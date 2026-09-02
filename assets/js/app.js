/* =============================================================
   app.js — renderiza o site a partir de config.js.
   Vanilla JS, sem dependências.
   ============================================================= */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) return;

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------- WhatsApp ---------- */
  var fone = String(S.contato.whatsapp || "").replace(/\D/g, "");

  function waLink(texto) {
    return "https://wa.me/" + fone + "?text=" + encodeURIComponent(texto || "");
  }

  function abrirWhats(texto) {
    window.open(waLink(texto), "_blank", "noopener");
  }

  /* Aplica no <picture> a foto configurada e suas versões leves.
     chave: "hero" -> usa imagens.hero / heroSrcset / heroWebp */
  function aplicarFoto(seletorImg, seletorWebp, chave) {
    var img = $(seletorImg);
    var webp = $(seletorWebp);
    var cfg = S.imagens || {};
    if (!img) return;

    var arquivo = cfg[chave];
    var srcset = cfg[chave + "Srcset"];
    var srcsetWebp = cfg[chave + "Webp"];

    if (arquivo) img.src = arquivo;
    if (srcset) img.srcset = srcset;
    else img.removeAttribute("srcset");

    if (webp) {
      if (srcsetWebp) webp.srcset = srcsetWebp;
      else webp.remove();
    }
  }

  /* ---------- Bind de textos ---------- */
  function bindTextos() {
    var mapa = {
      nome: S.artista.nome,
      tagline: S.artista.tagline,
      regiao: S.artista.regiao,
      "cidade-uf": S.artista.cidade + (S.artista.uf ? " / " + S.artista.uf : ""),
      instagram: S.contato.instagram ? "@" + S.contato.instagram.replace(/^@/, "") : "",
      "pix-titular": S.pix.titular
    };

    Object.keys(mapa).forEach(function (chave) {
      $$('[data-bind="' + chave + '"]').forEach(function (el) {
        if (mapa[chave]) el.textContent = mapa[chave];
      });
    });

    // título da aba e meta
    document.title = S.artista.nome + " • Sertanejo & Modão | Voz e violão para bares e eventos";

    // links de contato
    $$('[data-bind-href="email"]').forEach(function (a) {
      if (!S.contato.email) { a.closest("li").hidden = true; return; }
      a.href = "mailto:" + S.contato.email;
      a.textContent = S.contato.email;
    });
    $$('[data-bind-href="instagram"]').forEach(function (a) {
      if (!S.contato.instagram) { a.closest("li").hidden = true; return; }
      a.href = "https://instagram.com/" + S.contato.instagram.replace(/^@/, "");
    });
    $$('[data-bind-href="youtube"]').forEach(function (a) {
      var canal = (S.contato.youtube || "").trim();
      if (!canal) { a.closest("li").hidden = true; return; }
      var arroba = "@" + canal.replace(/^@/, "");
      a.href = "https://youtube.com/" + arroba;
      var rotulo = $('[data-bind="youtube"]', a);
      if (rotulo) rotulo.textContent = arroba;
    });

    // botões de WhatsApp declarativos
    $$("[data-wa]").forEach(function (el) {
      var msg = S.mensagens[el.getAttribute("data-wa")] || S.mensagens.orcamento;
      el.setAttribute("href", waLink(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    // fotos (com as versões leves, quando existirem)
    aplicarFoto("#hero-img", "#hero-webp", "hero");
    aplicarFoto("#formatos-img", "#formatos-webp", "formatos");

    // Pix
    var chave = $("#pix-chave");
    if (chave) chave.textContent = S.pix.chave || "—";

    var ano = $("#ano");
    if (ano) ano.textContent = new Date().getFullYear();
  }

  /* ---------- Formatos de show ---------- */
  var ICONES = {
    violao: '<path d="M14.5 3.2 17 5.7M15.8 6.9 9.4 13.3M12.4 4.2 6 10.6"/><circle cx="8" cy="16" r="5.2"/><circle cx="8" cy="16" r="1.7"/>',
    duo:    '<circle cx="8.5" cy="8" r="3.2"/><path d="M2.8 20c0-3.1 2.6-5.4 5.7-5.4s5.7 2.3 5.7 5.4"/><circle cx="17" cy="9.5" r="2.6"/><path d="M14.8 15.4c.7-.3 1.4-.5 2.2-.5 2.4 0 4.2 1.8 4.2 4.1"/>',
    festa:  '<path d="M3 21 9.4 8.5 15.5 14.6 3 21Z"/><path d="M13 3.6v2M17.4 5.1l-1.4 1.4M20.4 9.5h-2M18.9 13.9l-1.4-1.4"/>'
  };

  function renderFormatos() {
    var alvo = $("#formatos-grid");
    if (!alvo) return;

    alvo.innerHTML = (S.formatos || []).map(function (f) {
      var itens = (f.itens || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("");
      var msg = "Olá! Vi seu site e gostaria de consultar disponibilidade de data para o show no formato: " + f.nome + ".";
      return '' +
        '<a href="' + waLink(msg) + '" target="_blank" rel="noopener" class="card reveal" style="text-decoration:none; color:inherit; display:flex;">' +
          '<div class="card__ico"><svg viewBox="0 0 24 24">' + (ICONES[f.icone] || ICONES.violao) + '</svg></div>' +
          "<h3>" + esc(f.nome) + "</h3>" +
          (f.resumo ? '<p class="card__resumo">' + esc(f.resumo) + "</p>" : "") +
          (f.texto ? "<p>" + esc(f.texto) + "</p>" : "") +
          (itens ? '<ul class="card__lista">' + itens + "</ul>" : "") +
        "</a>";
    }).join("");
  }

  /* ---------- Depoimentos ---------- */
  function renderDepoimentos() {
    var alvo = $("#quotes-grid");
    if (!alvo) return;

    var html = (S.depoimentos || []).map(function (d) {
      return '' +
        '<article class="quote">' +
          "<p>" + esc(d.texto) + "</p>" +
          "<footer><strong>" + esc(d.autor) + "</strong>" + esc(d.papel) + "</footer>" +
        "</article>";
    }).join("");

    alvo.innerHTML = html + html;
  }

  /* ---------- Vídeos ---------- */
  function renderVideos() {
    var alvo = $("#videos-grid");
    if (!alvo) return;

    alvo.innerHTML = (S.videos || []).map(function (v) {
      var frame;

      if (v.tipo === "youtube" && v.id) {
        frame = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.id) + '" ' +
                'title="' + esc(v.titulo) + '" loading="lazy" allowfullscreen ' +
                'allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"></iframe>';
      } else if (v.tipo === "local" && v.src) {
        frame = "<video controls preload=\"metadata\"" + (v.poster ? ' poster="' + esc(v.poster) + '"' : "") +
                '><source src="' + esc(v.src) + '#t=0.001" type="video/mp4"></video>';
      } else {
        frame = '' +
          '<div class="video__ph">' +
            '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="m10 9.5 5 2.5-5 2.5z"/></svg>' +
            "<span>Vídeo em breve</span>" +
            "<small>adicione o id do YouTube em <code>config.js</code></small>" +
          "</div>";
      }

      return '' +
        '<article class="video reveal">' +
          '<div class="video__frame">' + frame + "</div>" +
          "<h3>" + esc(v.titulo) + "</h3>" +
          "<p>" + esc(v.legenda) + "</p>" +
        "</article>";
    }).join("");

    var vids = $$("video", alvo);
    vids.forEach(function (vid) {
      vid.addEventListener("play", function () {
        vids.forEach(function (other) {
          if (other !== vid && !other.paused) {
            other.pause();
          }
        });
      });
    });

    // Auto-play ao deslizar no carrossel — só no mobile (< 760px)
    if (window.IntersectionObserver && vids.length) {
      var observer = new IntersectionObserver(function (entries) {
        if (window.innerWidth >= 760) return; // ignora no desktop
        entries.forEach(function (entry) {
          var vid = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            vids.forEach(function (other) {
              if (other !== vid) other.pause();
            });
            vid.play().catch(function () {}); // catch: autoplay policy em alguns browsers
          } else {
            vid.pause();
          }
        });
      }, { threshold: 0.7 });

      vids.forEach(function (vid) { observer.observe(vid); });
    }
  }

  /* ---------- Repertório ---------- */
  var blocos = S.repertorio || [];
  var abaAtiva = blocos.length ? blocos[0].id : null;

  // tira acento para a busca ficar tolerante ("evidencias" acha "Evidencias")
  var ACENTOS = new RegExp("[\u0300-\u036f]", "g");

  function normalizar(txt) {
    return String(txt).toLowerCase().normalize("NFD").replace(ACENTOS, "");
  }

  function destacar(texto, termo) {
    if (!termo) return esc(texto);
    var alvo = normalizar(texto);
    var i = alvo.indexOf(termo);
    if (i < 0) return esc(texto);
    return esc(texto.slice(0, i)) +
           "<mark>" + esc(texto.slice(i, i + termo.length)) + "</mark>" +
           esc(texto.slice(i + termo.length));
  }

  function itemMusica(m, termo) {
    return '' +
      '<li class="musica">' +
        '<span class="musica__titulo">' + destacar(m.titulo, termo) + "</span>" +
        '<span class="musica__linha" aria-hidden="true"></span>' +
        '<span class="musica__artista">' + destacar(m.artista, termo) + "</span>" +
      "</li>";
  }

  function renderTabs() {
    var alvo = $("#tabs");
    if (!alvo) return;

    alvo.innerHTML = blocos.map(function (b) {
      var ativa = b.id === abaAtiva;
      return '<button class="tab" type="button" role="tab" id="tab-' + esc(b.id) + '" ' +
             'aria-controls="painel-' + esc(b.id) + '" aria-selected="' + ativa + '" ' +
             'tabindex="' + (ativa ? "0" : "-1") + '" data-aba="' + esc(b.id) + '">' +
             esc(b.titulo) + "</button>";
    }).join("");
  }

  function renderPainel(termo) {
    var alvo = $("#painel-repertorio");
    var tabs = $("#tabs");
    var status = $("#busca-status");
    if (!alvo) return;

    /* ----- modo busca: varre todos os blocos ----- */
    if (termo) {
      var achados = 0;
      var html = blocos.map(function (b) {
        var hits = b.musicas.filter(function (m) {
          return normalizar(m.titulo).indexOf(termo) > -1 || normalizar(m.artista).indexOf(termo) > -1;
        });
        if (!hits.length) return "";
        achados += hits.length;
        return '<section class="bloco">' +
                 '<p class="kicker">' + esc(b.titulo) + "</p>" +
                 '<ul class="musicas">' + hits.map(function (m) { return itemMusica(m, termo); }).join("") + "</ul>" +
               "</section>";
      }).join("");

      if (tabs) tabs.classList.add("is-hidden");

      if (!achados) {
        alvo.innerHTML = '' +
          '<div class="vazio">' +
            "<strong>Não achei essa aqui na lista.</strong>" +
            "<p>Mas o repertório é bem maior que a amostra — e dá tempo de aprender pro seu show.</p>" +
            '<a class="btn btn--amber" id="pedir-inexistente" href="#">Perguntar no WhatsApp</a>' +
          "</div>";

        var btn = $("#pedir-inexistente");
        if (btn) {
          var termoOriginal = $("#busca").value.trim();
          btn.href = waLink('Olá! Vi o site e queria saber se você toca "' + termoOriginal + '".');
          btn.target = "_blank";
          btn.rel = "noopener";
        }
        if (status) status.textContent = "Nenhuma música encontrada.";
      } else {
        alvo.innerHTML = html;
        if (status) {
          status.textContent = achados === 1
            ? "1 música encontrada — essa toca sim!"
            : achados + " músicas encontradas.";
        }
      }
      return;
    }

    /* ----- modo abas ----- */
    if (tabs) tabs.classList.remove("is-hidden");
    if (status) status.textContent = "";

    alvo.innerHTML = blocos.map(function (b) {
      var ativo = b.id === abaAtiva;
      return '<section class="bloco" id="painel-' + esc(b.id) + '" role="tabpanel" ' +
               'aria-labelledby="tab-' + esc(b.id) + '"' + (ativo ? "" : " hidden") + ">" +
               '<p class="bloco__sub">' + esc(b.subtitulo) + "</p>" +
               '<ul class="musicas">' + b.musicas.map(function (m) { return itemMusica(m, ""); }).join("") + "</ul>" +
             "</section>";
    }).join("");
  }

  function ligarAbas() {
    var tabs = $("#tabs");
    if (!tabs) return;

    tabs.addEventListener("click", function (ev) {
      var botao = ev.target.closest("[data-aba]");
      if (!botao) return;
      abaAtiva = botao.getAttribute("data-aba");
      renderTabs();
      renderPainel("");
    });

    // navegação por setas (padrão ARIA de tablist)
    tabs.addEventListener("keydown", function (ev) {
      if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
      var i = blocos.findIndex(function (b) { return b.id === abaAtiva; });
      var prox = ev.key === "ArrowRight" ? (i + 1) % blocos.length : (i - 1 + blocos.length) % blocos.length;
      abaAtiva = blocos[prox].id;
      renderTabs();
      renderPainel("");
      var novo = $("#tab-" + abaAtiva);
      if (novo) novo.focus();
      ev.preventDefault();
    });
  }

  function ligarBusca() {
    var input = $("#busca");
    var limpar = $("#busca-clear");
    if (!input) return;

    var timer;
    function aplicar() {
      var termo = normalizar(input.value.trim());
      if (limpar) limpar.hidden = !input.value;
      renderPainel(termo.length >= 2 ? termo : "");
    }

    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(aplicar, 140);
    });

    if (limpar) {
      limpar.addEventListener("click", function () {
        input.value = "";
        aplicar();
        input.focus();
      });
    }
  }

  /* ---------- Pedir música na mesa ---------- */
  function ligarPedido() {
    var form = $("#form-pedido");
    if (!form) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var campo = $("#pedido-musica");
      var musica = campo.value.trim();
      if (!musica) { campo.focus(); return; }
      abrirWhats(S.mensagens.pedidoMusica + musica);
      campo.value = "";
    });
  }

  /* ---------- Formulário de orçamento ---------- */
  function ligarOrcamento() {
    var form = $("#form-orcamento");
    if (!form) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var nome = $("#f-nome");
      if (!nome.value.trim()) { nome.focus(); toast("Me diz seu nome primeiro 🙂"); return; }

      var data = $("#f-data").value;
      var dataFmt = data ? data.split("-").reverse().join("/") : "a combinar";
      var local = $("#f-local").value.trim();
      var msg = $("#f-msg").value.trim();

      var texto =
        "Olá, " + S.artista.nome + "! Vi seu site e quero consultar disponibilidade.\n\n" +
        "*Nome:* " + nome.value.trim() + "\n" +
        "*Evento:* " + $("#f-tipo").value + "\n" +
        "*Data:* " + dataFmt + "\n" +
        "*Formato:* " + $("#f-formato").value + "\n" +
        (local ? "*Local:* " + local + "\n" : "") +
        (msg ? "\n" + msg : "");

      abrirWhats(texto);
    });
  }

  /* ---------- Copiar chave Pix ---------- */
  function copiarTexto(texto, btn, mensagem) {
    function ok() {
      toast(mensagem);
      if (!btn) return;
      var rotulo = btn.textContent;
      btn.textContent = "Copiado!";
      setTimeout(function () { btn.textContent = rotulo; }, 2000);
    }

    function fallback() {
      var tmp = document.createElement("textarea");
      tmp.value = texto;
      tmp.setAttribute("readonly", "");
      tmp.style.position = "fixed";
      tmp.style.opacity = "0";
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand("copy"); ok(); }
      catch (e) { toast("Copie manualmente: " + texto); }
      document.body.removeChild(tmp);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok, fallback);
    } else {
      fallback();
    }
  }

  function ligarCopia() {
    $$("[data-copy-target]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var alvo = document.getElementById(btn.getAttribute("data-copy-target"));
        if (!alvo) return;
        copiarTexto(alvo.textContent.trim(), btn, "Chave Pix copiada ✅");
      });
    });
  }

  /* ---------- QR do Pix ----------
     1) se houver "copia e cola" no config, o QR é desenhado aqui mesmo;
     2) senão, tenta a imagem em assets/img/qr-pix.png;
     3) se ela não existir, mostra o aviso de placeholder.            */
  function ligarQr() {
    var caixa = $("#pix-qr");
    var img = $("#pix-qr-img");
    var fb = $("#pix-qr-fallback");
    if (!caixa || !img || !fb) return;

    var codigo = (S.pix.copiaECola || "").trim();

    if (codigo && window.QR) {
      try {
        img.hidden = true;
        fb.hidden = true;
        caixa.insertAdjacentHTML("afterbegin", window.QR.svg(codigo, { modulo: 8, margem: 2 }));
        mostrarCopiaECola(codigo);
        return;
      } catch (e) {
        /* cai para a imagem */
      }
    }

    if (S.pix.qr) img.src = S.pix.qr;

    img.addEventListener("error", function () {
      img.hidden = true;
      fb.hidden = false;
    });
    if (img.complete && img.naturalWidth === 0) {
      img.hidden = true;
      fb.hidden = false;
    }
  }

  function mostrarCopiaECola(codigo) {
    var area = $("#pix-acoes");
    if (!area) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--amber btn--sm";
    btn.textContent = "Copiar código Pix";
    btn.addEventListener("click", function () {
      copiarTexto(codigo, btn, "Código Pix copiado ✅");
    });
    area.appendChild(btn);
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(texto) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = texto;
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add("is-on"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("is-on");
      setTimeout(function () { el.hidden = true; }, 260);
    }, 2600);
  }

  /* ---------- Nav: fundo ao rolar + menu mobile ---------- */
  function ligarNav() {
    var nav = $("#nav");
    if (!nav) return;

    var aplicar = function () { nav.classList.toggle("is-stuck", window.scrollY > 24); };
    aplicar();
    window.addEventListener("scroll", aplicar, { passive: true });

    var botao = $("#nav-toggle");
    var menu = $("#nav-menu");
    if (!botao || !menu) return;

    function fechar() {
      nav.classList.remove("is-open");
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu");
    }

    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("is-open");
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    menu.addEventListener("click", function (ev) {
      if (ev.target.closest("a")) fechar();
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("is-open")) { fechar(); botao.focus(); }
    });

    document.addEventListener("click", function (ev) {
      if (!nav.classList.contains("is-open")) return;
      if (!ev.target.closest("#nav-menu") && !ev.target.closest("#nav-toggle")) fechar();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function ligarReveal() {
    var alvos = $$(".reveal, .section__head, .boteco__card, .form, .contato__texto");
    if (!("IntersectionObserver" in window)) {
      alvos.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    alvos.forEach(function (el) { el.classList.add("reveal"); });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Boot ---------- */
  bindTextos();
  renderFormatos();
  renderDepoimentos();
  renderVideos();
  renderTabs();
  renderPainel("");
  ligarAbas();
  ligarBusca();
  ligarPedido();
  ligarOrcamento();
  ligarCopia();
  ligarQr();
  ligarNav();
  ligarReveal();

  // exposto para a plaquinha de mesa (mesa.html)
  window.SITE_HELPERS = { waLink: waLink, esc: esc };
})();
