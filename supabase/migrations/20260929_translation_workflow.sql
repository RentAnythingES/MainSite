-- Private authoring and attributed review. Does not publish a language.
alter table public.products add column translation_source_revision bigint not null default 1;
alter table public.product_localizations
  add column translation_content jsonb,
  add column source_revision bigint,
  add column translation_revision integer not null default 0,
  add column reviewed_revision integer,
  add column reviewed_by uuid,
  add column reviewed_at timestamptz;

create table public.translation_events (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  locale text not null references public.locales(code),
  action text not null check(action in ('save','review','publish','unpublish','source_changed')),
  revision integer not null,
  source_revision bigint not null,
  actor_id uuid,
  created_at timestamptz not null default now()
);
alter table public.translation_events enable row level security;
revoke all on public.translation_events from public, anon, authenticated;
grant select, insert on public.translation_events to service_role;
grant usage, select on sequence public.translation_events_id_seq to service_role;

create policy "Reviewed translation revision gate" on public.product_localizations
  as restrictive for select to anon, authenticated using (
    source_revision is null or (
      reviewed_by is not null and reviewed_revision=translation_revision and
      exists(select 1 from products p where p.id=product_id and p.translation_source_revision=source_revision)
    )
  );

-- Direct maintenance writers cannot silently preserve approval after changing copy.
create function public.invalidate_changed_translation() returns trigger
language plpgsql set search_path=public as $$
begin
  if old.source_revision is not null and old.locale<>'en' and new.translation_revision=old.translation_revision
    and (new.translation_content is distinct from old.translation_content or
      (new.publication_status=old.publication_status and
        (to_jsonb(new)-array['updated_at','reviewed_at','reviewed_by','reviewed_revision','publication_status','source_revision'])
        is distinct from (to_jsonb(old)-array['updated_at','reviewed_at','reviewed_by','reviewed_revision','publication_status','source_revision']))) then
    new.translation_revision:=old.translation_revision+1;
    new.publication_status:='draft';new.reviewed_by:=null;new.reviewed_at:=null;new.reviewed_revision:=null;
  end if;
  return new;
end $$;
create trigger invalidate_changed_translation before update on public.product_localizations
  for each row execute function public.invalidate_changed_translation();

-- Only editorial/factual changes invalidate translations; stock and prices do not.
create function public.track_product_translation_source() returns trigger
language plpgsql set search_path=public as $$
declare old_source jsonb; new_source jsonb;
begin
  select jsonb_object_agg(key,value) into old_source from jsonb_each(to_jsonb(old))
    where key=any(array['name','brand','slug','category_id','subcategory','description','features','specs','image_url','content_status']);
  select jsonb_object_agg(key,value) into new_source from jsonb_each(to_jsonb(new))
    where key=any(array['name','brand','slug','category_id','subcategory','description','features','specs','image_url','content_status']);
  if old_source is distinct from new_source then
    new.translation_source_revision := old.translation_source_revision + 1;
  end if;
  return new;
end $$;
create trigger track_product_translation_source before update on public.products
  for each row execute function public.track_product_translation_source();

create function public.stale_product_translations() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if new.translation_source_revision is distinct from old.translation_source_revision then
    insert into translation_events(product_id,locale,action,revision,source_revision)
      select product_id,locale,'source_changed',translation_revision,new.translation_source_revision
      from product_localizations where product_id=new.id and source_revision is not null and locale<>'en';
    update product_localizations set publication_status='stale', reviewed_by=null,
      reviewed_at=null, reviewed_revision=null
      where product_id=new.id and source_revision is not null and locale<>'en';
  end if;
  return new;
end $$;
create trigger stale_product_translations after update on public.products
  for each row execute function public.stale_product_translations();

