# LOG.md — Bitácora del proyecto ColorFly

> Este archivo documenta las decisiones técnicas y el avance del proyecto por etapas.
> El detalle del uso de IA como herramienta de asistencia (prompts, criterios, resultados) se encuentra documentado por separado en `documentacion/uso-ia.md`.

---

## Etapa 0 — Planificación y estructura del proyecto

**Fecha:** 2026-08-13

### Objetivo

Definir la estructura base del proyecto y dejar el repositorio inicializado en GitHub.

### Decisiones tomadas

- Nombre del repositorio: `ProyectoM1_ReyGabriel`.
- Estructura de carpetas definida:
    - `index.html` en la raíz (requisito de GitHub Pages).
    - `css/styles.css`
    - `js/script.js`
    - `assets/` (reservada para uso futuro, opcional).
    - `README.md` y `LOG.md`.
    - `documentacion/` con `uso-ia.md` y `capturas/`, para cumplir el entregable final (documentación + uso de IA), sin interferir con el deploy en GitHub Pages (que se sirve desde la raíz).
- Flujo de trabajo Git: rama única `main`, commits pequeños y descriptivos con formato tipo _conventional commits_ (`feat`, `fix`, `chore`, `docs`).
- Repositorio creado como público en GitHub, sin README ni .gitignore autogenerados (para evitar conflictos con los archivos locales).

### Acciones realizadas

- Creación local de carpetas y archivos vacíos.
- Inicialización del repositorio Git local.
- Commit inicial: `chore: inicializa estructura base del proyecto`.
- Repositorio remoto creado en GitHub y push inicial completado.

### Estado

✅ Etapa completada y validada.

### Próximo paso

Etapa 1 — Definir la estructura HTML semántica de la aplicación.

---

## Etapa 1 — Estructura HTML semántica

**Fecha:** 2026-08-13

### Objetivo

Definir la estructura semántica de la página a partir de un boceto propio (papel → Excalidraw), resolviendo ambigüedades de diseño y accesibilidad antes de escribir código.

### Proceso

- Boceto inicial realizado en papel y digitalizado en Excalidraw, usado como base de discusión.
- Se identificaron y resolvieron los siguientes puntos:
    - Separación entre logotipo/isotipo (header) y el h1 real de la página.
    - El selector de tamaño de paleta (6/8/9) se resuelve como `fieldset` + `legend` + inputs `radio`, no como botones sueltos, por tratarse de una selección única y para garantizar accesibilidad por teclado.
    - La funcionalidad "Paletas anteriores" se identificó como _extra point_ (no forma parte del alcance obligatorio) y se pospone para el final del proyecto, priorizando el mínimo funcional.
    - Se unificaron los paneles "Información de colores" y "Dibujo de la paleta" en un solo componente por color (swatch + HEX + HSL en el mismo bloque), evitando que la asociación color↔código dependa solo del orden visual.
    - Se definió mostrar HEX y HSL siempre visibles y con igual jerarquía visual (sin ocultar ninguno detrás de un selector), por requisito explícito de la consigna.
    - El botón "Generar Paleta" se ubicó fuera de las secciones de configuración y resultado, en un contenedor propio, por ser una acción y no contenido temático.
    - Se definió jerarquía de encabezados: `h1` único (ColorFly) y `h2` para cada sección temática (Configurar paleta, Tu paleta, Paletas anteriores).

### Estado

✅ Etapa completada y validada. Estructura semántica implementada en `index.html`.

### Próximo paso

Etapa 2 — Lógica de generación de color (JS puro): algoritmo de color aleatorio y conversión HSL↔HEX.

## Etapa 2 — Lógica de generación de color (JS puro)

**Fecha:** 2026-08-15

### Objetivo

Implementar la lógica de generación aleatoria de color y su conversión entre formatos HSL y HEX, sin tocar el DOM todavía.

### Decisiones tomadas

