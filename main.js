(function () {
  "use strict";

  var WA_LINK = "https://wa.me/551141720517?text=Ol%C3%A1!%20Vim%20do%20site%20da%20Dra%20Maximiana%20e%20gostaria%20de%20agendar%20uma%20consulta.";
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.setAttribute("href", WA_LINK);
  });

  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header ---------- */
  var header = document.querySelector("[data-header]");
  var progresso = document.querySelector("[data-progresso]");
  var menuBotao = document.getElementById("menuBotao");
  var nav = document.getElementById("navegacao");
  var ultimoY = window.scrollY;

  function aoRolar() {
    var y = window.scrollY;
    header.classList.toggle("solido", y > 40);
    if (y > 240 && y > ultimoY) header.classList.add("esconder");
    else header.classList.remove("esconder");
    ultimoY = y;

    var altura = document.documentElement.scrollHeight - window.innerHeight;
    var prop = altura > 0 ? y / altura : 0;
    if (progresso) progresso.style.transform = "scaleX(" + prop + ")";

    var fab = document.querySelector("[data-fab]");
    if (fab) fab.classList.toggle("mostrar", y > 480);
  }
  document.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  if (menuBotao && nav) {
    menuBotao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      menuBotao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("aberto");
        menuBotao.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var secoes = ["tratamentos", "sinais", "sobre", "contato"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  /* ---------- GSAP ---------- */
  if (window.gsap && !reduzido) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("js-ready");

    secoes.forEach(function (sec) {
      var link = nav.querySelector('a[href="#' + sec.id + '"]');
      if (!link) return;
      ScrollTrigger.create({
        trigger: sec, start: "top 40%", end: "bottom 40%",
        onToggle: function (self) { link.classList.toggle("ativo", self.isActive); }
      });
    });

    /* Hero curtain + stagger */
    var heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .to("[data-anim-foto]", { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power4.out" }, 0.05)
      .to(".hero [data-anim]", { opacity: 1, y: 0, duration: .85, stagger: .12 }, 0.2);

    /* Generic fade-ins */
    gsap.utils.toArray("[data-anim]:not(.hero [data-anim])").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    /* Treatment blocks */
    gsap.utils.toArray("[data-anim-eixo]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    /* Stagger lists */
    gsap.utils.toArray("[data-anim-lista]").forEach(function (lista) {
      var n = lista.children.length;
      gsap.from(lista.children, {
        y: 18, opacity: 0, duration: .6,
        stagger: n > 8 ? .04 : .09,
        ease: "power3.out",
        scrollTrigger: { trigger: lista, start: "top 85%" }
      });
    });

    /* Checklist checkmarks draw-in */
    ScrollTrigger.batch(".checklist li", {
      start: "top 92%",
      onEnter: function (batch) {
        batch.forEach(function (li, i) {
          setTimeout(function () { li.classList.add("visto"); }, i * 45);
        });
      }
    });

    /* Word-mask reveal for quotes */
    document.querySelectorAll("[data-anim-palavras]").forEach(function (bloco) {
      var texto = bloco.textContent;
      bloco.innerHTML = texto.split(" ").map(function (p) {
        return '<span class="palavra"><i>' + p + '</i></span>';
      }).join(" ");
      gsap.from(bloco.querySelectorAll(".palavra > i"), {
        yPercent: 110, opacity: 0, duration: .7, stagger: .018, ease: "power3.out",
        scrollTrigger: { trigger: bloco, start: "top 85%" }
      });
    });

    /* Faixa parallax (photo bg, safe — plain rectangular photo) */
    gsap.utils.toArray(".faixa__foto img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: img.closest(".faixa"), start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* Sobre photo gentle parallax (translate only, no scale/crop risk) */
    gsap.utils.toArray("[data-parallax]").forEach(function (fig) {
      var img = fig.querySelector("img");
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* Stat counters */
    document.querySelectorAll("[data-contador]").forEach(function (el) {
      var alvo = parseInt(el.getAttribute("data-contador"), 10);
      var obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: alvo, duration: 1.6, ease: "power2.out",
            onUpdate: function () { el.textContent = Math.round(obj.val); }
          });
        }
      });
    });

    /* Header accent bar-esque numero reveal on treatments */
    gsap.utils.toArray(".tratamento__numero").forEach(function (n) {
      gsap.from(n, {
        opacity: 0, x: -12, duration: .6, ease: "power2.out",
        scrollTrigger: { trigger: n, start: "top 90%" }
      });
    });

  } else {
    /* No-motion fallback: ensure quotes still render as plain text (already are) */
    document.documentElement.classList.remove("js-ready");
  }

  /* ---------- Magnetic CTA buttons ---------- */
  if (!reduzido && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".botao--cta").forEach(function (btn) {
      var forca = 14;
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        if (window.gsap) {
          gsap.to(btn, { x: x * forca, y: y * forca, duration: .3, ease: "power2.out" });
        }
      });
      btn.addEventListener("mouseleave", function () {
        if (window.gsap) gsap.to(btn, { x: 0, y: 0, duration: .5, ease: "elastic.out(1, 0.4)" });
      });
    });
  }
})();
