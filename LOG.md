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

- Se consultó con la docente sobre el requisito de aleatoriedad y se confirmó que debe ser 100% real.
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
