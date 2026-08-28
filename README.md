# Fanuel Henrique — site de shows (sertanejo & modão)

Landing page **one-page, mobile-first**, feita em HTML + CSS + JavaScript puro.
Sem build, sem framework, sem dependência externa em runtime: é só abrir o
`index.html` ou jogar a pasta em qualquer hospedagem estática.

```
index.html            página principal
mesa.html             plaquinha de mesa para imprimir (QR de pedir música + caixinha)
assets/css/styles.css  visual (paleta "boteco acústico")
assets/js/config.js    ← TUDO que você precisa editar no dia a dia
assets/js/app.js       renderização, busca, formulários
assets/js/qr.js        gerador de QR Code próprio (não usa serviço de terceiros)
assets/img/            fotos (originais + versões leves), favicon, og
vercel.json           cache e cabeçalhos na Vercel (não é build)
robots.txt            libera a indexação
```

---

## 1. Rodando na sua máquina

Abrir o `index.html` com dois cliques já funciona. Para ficar igual à
hospedagem (caminhos absolutos, cache), sirva a pasta:

```bash
npx serve .          # ou: python -m http.server 5173
```

## 2. O que editar antes de publicar

Tudo em **`assets/js/config.js`**. Os campos abaixo são os obrigatórios:

| Campo | O que é | Estado atual |
|---|---|---|
| `artista.nome` / `tagline` | Nome e assinatura no topo e no rodapé | preenchido |
| `artista.cidade` / `uf` / `regiao` | Onde atende | **placeholder** |
| `contato.whatsapp` | `55` + DDD + número, só dígitos | **placeholder (5599999999999)** |
| `contato.instagram` / `email` | Redes e e-mail | **placeholder** |
| `contato.youtube` | Canal (opcional) — some do site se ficar vazio | vazio |
| `site.url` | Endereço final (vira QR na plaquinha) | **placeholder** |
| `pix.chave` / `titular` | Caixinha virtual | **placeholder** |
| `pix.copiaECola` | BR Code do banco → gera o QR sozinho | vazio |
| `videos[].id` | ID do vídeo no YouTube | vazio (mostra "vídeo em breve") |
| `imagens.hero` | Foto de fundo do topo | **foto real, já otimizada** |

> Enquanto o WhatsApp for o número de exemplo, a `mesa.html` mostra um aviso
> vermelho antes de imprimir — de propósito, pra ninguém sair distribuindo
> plaquinha com QR errado.

### Foto do topo

Já está no ar a foto ao vivo (`assets/img/original-ao-vivo.jpeg`). Como o original
tem 456 KB e 2025px, o site carrega versões reduzidas geradas a partir dele:

| arquivo | uso | peso |
|---|---|---|
| `hero-1000.webp` | celular | 35 KB |
| `hero-1800.webp` | desktop | 76 KB |
| `hero-1000.jpg` / `hero-1800.jpg` | navegador sem WebP | 57 / 140 KB |

O navegador escolhe sozinho, via `<picture>` + `srcset`. O enquadramento muda
por tela: no desktop a foto aparece quase inteira, com ele à direita e o texto
sobre a galera. No celular o corte vira uma faixa estreita, então o texto fica
numa coluna de 62% à esquerda (`.eyebrow`, `.hero__title`, `.hero__lead`) e o
rosto dele aparece ao lado; botões e números seguem na largura toda.

Para trocar a foto depois: aponte `imagens.hero` para o arquivo novo e deixe
`heroSrcset` e `heroWebp` como `""`. Se o rosto ficar em outra posição, ajuste o
`object-position` de `.hero__bg img` no CSS.

A foto é em P&B e leva um sépia leve via CSS, para casar com o âmbar do resto do
site; o degradê escuro por cima garante a legibilidade do texto.

### Foto dos formatos de show

A foto de estúdio (`assets/img/original-estudio.jpeg`) cobre a
seção inteira, como o hero, com os três cards por cima, lado a lado. Versões
leves: `formatos-700.webp` (10 KB) e `formatos-1376.webp` (29 KB), com `.jpg` de
fallback (20 e 60 KB).

No desktop ela preenche toda a altura da seção. No celular, onde a seção fica
bem mais alta, a foto esticada viraria um borrão — então ocupa só uma faixa no
topo (`min(66svh,560px)`) e dissolve no fundo escuro.

Configurável em `imagens.formatos` / `formatosSrcset` / `formatosWebp`, igual ao
hero. Enquadramento pelo `object-position` de `.secao__bg img`; o mesmo par
`.section--foto` + `.secao__bg` serve para dar foto de fundo a qualquer outra
seção.

### Preview no WhatsApp e no Instagram

Já gerada em `assets/img/og.jpg` (1200×630, 49 KB): um recorte da foto ao vivo
com o mesmo tom quente do site. É ela que aparece quando alguém cola o link numa
conversa. Depois do deploy, troque o `og:image` do `index.html` pela URL
absoluta.

### Vídeos

Em `config.js`, o formato mais simples é o YouTube:

