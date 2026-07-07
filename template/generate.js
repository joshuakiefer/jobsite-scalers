#!/usr/bin/env node
/* ============================================================
   STATIC SITE GENERATOR
   Reads site.config.js and writes a complete multi-page client
   site into dist/: home page, one real page per service, one
   real page per city, sitemap.xml, and robots.txt.

   Usage:  node generate.js [path/to/site.config.js]
   Deploy: point Vercel/Netlify at the dist/ folder. Done.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(process.argv[2] || path.join(__dirname, "site.config.js"));
const C = require(configPath);
const OUT = path.join(path.dirname(configPath), "dist");

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const services = C.services.slice(0, 10).map((s) => ({ ...s, slug: s.slug || slugify(s.name) }));
const cities = C.cities.slice(0, 10).map((c) => ({
  name: c,
  slug: C.trade.urlPrefix + "-" + slugify(c) + "-" + (C.citySuffix || ""),
}));

/* ---------------- icons ---------------- */
const ICONS = {
  heater: '<rect x="7" y="2.5" width="10" height="17" rx="3" stroke="ICO" stroke-width="1.8"/><path d="M10 6.5h4M12 19.5V22M9.5 22h5" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/><path d="M12 10c-1.2 1.5-1.8 2.4-1.8 3.3a1.8 1.8 0 0 0 3.6 0c0-.9-.6-1.8-1.8-3.3z" fill="ICO"/>',
  drain: '<path d="M4 4c5 0 5 4 10 4s5-4 6-4M4 10c5 0 5 4 10 4s5-4 6-4M4 16c5 0 5 4 10 4s5-4 6-4" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/>',
  pipes: '<path d="M3 8h7a4 4 0 0 1 4 4v9" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/><path d="M3 5v6M11 21h6" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/><circle cx="19.5" cy="8" r="2.5" stroke="ICO" stroke-width="1.8"/>',
  pump: '<path d="M12 3c-3 3.8-4.7 6.1-4.7 8.4a4.7 4.7 0 0 0 9.4 0C16.7 9.1 15 6.8 12 3z" stroke="ICO" stroke-width="1.8"/><path d="M5 20h14M8 17l-2 3M16 17l2 3" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/>',
  flame: '<path d="M12 2.5c1 2.8 3.5 4 3.5 7a3.5 3.5 0 0 1-7 0c0-1.2.4-2.1 1-3.1.3 1 .9 1.6 1.6 1.9-.4-2.2-.1-4.2.9-5.8z" stroke="ICO" stroke-width="1.8" stroke-linejoin="round"/><rect x="6" y="14.5" width="12" height="7" rx="2" stroke="ICO" stroke-width="1.8"/><path d="M9 18h6" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/>',
  dig: '<path d="M3 18h18M3 21h18" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/><path d="M6 18c0-2 1.5-3.5 3-4.5M18 18c0-2-1.5-3.5-3-4.5" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/><path d="M13 4l3.5 3.5c.8.8.8 2 0 2.8l-1.2 1.2c-.8.8-2 .8-2.8 0L9 8l4-4z" stroke="ICO" stroke-width="1.8" stroke-linejoin="round"/>',
  drop: '<path d="M12 3c-3 3.8-5 6.6-5 9.3a5 5 0 0 0 10 0C17 9.6 15 6.8 12 3z" stroke="ICO" stroke-width="1.8"/><path d="M9.5 13a2.5 2.5 0 0 0 2.5 2.5" stroke="ICO" stroke-width="1.8" stroke-linecap="round"/>',
  bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2z" stroke="ICO" stroke-width="1.8" stroke-linejoin="round"/>',
  wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.7L3 17.7V21h3.3l5.7-5.7a4.5 4.5 0 0 0 5.7-6l-3 3-2.7-.3-.3-2.7 3-3z" stroke="ICO" stroke-width="1.8" stroke-linejoin="round"/>',
};
const icon = (name, color, size = 24) =>
  '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none">' +
  (ICONS[name] || ICONS.wrench).replace(/ICO/g, color) + "</svg>";
