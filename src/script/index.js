// Main JavaScript file for PWA Icon Generator
// Contains PNG2ICOjs library and initialization

// PNG2ICOjs library for creating ICO files
const MaxSize = 256;
const MaxFiles = 65536;
const FileHeaderSize = 6;
const ImageHeaderSize = 16;
const IcoMime = 'image/x-icon';

class PngIcoConverter {
  async convertToBlobAsync(inputs, mime = IcoMime) {
    const arr = await this.convertAsync(inputs);
    return new Blob([arr], { type: mime });
  }

  async convertAsync(inputs) {
    const inLen = inputs.length;
    if (inLen > MaxFiles) {
      throw new Error('TOO_MANY_FILES');
    }

    const headersLen = FileHeaderSize + ImageHeaderSize * inLen;
    const totalLen = headersLen + this.sumInputLen(inputs);
    const arr = new Uint8Array(totalLen);

    arr.set([0, 0, 1, 0, ...this.to2Bytes(inLen)], 0);

    let imgPos = headersLen;
    for (let i = 0; i < inputs.length; i++) {
      const currPos = FileHeaderSize + ImageHeaderSize * i;
      const input = inputs[i];
      const blob = this.toBlob(input.png);
      const img = await this.loadImageAsync(blob);
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (!input.ignoreSize && (w > MaxSize || h > MaxSize)) {
        throw new Error('INVALID_SIZE');
      }

      arr.set(
        [
          w > MaxSize ? 0 : w,
          h > MaxSize ? 0 : h,
          0,
          0,
          0,
          0,
          ...(input.bpp ? this.to2Bytes(input.bpp) : [0, 0]),
          ...this.to4Bytes(blob.size),
          ...this.to4Bytes(imgPos),
        ],
        currPos,
      );

      const buffer = input.png instanceof ArrayBuffer ? input.png : await input.png.arrayBuffer();
      arr.set(new Uint8Array(buffer), imgPos);
      imgPos += blob.size;
    }
    return arr;
  }

  loadImageAsync(png) {
    return new Promise((r, rej) => {
      const img = new Image();
      img.onload = () => r(img);
      img.onerror = () => rej('INVALID_IMAGE');
      img.src = URL.createObjectURL(png);
    });
  }

  toBlob(input, type = 'image/png') {
    return input instanceof Blob ? input : new Blob([input], { type });
  }

  to2Bytes(n) {
    return [n & 255, (n >> 8) & 255];
  }

  to4Bytes(n) {
    return [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255];
  }

  sumInputLen(inputs) {
    let total = 0;
    for (const i of inputs) {
      const png = i.png;
      if (png instanceof Blob) {
        total += png.size;
      } else {
        total += png.byteLength;
      }
    }
    return total;
  }
}

// Make PngIcoConverter available globally
window.PngIcoConverter = PngIcoConverter;

