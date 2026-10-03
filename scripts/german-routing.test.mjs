import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
process.env.NEXT_PUBLIC_GERMAN_ENABLED="true";
const {proxy}=await import("../src/proxy.ts");
const request=path=>new NextRequest("https://rentandroll.com"+path);
test("unknown German routes use the full localized 404 without redirecting the browser",()=>{
 for(const path of ["/de/missing-page","/de/booking/quote/not-a-token","/de/review/not-a-token"]){const response=proxy(request(path));assert.equal(response.status,404);const target=new URL(response.headers.get("x-middleware-rewrite"));assert.equal(target.pathname,"/_not-found");assert.equal(target.searchParams.get("lang"),"de");assert.equal(response.headers.get("Content-Language"),"de");assert.equal(response.headers.get("Referrer-Policy"),"no-referrer");}
});
test("valid private route shapes still reach their original server authorization",()=>{
 const token="11111111-1111-4111-8111-111111111111";
 for(const path of ["/de/booking/success","/de/booking/cancel","/de/newsletter/unsubscribe","/de/booking/quote/"+token,"/de/booking/fulfillment/"+token,"/de/booking/messages/"+token,"/de/review/"+token]){const response=proxy(request(path));assert.equal(response.headers.get("x-middleware-next"),"1");assert.equal(response.headers.get("x-middleware-rewrite"),null);assert.equal(response.headers.get("Content-Language"),"de");}
});
test("404 rewrite retains display language on its internal request",()=>{
 const response=proxy(request("/_not-found?lang=de"));assert.equal(response.headers.get("Content-Language"),"de");assert.equal(response.headers.get("x-middleware-request-x-pathname"),"/de");
});
test("original public paths retain their locale routing",()=>{
 for(const path of ["/de","/de/valencia","/de/rental/baby-gear","/de/product/travel-cot","/de/discover/albufera","/de/blog/digital-nomad-guide-valencia","/unknown-english","/es/unknown-spanish"]){const response=proxy(request(path));assert.equal(response.headers.get("x-middleware-rewrite"),null);assert.equal(response.headers.get("x-middleware-next"),"1");}
});
