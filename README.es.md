[English](README.md) | Español | [Русский](README.ru.md)

# IconForge

## Propósito

IconForge es una herramienta de navegador para crear un conjunto de iconos PWA y un favicon a partir de una imagen proporcionada por la persona usuaria.

## Dirección web

<https://icon-forge.d9911.org/>

## Funciones verificadas

- Selecciona o arrastra una imagen a la página y genera iconos PNG en lienzos.
- Configura el nombre de la aplicación, el nombre corto, los colores de tema y fondo, el radio de las esquinas, el relleno, el fondo y el conjunto completo o mínimo de iconos.
- Genera el conjunto completo en 16, 32, 48, 72, 96, 128, 144, 152, 192, 256, 384 y 512 píxeles, o el conjunto mínimo en 16, 32, 180, 192 y 512 píxeles.
- **Nota sobre el conjunto mínimo:** el acceso directo del manifiesto generado hace referencia a `icons/icon-96x96.png`, que el ajuste mínimo no crea. Para un manifiesto/ZIP autosuficiente, usa el conjunto completo o añade manualmente un icono de 96×96.
- Descarga PNG individuales, un `favicon.ico`, un `manifest.json` generado o un archivo ZIP; el manifiesto también se puede copiar al portapapeles.
- Guarda los ajustes del generador en `localStorage` del navegador.
- Incluye un manifiesto web y registra `sw.js`, cuya lista de caché contiene los archivos de la aplicación y la URL de JSZip. Esto describe solamente la implementación incluida; la compatibilidad del navegador y la disponibilidad de los recursos almacenados en caché siguen determinando su comportamiento.

## Uso

1. Añade una imagen eligiendo un archivo o soltándolo en el área de carga.
2. Ajusta los iconos y el manifiesto, y selecciona **Generar iconos**.
3. Descarga los archivos necesarios por separado, descarga el archivo ZIP o copia/descarga el manifiesto generado.

## Desarrollo local y compilación

El repositorio no contiene un manifiesto de paquetes, lockfile ni configuración de compilación local. Es una aplicación estática: sirve el repositorio mediante un servidor HTTP local al probar el comportamiento del service worker. No se define ningún comando local de instalación o compilación.

## Estructura

- `index.html` es el documento de la aplicación y registra el service worker.
- `src/script/` contiene la carga de imágenes, la generación de iconos, la generación del manifiesto y la lógica compartida del navegador.
- `src/style/` contiene los estilos de la página; `src/img/` contiene los iconos incluidos.
- `src/manifest.json` define el manifiesto de la app y `sw.js` contiene la estrategia de caché.

## Tecnologías y dependencias de ejecución

La app usa HTML, CSS y JavaScript del navegador, las API Canvas, File/Blob, Clipboard, `localStorage`, Web App Manifest y Service Worker. JSZip 3.10.1 se carga desde cdnjs en tiempo de ejecución para crear ZIP. No hay configuración de dependencias de Node.js en el repositorio.

## Licencia

Los términos de distribución y licencia están en [LICENSE](LICENSE), incluidos los términos adicionales específicos del proyecto.

## Autor

El aviso de copyright del repositorio identifica a Denis Gutsuliak (`d9911.org`), 2024–2025.