- Se definió generar el color en HSL como formato "fuente", y derivar el HEX a partir de esos valores (no generar HEX directamente), por ser matemáticamente más simple de construir y por mantener la generación aleatoria separada de la conversión de formato.
- H se genera sin restricciones (0-360). S y L se acotan a rangos razonables (S: 40-100, L: 25-80) para evitar casos borde que devuelvan grises, negros o blancos puros, priorizando que la paleta tenga sentido visual — decisión de diseño, no de accesibilidad forzada (ya que el color de fondo del swatch no requiere contraste de texto, por la estructura HTML definida en la Etapa 1).
- Se separó la lógica en tres funciones con responsabilidad única:
    - `generarColorHSL()`: genera un objeto `{h, s, l}` aleatorio dentro de los rangos definidos.
    - `hslToHex(h, s, l)`: convierte valores HSL a un string HEX, mediante el algoritmo estándar de conversión (cálculo de C, X, m según sector de 60° en la rueda de color).
    - `generarColor()`: función orquestadora que combina las dos anteriores y devuelve un objeto plano `{h, s, l, hex}`, listo para usar en el render (Etapa 3).
- Se optó por devolver objetos (no arrays) en todas las funciones, por legibilidad y para evitar errores por dependencia de orden posicional.

### Proceso de aprendizaje

- El algoritmo de conversión HSL→HEX se trabajó primero a mano (con valores numéricos concretos) antes de escribir código, para entender la lógica matemática (rueda de color, sectores de 60°, valores auxiliares C/X/m) en vez de copiar una fórmula sin comprenderla.

### Estado

✅ Etapa completada y validada. Las tres funciones fueron probadas manualmente en la consola del navegador con múltiples valores, confirmando resultados correctos.

### Próximo paso

Etapa 3 — Render dinámico de la paleta en el DOM, según el tamaño seleccionado por el usuario.

## Etapa 3 — Render dinámico de la paleta

**Fecha:** 2026-08-15

### Objetivo

Conectar la lógica de generación de color (Etapa 2) con el DOM, para renderizar dinámicamente la paleta según el tamaño seleccionado por el usuario, activada por el botón "Generar Paleta".

### Decisiones tomadas

- Se separó la lógica en funciones de responsabilidad única:
    - `obtenerTamanioSeleccionado()`: lee el radio button marcado y devuelve el tamaño como número.
    - `generarPaleta(cantidad)`: genera un array de colores llamando a `generarColor()` (Etapa 2) tantas veces como se indique.
    - `renderizarPaleta(colores)`: construye el HTML de cada color usando `document.createElement()` y `appendChild()` (no `innerHTML` con strings), evitando malas prácticas y riesgos de seguridad tipo XSS.
    - `manejarClickGenerar()`: orquesta las tres funciones anteriores en el orden correcto.
- Antes de renderizar una nueva paleta, se vacía el contenedor (`innerHTML = ""`) para evitar que se acumulen paletas anteriores.
- Se conectó el flujo completo al evento `click` del botón "Generar Paleta" mediante `addEventListener`.
- Ajuste menor de un comentario en `index.html` (referencia a la estructura de los `<li>`), agrupado en el mismo commit por ser parte del mismo trabajo, sin ameritar un commit propio.

### Estado

✅ Etapa completada y validada. Probado manualmente con los tres tamaños de paleta (6, 8, 9), confirmando generación aleatoria correcta y render dinámico funcional.

### Próximo paso

Etapa 4 — Interacción y microfeedback (copiar código al portapapeles + confirmación visible al usuario).

## Etapa 4 — Interacción y microfeedback

**Fecha:** 2026-08-15

### Objetivo

Implementar la funcionalidad de copiar el código HEX al portapapeles al hacer clic en un swatch, con microfeedback visible (toast), cumpliendo el punto 4 del alcance mínimo obligatorio y el extra point de copiado al portapapeles.

### Decisiones tomadas

- Se utilizó delegación de eventos: un único listener de `click` en el contenedor `listaPaleta` (que siempre existe), en vez de agregar un listener por cada swatch (que se crean y destruyen dinámicamente). Se usó `event.target.closest(".swatch")` para identificar, desde el contenedor, cuál swatch específico originó el click.
- Se decidió guardar el código HEX de cada swatch en un atributo `data-hex`, accesible vía `.dataset.hex`, en lugar de leerlo desde `style.backgroundColor`, evitando depender de cómo el navegador normaliza internamente los formatos de color (que puede devolver `rgb()` en vez de HEX) y separando la responsabilidad visual (estilo) de la responsabilidad de datos.
- Se implementó el copiado con la API asíncrona `navigator.clipboard.writeText()`, usando `async/await` y `try/catch` para manejar tanto el caso de éxito como el de fallo.
- Se agregó un elemento `<div id="toast">` fijo en el HTML (oculto por defecto con el atributo `hidden`), con `role="status"` y `aria-live="polite"` para garantizar que el microfeedback sea también accesible para usuarios de lectores de pantalla, no solo visual.
- El toast se muestra y oculta automáticamente a los 2 segundos mediante `setTimeout`, mostrando un mensaje distinto según el resultado (éxito o error al copiar).

