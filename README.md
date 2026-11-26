# E4CC Practice (PWA)

Sube **todo el contenido de esta carpeta** a la raíz de un hosting estático con HTTPS (Netlify Drop, Cloudflare Pages, GitHub Pages…). Sin HTTPS el Service Worker no se activa; en local usa `localhost`.

## Instalar
- **Android (Chrome):** menú ⋮ → «Instalar aplicación».
- **iPhone/iPad (Safari):** Compartir → «Añadir a pantalla de inicio».
- **Computadora (Chrome/Edge):** ícono de instalar en la barra de direcciones.

## Estructura
`index.html` · `css/styles.css` · `js/` (core, icons, lookup, modes, voice, views, app) · `data/` (basic0, habits, dictionary, manifest) · `icons/` · `manifest.webmanifest` · `sw.js`

## Añadir lecciones
Crea `data/basic1.js` con `E4CC.addLesson({...})`, regístralo en `data/manifest.js` y añade la ruta a `ASSETS` en `sw.js`.

## Caché y actualizaciones
`sw.js` usa «stale-while-revalidate»: abre al instante desde caché y se actualiza en segundo plano (los cambios se ven en la siguiente apertura). Si cambias la lista de archivos, sube `VERSION` en `sw.js`. La voz en línea (ElevenLabs / Google / proxy) nunca se cachea y requiere conexión; sin ella se usa la voz del navegador.

## Nota
El progreso se guarda en el navegador: la app instalada en iPhone empieza con su propio almacenamiento, separado de Safari.
