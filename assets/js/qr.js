/* =============================================================
   qr.js — gerador de QR Code em JS puro (modo byte, versões 1–20).
   Sem dependências, sem chamada de rede: o QR é desenhado no
   próprio navegador. Usado na caixinha (Pix copia e cola) e na
   plaquinha de mesa (mesa.html).

   Uso:  QR.svg("texto", { ecc: "M", modulo: 6, margem: 4 }) -> string SVG
   ============================================================= */
(function (global) {
  "use strict";

  /* ---- tabela de blocos: [ecCodewordsPorBloco, b1, dc1, b2, dc2] ---- */
  var BLOCOS = {
    L: [
      null,
      [7, 1, 19], [10, 1, 34], [15, 1, 55], [20, 1, 80], [26, 1, 108],
      [18, 2, 68], [20, 2, 78], [24, 2, 97], [30, 2, 116], [18, 2, 68, 2, 69],
      [20, 4, 81], [24, 2, 92, 2, 93], [26, 4, 107], [30, 3, 115, 1, 116], [22, 5, 87, 1, 88],
      [24, 5, 98, 1, 99], [28, 1, 107, 5, 108], [30, 5, 120, 1, 121], [28, 3, 113, 4, 114], [28, 3, 107, 5, 108]
    ],
    M: [
      null,
      [10, 1, 16], [16, 1, 28], [26, 1, 44], [18, 2, 32], [24, 2, 43],
      [16, 4, 27], [18, 4, 31], [22, 2, 38, 2, 39], [22, 3, 36, 2, 37], [26, 4, 43, 1, 44],
      [30, 1, 50, 4, 51], [22, 6, 36, 2, 37], [22, 8, 37, 1, 38], [24, 4, 40, 5, 41], [24, 5, 41, 5, 42],
      [28, 7, 45, 3, 46], [28, 10, 46, 1, 47], [26, 9, 43, 4, 44], [26, 3, 44, 11, 45], [26, 3, 41, 13, 42]
    ]
  };

  var ALINHAMENTO = [
    null, [], [6, 18], [6, 22], [6, 26], [6, 30],
    [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
    [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70],
    [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90]
  ];

  var BITS_ECC = { L: 1, M: 0, Q: 3, H: 2 };

  /* ---------------- aritmética em GF(256) ---------------- */
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function mul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function polinomioGerador(grau) {
    var poly = [1];
    for (var i = 0; i < grau; i++) {
      var novo = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        novo[j] ^= poly[j];
        novo[j + 1] ^= mul(poly[j], EXP[i]);
      }
      poly = novo;
    }
    return poly;
  }

  function calcularEcc(dados, qtdEcc) {
    var gen = polinomioGerador(qtdEcc);
    var resto = new Array(qtdEcc).fill(0);

    for (var i = 0; i < dados.length; i++) {
      var fator = dados[i] ^ resto[0];
      resto.shift();
      resto.push(0);
      for (var j = 0; j < qtdEcc; j++) resto[j] ^= mul(gen[j + 1], fator);
    }
    return resto;
  }

  /* ---------------- codificação dos dados ---------------- */
  function utf8(texto) {
    var out = [];
    var esc = encodeURIComponent(texto);
    for (var i = 0; i < esc.length; i++) {
      if (esc[i] === "%") { out.push(parseInt(esc.substr(i + 1, 2), 16)); i += 2; }
      else out.push(esc.charCodeAt(i));
    }
    return out;
  }

  function capacidadeDados(versao, ecc) {
    var t = BLOCOS[ecc][versao];
    return t[1] * t[2] + (t[3] ? t[3] * t[4] : 0);
  }

  function escolherVersao(tamanhoBytes, ecc) {
    for (var v = 1; v <= 20; v++) {
      var cabecalho = 4 + (v < 10 ? 8 : 16);
      var necessario = Math.ceil((cabecalho + tamanhoBytes * 8) / 8);
      if (necessario <= capacidadeDados(v, ecc)) return v;
    }
    throw new Error("Texto grande demais para QR versão 20.");
  }

  function montarCodewords(bytes, versao, ecc) {
    var bits = [];
    function push(valor, n) {
      for (var i = n - 1; i >= 0; i--) bits.push((valor >> i) & 1);
    }

    push(0b0100, 4);                              // modo byte
    push(bytes.length, versao < 10 ? 8 : 16);     // contagem
    bytes.forEach(function (b) { push(b, 8); });

    var totalCw = capacidadeDados(versao, ecc);
    var maxBits = totalCw * 8;

    push(0, Math.min(4, maxBits - bits.length));  // terminador
    while (bits.length % 8) bits.push(0);

    var cw = [];
    for (var i = 0; i < bits.length; i += 8) {
      var byte = 0;
      for (var j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      cw.push(byte);
    }
    var pads = [0xec, 0x11], k = 0;
    while (cw.length < totalCw) cw.push(pads[k++ % 2]);

    /* --- divide em blocos, calcula ECC e intercala --- */
    var t = BLOCOS[ecc][versao];
    var qtdEcc = t[0];
    var grupos = [[t[1], t[2]]];
    if (t[3]) grupos.push([t[3], t[4]]);

    var blocosDados = [], blocosEcc = [], pos = 0;
    grupos.forEach(function (g) {
      for (var b = 0; b < g[0]; b++) {
        var pedaco = cw.slice(pos, pos + g[1]);
        pos += g[1];
        blocosDados.push(pedaco);
        blocosEcc.push(calcularEcc(pedaco, qtdEcc));
      }
    });

    var saida = [], maxD = Math.max.apply(null, blocosDados.map(function (b) { return b.length; }));
    for (var d = 0; d < maxD; d++) {
      blocosDados.forEach(function (b) { if (d < b.length) saida.push(b[d]); });
    }
    for (var e = 0; e < qtdEcc; e++) {
      blocosEcc.forEach(function (b) { saida.push(b[e]); });
    }
    return saida;
  }

  /* ---------------- matriz ---------------- */
  function novaMatriz(n) {
    var m = [];
    for (var i = 0; i < n; i++) m.push(new Array(n).fill(null));
    return m;
  }

  function colocarFuncoes(m, versao) {
    var n = m.length;

    function finder(linha, coluna) {
      for (var dy = -1; dy <= 7; dy++) {
        for (var dx = -1; dx <= 7; dx++) {
          var y = linha + dy, x = coluna + dx;
          if (y < 0 || y >= n || x < 0 || x >= n) continue;
          var borda = Math.max(Math.abs(dy - 3), Math.abs(dx - 3));
          m[y][x] = (borda !== 2 && borda <= 3) ? 1 : 0;
        }
      }
    }
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);

    for (var i = 8; i < n - 8; i++) {          // timing
      var v = i % 2 === 0 ? 1 : 0;
      m[6][i] = v; m[i][6] = v;
    }

    // alinhamento: todas as combinações, menos os 3 cantos ocupados pelos finders
    var pos = ALINHAMENTO[versao];
    var ultimo = pos.length - 1;
    pos.forEach(function (ly, i) {
      pos.forEach(function (lx, j) {
        if ((i === 0 && j === 0) || (i === 0 && j === ultimo) || (i === ultimo && j === 0)) return;
        for (var dy = -2; dy <= 2; dy++) {
          for (var dx = -2; dx <= 2; dx++) {
            var borda = Math.max(Math.abs(dy), Math.abs(dx));
            m[ly + dy][lx + dx] = (borda === 1) ? 0 : 1;
          }
        }
      });
    });

    m[n - 8][8] = 1;                           // módulo escuro

    // reserva das áreas de formato
    for (var k = 0; k <= 8; k++) {
      if (m[8][k] === null) m[8][k] = 0;
      if (m[k][8] === null) m[k][8] = 0;
    }
    for (var q = 0; q < 8; q++) {
      if (m[8][n - 1 - q] === null) m[8][n - 1 - q] = 0;
      if (m[n - 1 - q][8] === null) m[n - 1 - q][8] = 0;
    }

    if (versao >= 7) {                          // info de versão
      var bch = versao;
      for (var b = 0; b < 12; b++) bch = (bch << 1) ^ ((bch >>> 11) * 0x1f25);
      var dados = (versao << 12) | bch;
      for (var i2 = 0; i2 < 18; i2++) {
        var bit = (dados >>> i2) & 1;
        var y2 = Math.floor(i2 / 3), x2 = i2 % 3;
        m[y2][n - 11 + x2] = bit;
        m[n - 11 + x2][y2] = bit;
      }
    }
  }

  function ehFuncao(versao, n, linha, coluna) {
    if (linha === 6 || coluna === 6) return true;                       // timing
    if (linha < 9 && coluna < 9) return true;                           // finder + formato TL
    if (linha < 9 && coluna >= n - 8) return true;                      // finder TR
    if (linha >= n - 8 && coluna < 9) return true;                      // finder BL
    if (versao >= 7) {
      if (linha < 6 && coluna >= n - 11) return true;                   // versão TR
      if (coluna < 6 && linha >= n - 11) return true;                   // versão BL
    }
    var pos = ALINHAMENTO[versao];
    for (var i = 0; i < pos.length; i++) {
      for (var j = 0; j < pos.length; j++) {
        var cy = pos[i], cx = pos[j];
        if (cy <= 8 && cx <= 8) continue;
        if (cy <= 8 && cx >= n - 9) continue;
        if (cy >= n - 9 && cx <= 8) continue;
        if (Math.abs(linha - cy) <= 2 && Math.abs(coluna - cx) <= 2) return true;
      }
    }
    return false;
  }

  function colocarDados(m, versao, codewords) {
    var n = m.length, bitIdx = 0;
    var totalBits = codewords.length * 8;

    for (var direita = n - 1; direita >= 1; direita -= 2) {
      if (direita === 6) direita = 5;                 // pula coluna de timing
      for (var passo = 0; passo < n; passo++) {
        var subindo = ((direita + 1) & 2) === 0;
        var linha = subindo ? n - 1 - passo : passo;
        for (var c = 0; c < 2; c++) {
          var coluna = direita - c;
          if (ehFuncao(versao, n, linha, coluna)) continue;
          var bit = 0;
          if (bitIdx < totalBits) {
            bit = (codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1;
            bitIdx++;
          }
          m[linha][coluna] = bit;
        }
      }
    }
  }

  var MASCARAS = [
    function (l, c) { return (l + c) % 2 === 0; },
    function (l)    { return l % 2 === 0; },
    function (l, c) { return c % 3 === 0; },
    function (l, c) { return (l + c) % 3 === 0; },
    function (l, c) { return (Math.floor(l / 2) + Math.floor(c / 3)) % 2 === 0; },
    function (l, c) { return (l * c) % 2 + (l * c) % 3 === 0; },
    function (l, c) { return ((l * c) % 2 + (l * c) % 3) % 2 === 0; },
    function (l, c) { return ((l + c) % 2 + (l * c) % 3) % 2 === 0; }
  ];

  function aplicarFormato(m, ecc, mascara) {
    var n = m.length;
    var dados = (BITS_ECC[ecc] << 3) | mascara;
    var bch = dados;
    for (var i = 0; i < 10; i++) bch = (bch << 1) ^ ((bch >>> 9) * 0x537);
    var bits = ((dados << 10) | bch) ^ 0x5412;

    // cópia 1: coluna 8 (topo) + linha 8 (esquerda)
    for (var k = 0; k <= 5; k++) m[k][8] = (bits >>> k) & 1;
    m[7][8] = (bits >>> 6) & 1;
    m[8][8] = (bits >>> 7) & 1;
    m[8][7] = (bits >>> 8) & 1;
    for (var j = 9; j <= 14; j++) m[8][14 - j] = (bits >>> j) & 1;

    // cópia 2: linha 8 (direita) + coluna 8 (base)
    for (var q = 0; q <= 7; q++) m[8][n - 1 - q] = (bits >>> q) & 1;
    for (var p = 8; p <= 14; p++) m[n - 15 + p][8] = (bits >>> p) & 1;
  }

  function penalidade(m) {
    var n = m.length, total = 0, escuros = 0;

    // regra 1: sequências de 5+ iguais
    for (var i = 0; i < n; i++) {
      var runL = 1, runC = 1;
      for (var j = 1; j < n; j++) {
        runL = (m[i][j] === m[i][j - 1]) ? runL + 1 : 1;
        if (runL === 5) total += 3; else if (runL > 5) total += 1;
        runC = (m[j][i] === m[j - 1][i]) ? runC + 1 : 1;
        if (runC === 5) total += 3; else if (runC > 5) total += 1;
      }
    }

    // regra 2: blocos 2x2
    for (var y = 0; y < n - 1; y++) {
      for (var x = 0; x < n - 1; x++) {
        var v = m[y][x];
        if (v === m[y][x + 1] && v === m[y + 1][x] && v === m[y + 1][x + 1]) total += 3;
      }
    }

    // regra 3: padrão 1:1:3:1:1 com 4 claros
    var alvo1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    var alvo2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function bate(get, base) {
      for (var k = 0; k < 11; k++) if (get(base + k) !== alvo1[k]) break;
      if (k === 11) return true;
      for (k = 0; k < 11; k++) if (get(base + k) !== alvo2[k]) return false;
      return true;
    }
    for (var a = 0; a < n; a++) {
      for (var b = 0; b + 11 <= n; b++) {
        if (bate(function (idx) { return m[a][idx]; }, b)) total += 40;
        if (bate(function (idx) { return m[idx][a]; }, b)) total += 40;
      }
    }

    // regra 4: proporção de módulos escuros (mesmo arredondamento da lib `qrcode`,
    // para a máscara escolhida bater com a implementação de referência)
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (m[r][c]) escuros++;
    var pct = escuros * 100 / (n * n);
    total += Math.abs(Math.ceil(pct / 5) - 10) * 10;

    return total;
  }

  /* ---------------- API ---------------- */
  function matriz(texto, opcoes) {
    opcoes = opcoes || {};
    var ecc = BLOCOS[opcoes.ecc] ? opcoes.ecc : "M";

    var bytes = utf8(String(texto));
    var versao = escolherVersao(bytes.length, ecc);
    var codewords = montarCodewords(bytes, versao, ecc);
    var n = versao * 4 + 17;

    var base = novaMatriz(n);
    colocarFuncoes(base, versao);
    colocarDados(base, versao, codewords);

    var melhor = null, melhorNota = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var teste = base.map(function (linha) { return linha.slice(); });
      for (var y = 0; y < n; y++) {
        for (var x = 0; x < n; x++) {
          if (!ehFuncao(versao, n, y, x) && MASCARAS[mask](y, x)) teste[y][x] ^= 1;
        }
      }
      aplicarFormato(teste, ecc, mask);
      var nota = penalidade(teste);
      if (nota < melhorNota) { melhorNota = nota; melhor = teste; }
    }
    return melhor;
  }

  function svg(texto, opcoes) {
    opcoes = opcoes || {};
    var m = matriz(texto, opcoes);
    var n = m.length;
    var margem = opcoes.margem == null ? 4 : opcoes.margem;
    var modulo = opcoes.modulo || 6;
    var lado = (n + margem * 2) * modulo;
    var claro = opcoes.claro || "#ffffff";
    var escuro = opcoes.escuro || "#121212";

    var caminho = "";
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (m[y][x]) caminho += "M" + (x + margem) + " " + (y + margem) + "h1v1h-1z";
      }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (n + margem * 2) + " " + (n + margem * 2) +
           '" width="' + lado + '" height="' + lado + '" shape-rendering="crispEdges" role="img">' +
           '<rect width="100%" height="100%" fill="' + claro + '"/>' +
           '<path d="' + caminho + '" fill="' + escuro + '"/></svg>';
  }

  function dataUri(texto, opcoes) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg(texto, opcoes));
  }

  global.QR = { matriz: matriz, svg: svg, dataUri: dataUri };
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined" && module.exports) module.exports = (typeof window !== "undefined" ? window : globalThis).QR;
