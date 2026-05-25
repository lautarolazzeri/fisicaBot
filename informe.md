Física Bot AI: Asistente para resolver y explicar problemas de mecánica clásica.

## Resumen:

El proyecto consiste en el desarrollo de un asistente de inteligencia artificial orientado al aprendizaje de física, especialmente mecánica clásica. El objetivo principal fue crear una herramienta capaz de resolver problemas complejos, generar visualizaciones interactivas y contrastar información académica con fuentes actualizadas en tiempo real. El sistema utiliza como fuentes base los libros y apuntes de la cátedra y archivos cargados por el usuario, como PDFs, imágenes o textos. La metodología incluyó el entrenamiento mediante ingeniería de prompt, incorporación de contexto y recuperación de información externa mediante búsqueda web opcional con Tavily sistémico y la implementación de un entorno de renderizado de simulaciones en HTML/JavaScript. El modelo generativo utilizado es Gemini, integrado en una aplicación web desarrollada con React, TypeScript y Vite. La herramienta permite chatear con el asistente, adjuntar materiales, renderizar fórmulas en LaTeX, generar gráficos y mostrar simulaciones físicas interactivas. Como resultado principal se obtuvo un prototipo funcional que combina explicación teórica, resolución guiada y apoyo visual para temas como cinematica, dinamica, energia y conservacion.

## Introducción:

Un agente de IA es un sistema que interpreta una solicitud, consulta el contexto disponible y produce una respuesta orientada a una tarea. En educación, su valor está en acompañar el razonamiento: no solo entregar un número final, sino explicar fórmulas, unidades y fuerzas. Este proyecto busca construir un tutor de física que ayude a resolver ejercicios, detectar errores conceptuales, generar gráficos y mostrar simulaciones. Los objetivos específicos fueron: incorporar material de cátedra, búsqueda web controlada, visualizar resultados físicos.

## Materiales y Métodos:

Se desarrolló la aplicación web con React, TypeScript, Vite y Tailwind CSS. El modelo empleado es `gemini-3-flash-preview`. La búsqueda externa usa Tavily Search, que actúa como un agente de recuperación de información externa cuando se requiere verificar constantes o datos experimentales recientes. Las fuentes de datos previstas son: libros y apuntes cargados por la cátedra, guías de ejercicios, PDFs, imágenes, archivos de texto y resultados web opcionales. La técnica principal fue recuperación aumentada por contexto: los archivos cargados y el resumen web se inyectan en la consulta, mientras que el prompt del sistema fija el alcance, reglas pedagógicas, uso de LaTeX, detección de errores y formatos JSON para gráficos/simulaciones.
La evaluación se realizó con revisión funcional del código, compilación sin errores y 10 problemas: 4 de cinematica, 3 de dinamica, 2 de energia/conservacion y 1 de grafico/simulacion.

## Discusión:

La principal fortaleza del asistente es que combina resolución explicada con recursos visuales. Esto lo vuelve útil para problemas donde no alcanza con obtener el resultado final, sino que también importa comprender el procedimiento. La carga de archivos permite adaptar las respuestas a materiales de una cátedra específica, mientras que la búsqueda web amplía el contexto cuando se necesitan ejemplos, información externa o datos actuales. Entre las limitaciones, el modelo al ser entrenado/guiado mediante prompts y contexto, la precisión final depende de la claridad del enunciado, de la calidad del material cargado y de la verificación del usuario. También sería recomendable ampliar la base de conocimiento con apuntes reales y soluciones oficiales para mejorar la evaluación.

## Conclusiones:

Se logró desarrollar un prototipo funcional de asistente de física con chat, adjuntos, recuperación web opcional, gráficos y simulaciones. Se cumplieron los objetivos de resolver ejercicios, explicar procedimientos y representar resultados; queda parcialmente pendiente ampliar la base real de apuntes/libros y registrar una evaluación experimental con respuestas ya guardadas. Como futuras mejoras se propone disminuir el tiempo promedio de respuesta, implementar exactitud en los gráficos, mejorar la estética visual para dispositivos móviles y simulaciones y sumar más contenidos vistos en la cátedra.

Las capturas, glosario, ejemplos de interacción y evidencias de resultados se incluirán en una carpeta de Drive: Haga click aquí.
Chatea con el bot en https://fisicabotai.vercel.app
