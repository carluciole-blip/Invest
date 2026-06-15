const ARR={
"1er — Louvre / Palais-Royal":{adr:300,occ:75},"2e — Bourse / Sentier":{adr:235,occ:74},
"3e — Haut-Marais":{adr:240,occ:75},"4e — Marais / Île St-Louis":{adr:250,occ:76},
"5e — Quartier Latin":{adr:225,occ:75},"6e — Saint-Germain":{adr:270,occ:75},
"7e — Tour Eiffel / Invalides":{adr:265,occ:74},"8e — Champs-Élysées":{adr:280,occ:72},
"9e — Opéra / Pigalle":{adr:200,occ:74},"10e — Canal St-Martin":{adr:180,occ:73},
"11e — Bastille / Oberkampf":{adr:171,occ:70},"12e — Bercy / Nation":{adr:160,occ:69},
"13e — Butte-aux-Cailles":{adr:150,occ:68},"14e — Montparnasse":{adr:165,occ:70},
"15e — Vaugirard":{adr:160,occ:70},"16e — Trocadéro / Passy":{adr:215,occ:69},
"17e — Batignolles":{adr:180,occ:71},"18e — Montmartre":{adr:160,occ:71},
"19e — Buttes-Chaumont":{adr:135,occ:67},"20e — Belleville":{adr:135,occ:67}
};
const COTIS={
svc:{s:.212,a:.50,l:.017},vte:{s:.123,a:.71,l:.010},
bnc:{s:.256,a:.34,l:.022},cpv:{s:.232,a:.34,l:.022}
};
const TAUX={15:3.20,20:3.37,25:3.48};
const SEA={Jan:.78,Fév:.80,Mar:.92,Avr:1.05,Mai:1.18,Juin:1.25,Juil:1.20,Aoû:1.05,Sep:1.22,Oct:1.10,Nov:.82,Déc:.90};
let salMode='net', meType='svc', meIR='bar', freq='m', capN=90, classt='nc', duree=20, cible='rp';
let lastCalc={};
const $=id=>document.getElementById(id);
const G=id=>+($(id).value||0);
const fe=n=>Math.round(n).toLocaleString('fr-FR')+' €';
const fp=(n,d=1)=>n.toFixed(d)+' %';
function sw(i){
document.querySelectorAll('.tab').forEach((t,j)=>t.classList.toggle('on',i===j));
document.querySelectorAll('.pane').forEach((p,j)=>p.classList.toggle('on',i===j));
}
function fv(id,lbl){$(lbl).textContent=fe(G(id))}
function sp(id,lbl,u=''){$(lbl).textContent=$(id).value+u}
function setMode(m,b){salMode=m;document.querySelectorAll('#sModeS button').forEach(x=>x.classList.toggle('on',x===b));$('netF').style.display=m==='net'?'':'none';$('brutF').style.display=m==='brut'?'':'none';c()}
function setMeType(t,b){meType=t;document.querySelectorAll('#sMeType button').forEach(x=>x.classList.toggle('on',x===b));c()}
function setMeIR(t,b){meIR=t;document.querySelectorAll('#sMeIR button').forEach(x=>x.classList.toggle('on',x===b));$('tmiF').style.display=t==='bar'?'block':'none';c()}
function setFreq(f,b){freq=f;document.querySelectorAll('#sFreq button').forEach(x=>x.classList.toggle('on',x===b));c()}
function setCap(n,b){capN=n;document.querySelectorAll('#sCapN button').forEach(x=>x.classList.toggle('on',x===b));c()}
function setClass(cl,b){classt=cl;document.querySelectorAll('#sClass button').forEach(x=>x.classList.toggle('on',x===b));c()}
function setDuree(d,b){duree=d;document.querySelectorAll('#sDuree button').forEach(x=>x.classList.toggle('on',x===b));c()}
function setCible(cl,b){cible=cl;document.querySelectorAll('#sCible button').forEach(x=>x.classList.toggle('on',x===b));c()}
function setArr(){const d=ARR[$('arrSel').value];$('adr').value=Math.round(d.adr*1.2/5)*5;$('occ').value=d.occ;sp('adr','lADR','€');sp('occ','lOcc','%');$('arrI').textContent='Médiane : '+d.adr+' €/nuit · occ. '+d.occ+'% · +20% pour 70m²/6 couchages';c()}
function syncTMI(){$('tmi').value=$('tmi2').value;$('lTMI').textContent=$('tmi2').value+' %'}
function calcAmort(){
const prix=G('prixAcq'), tTerrain=G('terrain')/100;
const amortBase=prix*(1-tTerrain);
const GO=amortBase*.50/50, fac=amortBase*.15/25, agen=amortBase*.20/15, inst=amortBase*.10/15, mob=amortBase*.05/7;
const tot=GO+fac+agen+inst+mob;
$('aGO').textContent=fe(GO);$('aFac').textContent=fe(fac);$('aAgen').textContent=fe(agen);
$('aInst').textContent=fe(inst);$('aMob').textContent=fe(mob);$('aTot').textContent=fe(tot);
const tmiVal=G('tmi2')/100, eco=tot*(tmiVal+0.186);
$('aEco').textContent=fe(eco)+'/an ('+fe(eco/12)+'/mois)';
const calcTot=Math.round(tot/500)*500;
$('amort').value=calcTot;$('lAmt').textContent=fe(calcTot);
$('amort').dataset.calcVal=calcTot;
c();
}
function mens(cap,taux,n){const r=taux/12/100,m=n*12;if(!r)return cap/m;return cap*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1)}
function capB(mm,taux,n){const r=taux/12/100,m=n*12;if(!r)return mm*m;return mm*(Math.pow(1+r,m)-1)/(r*Math.pow(1+r,m))}
function c(){
const PS=0.186, tmi=G('tmi')/100;
const salNetM = salMode==='net' ? G('salN') : G('salB')*0.78;
if(salMode==='brut') $('netEst').textContent=fe(G('salB')*.78);
const ct=COTIS[meType], caM=G('meCA'), cotM=caM*ct.s;
const irM = meIR==='lib' ? caM*ct.l : caM*(1-ct.a)*tmi;
const meNet=caM-cotM-irM;
$('rMeCA').textContent=fe(caM);
$('rMeCot').textContent='− '+fe(cotM);
$('rMeIR').textContent='− '+fe(irM);
$('rMeNet').textContent=fe(meNet);
$('rMeTx').textContent=fp(caM>0?(cotM+irM)/caM*100:0);
const airNet=G('airN'), divNet=G('divN'), autRev=G('autR');
const totalRev=salNetM+meNet+airNet+divNet+autRev;
const logC=G('loyer')+G('crEx');
const vieC=G('trp')+G('alim')+G('snte')+G('abo')+G('lois')+G('epF')+G('autC');
const totalChg=logC+vieC;
const epargne=totalRev-totalChg;
const txEp=totalRev>0?epargne/totalRev*100:0;
$('kRev').textContent=fe(totalRev); $('kRev').style.color='var(--acc)';
$('kChg').textContent=fe(totalChg); $('kChg').style.color='var(--red)';
const epc=epargne>=0?'var(--green)':'var(--red)';
$('kEp').textContent=fe(epargne); $('kEp').style.color=epc;
$('kEpCard').style.borderLeftColor=epc;
$('kEpPct').textContent=fp(txEp)+' des revenus';
const pct=Math.min(100,totalRev>0?totalChg/totalRev*100:100);
$('epfill').style.width=pct+'%'; $('epfill').style.background=epargne>=0?'var(--acc)':'var(--red)';
$('rSal').textContent=fe(salNetM);
$('rR0').textContent=fe(salNetM); $('rR1').textContent=fe(meNet);
$('rR2').textContent=fe(airNet); $('rR3').textContent=fe(divNet+autRev);
$('rRTot').textContent=fe(totalRev); $('rRAn').textContent=fe(totalRev*12);
$('bRev').textContent=fe(totalRev); $('bLog').textContent='− '+fe(logC);
$('bVie').textContent='− '+fe(vieC); $('bEp').textContent=fe(epargne);
$('bEp').style.color=epc; $('bTx').textContent=fp(txEp); $('bTx').style.color=epc;
let epAl='';
if(epargne<0) epAl=`<div class="box bad">⚠️ Flux négatif : charges > revenus de ${fe(-epargne)}/mois. Un banquier refusera tout nouveau crédit dans cette configuration.</div>`;
else if(txEp<10) epAl='<div class="box warn">Taux d\'épargne &lt; 10 % — profil tendu. Visez 15 % minimum pour rassurer un prêteur.</div>';
else if(txEp>=15) epAl=`<div class="box good">✅ Taux d'épargne solide (${fp(txEp)}) — profil rassurant pour un banquier.</div>`;
$('epAlrt').innerHTML=epAl;
const M=freq==='m'?12:1;
const adr=G('adr'), occ=G('occ')/100, stay=G('stay')||1, cln=G('cln');
const comm=G('comm')/100, plat=G('plat')/100;
const nights=Math.min(365*occ,capN), bookings=nights/stay;
const lodging=nights*adr, cleanRev=bookings*cln, gross=lodging+cleanRev;
const cleanCost=bookings*cln, commCost=lodging*comm, platCost=gross*plat, opCost=cleanCost+commCost+platCost;
const ebitda=gross-opCost;
const fixIds=['loan','cop','elec','eau','net2','ass','bnk','tf','cfe','cpta','mnt'];
const fixed=fixIds.reduce((s,id)=>s+(G(id)*M),0);
const loanAn=G('loan')*M, intrAn=G('intr')*M;
$('aGross').textContent=fe(gross); $('aEBITDA').textContent=fe(ebitda);
$('aFixed').textContent=fe(fixed); $('aNights').textContent=Math.round(nights)+' · '+Math.round(bookings);
const mo=Object.keys(SEA), wS=mo.reduce((s,m)=>s+SEA[m],0);
$('seasBars').innerHTML=mo.map(m=>{const r=gross*(SEA[m]/wS),w=SEA[m]/1.25*100;
return`<div class="brow"><span class="m">${m}</span><div class="btrk"><div class="bfll" style="width:${w}%"></div></div><span class="rv">${fe(r)}</span></div>`;}).join('');
const tmi3=G('tmi2')/100, amort=G('amort');
const amortEl=$('amort');
if(amortEl.dataset.calcVal && Math.abs(amort - +amortEl.dataset.calcVal) > 500){
if(!$('amortWarn')) {
const w=document.createElement('div');
w.id='amortWarn';w.className='box warn';w.style.marginTop='6px';
w.textContent='⚠️ Amortissement retenu ('+fe(amort)+'/an) différent de la valeur calculée par composants ('+fe(+amortEl.dataset.calcVal)+'/an). Vérifiez ou recalculez via le calculateur ci-dessus.';
amortEl.parentElement.appendChild(w);
}
} else {
const ow=$('amortWarn');if(ow)ow.remove();
}
const microCap=classt==='nc'?15000:83600, abatt=classt==='nc'?0.30:0.50; // LF2026: seuil classé 83600€
const eligible=gross<=microCap;
const micBase=Math.max(0,gross*(1-abatt));
const micTax=micBase*(tmi3+PS);
const micNet=ebitda-fixed-micTax;
const deductFixed=fixIds.reduce((s,id)=>s+(G(id)*M),0)-loanAn+intrAn;
const reelBase=Math.max(0,gross-opCost-deductFixed-amort);
const TNS_RATE=0.37;
const isTNS=gross>23000;
const reelTax=reelBase*(isTNS?TNS_RATE:tmi3+PS);
const reelNet=ebitda-fixed-reelTax;
const sciBase=Math.max(0,gross-opCost-fixed+loanAn-intrAn-amort);
const sciIS=Math.min(sciBase,100000)*.15+Math.max(0,sciBase-100000)*.25;
const sciFT=(sciBase-sciIS)*.314;
const sciNet=ebitda-fixed-sciIS-sciFT;
const sasuBase=sciBase;
const sasuIS=Math.min(sasuBase,100000)*.15+Math.max(0,sasuBase-100000)*.25;
const sasuFT=(sasuBase-sasuIS)*.314;
const sasuNet=ebitda-fixed-sasuIS-sasuFT;
const structs=[
{k:'mic',name:'LMNP micro-BIC',net:micNet,tax:micTax,note:eligible?'':'⚠️ CA > plafond '+fe(microCap)+' → Réel obligatoire'},
{k:'ree',name:'LMNP réel simplifié',net:reelNet,tax:reelTax,note:'Amort. '+fe(amort)+'/an · charges déduites'},
{k:'sci',name:'SCI à l\'IS',net:sciNet,tax:sciIS+sciFT,note:'IS 15/25% + flat tax 31,4% (double imp.)'},
{k:'sas',name:'SASU / SAS IS',net:sasuNet,tax:sasuIS+sasuFT,note:'Plus-value pro à la revente (sans abattement)'},
];
const bestK=structs.reduce((a,b)=>a.net>b.net?a:b).k;
const bestNet=structs.find(s=>s.k===bestK).net;
if(bestNet>0){$('airN').value=Math.round(bestNet/12);$('lAir').textContent=fe(bestNet/12)}
const lmnpReelTax=reelTax;
const cascadeItems=[
['CA brut / an',fe(gross),''],
['− Ménage + comm. + plateforme','− '+fe(opCost),'dim'],
['= Marge d\'exploitation',fe(ebitda),'bold'],
['− Impôt + PS (LMNP réel estimé)','− '+fe(lmnpReelTax),'dim'],
['− Crédit immobilier','− '+fe(loanAn),'dim'],
['− Copropriété + TF + CFE','− '+fe((G('cop')+G('tf')+G('cfe'))*M),'dim'],
['− Énergie + internet','− '+fe((G('elec')+G('eau')+G('net2'))*M),'dim'],
['− Assurance + banque + comptable','− '+fe((G('ass')+G('bnk')+G('cpta'))*M),'dim'],
['− Maintenance','− '+fe(G('mnt')*M),'dim'],
];
const cfn=reelNet;
$('cascade').innerHTML=cascadeItems.map(r=>`<div class="row ${r[2]}"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')+
`<div class="row bold total"><span>= Cash-flow net (LMNP réel)</span><span style="color:${cfn>=0?'var(--green)':'var(--red)'}">${fe(cfn)}</span></div>`;
const amortVal=G('amort'), taxSaving=amortVal*(tmi3+(isTNS?TNS_RATE:0.186));
let cfNote='';
if(isTNS){
cfNote='<div class="box warn">'+
'<b>Seuil TNS franchi (CA &gt; 23 000 EUR)</b> : les prelevements sociaux 18,6% ne s\'appliquent plus. '+
'Au-dela de 23 000 EUR de recettes Airbnb, basculement vers les <b>cotisations sociales TNS/URSSAF (~37% du benefice net)</b> '+
'(art. L.611-1 et L.613-7 CSS). L\'impot affiche integre ce taux plus eleve. '+
'Un expert-comptable peut optimiser via une structure (SCI IS ou SASU).'+
'</div>';
}
if(capN===90){
const grossSec=Math.min(365*occ,365)*adr+Math.min(365*occ,365)/stay*cln;
cfNote=`<div class="box info">
Plafond 90 nuits (résidence principale) = CA brut max ${fe(gross)}/an.<br>
En résidence secondaire (365 nuits autorisées) : CA brut estimé ~${fe(grossSec)}/an — cash-flow potentiellement 2 à 3× supérieur.
</div>`;
}
if(amortVal>0){
cfNote+=`<div class="box good" style="margin-top:6px">
L'amortissement (${fe(amortVal)}/an) est une charge <b>non décaissée</b> : il réduit l'impôt de ${fe(taxSaving)}/an (${fe(taxSaving/12)}/mois) sans sortir d'argent.
</div>`;
}
cfNote+='<div class="box warn" style="margin-top:6px">'+
'<b>Para-hôtellerie et TVA (art. 261 D, 4° CGI) :</b> si vous fournissez 3 services ou plus parmi : '+
'petit-déjeuner, ménage régulier (> 1x/semaine), linge de maison, réception de la clientèle, '+
'votre activité bascule en <b>para-hôtellerie</b> → assujettissement TVA 10 % + possible bascule en BIC professionnel. '+
'Non géré dans ce simulateur. Vérifiez avec un expert-comptable si vous proposez ces services.'+
'</div>';
$('cashflowNote').innerHTML=cfNote;
$('structCards').innerHTML=structs.map(s=>{
const ib=s.k===bestK;
return`<div class="scard ${ib?'best':''}">
${ib?'<div class="badge best">Meilleur net</div>':''}
<div class="sn">${s.name}</div>
<div class="sv">${fe(s.net/12)}<span style="font-size:12px;font-weight:400">/mois</span></div>
<div class="ss">Impôt : ${fe(s.tax/12)}/mois · ${gross>0?fp(s.tax/gross*100,0):'0 %'} du CA</div>
${s.note?`<div style="font-size:10.5px;color:var(--warn-txt);margin-top:4px">${s.note}</div>`:''}
</div>`;}).join('');
const cols=['LMNP micro-BIC','LMNP réel','SCI IS','SASU IS'];
const netRow=[micNet,reelNet,sciNet,sasuNet];
const taxRow=[micTax,reelTax,sciIS+sciFT,sasuIS+sasuFT];
const rows=[
{l:'Structure',v:['Nom propre (SIRET)','Nom propre (SIRET)','Société civile','Soc. commerciale']},
{l:'Impôt de base',v:['TMI + 18,6 % PS','TMI + 18,6 % PS','IS 15 %/100k€/25 %','IS 15 %/100k€/25 %']},
{l:'Déduction charges',v:[abatt*100+'% abattement','Réelles + amort.','Réelles + amort.','Réelles + amort.']},
{l:'Amortissement',v:['Non','Oui ('+fe(amort)+'/an)','Oui','Oui']},
{l:'Distribution bénéf.',v:['Revenus directs','Revenus directs','Flat tax 31,4 %','Flat tax 31,4 %']},
{l:'Plus-value revente',v:['Particulier + réintég.','Particulier + réintég.','Particulier (SCI IR) / IS','IS — très défavorable']},
{l:'Plafond micro',v:[fe(microCap),'—','—','—']},
{l:'Impôt total / an',v:taxRow.map(t=>fe(t))},
{l:'Net dans la poche / an',v:netRow.map(n=>fe(n)),bold:true},
{l:'Net / mois',v:netRow.map(n=>fe(n/12)),bold:true},
];
let tbl=`<tr>${['Critère',...cols].map((h,i)=>`<th>${h}${i>0&&structs[i-1].k===bestK?' ★':''}</th>`).join('')}</tr>`;
rows.forEach(row=>{
const best=row.bold?netRow.indexOf(Math.max(...netRow)):false;
tbl+=`<tr ${row.bold?'class="tot"':''}><td style="color:var(--muted)">${row.l}</td>`;
row.v.forEach((v,i)=>{
const isBest=row.bold&&i===best;
tbl+=`<td${isBest?' class="hi"':''}>${v}</td>`;
});
tbl+='</tr>';
});
$('cmpTbl').innerHTML=tbl;
const tauxM=G('tauxM'), taux=tauxM>0?tauxM:(TAUX[duree]||3.37);
const revB=cible==='loc'?salNetM+meNet*.7+airNet*.7+divNet*.5+autRev*.5:salNetM+meNet*.7+airNet*.7+divNet+autRev;
const existC=G('crEx');
const mensMax=Math.max(0,revB*.35-existC);
const capEmp=capB(mensMax,taux,duree);
const prixMax=capEmp+G('appt');
const mensC=mens(capEmp,taux,duree);
const assM=capEmp*G('assE')/100/12;
const mensT=mensC+assM;
const txEnd=revB>0?(existC+mensT)/revB*100:0;
$('bkCap').textContent=fe(capEmp); $('bkMens').textContent='Mensualité hors ass. : '+fe(mensC);
$('bkPrix').textContent=fe(prixMax); $('bkSub').textContent='Apport '+fe(G('appt'))+' + emprunt '+fe(capEmp);
$('bkRevB').textContent=fe(revB); $('bk35').textContent=fe(revB*.35);
$('bkExC').textContent='− '+fe(existC); $('bkMM').textContent=fe(mensMax);
$('bkMC').textContent=fe(mensC); $('bkAM').textContent=fe(assM);
$('bkMT').textContent=fe(mensT);
$('bkTx').textContent=fp(txEnd); $('bkTx').style.color=txEnd<=35?'var(--green)':'var(--red)';
let bkAl='';
if(txEnd>35) bkAl=`<div class="box bad">⚠️ Endettement ${fp(txEnd)} > 35 % — dépassement HCSF. Augmentez l'apport, réduisez la durée ou améliorez les revenus.</div>`;
else if(txEnd>0) bkAl=`<div class="box good">✅ Taux d'endettement ${fp(txEnd)} — dans la limite des 35 %. Profil finançable.</div>`;
$('bkAlrt').innerHTML=bkAl;
$('bkLook').innerHTML=[
[salNetM>0?'✅':'⚠️','Salaire',salNetM>0?'Atout majeur — revenu stable et justifiable':'Aucun salaire — indépendants scrutinés sur 3 ans'],
[meNet>0?'⚠️':'—','Micro-entreprise (décote 30 %)',meNet>0?`Retenu : ${fe(meNet*.7)}/mois · 3 bilans exigés`:'Non renseigné'],
[airNet>0?'⚠️':'—','Airbnb (décote 30 %)',airNet>0?`Retenu : ${fe(airNet*.7)}/mois`:'Non renseigné'],
[txEnd<=33?'✅':txEnd<=35?'⚠️':'🚫','Endettement',fp(txEnd)+(txEnd<=33?' — Excellent':txEnd<=35?' — Acceptable':' — Trop élevé')],
['💰','Reste à vivre',fe(totalRev-mensT-(totalChg-G('loyer')-G('crEx')))+'/mois'],
['🏦','Apport / notaire',fe(G('appt'))+' — frais notaire estimés : '+fe(prixMax*.08)],
].map(([i,k,v])=>`<div class="row"><span style="display:flex;gap:8px"><span>${i}</span><span style="color:var(--muted)">${k}</span></span><span style="font-size:12px;text-align:right;max-width:55%">${v}</span></div>`).join('');
lastCalc={gross,reelNet,fixed,loanAn,reelTax,tmi3,amort,opCost,deductFixed,prixAcq:G('prixAcq')};
calcConseil();
}
function calcConseil(){
var lc=lastCalc;
if(!lc||!lc.prixAcq) return;
var revSal=G('cRevSal')||0;
var revFon=G('cRevFon')||0;
var parts=parseFloat(document.getElementById('cParts').value)||1;
var rfr=G('cRFR')||45000;
function tmiFromRev(rev,p){
var rn=rev/p;
if(rn<=11497) return 0;
if(rn<=29315) return 0.11;
if(rn<=83823) return 0.30;
if(rn<=180294) return 0.41;
return 0.45;
}
var tmiCalc=tmiFromRev(revSal+revFon,parts);
var tmiPct=Math.round(tmiCalc*100);
var badge=$('cTMIbadge');
badge.textContent=tmiPct+' %';
badge.style.background=tmiPct>=30?'var(--acc)':'var(--green)';
var tmi=tmiCalc>0?tmiCalc:(lc.tmi3||0.30);
var PS=0.186;
var prixAcq=lc.prixAcq||300000;
var gross=lc.gross||0;
var reelNet=lc.reelNet||0;
var fixed=lc.fixed||0;
var loanAn=lc.loanAn||0;
var amort=lc.amort||0;
var reelTax=lc.reelTax||0;
var loyerLT=G('loyerLT')||1400;
var vacLT=G('vacLT')/100||0.08;
var gstLT=G('gstLT')/100||0;
var loyerEvite=G('loyerEvite')||1500;
var rpCFan=loyerEvite*12-fixed;
var rpCFm=rpCFan/12;
var rpRend=prixAcq>0?rpCFan/prixAcq*100:0;
var ltRevAn=loyerLT*12*(1-vacLT);
var ltComm=loyerLT*12*gstLT;
var ltImpot=0; var ltRegime='micro-BIC 50%';
if(ltRevAn>83600){
var ltBase=Math.max(0,ltRevAn-ltComm-(fixed-loanAn)-amort);
ltImpot=ltBase*(tmi+PS); ltRegime='LMNP reel';
} else {
ltImpot=ltRevAn*0.50*(tmi+PS);
}
var ltCFan=ltRevAn-ltComm-ltImpot-fixed;
var ltCFm=ltCFan/12;
var ltRend=prixAcq>0?ltCFan/prixAcq*100:0;
var airCFm=reelNet/12;
var airRend=prixAcq>0?reelNet/prixAcq*100:0;
var prixVente=prixAcq*0.95;
var venteRevAn=prixVente*0.04*(1-0.30);
var venteCFm=venteRevAn/12;
var venteRend=prixAcq>0?venteRevAn/prixAcq*100:0;
function scoreCF(cfm){ return Math.max(0,Math.min(10,cfm/100)); }
function scoreFisc(impAn,revBrut){
if(revBrut<=0) return 5;
return Math.max(0,Math.min(10,10-impAn/revBrut*20));
}
function scorePat(cfm){ return Math.max(0,Math.min(10,cfm*12*10/50000)); }
var scenarios=[
{id:'rp',  name:'Residence principale', icon:'Maison',
cfm:rpCFm,  impotAn:0,          revBrut:loyerEvite*12, rend:rpRend,   regime:'Non impose',
scores:{cashflow:scoreCF(rpCFm),  fiscalite:10, risque:9, gestion:10, patrimoine:scorePat(rpCFm)},
note:'Loyer evite = economie reelle. Exoneration PV totale si RP > 2 ans. Zero gestion.'},
{id:'lt',  name:'Location longue duree', icon:'Cle',
cfm:ltCFm,  impotAn:ltImpot,    revBrut:ltRevAn,       rend:ltRend,   regime:ltRegime,
scores:{cashflow:scoreCF(ltCFm),  fiscalite:scoreFisc(ltImpot,ltRevAn), risque:7, gestion:7, patrimoine:scorePat(ltCFm)},
note:'LMNP reel si CA > 77 700 EUR/an (amortissement deductible). Revenus reguliers.'},
{id:'air', name:'Airbnb LMNP reel', icon:'Avion',
cfm:airCFm, impotAn:reelTax,    revBrut:gross,         rend:airRend,  regime:'LMNP reel',
scores:{cashflow:scoreCF(airCFm), fiscalite:scoreFisc(reelTax,gross), risque:4, gestion:3, patrimoine:scorePat(airCFm)},
note:'Plafond 90 nuits/an en RP (loi Le Meur). Amortissement deductible. Gestion intensive.'},
{id:'vte', name:'Vente + placement', icon:'Graphique',
cfm:venteCFm,impotAn:venteRevAn*0.30,revBrut:venteRevAn,rend:venteRend,regime:'Flat tax 30%',
scores:{cashflow:scoreCF(venteCFm),fiscalite:scoreFisc(venteRevAn*0.30,venteRevAn),risque:6,gestion:9,patrimoine:scorePat(venteCFm)},
note:'Capital place en SCPI/PEA a ~4% brut. Passif mais perte de l\'effet levier credit.'}
];
scenarios.forEach(function(s){
s.total=s.scores.cashflow+s.scores.fiscalite+s.scores.risque+s.scores.gestion+s.scores.patrimoine;
});
var best=scenarios.reduce(function(a,b){return a.total>b.total?a:b;});
var criteres=[
{k:'cashflow',l:'Cash-flow'},
{k:'fiscalite',l:'Fiscalite'},
{k:'risque',l:'Risque/Stabilite'},
{k:'gestion',l:'Facilite gestion'},
{k:'patrimoine',l:'Patrimoine 10 ans'}
];
var cardsHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">';
scenarios.forEach(function(s){
var isBest=s.id===best.id;
var scoreColor=s.total>=35?'var(--green)':s.total>=25?'var(--acc)':'var(--red)';
var cfColor=s.cfm>=0?'var(--green)':'var(--red)';
var bars=criteres.map(function(c){
var v=s.scores[c.k];
var pct=v/10*100;
var bc=v>=7?'var(--green)':v>=4?'var(--acc)':'var(--red)';
return '<div style="margin-bottom:6px">'+
'<div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);margin-bottom:2px">'+
'<span>'+c.l+'</span><span style="font-weight:600">'+v.toFixed(1)+'</span></div>'+
'<div style="background:#e5e7eb;border-radius:3px;height:5px">'+
'<div style="width:'+pct+'%;height:100%;border-radius:3px;background:'+bc+'"></div></div></div>';
}).join('');
var border=isBest?'2px solid var(--green)':'1px solid var(--border)';
var badge=isBest?'<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--green);color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;white-space:nowrap">RECOMMANDE</div>':'';
cardsHTML+=
'<div style="background:#fff;border:'+border+';border-radius:10px;padding:14px;position:relative">'+badge+
'<div style="font-size:12px;font-weight:700;margin-bottom:8px">'+s.name+'</div>'+
'<div style="font-size:20px;font-weight:700;color:'+cfColor+';margin-bottom:2px">'+fe(s.cfm)+'</div>'+
'<div style="font-size:10.5px;color:var(--muted);margin-bottom:10px">/mois net - rend. '+fp(s.rend,2)+'</div>'+
bars+
'<div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;align-items:center">'+
'<span style="font-size:10.5px;color:var(--muted)">'+s.regime+'</span>'+
'<span style="font-size:18px;font-weight:700;color:'+scoreColor+'">'+s.total.toFixed(0)+
'<span style="font-size:11px;font-weight:400">/50</span></span></div>'+
'<div style="font-size:10.5px;color:var(--muted);margin-top:6px;line-height:1.4">'+s.note+'</div></div>';
});
cardsHTML+='</div>';
$('scoreCards').innerHTML=cardsHTML;
var bestIdx=scenarios.indexOf(best);
var cols=['Critere','RP','Location LT','Airbnb','Vente+placement'];
var tbl='<tr>'+cols.map(function(h,i){
var hi=i>0&&i-1===bestIdx;
return '<th'+(hi?' class="col-hi"':'')+'>'+h+(hi?' *':'')+' </th>';
}).join('')+'</tr>';
var tRows=[
{l:'Cash-flow / mois',    v:scenarios.map(function(s){return fe(s.cfm);}),             vals:scenarios.map(function(s){return s.cfm;}), hi:true},
{l:'Rendement net',        v:scenarios.map(function(s){return fp(s.rend,2);}),          vals:scenarios.map(function(s){return s.rend;}),hi:true},
{l:'Impot estime / an',    v:scenarios.map(function(s){return fe(s.impotAn);}),         vals:null},
{l:'Regime fiscal',         v:scenarios.map(function(s){return s.regime;}),              vals:null},
{l:'Score cashflow /10',    v:scenarios.map(function(s){return s.scores.cashflow.toFixed(1);}),   vals:scenarios.map(function(s){return s.scores.cashflow;}), hi:true},
{l:'Score fiscalite /10',   v:scenarios.map(function(s){return s.scores.fiscalite.toFixed(1);}),  vals:scenarios.map(function(s){return s.scores.fiscalite;}),hi:true},
{l:'Score risque /10',      v:scenarios.map(function(s){return s.scores.risque.toFixed(1);}),     vals:scenarios.map(function(s){return s.scores.risque;}),   hi:true},
{l:'Score gestion /10',     v:scenarios.map(function(s){return s.scores.gestion.toFixed(1);}),    vals:scenarios.map(function(s){return s.scores.gestion;}),  hi:true},
{l:'Score patrimoine /10',  v:scenarios.map(function(s){return s.scores.patrimoine.toFixed(1);}), vals:scenarios.map(function(s){return s.scores.patrimoine;}),hi:true},
{l:'SCORE TOTAL /50',       v:scenarios.map(function(s){return s.total.toFixed(0)+'/50';}),       vals:scenarios.map(function(s){return s.total;}), hi:true, bold:true},
];
tRows.forEach(function(row){
var maxV=row.hi&&row.vals?Math.max.apply(null,row.vals):null;
tbl+='<tr'+(row.bold?' class="tot"':'')+'><td style="color:var(--muted)">'+row.l+'</td>';
row.v.forEach(function(v,i){
var highlight=(row.hi&&row.vals&&row.vals[i]===maxV)||(row.bold&&i===bestIdx);
tbl+='<td'+(highlight?' class="col-hi"':'')+'>'+v+'</td>';
});
tbl+='</tr>';
});
$('conseilCmpTbl').innerHTML=tbl;
var actions={
rp:['Renégociez le crédit si taux > 3,5% pour améliorer le cash-flow mensuel.',
"Exonération de plus-value totale à la revente si résidence principale depuis > 2 ans (art.150 U CGI) — avantage fiscal majeur.",
"Envisagez de louer une chambre meublée ponctuellement (jusqu'à 90 nuits/an) pour un complément de revenu sans changer de statut."],
lt: ["Optez pour le LMNP réel simplifié : l'amortissement réduit la base imposable à quasi-zéro les premières années.",
"Déposez une déclaration P0i (greffe du tribunal de commerce) pour obtenir votre SIRET LMN avant la 1ère location.",
"Faites établir un plan d'amortissement par composants par un expert-comptable (~500 EUR HT) — déductible la 1ère année."],
air:["Enregistrez le logement en mairie (numéro obligatoire Paris) avant toute mise en ligne sur les plateformes.",
"Constituez un tableau d'amortissement par composants (gros oeuvre 50 ans, mobilier 7 ans) pour maximiser les déductions LMNP réel.",
"Provisionnez la réintégration amortissements à la revente (art.84 LF2025, depuis 15/02/2025) — anticipez la plus-value taxable."],
vte:["Avant la vente, confirmez l'exonération résidence principale (RP > 2 ans = PV totalement exonérée).",
"Orientez le produit vers un PEA (plafond 150 000 EUR) ou des SCPI en démembrement pour optimiser la fiscalité des revenus futurs.",
"Comparez le rendement net du placement avec le rendement locatif net — l'effet levier du crédit est souvent plus puissant."]
};
var vigilance=[];
vigilance.push("Loi Le Meur (oct. 2024) : Airbnb en résidence principale limité à 90 nuits/an. En résidence secondaire : 120 nuits (meublé classé).");
vigilance.push("Art.84 LF 2025 (15/02/2025) : amortissements LMNP réel réintégrés dans le calcul de la plus-value à la revente — PS sur PV immobilière maintenu à 17,2% (non impacté par LFSS 2026), IR 19% + abattements durée détention. Exceptions : résidences étudiantes, seniors, EHPAD.");
if(prixAcq>0&&amort>0){
var prixRevEstim=prixAcq; // hypothèse prix stable pour illustration
var amortTotalEstim=amort*10; // 10 ans d'amort par défaut
var pvBrute=Math.max(0,prixRevEstim-prixAcq+amortTotalEstim); // réintégration amort
var pvIR=pvBrute*0.19, pvPS=pvBrute*0.172; // PS 17,2% sur PV immo
if(pvBrute>0) vigilance.push("PV revente estimée (scénario 10 ans, prix stable) : réintégration amort "+fe(amortTotalEstim)+" → base imposable ~"+fe(pvBrute)+" → IR 19% = "+fe(pvIR)+" + PS 17,2% = "+fe(pvPS)+" = total "+fe(pvIR+pvPS)+". Utiliser un simulateur ou notaire pour affiner.");
}
if(rfr/parts<=29315) vigilance.push("Versement libératoire accessible (RFR N-2 "+fe(rfr)+" <= 29 315 EUR/part) : intéressant en micro-BIC si TMI >= 11%.");
else vigilance.push("Versement libératoire non accessible (RFR N-2 "+fe(rfr)+" > 29 315 EUR/part).");
if(amort>0&&ltCFan<0) vigilance.push("Déficit LMNP réel (LT) reportable sur BIC meublés des 10 années suivantes — avantage fiscal différé.");
if(loanAn>0) vigilance.push("Crédit en cours : "+fe(loanAn/12)+"/mois. Taux d'endettement global à vérifier <= 35% avant nouvel investissement (règle HCSF).");
if(prixAcq>=1300000) vigilance.push("Patrimoine >= 1,3 M EUR : vérifiez le seuil IFI. Structurer en SCI peut réduire l'assiette taxable.");
var tmiForBareme=tmiCalc>0?tmiCalc:(lc.tmi3||0.30);
if(tmiForBareme<=0.11){
vigilance.push("Option barème progressif (case 2OP) : si votre TMI est de 0% ou 11%, l\'option barème peut être plus favorable que le PFU 31,4% sur vos dividendes SCI/SASU. CSG 6,8% déductible du revenu global dans ce cas (art. 154 quinquies CGI). L\'option n\'est plus irrévocable depuis la LF 2026 — à arbitrer chaque année.");
} else {
vigilance.push("PFU 31,4% (flat tax) appliqué aux dividendes SCI/SASU. Si TMI <= 11%, l\'option barème (case 2OP) avec déduction CSG 6,8% pourrait être avantageuse. Sur revenus BIC meublé (LMNP) : PS non déductible — pas d\'option barème possible.");
}
var sorted=[].concat(scenarios).sort(function(a,b){return b.total-a.total;});
var actList=(actions[best.id]||[]).map(function(a){
return '<li style="margin-bottom:8px;font-size:13px;line-height:1.5">'+a+'</li>';
}).join('');
var vigList=vigilance.map(function(v){
return '<li style="margin-bottom:5px;font-size:12px;line-height:1.4">'+v+'</li>';
}).join('');
var classement=sorted.map(function(s,i){return (i+1)+'. '+s.name+' ('+s.total.toFixed(0)+'/50)';}).join(' > ');
var recoHTML=
'<div class="box good" style="margin-bottom:12px"><b>Stratégie recommandée : '+best.name+'</b> ('+best.total.toFixed(0)+'/50)<br>'+
'Cash-flow : <b>'+fe(best.cfm)+'/mois</b> - Rendement net : <b>'+fp(best.rend,2)+'</b> - Régime : '+best.regime+'</div>'+
'<div class="sec" style="margin-bottom:12px"><div class="stitle">3 ACTIONS PRIORITAIRES</div>'+
'<ol style="padding-left:18px;margin:0">'+actList+'</ol></div>'+
'<div class="box warn"><b>Points de vigilance législatifs :</b>'+
'<ul style="margin:6px 0 0 14px">'+vigList+'</ul></div>'+
'<div style="margin-top:10px;font-size:12px;color:var(--muted)">Classement : '+classement+'</div>';
$('recommandation').innerHTML=recoHTML;
calcProjection();
}
function sp2(id,lbl,unit){$(lbl).textContent=G(id)+unit}
function spF(id,lbl,unit){$(lbl).textContent=G(id).toFixed(1).replace('.',',')+' '+unit}
function calcProjection(){
const lc=lastCalc;
if(!lc||!lc.prixAcq) return;
const n=G('dureeProj')||10;
const inf=G('inflat')/100;
const anDebut=+(document.getElementById('anDebut').value)||2026;
const prixAcq=lc.prixAcq||300000;
const fixed=lc.fixed||0;
const loanAn=lc.loanAn||0;
const tmi3=lc.tmi3||0.30;
const gross0=lc.gross||0;
const opCost0=lc.opCost||0;
const deductFixed0=lc.deductFixed||0;
const loyerEvite0=(G('loyerEvite')||1500);
const loyerLT0=(G('loyerLT')||1400);
const vacLT=G('vacLT')/100||0.08;
const gstLT=G('gstLT')/100||0;
const tTerrain=G('terrain')/100||0.15;
const amortBase=prixAcq*(1-tTerrain);
const mobAn=amortBase*.05/7;
const instAn=amortBase*.10/15;
const agenAn=amortBase*.20/15;
const facAn=amortBase*.15/25;
const goAn=amortBase*.50/50;
function amortY(y){
return goAn+(y<=25?facAn:0)+(y<=15?agenAn+instAn:0)+(y<=7?mobAn:0);
}
const rows=[];
let cumRP=0,cumLT=0,cumAir=0;
for(let y=1;y<=n;y++){
const g=Math.pow(1+inf,y-1);
const amort=amortY(y);
const rpCF12=(loyerEvite0*g*12)-fixed;
cumRP+=rpCF12;
const ltRev=loyerLT0*g*12*(1-vacLT);
const ltComm=loyerLT0*g*12*gstLT;
const ltSeuilMicro=83600*Math.pow(1+inf,y-1);
let ltImp=0;
if(ltRev>ltSeuilMicro){
const ltBase=Math.max(0,ltRev-ltComm-(fixed-loanAn)-amort);
ltImp=ltBase*(tmi3+0.186);
} else {
ltImp=ltRev*0.50*(tmi3+0.186);
}
const ltCF12=ltRev-ltComm-ltImp-fixed;
cumLT+=ltCF12;
const grossY=gross0*g;
const opCostY=opCost0*g;
const airBase=Math.max(0,grossY-opCostY-(fixed-loanAn)-amort);
const airTax=airBase*(tmi3+0.186);
const airCF12=grossY-opCostY-airTax-fixed;
cumAir+=airCF12;
rows.push({y,an:anDebut+y-1,rpM:rpCF12/12,ltM:ltCF12/12,airM:airCF12/12,cumRP,cumLT,cumAir,amort,ltRegP:ltRev>ltSeuilMicro?'LMNP réel':'micro-BIC'});
}
let tbl='<tr><th>Année</th><th>RP / mois</th><th>Long terme / mois</th><th>Régime LT</th><th>Airbnb / mois</th><th>Amort. / an</th></tr>';
rows.forEach(function(r){
const best=Math.max(r.rpM,r.ltM,r.airM);
let amortNote='';
if(r.y===8) amortNote='<br><span style="font-size:10px;color:var(--warn-txt)">mobilier épuisé</span>';
else if(r.y===16) amortNote='<br><span style="font-size:10px;color:var(--warn-txt)">agen.+inst. épuisés</span>';
else if(r.y===26) amortNote='<br><span style="font-size:10px;color:var(--warn-txt)">façade épuisée</span>';
tbl+='<tr>';
tbl+='<td style="color:var(--muted)">'+r.an+amortNote+'</td>';
tbl+='<td class="'+(r.rpM===best?'col-hi':'')+'" style="color:'+(r.rpM>=0?'inherit':'var(--red)')+'">'+fe(r.rpM)+'</td>';
tbl+='<td class="'+(r.ltM===best&&r.ltM!==r.rpM?'col-hi':'')+'" style="color:'+(r.ltM>=0?'inherit':'var(--red)')+'">'+fe(r.ltM)+'</td>';
tbl+='<td style="font-size:10.5px;color:var(--muted)">'+r.ltRegP+'</td>';
tbl+='<td class="'+(r.airM===best&&r.airM!==r.rpM&&r.airM!==r.ltM?'col-hi':'')+'" style="color:'+(r.airM>=0?'inherit':'var(--red)')+'">'+fe(r.airM)+'</td>';
tbl+='<td style="color:var(--muted);font-size:11.5px">'+fe(r.amort)+'</td>';
tbl+='</tr>';
});
$('projTable').innerHTML=tbl;
const last=rows[rows.length-1];
const cums=[{n:'RP',c:last.cumRP},{n:'Location LT',c:last.cumLT},{n:'Airbnb',c:last.cumAir}];
const bestCum=cums.reduce((a,b)=>a.c>b.c?a:b);
const worstCum=cums.reduce((a,b)=>a.c<b.c?a:b);
const ecart=bestCum.c-worstCum.c>0?' · Écart max : <b>+'+fe(bestCum.c-worstCum.c)+'</b>':'';
$('projCumul').innerHTML=
'<div class="box good"><b>Cumul sur '+n+' ans :</b> RP → <b>'+fe(last.cumRP)+'</b> · Long terme → <b>'+fe(last.cumLT)+'</b> · Airbnb → <b>'+fe(last.cumAir)+'</b><br>'+
'<span style="color:var(--good-txt)">Meilleur scénario sur '+n+' ans : <b>'+bestCum.n+'</b> ('+fe(bestCum.c)+' nets cumulés)</span>'+ecart+'</div>'+
'<div class="box info" style="margin-top:6px"><b>Note :</b> L\'amortissement LMNP réel s\'épuise par composant (mobilier 7 ans, installations/agencements 15 ans, façade 25 ans, gros oeuvre 50 ans). Au fil des années, la base imposable du scénario Airbnb augmente → l\'avantage fiscal se réduit.</div>';
}
const sel=$('arrSel');
Object.keys(ARR).forEach((k,i)=>{const o=document.createElement('option');o.value=k;o.textContent=k;if(i===10)o.selected=true;sel.appendChild(o);});
setArr();
calcAmort();