const iconForgeTranslations = {
  ru: {
    pageTitle: 'IconForge — генератор иконок PWA', description: 'Создавайте favicon и наборы PWA-иконок разных размеров из одного изображения прямо в браузере.',
    skip: 'Перейти к генератору иконок', displaySettings: 'Настройки отображения', language: 'Язык', heading: '🎨 PWA Icon Generator', subtitle: 'Создайте полный набор иконок для вашего PWA приложения из одного изображения',
    uploadHint: 'Перетащите изображение сюда или нажмите для выбора файла', selectFile: 'Выбрать файл', originalImageHeading: '📷 Исходное изображение', originalImageAlt: 'Исходное изображение', imagePlaceholder: 'Изображение будет отображено здесь',
    appName: 'Название приложения:', appNamePlaceholder: 'Название приложения', shortName: 'Короткое название:', shortNamePlaceholder: 'Короткое название', themeColor: 'Цвет темы:', backgroundColor: 'Цвет фона:', cornerRadius: 'Скругление углов (%):', padding: 'Отступы (%):',
    addBackground: 'Добавить фон к иконкам', minimalSet: 'Минимальный набор размеров', reset: '🔄 Сбросить настройки', saved: '💾 Настройки сохранены', generate: '🚀 Сгенерировать иконки', progress: 'Создание иконок', downloads: '📦 Скачать результаты', downloadAll: '📁 Скачать все иконки (ZIP)', downloadManifest: '📄 Скачать manifest.json', downloadFavicon: '🌐 Скачать favicon.ico', copyManifest: '📋 Копировать manifest.json', footer: 'Создание PWA-иконок выполняется локально в браузере.',
    theme: 'Тема', themeAction: 'Нажмите, чтобы изменить', lightThemeName: 'Светлая', darkThemeName: 'Тёмная', systemThemeName: 'Авто', lightTheme: 'Переключить на светлую тему', darkTheme: 'Переключить на тёмную тему', 'Размер:': 'Размер:', 'Файл:': 'Файл:', 'Размер файла:': 'Размер файла:', '📥 Скачать': '📥 Скачать',
    'Настройки сброшены к значениям по умолчанию!': 'Настройки сброшены к значениям по умолчанию!', 'Пожалуйста, выберите файл изображения': 'Пожалуйста, выберите файл изображения', 'Файл слишком большой. Максимальный размер: 10MB': 'Файл слишком большой. Максимальный размер: 10 MB', 'Загрузка изображения...': 'Загрузка изображения…', 'Изображение загружено успешно!': 'Изображение загружено успешно!', 'Ошибка при загрузке изображения': 'Ошибка при загрузке изображения', 'Подготовка ZIP архива...': 'Подготовка ZIP-архива…', 'ZIP архив скачан!': 'ZIP-архив скачан!', 'Ошибка при создании архива': 'Ошибка при создании архива', 'Скачивание файлов по отдельности...': 'Скачивание файлов по отдельности…', 'Все файлы скачаны!': 'Все файлы скачаны!', 'manifest.json скачан!': 'manifest.json скачан!', 'favicon.ico скачан!': 'favicon.ico скачан!', 'Ошибка при создании favicon.ico': 'Ошибка при создании favicon.ico', 'manifest.json скопирован в буфер обмена!': 'manifest.json скопирован в буфер обмена!', 'Ошибка при копировании в буфер обмена': 'Ошибка при копировании в буфер обмена', 'Сначала загрузите изображение': 'Сначала загрузите изображение', 'Генерация иконок...': 'Генерация иконок…', 'Все иконки сгенерированы!': 'Все иконки сгенерированы!'
  },
  en: {
    pageTitle: 'IconForge — PWA icon generator', description: 'Create favicons and complete PWA icon sets from one image directly in your browser.',
    skip: 'Skip to icon generator', displaySettings: 'Display settings', language: 'Language', heading: '🎨 PWA Icon Generator', subtitle: 'Create a complete PWA icon set from a single image',
    uploadHint: 'Drop an image here or click to choose a file', selectFile: 'Choose file', originalImageHeading: '📷 Source image', originalImageAlt: 'Source image', imagePlaceholder: 'The image preview will appear here',
    appName: 'Application name:', appNamePlaceholder: 'Application name', shortName: 'Short name:', shortNamePlaceholder: 'Short name', themeColor: 'Theme color:', backgroundColor: 'Background color:', cornerRadius: 'Corner radius (%):', padding: 'Padding (%):',
    addBackground: 'Add a background to icons', minimalSet: 'Use the minimal size set', reset: '🔄 Reset settings', saved: '💾 Settings saved', generate: '🚀 Generate icons', progress: 'Generating icons', downloads: '📦 Download results', downloadAll: '📁 Download all icons (ZIP)', downloadManifest: '📄 Download manifest.json', downloadFavicon: '🌐 Download favicon.ico', copyManifest: '📋 Copy manifest.json', footer: 'PWA icons are generated locally in your browser.',
    theme: 'Theme', themeAction: 'Press to change', lightThemeName: 'Light', darkThemeName: 'Dark', systemThemeName: 'Auto', lightTheme: 'Switch to light theme', darkTheme: 'Switch to dark theme', 'Размер:': 'Dimensions:', 'Файл:': 'File:', 'Размер файла:': 'File size:', '📥 Скачать': '📥 Download',
    'Настройки сброшены к значениям по умолчанию!': 'Settings were reset to defaults!', 'Пожалуйста, выберите файл изображения': 'Please select an image file', 'Файл слишком большой. Максимальный размер: 10MB': 'The file is too large. Maximum size: 10 MB', 'Загрузка изображения...': 'Loading image…', 'Изображение загружено успешно!': 'Image loaded successfully!', 'Ошибка при загрузке изображения': 'Unable to load the image', 'Подготовка ZIP архива...': 'Preparing ZIP archive…', 'ZIP архив скачан!': 'ZIP archive downloaded!', 'Ошибка при создании архива': 'Unable to create the archive', 'Скачивание файлов по отдельности...': 'Downloading files separately…', 'Все файлы скачаны!': 'All files downloaded!', 'manifest.json скачан!': 'manifest.json downloaded!', 'favicon.ico скачан!': 'favicon.ico downloaded!', 'Ошибка при создании favicon.ico': 'Unable to create favicon.ico', 'manifest.json скопирован в буфер обмена!': 'manifest.json copied to the clipboard!', 'Ошибка при копировании в буфер обмена': 'Unable to copy to the clipboard', 'Сначала загрузите изображение': 'Upload an image first', 'Генерация иконок...': 'Generating icons…', 'Все иконки сгенерированы!': 'All icons generated!'
  },
  es: {
    pageTitle: 'IconForge — generador de iconos PWA', description: 'Crea favicons y conjuntos completos de iconos PWA desde una imagen directamente en el navegador.',
    skip: 'Ir al generador de iconos', displaySettings: 'Ajustes de visualización', language: 'Idioma', heading: '🎨 Generador de iconos PWA', subtitle: 'Crea un conjunto completo de iconos PWA a partir de una sola imagen',
    uploadHint: 'Suelta una imagen aquí o haz clic para elegir un archivo', selectFile: 'Elegir archivo', originalImageHeading: '📷 Imagen original', originalImageAlt: 'Imagen original', imagePlaceholder: 'La vista previa aparecerá aquí',
    appName: 'Nombre de la aplicación:', appNamePlaceholder: 'Nombre de la aplicación', shortName: 'Nombre corto:', shortNamePlaceholder: 'Nombre corto', themeColor: 'Color del tema:', backgroundColor: 'Color de fondo:', cornerRadius: 'Radio de esquina (%):', padding: 'Espaciado (%):',
    addBackground: 'Añadir fondo a los iconos', minimalSet: 'Usar el conjunto mínimo de tamaños', reset: '🔄 Restablecer ajustes', saved: '💾 Ajustes guardados', generate: '🚀 Generar iconos', progress: 'Generando iconos', downloads: '📦 Descargar resultados', downloadAll: '📁 Descargar todos los iconos (ZIP)', downloadManifest: '📄 Descargar manifest.json', downloadFavicon: '🌐 Descargar favicon.ico', copyManifest: '📋 Copiar manifest.json', footer: 'Los iconos PWA se generan localmente en el navegador.',
    theme: 'Tema', themeAction: 'Pulsa para cambiar', lightThemeName: 'Claro', darkThemeName: 'Oscuro', systemThemeName: 'Auto', lightTheme: 'Cambiar al tema claro', darkTheme: 'Cambiar al tema oscuro', 'Размер:': 'Dimensiones:', 'Файл:': 'Archivo:', 'Размер файла:': 'Tamaño:', '📥 Скачать': '📥 Descargar',
    'Настройки сброшены к значениям по умолчанию!': 'Los ajustes se restablecieron', 'Пожалуйста, выберите файл изображения': 'Selecciona un archivo de imagen', 'Файл слишком большой. Максимальный размер: 10MB': 'El archivo es demasiado grande. Máximo: 10 MB', 'Загрузка изображения...': 'Cargando imagen…', 'Изображение загружено успешно!': 'Imagen cargada correctamente', 'Ошибка при загрузке изображения': 'No se pudo cargar la imagen', 'Подготовка ZIP архива...': 'Preparando archivo ZIP…', 'ZIP архив скачан!': 'Archivo ZIP descargado', 'Ошибка при создании архива': 'No se pudo crear el archivo', 'Скачивание файлов по отдельности...': 'Descargando archivos por separado…', 'Все файлы скачаны!': 'Todos los archivos se descargaron', 'manifest.json скачан!': 'manifest.json descargado', 'favicon.ico скачан!': 'favicon.ico descargado', 'Ошибка при создании favicon.ico': 'No se pudo crear favicon.ico', 'manifest.json скопирован в буфер обмена!': 'manifest.json copiado al portapapeles', 'Ошибка при копировании в буфер обмена': 'No se pudo copiar al portapapeles', 'Сначала загрузите изображение': 'Primero carga una imagen', 'Генерация иконок...': 'Generando iconos…', 'Все иконки сгенерированы!': 'Todos los iconos fueron generados'
  }
};

