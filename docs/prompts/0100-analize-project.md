Analiza el repositorio actual y crea documentación fiable para explicar el proyecto a personas y proporcionar contexto útil a GitHub Copilot en futuras consultas.

## Archivos que debes crear o actualizar

1. `README.md`: presentación y guía de uso para las personas.
2. `docs/overview.md`: descripción detallada del propósito, tecnologías, arquitectura, organización y flujos del proyecto.
3. `.github/copilot-instructions.md`: instrucciones prácticas y concisas para que Copilot trabaje en este repositorio.

Crea las carpetas necesarias. Si alguno de estos archivos ya existe, revísalo y conserva la información útil, corrigiendo o ampliando solo lo que puedas verificar.

## Análisis del repositorio

Antes de escribir, inspecciona la estructura y los archivos relevantes, entre ellos, si existen:

- Manifiestos y archivos de dependencias, como `package.json`, archivos de lock, soluciones y proyectos, `pyproject.toml`, `requirements.txt`, `pom.xml`, `build.gradle`, `Cargo.toml` y equivalentes.
- Código fuente, puntos de entrada y módulos principales.
- Rutas, páginas, componentes, APIs, servicios, modelos de datos e integraciones.
- Scripts de instalación, desarrollo, compilación, pruebas, lint y despliegue.
- Archivos de configuración, variables de entorno de ejemplo y herramientas de calidad.
- Pruebas, pipelines CI/CD, Docker e infraestructura como código, si existen.
- Documentación actual, incluido `README.md`, `AGENTS.md` y otros archivos de instrucciones para agentes.

Usa el código y la configuración del repositorio como fuente de verdad. No inventes funcionalidades, tecnologías, versiones, comandos, requisitos ni decisiones arquitectónicas. Si un dato no puede confirmarse, indícalo como desconocido o no lo incluyas.

Evita basar el análisis en dependencias instaladas, artefactos generados, archivos compilados o carpetas irrelevantes. No incluyas secretos ni valores sensibles. Si el proyecto usa variables sensibles, documenta únicamente sus nombres y propósito cuando sean verificables, nunca sus valores.

## Contenido de `README.md`

Escribe en español claro y profesional, salvo que el idioma predominante del repositorio indique otra cosa. Incluye las secciones pertinentes:

- Nombre del proyecto y resumen breve.
- Qué es el proyecto, qué problema resuelve y quiénes son sus usuarios, solo si hay evidencia.
- Funcionalidades principales verificadas.
- Tecnologías y herramientas utilizadas, indicando su función y versión declarada cuando esté disponible.
- Requisitos previos.
- Instalación y configuración local.
- Variables de entorno necesarias, sin valores secretos.
- Cómo ejecutar la aplicación en desarrollo.
- Cómo compilar, probar y ejecutar lint o formato, únicamente con comandos existentes y verificados.
- Enlaces a `docs/overview.md` y a otra documentación relevante.
- Instrucciones de despliegue o CI/CD, si existen.

Mantén el README orientado a quienes quieran conocer, instalar o usar el proyecto. No lo conviertas en una copia del análisis arquitectónico.

## Contenido de `docs/overview.md`

Este documento debe ser la referencia descriptiva detallada del proyecto. Explica, con evidencia del repositorio:

- Propósito, alcance y problema que aborda el proyecto.
- Usuarios o actores principales, si pueden identificarse.
- Funcionalidades y flujos principales.
- Lenguajes, frameworks, runtimes, herramientas y servicios externos; indica versiones solo cuando estén declaradas.
- Arquitectura general y responsabilidades de sus componentes.
- Organización de las carpetas y archivos importantes.
- Puntos de entrada y recorrido de una operación o flujo importante, si el código lo permite.
- APIs, persistencia, modelos de datos e integraciones, si existen.
- Configuración necesaria y relación entre los componentes.
- Pruebas, validaciones, despliegue y CI/CD, si están configurados.
- Limitaciones o aspectos pendientes solo cuando estén documentados o sean claramente comprobables.

Distingue claramente los hechos confirmados de cualquier interpretación. No incluyas una lista exhaustiva de archivos sin explicar su relevancia. Usa ejemplos concretos y rutas relativas al repositorio.

## Contenido de `.github/copilot-instructions.md`

Este archivo contiene instrucciones para trabajar en el proyecto, no una descripción extensa. Debe ser breve, accionable y específica. Incluye:

- Un resumen corto del proyecto y de su arquitectura.
- Dónde realizar cambios según el tipo de tarea.
- Convenciones observables en el código.
- Comandos verificados de instalación, pruebas y validación.
- Restricciones o cuidados importantes al modificar el proyecto.
- La instrucción de consultar `docs/overview.md` cuando una tarea requiera entender el propósito, la arquitectura o los flujos del sistema.

No dupliques el README ni el contenido completo de `docs/overview.md`. No agregues reglas genéricas, no verificadas o redundantes con herramientas automáticas.

`AGENTS.md` es un formato compartido por varios agentes para instrucciones de proyecto; `.github/copilot-instructions.md` es la ubicación específica de instrucciones de repositorio para Copilot. En esta tarea, crea el archivo de Copilot solicitado y no agregues un `AGENTS.md` duplicado. Si ya existe un `AGENTS.md`, revísalo y evita que las nuevas instrucciones lo contradigan. No lo elimines ni lo reemplaces.

## Validación y entrega

- Comprueba que las tecnologías, rutas, versiones y comandos escritos coincidan con el repositorio.
- Ejecuta los comandos documentados cuando sea razonable y seguro; no afirmes que fueron probados si no los ejecutaste.
- Comprueba que los tres documentos sean coherentes entre sí y no se contradigan.
- Limita los cambios a `README.md`, `docs/overview.md` y `.github/copilot-instructions.md`, además de crear las carpetas necesarias.
- No modifiques código fuente, dependencias ni otros archivos.
- Al terminar, resume brevemente qué archivos creaste o actualizaste, qué fuentes del repositorio consultaste y qué datos no pudiste confirmar.