create function public.track_related_translation_source() returns trigger
language plpgsql security definer set search_path=public as $$
declare value jsonb; prior jsonb; product_key uuid;
begin
  value := case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end;
  prior := case when tg_op='INSERT' then null else to_jsonb(old) end;
  if tg_table_name<>'product_images' and value->>'locale'<>'en' then return null; end if;
  if tg_op='UPDATE' and (value-array['id','updated_at','created_at']) is not distinct from
    (prior-array['id','updated_at','created_at']) then return null; end if;
  product_key := (value->>'product_id')::uuid;
  update products set translation_source_revision=translation_source_revision+1 where id=product_key;
  return null;
end $$;
create trigger track_translation_english_copy after insert or update or delete on public.product_localizations
  for each row execute function public.track_related_translation_source();
create trigger track_translation_english_faqs after insert or update or delete on public.product_faqs
  for each row execute function public.track_related_translation_source();
create trigger track_translation_images after insert or update or delete on public.product_images
  for each row execute function public.track_related_translation_source();

create function public.translation_missing_fields(content jsonb) returns text[]
language plpgsql immutable set search_path=public as $$
declare missing text[] := '{}'; field text;
begin
  foreach field in array array['name','short_description','detail_description','includes_text',
    'constraints_text','delivery_setup_note','care_note','seo_title','seo_description','image_alt_text'] loop
    if jsonb_typeof(content->field) is distinct from 'string' or btrim(content->>field)='' then
      missing := array_append(missing,field);
    end if;
  end loop;
  if length(content->>'seo_title')>60 then missing:=array_append(missing,'seo_title_max_60'); end if;
  if jsonb_typeof(content->'features') is distinct from 'array' then missing:=array_append(missing,'features'); end if;
  if jsonb_typeof(content->'specs') is distinct from 'object' then missing:=array_append(missing,'specs'); end if;
  if length(content->>'seo_description') not between 130 and 155 then missing:=array_append(missing,'seo_description_130_155'); end if;
  if jsonb_typeof(content->'faqs') is distinct from 'array' then
    missing:=array_append(missing,'faqs');
  elsif jsonb_array_length(content->'faqs')<3 or exists(
    select 1 from jsonb_array_elements(content->'faqs') f
    where coalesce(btrim(f->>'question'),'')='' or coalesce(btrim(f->>'answer'),'')=''
  ) then missing:=array_append(missing,'three_complete_faqs'); end if;
  return missing;
end $$;

