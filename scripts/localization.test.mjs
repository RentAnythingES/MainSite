import assert from 'node:assert/strict';
import test from 'node:test';
import {localeFromPathname,publicLocales,localeRegistry,isLocale} from '../src/i18n/config.ts';
import {getDictionary} from '../src/i18n/getDictionary.ts';
import {publicLocaleHref} from '../src/lib/public-routes.ts';
import {productPageMetadata} from '../src/lib/product-page-metadata.ts';

test('published language detection respects segment boundaries and keeps German private',()=>{
  assert.deepEqual(publicLocales,['en','es']);
  for(const path of ['/es','/es/product/a'])assert.equal(localeFromPathname(path),'es');
  for(const path of ['/','/estate','/esoteric','/de','/de/product/a'])assert.equal(localeFromPathname(path),'en');
  assert.equal(isLocale('de'),true);assert.equal(isLocale('constructor'),false);
  assert.equal(localeRegistry.de.public,false);
  assert.throws(()=>publicLocaleHref('/product/a','de'),/not public/);
});
test('language switching preserves equivalent product identity and translated exceptions',()=>{
  for(const [en,es] of [['/','/es'],['/product/a','/es/product/a'],['/valencia/kits/a','/es/valencia/kits/a'],['/partners','/es/colaboraciones'],['/valencia/host-services','/es/valencia/servicios-anfitriones']]){
    assert.equal(publicLocaleHref(en,'es'),es);assert.equal(publicLocaleHref(es,'en'),en);
  }
  assert.equal(publicLocaleHref('/blog/untranslated','es'),'/es');
  assert.throws(()=>publicLocaleHref('//external.test','es'));
  assert.throws(()=>publicLocaleHref('/product/a?locale=es','es'));
});
function leaves(value,prefix=''){
  return Object.entries(value).flatMap(([key,item])=>typeof item==='object'&&item!==null
    ?leaves(item,`${prefix}${key}.`):[[`${prefix}${key}`,item]]);
}
test('German draft covers all dictionary keys without blank strings or silent language fallback',()=>{
  const en=leaves(getDictionary('en'));const de=leaves(getDictionary('de'));
  assert.deepEqual(de.map(([key])=>key).sort(),en.map(([key])=>key).sort());
  assert.ok(de.every(([,value])=>typeof value==='string'&&value.trim().length>0));
  assert.equal(getDictionary('de').locale,'de');
  assert.throws(()=>getDictionary('fr'),/Unsupported/);
  assert.throws(()=>getDictionary('constructor'),/Unsupported/);
});
test('shared metadata preserves published and incomplete Spanish canonical behavior',()=>{
  const product={name:'Test product',description:'Test description',pricing:[{days:1,perDay:10}],image:'/products/test.png'};
  const state={indexableEn:true,indexableEs:true};
  const en=productPageMetadata('test','en',product,state);
  const es=productPageMetadata('test','es',product,state);
  assert.equal(en.alternates.canonical,'https://rentandroll.com/product/test');
  assert.equal(es.alternates.canonical,'https://rentandroll.com/es/product/test');
  assert.deepEqual(en.alternates.languages,es.alternates.languages);
  const incomplete=productPageMetadata('test','es',product,{...state,indexableEs:false});
  assert.equal(incomplete.alternates.canonical,en.alternates.canonical);
  assert.equal(incomplete.alternates.languages,undefined);assert.equal(incomplete.robots.index,false);
  assert.equal(productPageMetadata('missing','es',null,null).robots.follow,false);
});