```js
{ tipo: "youtube", id: "dQw4w9WgXcQ", titulo: "...", legenda: "..." }
```

O `id` é o trecho depois de `watch?v=`. Para vídeo próprio (mp4 na pasta
`assets/video/`):

```js
{ tipo: "local", src: "assets/video/modao.mp4", poster: "assets/img/modao.jpg", titulo: "...", legenda: "..." }
```

Prioridade sugerida pelo briefing: **1 modão limpo** (voz e violão) e
**1 do bar cantando junto no refrão** — é esse segundo que vende show pra dono
de bar.

### Repertório

Cada bloco de `repertorio` vira uma aba, e a busca varre todos os blocos de uma
vez (ignora acento: "evidencias" acha "Evidências"). Quando não encontra,
oferece um botão que pergunta a música pelo WhatsApp. Para acrescentar uma aba,
basta copiar um bloco e trocar `id`, `titulo`, `subtitulo` e `musicas`.

### Caixinha / Pix

Duas formas, nesta ordem de preferência:

1. **`pix.copiaECola`** — no app do banco, gere o "Pix copia e cola" (BR Code) e
   cole aqui *exatamente* como veio. O site desenha o QR sozinho, e ainda
   aparece o botão "Copiar código Pix". Nada é enviado pra fora — o QR é
   desenhado no navegador de quem acessa.
2. **`assets/img/qr-pix.png`** — se preferir usar a imagem que o banco gerou,
   salve com esse nome. Sem nenhuma das duas, aparece um aviso de placeholder
   no lugar do QR.

## 3. Plaquinha de mesa (`mesa.html`)

Abra `mesa.html` e clique em **Imprimir**: sai uma folha A4 com 4 plaquinhas,
cada uma com o QR de **pedir música** (abre o WhatsApp com a mensagem já
escrita) e o QR da **caixinha** (só aparece se o `copiaECola` estiver
preenchido). Recorte e deixe nas mesas.

## 4. Publicando na Vercel

O repositório já está pronto: **não existe build**. Na Vercel, importe
`github.com/renanperao/fanuel-henrique` e aceite os padrões:

| Campo | Valor |
|---|---|
| Framework Preset | **Other** |
| Build Command | *(vazio)* |
| Output Directory | *(vazio — a raiz do repo)* |
| Install Command | *(vazio)* |

Não adicione `package.json`: sem ele a Vercel trata o projeto como estático e
serve os arquivos direto.

O `vercel.json` já vai versionado e cuida de:

- **`cleanUrls`** — a plaquinha fica em `/mesa`, sem o `.html`.
- **Cache**: imagens por 7 dias, CSS e JS por 1 hora (ambos com
  `stale-while-revalidate`); o HTML fica sem cache, como já é o padrão da
  Vercel. Como os arquivos não têm hash no nome, não dá pra usar cache eterno:
  uma mudança no `config.js` (número de WhatsApp, por exemplo) pode levar até
  1 hora para chegar em quem já visitou, e uma foto trocada mantendo o mesmo
  nome, até 7 dias. Se precisar que apareça na hora, salve com outro nome de
  arquivo e aponte o `config.js` para ele.
- **Cabeçalhos de segurança**: `X-Content-Type-Options`, `Referrer-Policy` e
  `Permissions-Policy`.

### Depois do primeiro deploy (2 ajustes)

1. **`site.url`** no `config.js` → endereço real. É ele que vira QR na
   plaquinha de mesa; enquanto estiver errado, o QR aponta pro lugar errado.
2. **`og:image`** no `index.html` → troque `assets/img/og.jpg` pela URL
   absoluta (`https://seu-dominio/assets/img/og.jpg`). Tem um comentário no
   arquivo marcando a linha. Vários leitores de link só aceitam caminho
   completo, e é essa imagem que aparece quando alguém cola o link no WhatsApp.

Depois é só commitar e dar push: a Vercel publica sozinha a cada push na `main`.

### Outras hospedagens

Serve em qualquer host estático — Cloudflare Pages, Netlify, GitHub Pages — é
só apontar para a raiz do repositório. Só o `vercel.json` é específico da
Vercel; nas outras, configure cache e cabeçalhos pelo painel delas.

## 5. O que já está pronto (e testado)

- Botão flutuante de WhatsApp com mensagem pré-preenchida, em todas as telas.
- Formulário de orçamento que **não usa servidor**: monta a mensagem (nome,
  evento, data em formato BR, formato do show, local) e abre o WhatsApp.
- "Pedir música na mesa" com mensagem pronta.
- Busca no repertório tolerante a acento, com destaque do trecho encontrado.
- Abas acessíveis (setas do teclado, `aria-selected`), menu mobile com Esc.
- Vídeos em carrossel no celular e em grade no desktop.
- `prefers-reduced-motion` respeitado; sem rolagem horizontal em 390px.

O gerador de QR (`assets/js/qr.js`) foi validado módulo a módulo contra a
biblioteca `qrcode` do npm: 624 comparações, versões 1 a 20, níveis de correção
L e M, todas idênticas.
