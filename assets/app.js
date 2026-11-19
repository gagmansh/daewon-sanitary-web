'use strict';
const menu=document.querySelector('.menu-button'),nav=document.querySelector('#nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});
const homeForm=document.querySelector('.search-strip form');
homeForm?.addEventListener('submit',e=>{e.preventDefault();const target=new URL('products.html',location.href);target.searchParams.set('q',document.querySelector('#home-search').value);location.href=target.href});
const params=new URLSearchParams(location.search),input=document.querySelector('#product-search');
if(input){
 let category=params.get('category')||'전체';const cards=[...document.querySelectorAll('.product-card')],filters=[...document.querySelectorAll('[data-filter]')];
 if(!filters.some(b=>b.dataset.filter===category))category='전체';input.value=params.get('q')||'';
 const normalize=s=>s.toLocaleLowerCase().replace(/\s+/g,'');
 const sub=document.querySelector('#subcategory');
 sub.value=[...sub.options].some(o=>o.value===params.get('subcategory'))?params.get('subcategory'):'전체';
 function filter(){const q=normalize(input.value);let count=0;cards.forEach(c=>{const show=(!q||normalize(c.dataset.search).includes(q))&&(category==='전체'||category===c.dataset.category)&&(sub.value==='전체'||sub.value===c.dataset.subcategory);c.hidden=!show;if(show)count++});filters.forEach(b=>{const selected=b.dataset.filter===category;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});document.querySelector('#result-count').textContent=`${category} · ${count}개 수록 항목`;document.querySelector('#empty').hidden=count!==0;const p=new URLSearchParams();if(input.value)p.set('q',input.value);if(category!=='전체')p.set('category',category);if(sub.value!=='전체')p.set('subcategory',sub.value);try{history.replaceState(null,'',location.pathname+(p.size?'?'+p.toString():''))}catch{}}
 sub.addEventListener('change',filter);
 input.addEventListener('input',filter);document.querySelector('#catalog-search').addEventListener('submit',e=>{e.preventDefault();filter()});filters.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;sub.value='전체';filter()}));document.querySelector('#reset').addEventListener('click',()=>{category='전체';sub.value='전체';input.value='';filter();input.focus()});filter();
}
const form=document.querySelector('#quote-form');
if(form){
 for(const name of ['type','product']){const value=params.get(name),select=form.elements[name];if(value&&[...select.options].some(o=>o.value===value))select.value=value}
 let quote='';
 form.addEventListener('input',()=>{document.querySelector('#quote-result').hidden=true;quote=''});
 form.addEventListener('submit',e=>{e.preventDefault();for(const name of ['company','person','message']){const el=form.elements[name];el.value=el.value.trim()}if(!form.reportValidity())return;
 const data=new FormData(form),type=form.elements.type.selectedOptions[0].textContent,product=form.elements.product.selectedOptions[0].textContent;
 quote=`대원쎄니타리 문의서 초안\n※ 미전송 문서: 회사에 접수되지 않았습니다.\n\n문의 유형: ${type}\n제품군: ${product}\n회사명: ${data.get('company')}\n담당자: ${data.get('person')}\n이메일: ${data.get('email')}\n전화번호: ${data.get('phone')||'미기재'}\n수량: ${data.get('quantity')||'확인 요청'}\n재질 · 규격: ${data.get('spec')||'확인 요청'}\n\n문의 내용\n${data.get('message')}`;
 document.querySelector('#quote-text').textContent=quote;document.querySelector('#quote-result').hidden=false;document.querySelector('#quote-result').scrollIntoView({block:'nearest',behavior:'smooth'});
 });
 document.querySelector('#download-quote').addEventListener('click',()=>{if(!quote)return;const a=document.createElement('a'),url=URL.createObjectURL(new Blob(['\ufeff'+quote],{type:'text/plain;charset=utf-8'}));a.href=url;a.download='daewon-inquiry-draft.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
}
