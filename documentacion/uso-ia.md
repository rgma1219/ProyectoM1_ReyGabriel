# Uso de IA en el desarrollo de ColorFly

Este documento registra cómo se utilizó IA (Claude, Anthropic) como asistente/tutor durante el desarrollo del proyecto, incluyendo el criterio de trabajo, los prompts principales y los resultados obtenidos en cada etapa.

**Metodología de trabajo con la IA:** se definieron reglas explícitas desde el inicio: la IA no debía generar código salvo que se lo solicitara expresamente, y las soluciones debían debatirse primero en texto/pseudocódigo antes de implementarse. El objetivo fue usar la IA como mentor de criterio (arquitectura, semántica, accesibilidad), no como generador automático de código.

---

## Etapa 0 — Planificación y estructura del proyecto

### Prompt utilizado (resumen)

Se solicitó a la IA actuar como tutor del proyecto integrador, estableciendo reglas de trabajo (no generar código sin pedido expreso, avanzar por etapas validadas, mantener un LOG.md, y actuar como mentor señalando fallas de lógica/accesibilidad/semántica). Se pidió luego definir la estructura de carpetas del proyecto y el criterio de nomenclatura de commits.

### Resultado obtenido

Se acordó una estructura estándar de proyecto estático (`index.html`, `css/`, `js/`, `assets/`, `README.md`, `LOG.md`, `documentacion/`), un flujo de trabajo en rama `main` con commits siguiendo convención tipo _conventional commits_ (`feat`, `fix`, `chore`, `docs`), y criterio para la descripción del repositorio en GitHub.

### Captura

![Configuración inicial del proyecto](capturas/etapa-0.png)

---

## Etapa 1 — Estructura HTML semántica

### Prompt utilizado (resumen)

Se compartió un boceto propio (papel → digitalizado en Excalidraw) con el diseño visual de la app, pidiendo a la IA analizarlo junto con el estudiante para derivar una estructura HTML semántica, sin escribir código hasta validar las decisiones.

### Resultado obtenido

Mediante preguntas guiadas, se resolvieron en conjunto:

- Separación entre isotipo/logotipo (header) y el `h1` real de la página.
- Uso de `fieldset` + `legend` + inputs `radio` (en vez de botones sueltos) para el selector de tamaño de paleta, por tratarse de una selección única y por motivos de accesibilidad por teclado.
- Identificación de "Paletas anteriores" como funcionalidad fuera del alcance obligatorio (movida a _extra points_).
- Unificación de la visualización del color (swatch) y sus códigos (HEX/HSL) en un mismo bloque semántico, evitando que la asociación color↔código dependiera solo del orden visual.
- Definición de mostrar ambos códigos (HEX y HSL) siempre visibles y con igual jerarquía, por requisito explícito de la consigna.
- Ubicación del botón "Generar Paleta" fuera de las secciones de configuración y resultado, como acción independiente.
- Jerarquía de encabezados: un único `h1`, y `h2` para cada sección temática.

A partir de estas decisiones, la IA proporcionó el código HTML completo y comentado del `index.html`, que el estudiante transcribió y validó manualmente.

### Captura

![Estructura HTML semántica implementada](capturas/etapa-1.png)

## Etapa 2 — Lógica de generación de color (JS puro)

### Prompt utilizado (resumen)

Se planteó a la IA el desarrollo de la lógica de generación de color, partiendo de una base ya conocida (`Math.random()` + `Math.floor()`) y con la decisión propia de generar en formato HSL para luego convertir a HEX. Se discutió previamente si el requisito de aleatoriedad 100% (indicado por la docente) entraba en conflicto con buenas prácticas de accesibilidad, concluyendo que no, dado el diseño de HTML ya definido en la Etapa 1. Se pidió explícitamente que la IA no avanzara con código hasta validar la lógica y el algoritmo matemático paso a paso.

### Resultado obtenido

- Se definieron y acotaron los rangos de generación aleatoria (H libre, S y L acotados) como decisión de diseño visual, no de accesibilidad.
- Se aprendió el algoritmo de conversión HSL→HEX de forma guiada: primero la teoría de color (diferencia conceptual entre el modelo HSL y RGB), luego el cálculo manual de los valores auxiliares (C, X, m) con ejemplos numéricos propios, y recién al final la implementación en código.
- Se practicó el cálculo a mano con dos ejemplos propios (H=210/S=65/L=50 como demostración, y H=300/S=65/L=60 resuelto por el estudiante, con corrección de un error en el cálculo de X).
- Se implementaron tres funciones JS con responsabilidad única: `generarColorHSL()`, `hslToHex()`, y `generarColor()` (orquestadora), validadas todas en consola del navegador.
- Se reforzó el criterio de diseño de software: separación de responsabilidades, reutilización y testeo aislado de funciones puras, como práctica profesional.

### Capturas

![Funciones de generación de color validadas en consola](capturas/etapa-2a.png)

![Funciones de generación de color validadas en consola](capturas/etapa-2b.png)

## Etapa 3 — Render dinámico de la paleta

### Prompt utilizado (resumen)

Se solicitó a la IA el desarrollo del flujo completo de render dinámico (lectura de tamaño seleccionado, generación de la paleta, y pintado en el DOM), optando esta vez por resolver todo el flujo junto en lugar de función por función, para luego revisar en conjunto cualquier duda puntual.

### Resultado obtenido

- Se implementó el flujo completo conectando las funciones de la Etapa 2 con el DOM.
- Tras la primera implementación, se pidió una explicación detallada línea por línea de la función `renderizarPaleta()`, ya que incluía conceptos nuevos (`document.createElement`, `appendChild`, `.style`, `.setAttribute`, `.textContent`, `forEach`, template literals).
- Se validó explícitamente con la IA que el enfoque utilizado (creación de nodos DOM en vez de construir HTML como texto con `innerHTML`) responde a un estándar profesional, evitando malas prácticas y riesgos de seguridad, y se identificó como simplificación consciente la ausencia de manejo de errores defensivo, quedando fuera del alcance de este proyecto.

### Captura

![Paleta generada dinámicamente en el DOM](capturas/etapa-3.png)
