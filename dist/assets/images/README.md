# Imagenes del portafolio

Coloca aqui tus fotos finales.

Formatos recomendados:

- `.webp` para la web, porque pesa menos y carga rapido.
- `.jpg` si exportas desde Lightroom, Photoshop o Capture One y quieres algo simple.
- Evita `.png` para fotos, salvo que tenga transparencia.

Tamanos recomendados:

- Foto principal tuya: 1200 px de ancho como minimo, vertical o 4:5.
- Fotos de portafolio: entre 1600 y 2200 px de ancho.
- Peso ideal por imagen: menos de 600 KB si puedes.

Como usarlas:

1. Pon una foto aqui, por ejemplo `retrato-fernando.webp`.
2. En `index.html`, cambia la foto principal por:

```html
src="dist/assets/images/retrato-fernando.webp"
```

3. En `dist/portfolio.js`, cambia las fotos de los proyectos por rutas como:

```js
image: "dist/assets/images/gastronomia-01.webp"
```

Usa nombres simples, sin tildes ni espacios, por ejemplo:

- `gastronomia-01.webp`
- `producto-cafe.webp`
- `retrato-corporativo.webp`
- `inmobiliaria-apartamento.webp`