### Estado

✅ Etapa completada y validada. Se probó el copiado de distintos swatches, confirmando que el color correcto se copia al portapapeles. Pendiente de estilos visuales (Etapa 6) para la presentación final del toast.

### Próximo paso

Etapa 5 — Accesibilidad y foco visible (revisión general de contraste, navegación por teclado y estados de foco).

## Etapa 5 — Accesibilidad y foco visible

**Fecha:** 2026-08-15

### Objetivo

Revisar y reforzar las consideraciones de accesibilidad del proyecto (labels asociados, contraste suficiente, foco visible), completando el requisito correspondiente del alcance mínimo obligatorio.

### Decisiones y hallazgos

**Foco visible:**

- Se confirmó, mediante prueba manual de navegación por teclado, que todos los elementos interactivos (radios, botón "Generar Paleta", swatches, links del footer) son alcanzables y operables sin mouse, en un orden lógico.
- Se identificó que el foco por defecto del navegador no es confiable para los swatches, ya que su color de fondo es aleatorio y puede coincidir o mimetizarse con el color del contorno de foco. Se definió como especificación pendiente (Etapa 6) implementar un estilo de foco propio con doble contorno (claro + oscuro) para garantizar visibilidad sin importar el color de fondo.
- Se detectó adicionalmente que los swatches, al no tener dimensiones definidas aún en CSS, se muestran demasiado pequeños, agravando el problema del foco. Ambos issues (tamaño y contraste de foco) quedan anotados para la Etapa 6.

**Contraste general:**

- Se revisó cada elemento de texto de la interfaz, confirmando que ningún texto se muestra sobre un fondo de color aleatorio (decisión de estructura ya tomada en la Etapa 1), reduciendo el riesgo de contraste a una correcta elección de paleta de colores propia en CSS.
- Se definió usar el estándar WCAG AA (contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande) como criterio a verificar en la Etapa 6, con herramientas como WebAIM Contrast Checker y el inspector de accesibilidad de Chrome DevTools.

**Corrección real del logo/header:**

- Al revisar el asset real del isotipo (que incluye el texto "ColorFly Studio" dibujado dentro de la imagen, no como texto HTML), se corrigió el `alt` de la imagen de vacío a descriptivo (`alt="ColorFly Studio"`), y se mantuvo el `<h1>ColorFly</h1>` en el HTML pero visualmente oculto mediante una clase `.sr-only` (pendiente de definir en CSS), preservando la jerarquía semántica de encabezados sin duplicar visualmente el texto del logo.

**Repaso general del HTML:**

- Se verificó la estructura completa: landmarks (`header`, `main`, `footer`, `nav`), jerarquía de encabezados sin saltos, asociación correcta de labels (`for`/`id`) en el grupo de radios, atributos `aria-label` en botón y swatches, `role="status"`/`aria-live="polite"` en el toast, y `lang="es"` en el documento. No se encontraron errores; se confirmó que la información del código HEX no debe duplicarse en el `aria-label` del swatch, ya que el `<p>` adyacente ya la expone de forma redundante para lectores de pantalla.
- Se identificó como pendiente de completar (no de accesibilidad): reemplazar los `href="#"` de los links del footer por las URLs reales antes de la entrega final.

### Estado

✅ Etapa completada y validada. Ajustes de accesibilidad implementados en HTML (`alt`, `.sr-only` en `h1`). Especificaciones de foco, tamaño de swatches y paleta de colores accesible quedan documentadas como pendientes para la Etapa 6.

### Próximo paso

Etapa 6 — Estilos y CSS (layout, paleta de colores accesible, foco con doble contorno, dimensiones de swatches).

## Etapa 6 — Estilos y CSS

**Fecha:** 2026-08-16

### Objetivo

Aplicar identidad visual completa al proyecto: paleta de colores accesible, layout general, y estilos de todos los componentes interactivos, manteniendo los criterios de accesibilidad definidos en la Etapa 5.

### Decisiones tomadas

**Sistema de variables:**

