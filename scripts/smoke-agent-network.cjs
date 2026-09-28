/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const { randomUUID, randomBytes } = require("node:crypto");
const { createClient } = require("@supabase/supabase-js");
process.loadEnvFile(".env.local");
const origin = process.env.AGENT_TEST_ORIGIN || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Run this smoke test against a local server only.");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const users=[], agentIds=[], applicationIds=[];
const runId=randomUUID();
async function request(path,{body,cookie,method,expected=200,originHeader=origin}={}) {
  const response=await fetch(origin+path,{method:method||(body?"POST":"GET"),headers:{origin:originHeader,...(cookie?{cookie}:{}),...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined});
  const data=await response.json(); assert.equal(response.status,expected,`${path}: ${data.error||response.status}`);
  return {data,cookie:response.headers.get("set-cookie")?.split(";")[0]};
}
async function main() {
  try {
    await request("/api/admin/agents",{expected:401});
    await request("/api/agent/workspace",{expected:401});
    await request("/api/agent/orders",{body:{},expected:401});
    await request("/api/agent/session",{body:{},expected:403,originHeader:"https://other.example"});
    const adminEmail=`agent-test-admin-${runId}@example.invalid`,adminPassword=randomBytes(24).toString("base64url")+"Aa1!";
    const admin=await db.auth.admin.createUser({email:adminEmail,password:adminPassword,email_confirm:true,app_metadata:{role:"admin"}});
    if(admin.error) throw admin.error;users.push(admin.data.user.id);
    const auth=await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}}).auth.signInWithPassword({email:adminEmail,password:adminPassword});
    if(auth.error) throw auth.error;
    const adminCookie=`sb-access-token=${auth.data.session.access_token}`;
    const state=await request("/api/admin/agents",{cookie:adminCookie});
    const market=state.data.markets[0].id;
    const email=`agent-test-${runId}@example.invalid`;
    await request("/api/agent/applications",{body:{full_name:"API verification",email,phone:"+34000000000",country_code:"ES",city:"Verification",area_of_operations:"Test only",consent:true},expected:201}).then(async()=>{
      const result=await db.from("agent_applications").select("id").eq("email",email).single();if(result.error)throw result.error;applicationIds.push(result.data.id);
    });
    const created=await request("/api/admin/agents",{cookie:adminCookie,body:{action:"create",email,full_name:"API verification",applicationId:applicationIds[0],marketIds:[market]}});
    assert.ok(created.data.password.length>=32); agentIds.push(created.data.agentId);
    const agentRecord=await db.from("rental_agents").select("user_id").eq("id",created.data.agentId).single();if(agentRecord.error)throw agentRecord.error;users.push(agentRecord.data.user_id);
    const login=await request("/api/agent/session",{body:{email,password:created.data.password}});
    const initial=await request("/api/agent/workspace",{cookie:login.cookie});assert.equal(initial.data.agent.must_change_password,true);assert.deepEqual(initial.data.orders,[]);
    await request("/api/admin/agents",{cookie:login.cookie,expected:401});
    await request("/api/agent/orders",{cookie:login.cookie,body:{action:"accept",bookingId:randomUUID()},expected:401});
    const profile={action:"profile",full_name:"API verification",phone:"+34000000000",contact_email:email,address:"Test address",area_of_operations:"Test only",languages:"English",availability_notes:"Test only"};
    await request("/api/agent/workspace",{cookie:login.cookie,body:profile});
    const newPassword=randomBytes(24).toString("base64url")+"Aa1!";
    const changed=await request("/api/agent/session",{method:"PATCH",cookie:login.cookie,body:{currentPassword:created.data.password,password:newPassword}});
    await request("/api/agent/workspace",{cookie:login.cookie,expected:401});
    const ready=await request("/api/agent/workspace",{cookie:changed.cookie});assert.equal(ready.data.agent.must_change_password,false);assert.ok(ready.data.agent.profile_completed_at);
    await request("/api/agent/workspace",{cookie:changed.cookie,body:{action:"driver",name:"Verification driver",phone:"000",vehicle:"Test"}});
    await request("/api/admin/agents",{cookie:adminCookie,body:{action:"active",id:created.data.agentId,is_active:false}});
    await request("/api/agent/workspace",{cookie:changed.cookie,expected:401});
    await request("/api/admin/agents",{cookie:adminCookie,body:{action:"active",id:created.data.agentId,is_active:true}});
    const reset=await request("/api/admin/agents",{cookie:adminCookie,body:{action:"reset",id:created.data.agentId}});
    await request("/api/agent/session",{body:{email,password:newPassword},expected:401});
    const resetLogin=await request("/api/agent/session",{body:{email,password:reset.data.password}});
    const resetState=await request("/api/agent/workspace",{cookie:resetLogin.cookie});assert.equal(resetState.data.agent.must_change_password,true);
    await request("/api/agent/session",{cookie:resetLogin.cookie,method:"DELETE"});
    await request("/api/agent/workspace",{cookie:resetLogin.cookie,expected:401});
    console.log(JSON.stringify({publicAndAdminIsolation:"passed",applicationAndProvisioning:"passed",onboarding:"passed",passwordAndSessionRevocation:"passed",suspension:"passed",emailsSent:0}));
  } finally {
    // Delete only the disposable records created by this invocation, never production records.
    for(const id of agentIds){for(const table of ["agent_audit_events","agent_drivers"]) { const r=await db.from(table).delete().eq("agent_id",id);if(r.error)throw r.error; }const r=await db.from("rental_agents").delete().eq("id",id);if(r.error)throw r.error;}
    for(const id of users){await db.from("agent_audit_events").delete().eq("actor_user_id",id);const r=await db.auth.admin.deleteUser(id);if(r.error)throw r.error;}
    const ownApplications=await db.from("agent_applications").select("id").eq("email",`agent-test-${runId}@example.invalid`); for(const row of ownApplications.data||[]) if(!applicationIds.includes(row.id)) applicationIds.push(row.id);
    for(const id of applicationIds){const r=await db.from("agent_applications").delete().eq("id",id);if(r.error)throw r.error;}
    console.log("Disposable test users, applications and drivers removed.");
  }
}
main().catch(e=>{console.error("Agent API smoke test failed:",e.message);process.exitCode=1;});
