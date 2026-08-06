# Brief de Arquitectura — Portafolio de Mauricio Rodríguez Carballo

**Rol de quien lee esto:** Eres el desarrollador (Claude Code) ejecutando este proyecto en VS Code. Este documento es tu especificación de arquitectura, definida junto con Mauricio (dueño del producto) y un Claude actuando como arquitecto de software. No es un CV — es una carta de presentación viva. Sigue las fases en orden; no saltes a implementación de detalle sin cerrar la fase anterior.

---

## 1. Objetivo del producto

Sitio personal que funcione como **prueba de habilidad, no como resumen**. El visitante (reclutador técnico, hiring manager, lead) debe:
1. En los primeros 5-10 segundos, sentir calidad de ejecución (velocidad, diseño, pulido).
2. En 30-60 segundos, entender qué tipo de problemas resuelve Mauricio y cómo piensa.
3. Si decide profundizar, poder **ver y tocar código real** — no solo leer sobre él.

**No duplicar el CV.** Nada de "Experiencia 2019-2022, Octopy, React Developer" en formato lista. La info del CV vive en LinkedIn/PDF adjunto; aquí se muestra *evidencia*, no biografía.

---

## 2. Público objetivo y restricción de atención

- Reclutadores no técnicos: hojean 15-45s. Necesitan impacto visual + mensaje claro de propuesta de valor.
- Leads/hiring managers técnicos: si llegan, van a querer ver código real, no solo un portfolio bonito.
- **Implicación de diseño:** el sitio no puede depender de que el usuario interactúe para "entender" quién es Mauricio. La interactividad es un plus para el que profundiza, no un requisito para el que hojea.

---

## 3. Decisión de arquitectura: Híbrido (estático rápido + 1-2 piezas interactivas fuertes)

- Base del sitio: contenido estático o pre-renderizado, animaciones sutiles de scroll/entrada, cero fricción de carga.
- Excepción: un **playground de código en vivo** (ver sección 6) como pieza central de diferenciación.
- Presupuesto de performance: Lighthouse Performance ≥ 90, LCP < 2s en conexión promedio, sin layout shift notorio.

---

## 4. Stack técnico

| Capa | Elección | Razón |
|---|---|---|
| Framework | **Next.js (React + TypeScript)** | SSG para velocidad, App Router, permite usar Route Handlers si el playground necesita backend ligero |
| Estilos | Tailwind CSS | Rapidez de iteración, consistente con sistema de diseño definido abajo |
| Animaciones | Framer Motion | Transiciones de scroll/entrada sutiles, sin over-engineering |
| Playground de código | Sandpack (CodeSandbox) o CodeMirror + runtime en cliente | Debe correr client-side, sin exponer secretos ni requerir backend persistente |
| Hosting | **Vercel (subdominio gratuito, ej. `mauricio-rodriguez.vercel.app`)** | Integración nativa con Next.js, deploy automático desde GitHub, cero costo inicial. Dominio propio queda como mejora futura opcional, no bloqueante para el lanzamiento |
| Fuente tipográfica | Monoespaciada para code/acentos (ej. JetBrains Mono) + sans-serif legible para texto largo (ej. Inter) | Refuerza identidad "técnica" sin sacrificar legibilidad |
| Internacionalización | `next-intl` (o `i18n` nativo de Next App Router) | Idioma por defecto: **inglés**. Español como segundo idioma vía selector. Se implementa en Fase 2 (no en Fase 0/1) para no frenar el desarrollo inicial con la capa de traducción |

**Nota:** no usar CMS ni base de datos. Todo el contenido vive en archivos (MDX o JSON) dentro del repo — es un sitio personal, no necesita esa complejidad operativa.

---

## 5. Sistema de diseño — dirección visual

**Tono elegido: Minimalista y técnico.**

- Dark mode como default (posible light mode opcional, no prioritario en v1).
- Estética "editor de código / terminal": tipografía monoespaciada en detalles (nav, tags, labels), paleta reducida (fondo casi negro, 1-2 acentos de color vivos — ej. verde terminal o cian, usados con moderación, no saturado).
- Micro-detalles que refuerzan identidad de dev: cursores parpadeantes, prompts tipo `$`, números de línea en los snippets, sintaxis highlighting real (no capturas de pantalla de código).
- Sin foto personal ni stock photos ni ilustraciones genéricas de "developer con laptop". La identidad visual se construye 100% con tipografía, código real, y el sistema de color/espaciado — el sitio debe sentirse tan cuidado que no necesite una cara para transmitir personalidad.
- Movimiento con propósito: fade/slide sutil al entrar secciones en scroll, hover states con feedback inmediato. Evitar animación decorativa sin función.