let iconForgeLanguage = 'ru';
const iconForgeTranslate = key => iconForgeTranslations[iconForgeLanguage]?.[key] ?? key;

const applyIconForgeLanguage = language => {
  iconForgeLanguage = iconForgeTranslations[language] ? language : 'en';
  localStorage.setItem('iconForgeLanguage', iconForgeLanguage);
  document.documentElement.lang = iconForgeLanguage;
  document.title = iconForgeTranslate('pageTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', iconForgeTranslate('description'));
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = iconForgeTranslate(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = iconForgeTranslate(element.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', iconForgeTranslate(element.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => { element.alt = iconForgeTranslate(element.dataset.i18nAlt); });
  document.dispatchEvent(new CustomEvent('iconforge:languagechange'));
};

window.iconForgeI18n = { t: iconForgeTranslate, apply: applyIconForgeLanguage, get language() { return iconForgeLanguage; } };

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'iconForgeTheme';
  const supportedThemes = ['light', 'dark', 'system'];
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
  const themeLabel = themeToggle?.querySelector('.theme-toggle__label');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const languageSelect = document.getElementById('languageSelect');
  const languageButton = document.getElementById('language-menu-button');
  const languagePanel = document.getElementById('language-menu-list');
  const languageOptions = [...document.querySelectorAll('.language-menu__option')];
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const languageDetails = {
    ru: { flag: 'RU', label: 'Русский' },
    en: { flag: 'EN', label: 'English' },
    es: { flag: 'ES', label: 'Español' },
  };

  let selectedTheme = supportedThemes.includes(localStorage.getItem(storageKey))
    ? localStorage.getItem(storageKey)
    : 'dark';

  const applyTheme = theme => {
    selectedTheme = supportedThemes.includes(theme) ? theme : 'dark';
    const effectiveTheme = selectedTheme === 'system'
      ? (colorScheme.matches ? 'dark' : 'light')
      : selectedTheme;
    const themeNames = {
      light: iconForgeTranslate('lightThemeName'),
      dark: iconForgeTranslate('darkThemeName'),
      system: iconForgeTranslate('systemThemeName'),
    };
    const themeIcons = { light: '☀', dark: '☾', system: '◐' };

    root.dataset.theme = effectiveTheme;
    themeColor?.setAttribute('content', effectiveTheme === 'dark' ? '#121212' : '#fbfbfb');

    if (themeToggle) {
      const label = themeNames[selectedTheme];
      themeToggle.dataset.themeValue = selectedTheme;
      themeToggle.setAttribute('aria-label', `${iconForgeTranslate('theme')}: ${label}. ${iconForgeTranslate('themeAction')}`);
      themeToggle.title = `${iconForgeTranslate('theme')}: ${label}`;
      if (themeIcon) themeIcon.textContent = themeIcons[selectedTheme];
      if (themeLabel) themeLabel.textContent = label;
    }
  };

  const updateLanguageMenu = () => {
    const details = languageDetails[iconForgeLanguage] ?? languageDetails.en;
    const flag = languageButton?.querySelector('.language-menu__flag');
    const label = languageButton?.querySelector('.language-menu__label');

    if (flag) flag.textContent = details.flag;
    if (label) label.textContent = details.label;
    if (languageButton) languageButton.setAttribute('aria-label', `${iconForgeTranslate('language')}: ${details.label}`);
    if (languageSelect) languageSelect.value = iconForgeLanguage;
    languageOptions.forEach(option => {
      option.setAttribute('aria-checked', String(option.dataset.language === iconForgeLanguage));
    });
  };

  const closeLanguageMenu = ({ restoreFocus = false } = {}) => {
    if (!languagePanel || !languageButton) return;
    languagePanel.hidden = true;
    languageButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) languageButton.focus();
  };

  const openLanguageMenu = focusTarget => {
    if (!languagePanel || !languageButton) return;
    languagePanel.hidden = false;
    languageButton.setAttribute('aria-expanded', 'true');
    const selectedIndex = Math.max(0, languageOptions.findIndex(option => option.dataset.language === iconForgeLanguage));
    const targetIndex = focusTarget === 'last' ? languageOptions.length - 1 : selectedIndex;
    languageOptions[targetIndex]?.focus();
  };

  const selectLanguage = language => {
    if (!iconForgeTranslations[language]) return;
    applyIconForgeLanguage(language);
    if (languageSelect) {
      languageSelect.value = language;
      languageSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  languageButton?.addEventListener('click', () => {
    if (languagePanel?.hidden) openLanguageMenu();
    else closeLanguageMenu();
  });

  languageButton?.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    openLanguageMenu(event.key === 'ArrowUp' ? 'last' : 'selected');
  });

  languageOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
      selectLanguage(option.dataset.language);
      closeLanguageMenu({ restoreFocus: true });
    });

    option.addEventListener('keydown', event => {
      const keyTargets = {
        ArrowDown: (index + 1) % languageOptions.length,
        ArrowUp: (index - 1 + languageOptions.length) % languageOptions.length,
        Home: 0,
        End: languageOptions.length - 1,
      };
      if (Object.hasOwn(keyTargets, event.key)) {
        event.preventDefault();
        languageOptions[keyTargets[event.key]]?.focus();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeLanguageMenu({ restoreFocus: true });
      }
    });
  });

  document.addEventListener('pointerdown', event => {
    if (!languagePanel?.hidden && !event.target.closest('.language-menu')) closeLanguageMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !languagePanel?.hidden) closeLanguageMenu({ restoreFocus: true });
  });

  document.addEventListener('iconforge:languagechange', () => {
    updateLanguageMenu();
    applyTheme(selectedTheme);
  });

  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  const savedLanguage = localStorage.getItem('iconForgeLanguage');
  const browserLanguage = navigator.language.toLowerCase().startsWith('ru') ? 'ru' : navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  const initialLanguage = iconForgeTranslations[queryLanguage] ? queryLanguage : iconForgeTranslations[savedLanguage] ? savedLanguage : browserLanguage;
  applyIconForgeLanguage(initialLanguage);
  if (languageSelect) {
    languageSelect.value = iconForgeLanguage;
    languageSelect.addEventListener('change', () => {
      if (languageSelect.value !== iconForgeLanguage) applyIconForgeLanguage(languageSelect.value);
    });
  }

  applyTheme(selectedTheme);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = { light: 'dark', dark: 'system', system: 'light' }[selectedTheme];
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });

  colorScheme.addEventListener('change', () => {
    if (selectedTheme === 'system') applyTheme('system');
  });

  console.log('PWA Icon Generator initialized');
});
