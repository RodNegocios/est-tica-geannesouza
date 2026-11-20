import {readFile, rename, writeFile} from 'node:fs/promises';

// A Hostinger serve a raiz do checkout. O ZIP continua servindo a raiz de dist/.
const built = new URL('../dist/', import.meta.url);
const compiled = await readFile(new URL('site.html', built), 'utf8');
await rename(new URL('site.html', built), new URL('index.html', built));
const checkoutEntry = compiled
  .replace('<html lang="pt-BR">', '<html lang="pt-BR" data-media-root="./dist/media/">')
  .replaceAll('./assets/', './dist/assets/')
  .replaceAll('./marca.svg', './dist/marca.svg')
  .replaceAll('./media/fachada', './dist/media/fachada');
await writeFile(new URL('../index.html', import.meta.url), checkoutEntry);