---

## 6. Arquitectura de contenido / secciones del sitio

### 6.1 Hero
**Copy final (definido con Mauricio):**
> "Math taught me to see problems as puzzles. Code taught me to solve them. Now, I'm teaching an AI to join in."

Este es el texto principal del hero. Atemporal (sin cifra de años), sin relleno, con progresión matemática → código → IA que conecta directamente con los 3 casos de estudio de la sección 6.2. No modificar el copy sin aprobación de Mauricio — es contenido ya cerrado, no placeholder.

### 6.2 "Cómo pienso" / Casos de estudio (Rayos X del código)
3 casos, cada uno con: contexto breve del problema (1-2 líneas, sin nombrar clientes/empresas reales por NDA), la decisión técnica clave, y un snippet de código curado y comentado que ilustra esa decisión.

Casos seleccionados:
1. **Optimización bajo tráfico alto** (dominio: medios/marketing) — mostrar el patrón de optimización real usado (ej. estrategia de caching, lazy loading, o refactor de código deprecado), generalizado y anonimizado.
2. **Multi-repo / DevOps** (basado en experiencia en Octopy) — no es un snippet de feature, es evidencia de pensamiento de ingeniería a nivel de equipo: estructura de repositorios, gestión de permisos, diseño de pipelines CI/CD (deploy a QA/producción vía Node.js + PM2). El "snippet" aquí puede ser, por ejemplo, un fragmento de configuración de pipeline (YAML) comentado explicando las decisiones — qué gates de calidad se validan antes de mergear/desplegar, y por qué.
3. **Agente de IA local con Ollama** — este es el más flexible porque es proyecto personal, sin restricción de NDA. Ideal candidato para ser también la base del playground interactivo (sección 6.3), ya que Mauricio puede compartir código real sin restricción.

**Regla para todos los snippets:** nunca código copiado literal de un cliente. Siempre reescrito/generalizado conservando el patrón y la decisión de diseño, no los detalles de negocio del cliente.

**Nota de proceso:** Mauricio no compartirá código real de clientes por temas de NDA. Los 3 snippets deben ser **escritos desde cero por Claude Code**, siguiendo estrictamente las especificaciones de patrón técnico de abajo — no inventar libremente. El objetivo es que el patrón sea técnicamente correcto y defendible en una entrevista (Mauricio debe poder hablar de esto con propiedad), no que sea código copiado.

#### Especificación snippet 1 — Optimización bajo tráfico alto
- **Patrón a ilustrar:** estrategia de caching tipo *stale-while-revalidate* para llamadas a API, combinada con deduplicación de requests concurrentes (evitar N llamadas idénticas simultáneas cuando hay picos de tráfico).
- **Lenguaje:** TypeScript, estilo hook de React (ej. `useCachedFetch` o similar).
- **Comentarios obligatorios:** explicar *por qué* este patrón reduce carga al backend durante picos, y el trade-off de servir datos ligeramente obsoletos a cambio de resiliencia.
- **Tono del copy alrededor:** "Cuando el tráfico se dispara, la peor decisión es dejar que cada usuario dispare su propia llamada al backend. Así es como diseño la capa de caching para que aguante el pico sin caerse."

#### Especificación snippet 2 — Multi-repo / DevOps
- **Patrón a ilustrar:** fragmento de configuración de pipeline CI/CD (formato YAML, tipo GitHub Actions) con stages de calidad antes de deploy: lint → test → build → deploy condicionado a rama/entorno (QA vs producción).
- **Comentarios obligatorios:** explicar la razón de cada gate (ej. por qué el deploy a producción requiere aprobación manual o tag, por qué el pipeline de QA es más permisivo).
- **Tono del copy alrededor:** enfatizar que esto no es "código de feature", es diseño de proceso — mostrar que Mauricio piensa en el equipo completo, no solo en su propio commit.

#### Especificación snippet 3 — Agente de IA con Ollama
- **Patrón a ilustrar:** orquestación de function-calling/tool-use en un agente local — ej. cómo se define un set de "tools" disponibles para el modelo, se parsea su decisión, y se ejecuta la función correspondiente.
- **Este es el único snippet que puede acercarse a código real**, ya que es proyecto personal sin NDA. Si Mauricio decide compartir fragmentos reales más adelante, este es el candidato; si no, Claude Code lo redacta siguiendo el patrón general de orquestación de tools en agentes con LLMs locales.
- Este snippet es también la base para el playground interactivo (sección 6.3) — debe quedar simplificado a una versión que corra 100% en el navegador (sin llamar a un Ollama real).

