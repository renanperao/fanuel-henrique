/* =============================================================
   CONFIG — Altere APENAS este arquivo para personalizar o site.
   Nada aqui exige build, framework ou servidor.
   ============================================================= */

window.SITE = {
  artista: {
    nome: "Fanuel Henrique",
    tagline: "Sertanejo & Modão • Voz e Violão",
    cidade: "Pato Branco",
    uf: "PR",
    regiao: "Pato Branco e região"
  },

  contato: {
    // Formato internacional, só números: 55 + DDD + número
    whatsapp: "5546991213141",
    instagram: "fanuel_hlds",
    youtube: "", // ex.: "@fanuelhenrique" (deixe "" para esconder)
    email: ""
  },

  // Foto do topo. Para trocar por outra: aponte "hero" para o arquivo novo e
  // deixe "heroSrcset" e "heroWebp" como "" (o site passa a usar só uma versão).
  imagens: {
    hero: "assets/img/hero-1800.jpg",
    heroSrcset: "assets/img/hero-1000.jpg 1000w, assets/img/hero-1800.jpg 1800w",
    heroWebp: "assets/img/hero-1000.webp 1000w, assets/img/hero-1800.webp 1800w",

    // Foto de fundo da seção de formatos de show (mesma lógica do hero)
    formatos: "assets/img/formatos-1376.jpg",
    formatosSrcset: "assets/img/formatos-700.jpg 700w, assets/img/formatos-1376.jpg 1376w",
    formatosWebp: "assets/img/formatos-700.webp 700w, assets/img/formatos-1376.webp 1376w"
  },

  // Endereço final do site (usado nos QR Codes da plaquinha de mesa).
  site: {
    url: "https://fanuelhenrique.com.br"
  },

  pix: {
    chave: "contato@fanuelhenrique.com.br",
    titular: "Fanuel Henrique",

    // "Copia e cola" gerado no app do banco (BR Code, começa com 000201...).
    // Se preencher, o QR do Pix é desenhado sozinho pelo site — não precisa
    // de imagem nenhuma. Cole EXATAMENTE como o banco entregou.
    copiaECola: "",

    // Alternativa: imagem do QR salva em assets/img/qr-pix.png
    qr: "assets/img/qr-pix.png"
  },

  mensagens: {
    orcamento:
      "Olá! Vi seu site e gostaria de consultar disponibilidade de data para o meu bar/evento.",
    pedidoMusica: "Fala! Tô aqui no bar e queria pedir a música: "
  },

  // Vídeos: YouTube (id) ou arquivo local em assets/video/ (src + poster).
  videos: [
    {
      tipo: "local",
      src: "assets/video/fanuel_hlds_1787320244_3968650926434344404_8146000432.mp4",
      titulo: "Banda completa",
      legenda: ""
    },
    {
      tipo: "local",
      src: "assets/video/fanuel_hlds_1773926530_3856296901738339027_8146000432.mp4",
      titulo: "voz, violão e gaita",
      legenda: ""
    },
    {
      tipo: "local",
      src: "assets/video/fanuel_hlds_1776354707_3876664637559213195_8146000432.mp4",
      titulo: "Voz e Violão",
      legenda: ""
    }
  ],

  formatos: [
    {
      icone: "violao",
      nome: "Voz, violão e gaita",
      resumo: "",
      texto: "",
      itens: ["2:00 de show"]
    },
    {
      icone: "duo",
      nome: "Banda completa",
      resumo: "",
      texto: "",
      itens: ["2:30/3:00 de show, conforme as necessidades do contratante"]
    }
  ],

  /* Repertório — cada bloco vira uma aba. A busca varre todos os blocos. */
  repertorio: [
    {
      id: "modao",
      titulo: "Modão & Raiz",
      subtitulo: "Pra bater na mesa e chorar de saudade",
      musicas: [
        { titulo: "Evidências", artista: "Chitãozinho & Xororó" },
        { titulo: "Fio de Cabelo", artista: "Chitãozinho & Xororó" },
        { titulo: "Galopeira", artista: "Chitãozinho & Xororó" },
        { titulo: "É o Amor", artista: "Zezé Di Camargo & Luciano" },
        { titulo: "No Dia em Que Eu Saí de Casa", artista: "Zezé Di Camargo & Luciano" },
        { titulo: "Sonho Por Sonho", artista: "Zezé Di Camargo & Luciano" },
        { titulo: "Estrada da Vida", artista: "Milionário & José Rico" },
        { titulo: "Sonhei Com Você", artista: "Milionário & José Rico" },
        { titulo: "Dormi na Praça", artista: "Bruno & Marrone" },
        { titulo: "Choram as Rosas", artista: "Bruno & Marrone" },
        { titulo: "Vidro Fumê", artista: "Bruno & Marrone" },
        { titulo: "Boate Azul", artista: "Bruno & Marrone" },
        { titulo: "Telefone Mudo", artista: "Trio Parada Dura" },
        { titulo: "Chora Peito", artista: "Trio Parada Dura" },
        { titulo: "Peão Apaixonado", artista: "Rio Negro & Solimões" },
        { titulo: "Pensa em Mim", artista: "Leandro & Leonardo" },
        { titulo: "Entre Tapas e Beijos", artista: "Leandro & Leonardo" },
        { titulo: "Não Aprendi Dizer Adeus", artista: "Leandro & Leonardo" },
        { titulo: "Cabelo Loiro", artista: "João Mineiro & Marciano" },
        { titulo: "Meu Primeiro Amor", artista: "Sérgio Reis" }
      ]
    },
    {
      id: "universitario",
      titulo: "Universitário & Clássicos dos 2010",
      subtitulo: "A trilha sonora de quem tem 25+ hoje",
      musicas: [
        { titulo: "Pra Sempre Com Você", artista: "Jorge & Mateus" },
        { titulo: "Os Anjos Cantam", artista: "Jorge & Mateus" },
        { titulo: "Amo Noite e Dia", artista: "Jorge & Mateus" },
        { titulo: "Sosseguei", artista: "Jorge & Mateus" },
        { titulo: "Cuida Bem Dela", artista: "Henrique & Juliano" },
        { titulo: "Vidinha de Balada", artista: "Henrique & Juliano" },
        { titulo: "Aquela Pessoa", artista: "Henrique & Juliano" },
        { titulo: "Balada", artista: "Gusttavo Lima" },
        { titulo: "Cor de Ouro", artista: "Gusttavo Lima" },
        { titulo: "Zé da Recaída", artista: "Gusttavo Lima" },
        { titulo: "Meteoro", artista: "Luan Santana" },
        { titulo: "Te Esperando", artista: "Luan Santana" },
        { titulo: "Escreve Aí", artista: "Luan Santana" },
        { titulo: "Camaro Amarelo", artista: "Munhoz & Mariano" },
        { titulo: "Ai Se Eu Te Pego", artista: "Michel Teló" },
        { titulo: "Nosso Santo Bateu", artista: "Maiara & Maraisa" },
        { titulo: "10%", artista: "Maiara & Maraisa" },
        { titulo: "Infiel", artista: "Marília Mendonça" },
        { titulo: "Graveto", artista: "Marília Mendonça" },
        { titulo: "Sonho de Consumo", artista: "Naiara Azevedo" }
      ]
    },
    {
      id: "hits",
      titulo: "Sofrência & Hits do Momento",
      subtitulo: "O que a mesa pede assim que reconhece a intro",
      musicas: [
        { titulo: "Pipoco", artista: "Ana Castela" },
        { titulo: "Boiadeira", artista: "Ana Castela" },
        { titulo: "Nosso Quadro", artista: "Ana Castela" },
        { titulo: "Solteiro Não Trai", artista: "Lauana Prado" },
        { titulo: "Cobaia", artista: "Lauana Prado" },
        { titulo: "Escrito nas Estrelas", artista: "Lauana Prado" },
        { titulo: "Barzinho Aleatório", artista: "Zé Neto & Cristiano" },
        { titulo: "Largado às Traças", artista: "Zé Neto & Cristiano" },
        { titulo: "Notificação Preferida", artista: "Zé Neto & Cristiano" },
        { titulo: "Cuidando de Longe", artista: "Hugo & Guilherme" },
        { titulo: "Toma Jeito", artista: "Hugo & Guilherme" },
        { titulo: "Espaçosa Demais", artista: "Hugo & Guilherme" },
        { titulo: "Erro Gostoso", artista: "Simone Mendes" },
        { titulo: "Dois Fugitivos", artista: "Simone Mendes" },
        { titulo: "Batom de Cereja", artista: "Israel & Rodolffo" },
        { titulo: "Seu Brilho Sumiu", artista: "Israel & Rodolffo" },
        { titulo: "Maloqueiro Sensível", artista: "Diego & Victor Hugo" },
        { titulo: "Coração Cachorro", artista: "Ávine Vinny & Matheus Fernandes" },
        { titulo: "Baby Me Atende", artista: "Cristiano Araújo" },
        { titulo: "Pense em Mim", artista: "João Gomes" }
      ]
    }
  ],

  depoimentos: [
    {
      texto: "00 da região 🔥",
      autor: "@kaipersantony",
      papel: ""
    },
    {
      texto: "Aí sim👏👏",
      autor: "@limaclarice79",
      papel: ""
    },
    {
      texto: "Talentoso demais ❤️",
      autor: "@marialu.rossoni",
      papel: ""
    },
    {
      texto: "Arrasaramm 🔥👏",
      autor: "@stefanie_gb",
      papel: ""
    },
    {
      texto: "Aí sim hein top demais Deus abençoe 🙏",
      autor: "@ederson_santos_010",
      papel: ""
    },
    {
      texto: "Show, muito talentosos👏🏼",
      autor: "@pietragoss_",
      papel: ""
    },
    {
      texto: "👏👏👏👏",
      autor: "@paulinho.rso_jr",
      papel: ""
    },
    {
      texto: "Top",
      autor: "@_ana_paula076",
      papel: ""
    },
    {
      texto: "Brabooo 🔥🔥",
      autor: "@_neemiasaugusto",
      papel: ""
    },
    {
      texto: "Canta dms irmão 👏",
      autor: "@_alexandrefae",
      papel: ""
    },
    {
      texto: "Bom de mais esse cara🔥",
      autor: "@guimsc",
      papel: ""
    }
  ]
};
