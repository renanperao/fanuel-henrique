/* =============================================================
   CONFIG — Altere APENAS este arquivo para personalizar o site.
   Nada aqui exige build, framework ou servidor.
   ============================================================= */

window.SITE = {
  artista: {
    nome: "Fanuel Henrique",
    tagline: "Sertanejo & Modão • Voz e Violão",
    cidade: "Sua Cidade",
    uf: "SP",
    regiao: "Região metropolitana e cidades vizinhas"
  },

  contato: {
    // Formato internacional, só números: 55 + DDD + número
    whatsapp: "5599999999999",
    instagram: "fanuelhenrique",
    youtube: "", // ex.: "@fanuelhenrique" (deixe "" para esconder)
    email: "contato@fanuelhenrique.com.br"
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
      tipo: "youtube",
      id: "",
      titulo: "Modão clássico",
      legenda: "Voz e violão limpos, do jeito que o modão pede."
    },
    {
      tipo: "youtube",
      id: "",
      titulo: "O bar cantando junto",
      legenda: "Refrão em coro — a prova de que a casa embala."
    },
    {
      tipo: "youtube",
      id: "",
      titulo: "Hits do momento",
      legenda: "O que está tocando agora, na pegada acústica."
    }
  ],

  formatos: [
    {
      icone: "violao",
      nome: "Voz & Violão",
      resumo: "Solo",
      texto:
        "O formato mais pedido para happy hour, restaurante e barzinho. Som na medida: dá pra conversar na mesa e cantar junto no refrão.",
      itens: ["Até 3h de show", "Equipamento próprio", "Casas de até 80 lugares"]
    },
    {
      icone: "duo",
      nome: "Duo Sertanejo",
      resumo: "Voz + sanfona/percussão",
      texto:
        "Mais pressão sonora e mais balanço para casas movimentadas, nas noites de sexta e sábado cheias.",
      itens: ["Até 4h de show", "PA reforçado", "Repertório mais dançante"]
    },
    {
      icone: "festa",
      nome: "Eventos Privados",
      resumo: "Aniversários e festas",
      texto:
        "Churrasco, noivado, aniversário e confra de empresa. Repertório montado junto com você, incluindo a música da entrada.",
      itens: ["Formato flexível", "Repertório personalizado", "Atendimento na região"]
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
      texto:
        "Casa cheia até o último set. O pessoal ficou pedindo música até a hora de fechar a conta.",
      autor: "Marcos",
      papel: "Boteco da Esquina"
    },
    {
      texto:
        "Chegou cedo, montou tudo sozinho e ainda ajustou o repertório com o clima da noite. Já reservei o mês inteiro.",
      autor: "Juliana",
      papel: "Empório & Bar"
    },
    {
      texto:
        "Cantou a música da nossa história na entrada. Não teve um convidado que não chorou.",
      autor: "Rafa & Bia",
      papel: "Noivado"
    }
  ]
};