### 6.3 Playground interactivo (pieza "wow")
Un componente donde el visitante puede:
- Ver un snippet real y editable relacionado con el proyecto de agente de IA (ej. un mini flujo de function calling, o un fragmento de lógica de orquestación con Ollama).
- Modificar parámetros o código y ver el resultado/output cambiar en vivo (ej. simulación en el navegador, no llamada real a un modelo local — eso no es desplegable en Vercel).
- Debe ejecutarse 100% en cliente. No depender de que el Ollama local de Mauricio esté corriendo.

### 6.4 Stack / herramientas
No lista aburrida de logos. Preferible: agrupado por "para qué lo uso" (ej. "Cuando necesito velocidad de iteración: React + TS + Tailwind" / "Cuando el proyecto crece: Node + Express / NestJS + Postgres"). Mantener breve.

### 6.5 Contacto / CTA final
Simple, directo: email, LinkedIn, y opcional link a CV en PDF. Nada de formularios de contacto complejos — un reclutador no va a llenar un form, va a copiar el email o mandar LinkedIn.

---

## 7. No-metas explícitas (para evitar scope creep)

- No blog.
- No sistema de comentarios ni analytics complejos (Vercel Analytics básico es suficiente si se quiere).
- No autenticación ni backend persistente.
- No responsive "perfecto" en todos los breakpoints imaginables — sí mobile-friendly funcional, pero el público principal revisa desde desktop/laptop.
- Internacionalización limitada a EN/ES vía selector simple (ver sección 3, `next-intl`). No agregar más idiomas ni lógica de detección automática de región/navegador en v1 — es un plus, no debe consumir tiempo desproporcionado del roadmap.

---

## 8. Roadmap de ejecución (fases para Claude Code)

**Fase 0 — Setup**
Proyecto Next.js + TypeScript + Tailwind, estructura de carpetas, configuración de fuentes, paleta de colores en `tailwind.config`, deploy inicial "hola mundo" a Vercel para validar el pipeline desde el día 1.

**Fase 1 — Layout y sistema de diseño**
Construir el shell de navegación, hero, y el sistema de componentes base (tipografía, botones, cards, tags) siguiendo la dirección visual de la sección 5. Sin contenido final todavía — usar contenido placeholder.

**Fase 2 — Secciones de contenido estático**
Casos de estudio (6.2), sección de stack (6.4), contacto (6.5), con animaciones de scroll (Framer Motion). Contenido real de los primeros 2 casos ya definidos.

**Fase 3 — Playground interactivo**
Investigar e implementar la solución de sandbox client-side (Sandpack u otra), integrar el snippet del proyecto de IA, validar que funcione bien en mobile y no rompa performance del resto del sitio (cargar de forma diferida/lazy).

**Fase 4 — Pulido y performance**
Auditoría Lighthouse, ajustar imágenes/fuentes, revisar accesibilidad básica (contraste, navegación por teclado), meta tags básicos (aunque no se indexe, sirve para el preview al compartir el link en LinkedIn/mensajes).

**Fase 5 — Deploy final y dominio**
Configurar dominio propio si Mauricio decide comprar uno (ej. mauriciorodriguez.dev), o usar el subdominio de Vercel. Verificar que el link final funcione bien embebido como preview en LinkedIn/Slack/email.

---

## 9. Pendientes que requieren decisión/input de Mauricio antes o durante el build

**Todos resueltos.** El brief está completo y listo para pasar a ejecución (Fase 0).

- ~~Foto personal~~ → No habrá foto. El sitio se apoya 100% en tipografía, código y diseño, sin rostro.
- ~~Dominio~~ → Subdominio gratuito de Vercel para el lanzamiento inicial. Dominio propio queda como mejora futura.
- ~~Idioma~~ → Inglés como idioma principal, con internacionalización (selector ES/EN) como feature de Fase 2.
- ~~Tercer caso de estudio~~ → Multi-repo/DevOps (Octopy): estructura de repos, permisos, pipelines CI/CD.
- ~~Snippets de código~~ → No se usará código real de cliente (NDA). Claude Code los redacta siguiendo las especificaciones de patrón técnico detalladas en la sección 6.2.
- ~~Copy del hero~~ → Ver sección 6.1, texto final ya cerrado.

---

## 10. Criterio de "listo para lanzar"

El sitio está listo cuando: carga en <2s, se ve bien en desktop y mobile, el playground funciona sin errores en consola, no hay ningún texto placeholder ("Lorem ipsum", contenido sin redactar), y Mauricio puede compartir el link y sentir que representa su nivel real de ejecución — no una plantilla genérica de portfolio.