const phoneIcon = (color, size = 14) =>
  '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none"><path d="M6.6 2.7c.5-.5 1.3-.4 1.7.1l2 2.6c.4.5.3 1.2-.1 1.6l-1.1 1.1c.8 1.7 2.2 3.1 3.9 3.9l1.1-1.1c.4-.4 1.1-.5 1.6-.1l2.6 2c.5.4.6 1.2.1 1.7l-1.5 1.5c-.5.5-1.3.7-2 .5-2.5-.7-4.9-2.1-6.9-4.1S4.7 8 4 5.5c-.2-.7 0-1.5.5-2l2.1-.8z" fill="' + color + '"/></svg>';

/* ---------------- CSS (shared by every page) ---------------- */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--navy:${C.brand.primary};--blue:${C.brand.blue};--amber:${C.brand.accent};--ink:#16212f;--muted:#5b6774}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--ink);background:#f7f8fa;-webkit-font-smoothing:antialiased}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input,textarea{font-family:inherit}
a{text-decoration:none;color:inherit}
.topbar{background:#fff;border-bottom:1px solid #e6e9ed;padding:0 5vw;height:66px;display:flex;align-items:center;gap:22px;position:sticky;top:0;z-index:50;box-shadow:0 1px 10px rgba(14,42,71,.06)}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18.5px;color:var(--navy);white-space:nowrap}
.brand-mark{width:36px;height:36px;border-radius:9px;background:linear-gradient(145deg,var(--blue),var(--navy));display:flex;align-items:center;justify-content:center;flex-shrink:0}
.nav{display:flex;gap:22px;margin-left:10px;align-items:center;height:66px}
.nav>a,.nav-item>a{color:#3c4a59;font-weight:600;font-size:13.5px}
.nav>a:hover,.nav-item>a:hover{color:var(--blue)}
.has-caret::after{content:"";display:inline-block;width:6px;height:6px;border-right:1.8px solid currentColor;border-bottom:1.8px solid currentColor;transform:rotate(45deg) translateY(-2px);margin-left:7px;opacity:.55}
.nav-item{position:relative;height:66px;display:flex;align-items:center}
.dropdown{position:absolute;top:100%;left:-10px;background:#fff;border:1px solid #e4e8ed;border-radius:13px;box-shadow:0 18px 44px rgba(14,42,71,.16);padding:8px;min-width:236px;opacity:0;visibility:hidden;transform:translateY(8px);transition:.16s;z-index:40}
.nav-item:hover .dropdown{opacity:1;visibility:visible;transform:none}
.dropdown a{display:block;padding:8.5px 12px;border-radius:8px;font-size:13px;font-weight:600;color:#3c4a59;white-space:nowrap}
.dropdown a:hover{background:#eef4fc;color:var(--blue)}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:14px}
.badge-247{background:#fff4dd;color:#9a6205;border:1px solid #f3d999;font-size:11.5px;font-weight:800;letter-spacing:.4px;padding:6px 11px;border-radius:999px;white-space:nowrap;display:flex;align-items:center;gap:6px}
.call-btn{background:var(--navy);color:#fff;font-weight:800;font-size:14.5px;padding:10px 18px;border-radius:10px;display:flex;align-items:center;gap:8px;white-space:nowrap}
.call-btn:hover{filter:brightness(1.15)}
.hero{background:radial-gradient(900px 400px at 85% -10%,rgba(29,111,209,.35),transparent 60%),radial-gradient(700px 500px at -10% 110%,rgba(245,165,36,.18),transparent 55%),linear-gradient(160deg,var(--navy) 0%,#123a63 55%,var(--navy) 100%);padding:56px 5vw 64px;display:grid;grid-template-columns:1.15fr .85fr;gap:44px;align-items:center;position:relative;overflow:hidden}
.hero::before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 2px,transparent 2px 26px);pointer-events:none}
.hero-copy{position:relative}
.crumb{font-size:12.5px;font-weight:600;color:#8fa6bf;margin-bottom:14px}
.crumb a{color:#8fa6bf}.crumb span{margin:0 6px;opacity:.6}.crumb b{color:#ffc45e;font-weight:700}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(245,165,36,.14);border:1px solid rgba(245,165,36,.45);color:#ffd489;font-size:12px;font-weight:800;letter-spacing:1.2px;padding:7px 14px;border-radius:999px;margin-bottom:20px;text-transform:uppercase}
.hero h1{color:#fff;font-size:clamp(28px,3.4vw,40px);line-height:1.12;letter-spacing:-.8px;font-weight:850;margin-bottom:16px}
.hero h1 em{font-style:normal;color:#ffc45e}
.hero .sub{color:#b9c9db;font-size:16.5px;line-height:1.55;max-width:460px;margin-bottom:26px}
.hero-ctas{display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap}
.btn-primary{background:linear-gradient(180deg,#ffb640,var(--amber));color:#3a2600;font-weight:800;font-size:15.5px;padding:14px 24px;border-radius:12px;box-shadow:0 8px 22px rgba(245,165,36,.35);display:inline-flex;align-items:center;gap:9px}
.btn-primary:hover{transform:translateY(-1px)}
.btn-ghost{border:1.5px solid rgba(255,255,255,.35);color:#fff;font-weight:700;font-size:15px;padding:14px 22px;border-radius:12px}
.btn-ghost:hover{background:rgba(255,255,255,.08)}
.chips{display:flex;gap:10px;flex-wrap:wrap}
.chip{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#dbe6f2;font-size:12.5px;font-weight:700;padding:8px 13px;border-radius:999px}
.lead-card{background:#fff;border-radius:18px;padding:26px 26px 22px;box-shadow:0 24px 60px rgba(4,16,32,.45);position:relative;z-index:2}
.lead-card h3{font-size:20px;font-weight:850;color:var(--navy)}
.lead-sub{font-size:13px;color:var(--muted);margin:5px 0 18px;display:flex;align-items:center;gap:7px}
.dot-live{width:8px;height:8px;border-radius:50%;background:#22b862;animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(34,184,98,.45)}70%{box-shadow:0 0 0 8px rgba(34,184,98,0)}100%{box-shadow:0 0 0 0 rgba(34,184,98,0)}}
.field{margin-bottom:13px}
.field label{display:block;font-size:12px;font-weight:800;color:#45505d;letter-spacing:.3px;margin-bottom:6px;text-transform:uppercase}
.field input,.field textarea{width:100%;border:1.5px solid #dde2e8;border-radius:10px;padding:11px 13px;font-size:14.5px;background:#fbfcfd;outline:none;transition:.15s;resize:none}
.field input:focus,.field textarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(29,111,209,.14);background:#fff}
.lead-submit{width:100%;background:linear-gradient(180deg,#2a7de0,#1a63bd);color:#fff;font-weight:800;font-size:15.5px;padding:14px;border-radius:11px;margin-top:4px;box-shadow:0 8px 20px rgba(29,111,209,.3)}
.fineprint{font-size:10.5px;color:#98a2ad;text-align:center;margin-top:11px;line-height:1.45}
.lead-success{position:absolute;inset:0;background:#fff;border-radius:18px;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px}
.lead-card.submitted .lead-success{display:flex}
.success-ring{width:74px;height:74px;border-radius:50%;background:#e6f8ee;display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.lead-success h4{font-size:20px;font-weight:850;color:var(--navy);margin-bottom:8px}
.lead-success p{font-size:14px;color:var(--muted);line-height:1.5;max-width:260px}
.section{padding:58px 5vw;scroll-margin-top:72px}
.section-head{text-align:center;max-width:620px;margin:0 auto 38px}
.kicker{color:var(--blue);font-size:12px;font-weight:850;letter-spacing:1.6px;text-transform:uppercase}
.section-head h2{font-size:clamp(24px,2.6vw,30px);font-weight:850;letter-spacing:-.5px;color:var(--navy);margin:8px 0 10px}
.section-head p{color:var(--muted);font-size:15px;line-height:1.55}
.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}
.svc-card{border:1px solid #e7ebef;border-radius:16px;padding:24px 20px;background:linear-gradient(180deg,#fff,#fafbfc);transition:.18s;display:block}
.svc-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(14,42,71,.1)}
.svc-icon{width:46px;height:46px;border-radius:12px;background:#e9f1fb;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.svc-card h3{font-size:16px;font-weight:800;color:var(--navy);margin-bottom:7px}
.svc-card p{font-size:13px;color:var(--muted);line-height:1.5}
.svc-more{font-size:12.5px;font-weight:800;color:var(--blue);margin-top:10px;display:inline-block}
.work-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.job-card{background:#fff;border:1px solid #e7ebef;border-radius:16px;overflow:hidden;transition:.18s}
.job-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(14,42,71,.12)}
.job-photo{aspect-ratio:4/3;position:relative;overflow:hidden;background:linear-gradient(150deg,#2c4d76,#122b47)}
.job-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.03);transition:transform .45s}
.job-card:hover .job-photo img{transform:scale(1.045)}
.job-cap{padding:13px 16px 15px}
.job-title{font-size:14.5px;font-weight:800;color:var(--navy)}
.job-meta{font-size:12px;color:var(--muted);margin-top:3px}
.why{background:var(--navy);display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));padding:30px 5vw;gap:14px}
.why div{text-align:center}
.why .big{color:#fff;font-size:23px;font-weight:850}
.why .small{color:#93a9c1;font-size:12px;font-weight:700;margin-top:3px;letter-spacing:.3px;text-transform:uppercase}
#reviews{background:#f2f5f8}
.rating{display:flex;align-items:center;justify-content:center;gap:18px;margin-bottom:30px}
.rating-num{font-size:46px;font-weight:850;color:var(--navy);letter-spacing:-1.5px;line-height:1}
.stars{color:#fbbc04;font-size:19px;letter-spacing:2px}
.rating-based{font-size:13px;color:var(--muted);font-weight:600;margin-top:3px;display:flex;align-items:center;gap:6px}
.review-list{max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
.review-card{background:#fff;border:1px solid #e6eaee;border-radius:15px;padding:18px 20px;box-shadow:0 2px 8px rgba(14,42,71,.05)}
.review-top{display:flex;align-items:center;gap:11px;margin-bottom:9px}
.rev-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;flex-shrink:0}
.rev-name{font-weight:800;font-size:14px}
.rev-meta{font-size:12px;color:#8b95a1;margin-top:1px}
.rev-stars{color:#fbbc04;font-size:13.5px;letter-spacing:1.5px;margin-left:auto}
.rev-text{font-size:13.8px;color:#37424e;line-height:1.55}
.svc-detail{max-width:760px;margin:0 auto;font-size:15.5px;color:#37424e;line-height:1.7}
.svc-detail p{margin-bottom:16px}
.svc-detail .cta-row{margin-top:26px;display:flex;gap:12px;flex-wrap:wrap}
.btn-solid{background:linear-gradient(180deg,#2a7de0,#1a63bd);color:#fff;font-weight:800;font-size:15px;padding:13px 22px;border-radius:11px;display:inline-flex;align-items:center;gap:8px}
.link-cols{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;max-width:920px;margin:0 auto}
.link-cols a{font-size:13.5px;font-weight:600;color:#3c4a59;padding:9px 12px;border-radius:9px;background:#fff;border:1px solid #e7ebef;display:block}
.link-cols a:hover{color:var(--blue);border-color:#cfe0f5}
footer{background:#091d33;color:#8fa3ba;padding:38px 5vw 30px;font-size:13px;line-height:1.6}
.footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:30px;margin-bottom:26px}
footer h4{color:#fff;font-size:13px;font-weight:800;letter-spacing:.8px;margin-bottom:10px;text-transform:uppercase}
.footer-brand{display:flex;align-items:center;gap:9px;color:#fff;font-weight:800;font-size:16px;margin-bottom:12px}
.footer-bottom{border-top:1px solid rgba(255,255,255,.09);padding-top:18px;font-size:12px;color:#5f7690;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
.sticky-call{display:none;position:fixed;bottom:22px;right:22px;z-index:60;width:62px;height:62px;border-radius:50%;background:linear-gradient(180deg,#2bb15e,#189549);box-shadow:0 10px 26px rgba(24,149,73,.45);align-items:center;justify-content:center;animation:pulse 2.4s infinite}
@media (max-width:900px){.sticky-call{display:flex}.hero{grid-template-columns:1fr}.nav{display:none}.badge-247{display:none}}
`;

/* ---------------- shared page pieces ---------------- */
const wrenchMark = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.7L3 17.7V21h3.3l5.7-5.7a4.5 4.5 0 0 0 5.7-6l-3 3-2.7-.3-.3-2.7 3-3z" fill="#fff"/></svg>';
const B = C.business;
const telHref = "tel:+1" + B.phone.replace(/\D/g, "");

function nav(rel) {
  const svcLinks = services.map((s) => `<a href="${rel}${s.slug}/">${esc(s.name)}</a>`).join("");
  const cityLinks = cities.map((c) => `<a href="${rel}${c.slug}/">${esc(c.name)}</a>`).join("");
  return `<header class="topbar">
  <a class="brand" href="${rel}"><span class="brand-mark">${wrenchMark}</span>${esc(B.name)}</a>
  <nav class="nav">
    <div class="nav-item"><a href="${rel}#services" class="has-caret">Services</a><div class="dropdown">${svcLinks}</div></div>
    <div class="nav-item"><a href="${rel}#areas" class="has-caret">Locations</a><div class="dropdown">${cityLinks}</div></div>
    <a href="${rel}#work">Our Work</a>
    <a href="${rel}#reviews">Reviews</a>
  </nav>
  <div class="topbar-right">
    <span class="badge-247">⚡ ${esc(C.hero.emergencyBadge)}</span>
    <a class="call-btn" href="${telHref}">${phoneIcon("#fff")} ${esc(B.phone)}</a>
  </div>
</header>`;
}

function leadForm(context) {
  return `<div class="lead-card" id="leadCard">
  <h3>${esc(C.form.title)}</h3>
  <p class="lead-sub"><span class="dot-live"></span>${esc(C.form.subtitle)}</p>
  <form id="leadForm" autocomplete="on">
    <div class="field"><label for="f-name">Your Name</label><input id="f-name" name="name" type="text" required></div>
    <div class="field"><label for="f-phone">Mobile Phone</label><input id="f-phone" name="phone" type="tel" required></div>
    <div class="field"><label for="f-address">Service Address</label><input id="f-address" name="address" type="text" placeholder="Street, city" required></div>
    <div class="field"><label for="f-issue">What's going on?</label><textarea id="f-issue" name="issue" rows="3" placeholder="${esc(C.form.issuePlaceholder)}" required></textarea></div>
    <input type="hidden" name="page" value="${esc(context)}">
    <button class="lead-submit" type="submit">${esc(C.form.button)}</button>
    <p class="fineprint">${esc(C.form.fineprint)}</p>
  </form>
  <div class="lead-success">
    <div class="success-ring"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="#1cab5c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <h4>${esc(C.form.successTitle)}</h4><p>${esc(C.form.successText)}</p>
  </div>
</div>`;
}

const FORM_JS = `<script>
(function(){
  var form=document.getElementById("leadForm");
  if(!form)return;
  var WEBHOOK=${JSON.stringify(C.leadWebhook || "")};
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var data={};
    new FormData(form).forEach(function(v,k){data[k]=v;});
    data.submittedAt=new Date().toISOString();
    data.source=location.href;
    if(WEBHOOK){
      fetch(WEBHOOK,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).catch(function(){});
    }
    document.getElementById("leadCard").classList.add("submitted");
  });
})();
<\/script>`;

function footer(rel) {
  return `<footer>
  <div class="footer-grid">
    <div>
      <div class="footer-brand"><span class="brand-mark" style="width:30px;height:30px;border-radius:8px">${wrenchMark}</span>${esc(B.name)}</div>
      <p>${esc(B.address)}<br>${esc(B.license)}</p>
    </div>
    <div><h4>Hours</h4><p>${esc(B.hours)}</p></div>
    <div><h4>Contact</h4><p><a href="${telHref}">${esc(B.phone)}</a><br>${esc(B.email)}</p></div>
  </div>
  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} ${esc(B.name)} All rights reserved.</span>
    <span>Proudly serving ${esc(cities.map((c) => c.name).slice(0, 4).join(", "))} & beyond</span>
  </div>
</footer>
<a class="sticky-call" href="${telHref}" aria-label="Call now">${phoneIcon("#fff", 26)}</a>`;
}

function page({ rel, title, desc, canonical, body, jsonld }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="data:,">
${jsonld ? '<script type="application/ld+json">' + JSON.stringify(jsonld) + "<\/script>" : ""}
<style>${CSS}</style>
</head>
<body>
${nav(rel)}
${body}
${footer(rel)}
${FORM_JS}
</body>
</html>`;
}

function hero({ rel, crumb, h1, sub, formContext }) {
  return `<section class="hero" id="request">
  <div class="hero-copy">
    ${crumb ? `<div class="crumb"><a href="${rel}">${esc(B.name)}</a><span>›</span><b>${esc(crumb)}</b></div>` : `<span class="eyebrow">⚡ ${esc(C.hero.badge)}</span>`}
    <h1>${h1}</h1>
    <p class="sub">${esc(sub)}</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="${telHref}">${phoneIcon("#3a2600", 15)} Call ${esc(B.phone)}</a>
      <a class="btn-ghost" href="#request">Request Service</a>
    </div>
    <div class="chips">${C.hero.chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
  </div>
  ${leadForm(formContext)}
</section>`;
}

function reviewsSection() {
  const palettes = ["linear-gradient(160deg,#7b61c9,#4a3a8c)", "linear-gradient(160deg,#e0793a,#b3541e)", "linear-gradient(160deg,#3aa87c,#1f7d57)"];
  const cards = C.reviews.items.map((r, i) => `<div class="review-card">
    <div class="review-top">
      <div class="rev-avatar" style="background:${palettes[i % palettes.length]}">${esc(r.name[0])}</div>
      <div><div class="rev-name">${esc(r.name)}</div><div class="rev-meta">${esc(r.when)}</div></div>
      <div class="rev-stars">★★★★★</div>
    </div>
    <p class="rev-text">${esc(r.text)}</p>
  </div>`).join("");
  return `<section class="section" id="reviews">
  <div class="section-head"><span class="kicker">Our Reputation</span><h2>Neighbors who'd call us again.</h2></div>
  <div class="rating">
    <span class="rating-num">${esc(C.reviews.rating)}</span>
    <div><div class="stars">★★★★★</div><div class="rating-based">Based on ${C.reviews.count} Google reviews</div></div>
  </div>
  <div class="review-list">${cards}</div>
</section>`;
}

function areasSection(rel) {
  return `<section class="section" id="areas" style="background:#fff">
  <div class="section-head"><span class="kicker">Service Areas</span><h2>${esc(C.trade.noun[0].toUpperCase() + C.trade.noun.slice(1))} service across the ${esc(B.serviceArea)}.</h2></div>
  <div class="link-cols">${cities.map((c) => `<a href="${rel}${c.slug}/">${esc(C.trade.person[0].toUpperCase() + C.trade.person.slice(1))} in ${esc(c.name)}</a>`).join("")}</div>
</section>`;
}

/* ---------------- home page ---------------- */
function homePage() {
  const svcCards = services.map((s) => `<a class="svc-card" href="${s.slug}/">
    <div class="svc-icon">${icon(s.icon, C.brand.blue)}</div>
    <h3>${esc(s.name)}</h3><p>${esc(s.blurb)}</p><span class="svc-more">Learn more →</span>
  </a>`).join("");
  const jobs = C.gallery.map((g) => `<figure class="job-card" style="margin:0">
    <div class="job-photo"><img src="photos/${path.basename(g.img)}" alt="${esc(g.title)}" loading="lazy"></div>
    <figcaption class="job-cap"><div class="job-title">${esc(g.title)}</div><div class="job-meta">${esc(g.meta)}</div></figcaption>
  </figure>`).join("");
  const body = `
${hero({ rel: "", crumb: null, h1: C.hero.h1, sub: C.hero.sub, formContext: "home" })}
<section class="section" id="services" style="background:#fff">
  <div class="section-head"><span class="kicker">What We Do</span><h2>Every job, every problem, handled.</h2>
  <p>From a small fix to a full replacement, our licensed techs show up on time with the parts on the truck.</p></div>
  <div class="svc-grid">${svcCards}</div>
</section>
<section class="section" id="work">
  <div class="section-head"><span class="kicker">Our Work</span><h2>Recent jobs around ${esc(B.serviceArea)}.</h2>
  <p>Here's a handful from the last couple of months.</p></div>
  <div class="work-grid">${jobs}</div>
</section>
<section class="why">${C.why.map(([b, s]) => `<div><div class="big">${esc(b)}</div><div class="small">${esc(s)}</div></div>`).join("")}</section>
${reviewsSection()}
${areasSection("")}`;
  return page({
    rel: "",
    title: `${B.name} | ${C.hero.emergencyBadge} ${C.trade.person[0].toUpperCase() + C.trade.person.slice(1)} in ${B.serviceArea}`,
    desc: C.hero.sub,
    canonical: C.baseUrl + "/",
    body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: B.name,
      telephone: B.phone,
      email: B.email,
      address: B.address,
      url: C.baseUrl,
      aggregateRating: { "@type": "AggregateRating", ratingValue: C.reviews.rating, reviewCount: C.reviews.count },
      areaServed: cities.map((c) => c.name),
    },
  });
}

/* ---------------- service pages ---------------- */
function servicePage(s) {
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 6);
  const body = `
${hero({ rel: "../", crumb: s.name, h1: `${esc(s.name)}, <em>done right.</em>`, sub: `Same-day ${s.name.toLowerCase()} across the ${B.serviceArea}. Upfront pricing, licensed techs, and a real person answering the phone.`, formContext: "service:" + s.slug })}
<section class="section" style="background:#fff">
  <div class="svc-detail">
    <span class="kicker">${esc(s.name)}</span>
    <h2 style="font-size:26px;font-weight:850;color:var(--navy);margin:8px 0 16px">Straight answers, fair prices, tidy work.</h2>
    <p>${esc(s.blurb)}</p>
    <p>Every ${esc(s.name.toLowerCase())} job starts the same way: we look, we explain what we found in plain English, and you approve the price before any work begins. No surprise line items, no upsell theater. Just the fix you actually need, backed by our satisfaction guarantee.</p>
    <p>We're ${esc(B.name)}, serving the ${esc(B.serviceArea)} since ${B.founded}. Licensed, insured, and background-checked, and we treat your home like it's ours: floor protection down, boots covered, and we haul away the mess when we're done.</p>
    <div class="cta-row">
      <a class="btn-solid" href="${telHref}">${phoneIcon("#fff", 15)} Call ${esc(B.phone)}</a>
      <a class="btn-solid" style="background:linear-gradient(180deg,#ffb640,var(--amber));color:#3a2600" href="#request">Request Service Online</a>
    </div>
  </div>
</section>
<section class="why">${C.why.map(([b, sm]) => `<div><div class="big">${esc(b)}</div><div class="small">${esc(sm)}</div></div>`).join("")}</section>
${reviewsSection()}
<section class="section" style="background:#fff">
  <div class="section-head"><span class="kicker">More Services</span><h2>We can help with that too.</h2></div>
  <div class="link-cols">${others.map((o) => `<a href="../${o.slug}/">${esc(o.name)}</a>`).join("")}</div>
</section>`;
  return page({
    rel: "../",
    title: `${s.name} in ${B.serviceArea} | ${B.name}`,
    desc: s.blurb,
    canonical: `${C.baseUrl}/${s.slug}/`,
    body,
  });
}

/* ---------------- city pages ---------------- */
function cityPage(c) {
  const svcLinks = services.slice(0, 6);
  const Person = C.trade.person[0].toUpperCase() + C.trade.person.slice(1);
  const body = `
${hero({ rel: "../", crumb: c.name, h1: `Fast, honest ${esc(C.trade.noun)} in <em>${esc(c.name)}</em>.`, sub: `Serving ${c.name} since ${B.founded}. Upfront pricing, licensed techs, and a real person answering the phone, day or night.`, formContext: "city:" + c.slug })}
<section class="section" style="background:#fff">
  <div class="svc-detail">
    <span class="kicker">${esc(Person)} in ${esc(c.name)}</span>
    <h2 style="font-size:26px;font-weight:850;color:var(--navy);margin:8px 0 16px">Your ${esc(c.name)} neighbors already call us.</h2>
    <p>When something breaks in ${esc(c.name)}, you don't want a call center three states away. You want a local crew that knows the homes here, picks up the phone, and shows up when they said they would. That's been our whole business since ${B.founded}.</p>
    <p>We keep trucks stocked and routes tight across the ${esc(B.serviceArea)}, which is how we hit our ${esc(C.why[3][0])} emergency response window. Day or night, weekends and holidays, a real person answers and help gets rolling.</p>
    <div class="cta-row">
      <a class="btn-solid" href="${telHref}">${phoneIcon("#fff", 15)} Call ${esc(B.phone)}</a>
      <a class="btn-solid" style="background:linear-gradient(180deg,#ffb640,var(--amber));color:#3a2600" href="#request">Request Service Online</a>
    </div>
  </div>
</section>
<section class="section">
  <div class="section-head"><span class="kicker">Popular in ${esc(c.name)}</span><h2>What we handle most around here.</h2></div>
  <div class="link-cols">${svcLinks.map((s) => `<a href="../${s.slug}/">${esc(s.name)}</a>`).join("")}</div>
</section>
<section class="why">${C.why.map(([b, sm]) => `<div><div class="big">${esc(b)}</div><div class="small">${esc(sm)}</div></div>`).join("")}</section>
${reviewsSection()}`;
  return page({
    rel: "../",
    title: `${Person} in ${c.name}, ${(C.citySuffix || "").toUpperCase()} | ${B.name}`,
    desc: `Fast, honest ${C.trade.noun} in ${c.name}. Upfront pricing, licensed techs, ${C.hero.emergencyBadge.toLowerCase()}. Call ${B.phone}.`,
    canonical: `${C.baseUrl}/${c.slug}/`,
    body,
  });
}

/* ---------------- write everything ---------------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "photos"), { recursive: true });

// copy gallery photos
for (const g of C.gallery) {
  const src = path.resolve(path.dirname(configPath), g.img);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(OUT, "photos", path.basename(src)));
  } else {
    console.warn("  ! photo not found, skipping:", g.img);
  }
}

fs.writeFileSync(path.join(OUT, "index.html"), homePage());
const urls = [C.baseUrl + "/"];
for (const s of services) {
  fs.mkdirSync(path.join(OUT, s.slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, s.slug, "index.html"), servicePage(s));
  urls.push(`${C.baseUrl}/${s.slug}/`);
}
for (const c of cities) {
  fs.mkdirSync(path.join(OUT, c.slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, c.slug, "index.html"), cityPage(c));
  urls.push(`${C.baseUrl}/${c.slug}/`);
}
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") + "\n</urlset>\n");
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${C.baseUrl}/sitemap.xml\n`);

console.log(`Built ${1 + services.length + cities.length} pages into ${path.relative(process.cwd(), OUT)}/`);
console.log(`  home + ${services.length} service pages + ${cities.length} city pages + sitemap.xml + robots.txt`);