- Se definieron variables CSS (`:root`) para colores, espaciado (escala en `rem`), tipografía y layout, evitando valores sueltos repetidos y facilitando ajustes futuros centralizados.
- Se adoptó `rem` como unidad estándar de medida (en lugar de `px`), decisión tomada pensando en una futura implementación responsive (objetivo personal del estudiante, fuera del alcance obligatorio de la consigna, pero identificado desde ahora para no tener que reescribir estilos más adelante).

**Paleta de colores:**

- Color de marca: `#2d3546` (provisto por el logo ya diseñado). Fondo general `#f4f6f9`, superficie de tarjetas `#ffffff`, texto secundario `#5c6478`.
- Verificado contraste WCAG AA: texto principal sobre fondo general con ratio muy superior al mínimo; texto secundario sobre fondo general con ratio 5.47:1 (verificado con WebAIM Contrast Checker), superando el mínimo de 4.5:1 exigido por AA. Se evaluó y descartó perseguir el nivel AAA (7:1) por no ser un requisito de la consigna y por ser inusual en productos de diseño moderno.

**Layout general:**

- Contenedor centrado con ancho máximo de 1000px.
- Header en fila (isotipo + frase) mediante Flexbox.
- Secciones del `<main>` estilizadas como tarjetas (fondo blanco, bordes redondeados) para diferenciarse del fondo general de la página.
- Reset básico de márgenes/paddings y `box-sizing: border-box` aplicado globalmente.

**Selector de tamaño (radios):**

- Se ocultó visualmente el input nativo (misma técnica que `.sr-only`) sin quitarlo de la accesibilidad, usando su `<label>` asociado como círculo visual.
- Estado seleccionado resuelto con el selector CSS `:checked + label`, sin necesidad de JavaScript.
- Foco visible aplicado sobre el label mediante `:focus-visible` en el input oculto.

**Botón "Generar Paleta":**

- Definido como el único botón con color de marca sólido de toda la interfaz, reservando ese peso visual para la acción principal.

**Swatches:**

- Se optó por una disposición en fila con `flex-wrap` (en lugar de un arco curvo) como solución funcional y prolija para esta etapa. Se dejó documentada la disposición en arco como mejora visual pendiente, a incorporar junto con el extra point de mejoras de UI.
- Tamaño fijo (4.5rem) y forma circular mediante `border-radius: 50%`.
- Foco visible resuelto con doble contorno (`outline` blanco + `box-shadow` en color de marca), garantizando visibilidad sin importar el color de fondo aleatorio del swatch.

**Toast:**

- Posicionado de forma fija, centrado horizontalmente, con animación de entrada/salida (fade + deslizamiento vertical) mediante `opacity` y `transform`, controlada por una clase CSS (`.visible`) en lugar de depender directamente del atributo `hidden` (que no es animable).
- Ajustada la función `mostrarToast()` en JS para sincronizar el atributo `hidden` con el fin real de la animación de salida, mediante un `setTimeout` anidado.

**Footer:**

- Reemplazo de los textos placeholder ("GH"/"LI") por íconos SVG embebidos de GitHub y LinkedIn, usando `fill="currentColor"` para heredar color desde CSS y `aria-hidden="true"` para evitar redundancia con el `aria-label` del link contenedor.
- Agregados los enlaces reales a los perfiles del desarrollador, con `target="_blank"` + `rel="noopener noreferrer"` para apertura segura en nueva pestaña.

### Estado

✅ Etapa completada. Todos los componentes probados visualmente y por navegación de teclado (foco visible confirmado en radios, botón, swatches y links del footer).

### Próximo paso

Revisión final de la consigna, y evaluación de los extra points pendientes (bloqueo de colores, guardado en localStorage, animaciones adicionales, mejoras de UI incluyendo la disposición en arco de la paleta) según tiempo disponible.

## Etapa 6 (revisión) — Ajustes de layout, contraste y limpieza de CSS

**Fecha:** 2026-08-16

### Objetivo

Corregir la disposición del `<main>` para reflejar fielmente el boceto original (config + botón en columna izquierda, paleta en columna derecha), resolver que header y footer queden fijos ocupando toda la altura de pantalla sin scroll general, y reforzar el contraste sutil entre las distintas zonas de la interfaz.

### Decisiones y correcciones

**Layout de una sola pantalla (sin scroll general):**

