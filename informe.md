# Informe Técnico - Asistente de Física Universitaria

## 1. Introducción

El presente proyecto consiste en el desarrollo de un asistente inteligente orientado al aprendizaje de la física universitaria. Su propósito es brindar apoyo a estudiantes en la resolución de problemas, comprensión de conceptos y detección de errores conceptuales mediante explicaciones detalladas y pedagógicas.

El sistema fue diseñado priorizando el rigor académico, basándose en bibliografía clásica ampliamente utilizada en carreras de ingeniería y ciencias exactas.

---

## 2. Objetivos

### Objetivo general

Desarrollar una herramienta interactiva que facilite el aprendizaje de la física mediante inteligencia artificial.

### Objetivos específicos

- Proveer explicaciones paso a paso.
- Detectar errores conceptuales en los planteos del usuario.
- Permitir la visualización de gráficos dinámicos.
- Integrar conocimiento académico con información actualizada.

---

## 3. Arquitectura del Sistema

El sistema implementa una arquitectura desacoplada compuesta por:

- **Frontend**: Aplicación desarrollada en React.
- **Backend / Proxy**: Manejo de requests externos y seguridad.
- **Modelo de IA (Gemini)**: Generación de respuestas.
- **Motor de búsqueda (Tavily)**: Obtención de información externa.

### Flujo de datos

Usuario → Frontend (React)
→ Backend / Proxy (Vercel)
→ Tavily API (opcional)
→ Modelo Gemini
→ Respuesta al usuario

Esta arquitectura permite escalabilidad, modularidad y protección de credenciales.

---

## 4. Funcionamiento del Asistente

El asistente utiliza un prompt estructurado que define:

- Alcance temático (cinemática, dinámica, energía, etc.)
- Reglas pedagógicas
- Uso de LaTeX para expresiones matemáticas
- Identificación de fuerzas y teoremas de conservación

Además, permite incorporar una base de conocimiento personalizada proveniente de apuntes o material académico.

---

## 5. Búsqueda Web Integrada

Se incorporó una funcionalidad que permite habilitar la búsqueda web para complementar las respuestas del sistema.

### Implementación

- Se utilizó la API de Tavily.
- Se implementó un proxy serverless en Vercel.
- Se evita la exposición de la API Key en el frontend.

### Flujo

1. El usuario activa la opción de búsqueda web.
2. La consulta se envía al backend.
3. El backend consulta Tavily.
4. Se obtiene un resumen y fuentes.
5. Esta información se integra al prompt.

### Beneficios

- Permite incorporar ejemplos reales.
- Mejora la calidad de respuestas en temas actuales.
- Complementa el conocimiento académico.

---

## 6. Seguridad

- Las claves de API se almacenan en variables de entorno.
- El frontend no accede directamente a servicios externos.
- Se utiliza un backend intermediario para proteger la información.

---

## 7. Validación del Sistema

Se realizaron pruebas comparando:

- Respuestas con y sin búsqueda web
- Resultados con diferentes tipos de preguntas
- Logs de consola para verificar llamadas a APIs

Se observó que la búsqueda web permite enriquecer significativamente las respuestas.

---

## 8. Conclusiones

El sistema desarrollado combina herramientas modernas de inteligencia artificial con fundamentos académicos sólidos, logrando una plataforma útil para el aprendizaje.

La integración de búsqueda web permite extender las capacidades del asistente, convirtiéndolo en una herramienta híbrida entre conocimiento teórico y aplicación práctica.

---

## 9. Trabajo Futuro

- Incorporar más fuentes académicas
- Implementar ranking de relevancia de resultados
- Mejorar la visualización de fuentes
- Integrar más modelos de IA

---

## 10. Tecnologías Utilizadas

- React
- TypeScript
- Node.js
- Tavily API
- Google Gemini API
- Vercel (Serverless)

---

Este informe describe el desarrollo y funcionamiento del asistente, destacando su enfoque pedagógico, arquitectura y potencial como herramienta educativa.
