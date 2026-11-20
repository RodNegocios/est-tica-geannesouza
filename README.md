# Geanne Souza Centro Especializado

Site em português do centro de estética de Vilhena, com abertura em camadas, quatro histórias de clientes, mural de fotografias e agendamento pelo WhatsApp. O portfólio integra os componentes ScrollStack e DriftWall fornecidos no briefing.

## Gerar a versão para publicação

O build utiliza Node.js 22.12 ou superior, Python 3 com Pillow e FFmpeg disponível no PATH. No diretório do repositório, execute:

```sh
python3 -m pip install Pillow
npm ci
npm run build
```

O comando prepara as imagens WebP, extrai as capas dos três vídeos e gera os arquivos estáticos em `dist/`. A preparação lê as fotos e os vídeos das pastas originais do repositório.

## Publicar na Hostinger

Envie **o conteúdo** de `dist/` para a pasta pública do domínio, normalmente `public_html/`. Deixe `index.html` diretamente nessa pasta, junto a `assets/`, `media/` e `marca.svg`. O servidor entrega arquivos estáticos, e as fontes e mídias são locais.

## Editar

Os relatos são lidos dos arquivos de texto de cada cliente durante o build. A seleção de trechos fica em `scripts/preparar_midias.py`. A galeria e os destinos de contato ficam em `src/content.js`. A composição da página está em `src/main.jsx` e a apresentação responsiva em `src/site.css`.
