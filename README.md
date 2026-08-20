# ColorFly — Generador de paletas de colores

**Proyecto Integrador — Módulo 1, Full Stack Development, Henry**

Aplicación web estática e interactiva que genera paletas de colores aleatorias en formato HSL y HEX, a partir de un único botón principal.

Link GitHub Pages: https://rgma1219.github.io/ProyectoM1_ReyGabriel/

---

## Índice

- [Descripción](#descripción)
- [Demo](#demo)
- [Capturas del flujo principal](#capturas-del-flujo-principal)
- [Funcionalidades](#funcionalidades)
    - [Alcance funcional mínimo](#alcance-funcional-mínimo)
    - [Decisiones de alcance (MVP)](#decisiones-de-alcance-mvp)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo ejecutar el proyecto localmente](#cómo-ejecutar-el-proyecto-localmente)
- [Despliegue en GitHub Pages](#despliegue-en-github-pages)
- [Decisiones técnicas relevantes](#decisiones-técnicas-relevantes)
- [Documentación adicional](#documentación-adicional)
- [Autor](#autor)

---

## Descripción

ColorFly permite generar paletas de colores aleatorias de 6, 8 o 9 colores. Cada color se genera internamente en formato **HSL** y se convierte matemáticamente a **HEX**. El usuario puede elegir en qué formato quiere visualizar y copiar el código de cada color, y copiar colores individuales al hacer clic sobre ellos.

## Demo

🔗 Demo desplegada en GitHub Pages: `https://rgma1219.github.io/ProyectoM1_ReyGabriel/`

## Capturas del flujo principal

![Animación de app en funcionamiento](./documentacion/capturas/animation-app.gif)

## Funcionalidades

### Alcance funcional mínimo

- [x] Botón "Generar paleta" operativo.
- [x] Generación de colores aleatorios válidos en HSL y HEX.
- [x] Selector de tamaño de paleta (6 / 8 / 9 colores) con render dinámico.
- [x] Selector de formato de visualización (HSL o HEX).
- [x] Microfeedback visible mediante toast (`role="status"`, `aria-live="polite"`) al copiar un color.
- [x] HTML semántico (`header`, `main`, `footer`, `nav`, `section`, `fieldset`/`legend`).
- [x] Accesibilidad básica: labels asociados, contraste verificado (WCAG AA), foco visible en todos los elementos interactivos.

### Decisiones de alcance (MVP)

Durante el desarrollo se evaluó la implementación del extra credit **bloqueo de colores**, y se decidió conscientemente dejarlo fuera de esta entrega por una cuestión de tiempo disponible, priorizando en su lugar el diseño responsive de la aplicación (no solicitado por la consigna, pero considerado necesario para poder mostrar el proyecto desde un celular).

Esta no fue una funcionalidad descartada por dificultad técnica, sino postergada de forma deliberada: se llegó a analizar su impacto real antes de tomar la decisión, y quedó identificado como el próximo paso natural del proyecto:

- **Lógica (JS):** requiere que `generatePalette()` reciba qué posiciones están bloqueadas y con qué color, regenerando solo las libres. Implica también definir el comportamiento al cambiar el tamaño de paleta con colores ya bloqueados (¿se mantienen? ¿se resetean?).
- **HTML:** cada `.color-item` necesitaría un segundo botón (candado abierto/cerrado), hermano del swatch existente, siguiendo el mismo patrón de accesibilidad ya aplicado en el historial (dos botones independientes, nunca uno anidado dentro del otro).
- **CSS:** un estado visual distinto para colores bloqueados (ícono superpuesto o borde diferenciado), con sus propios estados `:hover` / `:focus-visible`.

Se prioriza documentar esto explícitamente para dejar en claro que fue una decisión de alcance de MVP, no una omisión.

> **Nota sobre el formato de visualización:** la consigna original pedía mostrar HSL y HEX simultáneamente junto a cada color. Tras una consulta de ambigüedad con la cátedra, se definió en su lugar un selector que permite al usuario elegir el formato de visualización y copiado (HSL o HEX), generando siempre ambos valores internamente de forma válida. El detalle de esta decisión está en `LOG.md`, Etapa 6 (nueva revisión).

## Stack tecnológico

- HTML5 semántico
- CSS3 (variables CSS, Grid, Flexbox, sin frameworks)
- JavaScript (vanilla, sin librerías ni frameworks)
- Git / GitHub
- GitHub Pages

## Estructura del proyecto

```
ProyectoM1_ReyGabriel/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── logo-desktop.png
│   └── icono-desktop.png
├── documentacion/
│   ├── uso-ia.md
│   └── capturas/
├── LOG.md
└── README.md
```

> **Nota sobre la estructura:** la consigna del proyecto describe un árbol de entrega bajo `Desarrollo/` y `Documentación/`. Se optó por mantener `index.html`, `css/` y `js/` en la raíz del repositorio (en vez de anidados bajo `Desarrollo/`) porque **GitHub Pages sirve el sitio desde la raíz por defecto**, y anidar el código habría complicado el despliegue sin aportar valor real. La documentación (bitácora, uso de IA y capturas) se organizó en `documentacion/` separada del código fuente, cumpliendo el mismo objetivo de organización que pedía la consigna. El detalle de esta decisión está documentado en `LOG.md`, Etapa 0.

## Cómo ejecutar el proyecto localmente

1. Cloná el repositorio:
    ```bash
    git clone https://github.com/rgma1219/ProyectoM1_ReyGabriel.git
    ```
2. Entrá a la carpeta del proyecto:
    ```bash
    cd ProyectoM1_ReyGabriel
    ```
3. Abrí `index.html` directamente en el navegador, o serví la carpeta con cualquier servidor local estático (por ejemplo, la extensión "Live Server" de VS Code).

No requiere instalación de dependencias ni build: es HTML, CSS y JS puro.

## Despliegue en GitHub Pages

1. En el repositorio de GitHub, ir a `Settings → Pages`.
2. En "Source", seleccionar la rama `main` y la carpeta `/ (root)`.
3. Guardar. GitHub Pages publicará automáticamente el sitio en `https://rgma1219.github.io/ProyectoM1_ReyGabriel/`.
4. Cada nuevo push a `main` actualiza la demo desplegada.

## Decisiones técnicas relevantes

Este README resume el proyecto; el detalle completo de cada decisión técnica, con su justificación y el proceso de trabajo etapa por etapa, está documentado en **[`LOG.md`](./LOG.md)**. Entre los puntos más relevantes:

- Generación de color en HSL como formato "fuente", con conversión matemática a HEX (no generación directa de HEX).
- Render mediante `document.createElement()` / `appendChild()` en vez de `innerHTML` con strings, evitando riesgos de seguridad tipo XSS.
- Delegación de eventos (`event.target.closest()`) para manejar clics sobre swatches generados dinámicamente.
- Sistema de foco visible con doble contorno (`outline` + `box-shadow`), pensado para ser legible sin importar el color de fondo aleatorio del swatch.
- Paleta de colores propia verificada contra el estándar de contraste WCAG AA.

## Documentación adicional

- 📄 **[`LOG.md`](./LOG.md)** — Bitácora completa del desarrollo: decisiones técnicas, proceso de aprendizaje y estado de cada etapa.
- 🤖 **[`documentacion/uso-ia.md`](./documentacion/uso-ia.md)** — Documentación del uso de IA como asistente de desarrollo: prompts utilizados, resultados obtenidos y capturas por etapa.

## Autor

**Rey Gabriel**

- GitHub: [@rgma1219](https://github.com/rgma1219)
- LinkedIn: [gabriel-rey](https://www.linkedin.com/in/gabriel-rey-2078563a1/)
