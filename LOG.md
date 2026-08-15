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
