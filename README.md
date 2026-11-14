# pagina-principal

Página principal de **Acción Cannábica** (Asociación Civil Acción Cannábica, `@accannabica`): un tablero institucional (*dashboard*) de una sola página, construido con React, TypeScript y Tailwind CSS.

> El propio proyecto se describe como un **prototipo**: el contenido institucional proviene de fuentes públicas citadas en el código, pero los datasets analíticos (EDA, mapa de calor, gradiente de peso), la tienda, parte de la agenda y el destino de donaciones son **datos de demostración**.

## Qué es

Una aplicación web de frontend puro (sin backend ni base de datos) que reúne en un único tablero con navegación lateral:

- Información institucional de la asociación: quiénes somos, recorrido y agenda, novedades.
- Redes de organizaciones y la federación **FACC** (Federación Argentina de Cannabis y Cáñamo).
- Información sobre el programa **REPROCANN** y su normativa.
- Un laboratorio de datos (EDA, mapa de calor, gradiente de peso) con un dataset sintético.
- Mockups de tienda con carrito, donaciones y formulario de contacto.
- Una sección «Spec & Skills» con la especificación del propio prototipo.

## Funcionalidades principales

Las 12 vistas están definidas en [`src/types.ts`](src/types.ts) (`NAV`); `harness`, `tienda` y `donaciones` están ocultas del sitio público con `visible: false` (el código se conserva y se reactivan quitando esa propiedad), por lo que hoy se muestran 9:

| Grupo | Vista |
| --- | --- |
| Tablero | Inicio |
| Institucional | Quiénes somos, Recorrido, Novedades |
| Redes | Redes, FACC |
| Programas | REPROCANN |
| Datos | Datos & EDA, *Spec & Skills (oculta)* |
| Acción | *Tienda (oculta)*, *Donaciones (oculta)*, Contacto |

Además: buscador global de secciones (atajo `/`), menú lateral responsive, ticker de titulares, enlaces por hash de la URL (`#reprocann`, `#eda`, etc.) y animaciones que respetan `prefers-reduced-motion`.

Limitaciones verificables en el código: el formulario de contacto solo valida los campos en el cliente y **no envía** el mensaje a ningún servidor; la tienda y las donaciones son mockups sin pasarela de pago.

## Tecnologías

Versiones declaradas en [`package.json`](package.json):

| Tecnología | Versión | Función |
| --- | --- | --- |
| React / React DOM | 19.2.6 | Interfaz de usuario |
| TypeScript | 5.9.3 | Tipado estricto |
| Vite | 7.3.2 | Servidor de desarrollo y *bundler* |
| Tailwind CSS + `@tailwindcss/vite` | 4.1.17 | Estilos |
| `@vitejs/plugin-react` | 5.1.1 | Soporte React en Vite |
| `vite-plugin-singlefile` | 2.3.0 | Genera la build como un único `index.html` |
| `clsx` + `tailwind-merge` | 2.1.1 / 3.4.0 | Composición de clases (`src/utils/cn.ts`) |

Los gráficos están hechos a medida en SVG (no se usa ninguna librería de gráficos). Las tipografías *Space Grotesk* y *JetBrains Mono* se cargan desde Google Fonts en [`index.html`](index.html).

## Requisitos previos

- Node.js y npm. El repositorio no declara una versión requerida (no hay campo `engines` ni `.nvmrc`); la build se verificó con Node.js 22.15.0.

## Instalación y ejecución

```bash
npm ci          # instala las dependencias según package-lock.json
npm run dev     # servidor de desarrollo de Vite
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo (`vite`). |
| `npm run build` | Genera `dist/index.html` con todo el JS y CSS incrustado. |
| `npm run preview` | Sirve localmente la build de `dist/`. |
| `npx tsc --noEmit` | Verificación de tipos (no es un script de `package.json`; la configuración estricta está en [`tsconfig.json`](tsconfig.json)). |

No hay pruebas automatizadas, ni linter ni formateador configurados.

## Variables de entorno

El proyecto no usa variables de entorno.

## Despliegue y CI/CD

No hay pipelines de CI/CD, Docker ni infraestructura como código en el repositorio. La build produce un único archivo estático, `dist/index.html`, que puede servirse desde cualquier hosting estático; el destino de despliegue real es desconocido.

## Documentación

- [`docs/overview.md`](docs/overview.md): propósito, arquitectura, organización del código y flujos.
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md): guía para GitHub Copilot en este repositorio.