- Se rediseñó el `<body>` como Grid de filas (`auto 1fr auto`) con altura fija (`html, body { height: 100% }` + `overflow: hidden`), evitando el uso de `position: fixed` en favor de una técnica más robusta y coherente con el objetivo futuro de responsive.
- Se identificó y corrigió un problema típico de Grid: las filas `1fr` no se encogen por debajo del contenido a menos que se indique `min-height: 0` explícitamente en cada nivel anidado (`main`, `.panel-config`, ambas secciones variables) — sin este ajuste, el contenido forzaba el crecimiento del `<body>` y generaba scroll de página no deseado.
- Se agregó scroll interno acotado (`overflow-y: auto`) en las secciones de contenido variable ("Tu paleta" y "Paletas anteriores"), como salvaguarda ante paletas grandes, sin afectar la visibilidad fija de header y footer.

**Estructura de dos columnas en el `<main>`:**

- Se implementó `grid-template-areas` para distribuir el contenido en zonas nombradas: columna izquierda dividida en configuración (arriba) e historial de paletas (abajo), columna derecha ocupada íntegramente por la paleta generada.
- Se agrupó en el HTML la sección de configuración junto al botón "Generar Paleta" dentro de un nuevo contenedor (`.panel-config`), necesario para que ambos se comporten como una unidad dentro del Grid del `<main>`.
- Se reemplazó el sistema de swatches en fila (Flexbox con ancho fijo) por Grid con `auto-fill`, resolviendo un desborde horizontal que generaba scroll no deseado dentro de la columna de resultados.

**Header y footer de ancho completo:**

- Se corrigió que el fondo de color de header/footer estuviera limitado al mismo ancho que el `<main>` (problema originado por tener el `max-width` a nivel `<body>`). Se resolvió moviendo el `max-width` centrado únicamente al `<main>`, y usando `padding` calculado dinámicamente (`calc()`) en header/footer para que su contenido interno quede alineado a la misma columna visual, mientras su fondo de color ocupa el 100% del ancho de la ventana.

**Contraste entre secciones:**

- Se ajustó el color de fondo general (`--color-fondo`) de `#f4f6f9` a `#e8ecf2`, un tono perceptiblemente más oscuro pero igualmente sutil, tras confirmar visualmente que el valor original no generaba suficiente diferencia contra el blanco de las tarjetas.
- Se sumó un borde sutil (`rgba` de baja opacidad) y una sombra suave a las tarjetas (`section`), reforzando la separación visual sin perder la estética moderna y liviana buscada.

**Limpieza de código:**

- Se detectó y eliminó un bloque de estilos `footer` duplicado y obsoleto (remanente de la sub-etapa 6.2, previo a la reestructuración del layout), que sobrescribía silenciosamente parte del padding definido en la versión correcta y vigente.
- Se corrigió el fondo del isotipo del logo (ajuste realizado directamente sobre el archivo de imagen, fuera de CSS), resolviendo un recuadro blanco no deseado alrededor del logo.

### Estado

✅ Layout, paleta de colores y contraste validados visualmente sobre monitor de escritorio real. Pendiente como mejora visual futura (no bloqueante): ajustar la disposición final de los swatches (posible disposición en arco, según el boceto original).

---

## Etapa 6 (revisión) — Reorganización de script.js

**Fecha:** 2026-08-16

### Objetivo

Reordenar `js/script.js` por bloques temáticos, sin modificar ninguna lógica ya validada, para mejorar la legibilidad y mantener coherencia con la organización por secciones ya aplicada en `styles.css`.

### Decisiones tomadas

- Se agrupó el archivo en 6 bloques comentados: lógica de color, referencias al DOM, lógica de paleta y render, toast, manejadores de eventos, y registro de event listeners.
- Se centralizaron ambos `addEventListener` (botón "Generar Paleta" y delegación de clicks en la lista de swatches) en un único bloque final, separando la definición del comportamiento (funciones) de su activación (listeners) — patrón estándar para que el flujo de eventos de la aplicación se entienda de un vistazo.
- No se modificó ninguna lógica funcional; el comportamiento de la aplicación se mantuvo idéntico y fue re-validado tras la reorganización.

### Estado

✅ Etapa 6 cerrada por completo. Código de `script.js` reorganizado y validado, sin cambios de comportamiento.

### Próximo paso

Revisión final de la consigna completa, y evaluación de los extra points pendientes según tiempo disponible.
