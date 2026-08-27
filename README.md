English | [Español](README.es.md) | [Русский](README.ru.md)

# IconForge

## Purpose

IconForge is a browser-based tool for creating a PWA icon set and a favicon from one user-supplied image.

## Web address

<https://icon-forge.d9911.org/>

## Verified capabilities

- Select or drag an image into the page, then generate PNG icons on canvases.
- Configure the application name, short name, theme and background colors, corner radius, padding, background, and full or minimal icon set.
- Generate the full set at 16, 32, 48, 72, 96, 128, 144, 152, 192, 256, 384, and 512 pixels, or the minimal set at 16, 32, 180, 192, and 512 pixels.
- **Minimal-set note:** the generated manifest shortcut references `icons/icon-96x96.png`, which the minimal preset does not create. For a self-contained manifest/ZIP, use the full set or add a 96×96 icon manually.
- Download individual PNGs, a `favicon.ico`, a generated `manifest.json`, or a ZIP archive; the manifest can also be copied to the clipboard.
- Store generator settings in browser `localStorage`.
- Include a web manifest and register `sw.js`, whose cache list contains the application files and the JSZip URL. This describes the shipped implementation only; browser support and availability of cached resources still determine its behavior.

## Usage

1. Add an image by choosing a file or dropping one onto the upload area.
2. Adjust the icon and manifest settings, then select **Generate icons**.
3. Download the needed files individually, download the ZIP archive, or copy/download the generated manifest.

## Local development and build

The repository has no tracked package manifest, lockfile, or project-local build configuration. It is a static application: serve the repository through a local HTTP server when testing service-worker behavior. No project-local installation or build command is defined.

## Structure

- `index.html` is the application document and registers the service worker.
- `src/script/` contains image loading, icon generation, manifest generation, and shared browser logic.
- `src/style/` contains the page styles; `src/img/` contains the shipped icons.
- `src/manifest.json` defines the app manifest, and `sw.js` contains the cache strategy.

## Technologies and runtime dependencies

The app uses browser HTML, CSS, JavaScript, Canvas, File/Blob, Clipboard, `localStorage`, Web App Manifest, and Service Worker APIs. JSZip 3.10.1 is loaded from cdnjs at runtime for ZIP creation. No Node.js dependency configuration is tracked.

## License

Distribution and license terms are in [LICENSE](LICENSE), including the repository's additional project-specific terms.

## Author

The repository copyright notice identifies Denis Gutsuliak (`d9911.org`), 2024–2025.
