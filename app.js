'use strict';
const pools={upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lower:'abcdefghijklmnopqrstuvwxyz',digits:'0123456789',symbols:'!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'};
const $=id=>document.getElementById(id);
const output=$('password'),status=$('status');
function randomIndex(n){const limit=Math.floor(4294967296/n)*n;const data=new Uint32Array(1);do{crypto.getRandomValues(data)}while(data[0]>=limit);return data[0]%n}
function makePassword(length,groups){const alphabet=groups.join('');let result;do{result=Array.from({length},()=>alphabet[randomIndex(alphabet.length)]).join('')}while(!groups.every(group=>Array.from(result).some(char=>group.includes(char))));return result}
$('range').addEventListener('input',()=>{$('length').value=$('range').value});
$('length').addEventListener('input',()=>{const n=Number($('length').value);if(Number.isInteger(n)&&n>=8&&n<=128)$('range').value=n});
$('generate').addEventListener('click',()=>{const n=Number($('length').value);if(!Number.isInteger(n)||n<8||n>128){status.textContent='Inserisci un numero intero da 8 a 128.';$('length').focus();return}const groups=Array.from(document.querySelectorAll('fieldset input:checked'),el=>pools[el.value]);if(!groups.length){status.textContent='Seleziona almeno un tipo di carattere.';return}if(!globalThis.crypto?.getRandomValues){status.textContent='Questo browser non supporta la generazione sicura. Apri il link con un browser aggiornato.';return}output.value=makePassword(n,groups);output.type='password';$('show').textContent='Mostra password';$('show').disabled=false;$('copy').disabled=false;status.textContent=`Password di ${n} caratteri generata. Include tutti i tipi selezionati.`});
$('show').addEventListener('click',()=>{const hidden=output.type==='password';output.type=hidden?'text':'password';$('show').textContent=hidden?'Nascondi password':'Mostra password'});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.value);status.textContent='Password copiata. Puoi incollarla dove ti serve.'}catch{output.type='text';$('show').textContent='Nascondi password';output.focus();output.select();status.textContent='Copia automatica non disponibile: la password è selezionata. Usa Copia dal menu del dispositivo.'}});
function setTheme(dark){document.body.classList.toggle('dark',dark);$('theme').textContent=dark?'Tema chiaro':'Tema scuro';$('theme').setAttribute('aria-pressed',String(dark));document.querySelector('meta[name=theme-color]').content=dark?'#131e30':'#2356a8'}
let dark=false;try{dark=localStorage.getItem('password-theme')==='dark'}catch{}setTheme(dark);
$('theme').addEventListener('click',()=>{dark=!dark;setTheme(dark);try{localStorage.setItem('password-theme',dark?'dark':'light')}catch{}});
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