-- Draft saves, review and publication share the product lock and revision checks.
-- Source edits also lock products, so review cannot race a source revision change.
create function public.manage_product_translation(
  p_product_id uuid, p_locale text, p_action text, p_expected_revision integer,
  p_expected_source_revision bigint, p_content jsonb, p_actor_id uuid
) returns public.product_localizations
language plpgsql security definer set search_path=public as $$
declare product public.products; entry public.product_localizations; field text; missing text[];
begin
  if p_actor_id is null or p_locale='en' or p_action not in ('save','review','publish','unpublish') then
    raise exception using errcode='22023', message='Invalid translation action';
  end if;
  if not exists(select 1 from locales where code=p_locale) then
    raise exception using errcode='22023', message='Unknown language';
  end if;
  select * into product from products where id=p_product_id for update;
  if not found then raise exception using errcode='P0002',message='Product not found'; end if;
  select * into entry from product_localizations where product_id=p_product_id and locale=p_locale for update;
  if p_expected_revision is distinct from coalesce(entry.translation_revision,0)
    or p_expected_source_revision is distinct from product.translation_source_revision then
    raise exception using errcode='40001',message='Content changed. Reload before saving.';
  end if;
  if p_action='save' then
    if jsonb_typeof(p_content) is distinct from 'object' or octet_length(p_content::text)>100000 then
      raise exception using errcode='22023',message='Invalid translation content';
    end if;
    for field in select jsonb_object_keys(p_content) loop
      if field=any(array['features','faqs']) then
        if jsonb_typeof(p_content->field)<>'array' or jsonb_array_length(p_content->field)>40 then
          raise exception using errcode='22023',message='Invalid translation list';
        end if;
      elsif field='specs' then
        if jsonb_typeof(p_content->field)<>'object' then raise exception using errcode='22023',message='Invalid specifications'; end if;
      elsif field=any(array['name','short_description','detail_description','includes_text','constraints_text',
        'delivery_setup_note','care_note','seo_title','seo_description','image_alt_text']) then
        if jsonb_typeof(p_content->field)<>'string' or length(p_content->>field)>12000 then
          raise exception using errcode='22023',message='Invalid translation text';
        end if;
      else raise exception using errcode='22023',message='Unknown translation field'; end if;
    end loop;
    if exists(select 1 from jsonb_array_elements(coalesce(p_content->'features','[]')) v where jsonb_typeof(v)<>'string')
      or exists(select 1 from jsonb_each(coalesce(p_content->'specs','{}')) v where jsonb_typeof(v.value)<>'string')
      or exists(select 1 from jsonb_array_elements(coalesce(p_content->'faqs','[]')) v
        where jsonb_typeof(v->'question') is distinct from 'string' or jsonb_typeof(v->'answer') is distinct from 'string') then
      raise exception using errcode='22023',message='Invalid translation list values';
    end if;
    insert into product_localizations(product_id,locale,publication_status,translation_content,source_revision,translation_revision)
      values(p_product_id,p_locale,'draft',p_content,product.translation_source_revision,1)
      on conflict(product_id,locale) do update set publication_status='draft',translation_content=p_content,
        source_revision=product.translation_source_revision,translation_revision=product_localizations.translation_revision+1,
        reviewed_by=null,reviewed_at=null,reviewed_revision=null,updated_at=now()
      returning * into entry;
  else
    if entry.id is null or entry.source_revision is null then raise exception using errcode='22023',message='Save a translation draft first'; end if;
    if p_action<>'unpublish' and entry.source_revision<>product.translation_source_revision then
      raise exception using errcode='40001',message='Translation source changed. Update the draft first.';
    end if;
    if p_action in ('review','publish') then
      missing:=translation_missing_fields(entry.translation_content);
      if cardinality(missing)>0 then raise exception using errcode='22023',message='Missing translation fields: '||array_to_string(missing,', '); end if;
    end if;
    if p_action='review' then
      update product_localizations set publication_status='reviewed',reviewed_by=p_actor_id,
        reviewed_at=now(),reviewed_revision=translation_revision,updated_at=now() where id=entry.id returning * into entry;
    elsif p_action='publish' then
      if entry.publication_status<>'reviewed' or entry.reviewed_revision is distinct from entry.translation_revision or entry.reviewed_by is null then
        raise exception using errcode='22023',message='Review the current translation before publishing';
      end if;
      if not exists(select 1 from locales where code=p_locale and is_public) then
        raise exception using errcode='22023',message='This language is private';
      end if;
      update product_localizations set publication_status='published',updated_at=now(),
        short_description=translation_content->>'short_description',detail_description=translation_content->>'detail_description',
        includes_text=translation_content->>'includes_text',constraints_text=translation_content->>'constraints_text',
        delivery_setup_note=translation_content->>'delivery_setup_note',care_note=translation_content->>'care_note',
        seo_title=translation_content->>'seo_title',seo_description=translation_content->>'seo_description'
        where id=entry.id returning * into entry;
    else
      update product_localizations set publication_status='draft',reviewed_by=null,reviewed_at=null,
        reviewed_revision=null,updated_at=now() where id=entry.id returning * into entry;
    end if;
  end if;
  insert into translation_events(product_id,locale,action,revision,source_revision,actor_id)
    values(p_product_id,p_locale,p_action,entry.translation_revision,product.translation_source_revision,p_actor_id);
  return entry;
end $$;

revoke all on function public.track_product_translation_source(), public.stale_product_translations(),
  public.invalidate_changed_translation(),
  public.track_related_translation_source(), public.translation_missing_fields(jsonb),
  public.manage_product_translation(uuid,text,text,integer,bigint,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.manage_product_translation(uuid,text,text,integer,bigint,jsonb,uuid) to service_role;
