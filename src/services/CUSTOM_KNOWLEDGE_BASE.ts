export const CUSTOM_KNOWLEDGE_BASE = `
# FÍSICA 1 - BASE DE CONOCIMIENTO

==================================================
TEMA: CINEMÁTICA
==================================================

Conceptos:
- La cinemática estudia el movimiento sin analizar sus causas.
- Los cuerpos se modelan como partículas puntuales.
- Variables fundamentales: posición, velocidad y aceleración.

Fórmulas:
- Velocidad: v = dr/dt
- Aceleración: a = dv/dt

MRU:
- x = x0 + vt

MRUV:
- x = x0 + v0t + (1/2)at²
- v = v0 + at
- v² = v0² + 2aΔx

Caída Libre:
- a = -g
- g = 9.8 m/s²

Tiro Parabólico:
- vx = constante
- vy = v0y - gt
- x = v0x t
- y = y0 + v0y t - (1/2)gt²

Reglas:
- Analizar siempre por separado eje X y eje Y.
- En tiro parabólico la aceleración horizontal es cero.

==================================================
TEMA: MOVIMIENTO CIRCULAR
==================================================

Conceptos:
- La rapidez puede ser constante aunque exista aceleración.
- La aceleración centrípeta apunta hacia el centro.

Fórmulas:
- ω = v/R
- ac = v²/R
- ac = ω²R
- Fc = mv²/R

Reglas:
- Toda aceleración centrípeta apunta hacia el centro.
- No confundir velocidad tangencial con aceleración centrípeta.

==================================================
TEMA: DINÁMICA
==================================================

Conceptos:
- Las fuerzas producen aceleraciones.
- Aplicar siempre las Leyes de Newton.

Primera Ley:
- Si ΣF = 0 entonces a = 0

Segunda Ley:
- ΣF = ma

Tercera Ley:
- Acción y reacción tienen igual magnitud y sentido opuesto.

Fuerzas Comunes:

Peso:
- P = mg

Normal:
- Perpendicular a la superficie.

Tensión:
- Actúa a lo largo de cuerdas ideales.

Rozamiento Estático:
- fs ≤ μs N

Rozamiento Cinético:
- fk = μk N

Ley de Hooke:
- F = -kx

Reglas:
- Dibujar siempre el diagrama de cuerpo libre.
- Identificar todas las fuerzas antes de plantear ecuaciones.

==================================================
TEMA: PLANO INCLINADO
==================================================

Fórmulas:

Componente paralela:
- Px = mg sen(θ)

Componente perpendicular:
- Py = mg cos(θ)

Normal:
- N = mg cos(θ)

Con Rozamiento:
- fk = μk N

Reglas:
- Elegir ejes paralelos y perpendiculares al plano.
- Descomponer siempre el peso.

==================================================
TEMA: TRABAJO Y ENERGÍA
==================================================

Conceptos:
- El trabajo representa transferencia de energía.

Trabajo:
- W = F·d·cos(θ)

Energía Cinética:
- K = (1/2)mv²

Energía Potencial Gravitatoria:
- Ug = mgh

Energía Potencial Elástica:
- Ue = (1/2)kx²

Potencia:
- P = W/t

Teorema Trabajo-Energía:
- Wneto = ΔK

Conservación de Energía:
- Em = K + U

Reglas:
- Sin fuerzas no conservativas → Em constante.
- Con rozamiento → Wnc = ΔEm.

==================================================
TEMA: IMPULSO Y MOMENTO LINEAL
==================================================

Cantidad de Movimiento:
- p = mv

Impulso:
- J = FΔt
- J = Δp

Conservación:
- Σp_inicial = Σp_final

Reglas:
- En sistemas aislados se conserva el momento lineal.

==================================================
TEMA: COLISIONES
==================================================

Choque Elástico:

Se conserva:
- Momento lineal
- Energía cinética

Σp_i = Σp_f
K_i = K_f

Choque Inelástico:

Se conserva:
- Momento lineal

No se conserva:
- Energía cinética

Σp_i = Σp_f

Choque Perfectamente Inelástico:

Los cuerpos quedan unidos luego del choque.

==================================================
TEMA: CENTRO DE MASA
==================================================

Fórmulas:

xcm = Σ(mixi)/Σmi
ycm = Σ(miyi)/Σmi

Reglas:
- Analizar el sistema como una única partícula ubicada en el CM.

==================================================
TEMA: ROTACIÓN
==================================================

Velocidad Angular:
- ω = dθ/dt

Aceleración Angular:
- α = dω/dt

Cinemática Angular:
- ω = ω0 + αt
- θ = θ0 + ω0t + (1/2)αt²

Torque:
- τ = r × F

Segunda Ley Rotacional:
- τ = Iα

Energía Cinética Rotacional:
- Krot = (1/2)Iω²

==================================================
TEMA: MOMENTO ANGULAR
==================================================

Partícula:
- L = r × p

Cuerpo Rígido:
- L = Iω

Conservación:
- Si Στext = 0 entonces L es constante.

Reglas:
- Si disminuye I, aumenta ω.
- Aplicar conservación de momento angular cuando no existan torques externos.

==================================================
TEMA: FLUIDOS
==================================================

Densidad:
- ρ = m/V

Presión:
- P = F/A

Presión Hidrostática:
- P = P0 + ρgh

Principio de Pascal:
- Una variación de presión se transmite a todo el fluido.

Principio de Arquímedes:
- E = ρgV

Caudal:
- Q = Av

Continuidad:
- A1v1 = A2v2

Bernoulli:
- P + (1/2)ρv² + ρgh = constante

Reglas:
- Aplicar Bernoulli únicamente a fluidos ideales.
- Aplicar continuidad cuando el flujo sea estacionario e incompresible.

==================================================
TEMAS PROHIBIDOS
==================================================

Si una consulta trata sobre:

- Electricidad
- Campo eléctrico
- Ley de Coulomb
- Corriente eléctrica
- Circuitos
- Capacitores
- Magnetismo
- Fuerza magnética
- Campo magnético
- Maxwell
- Inducción electromagnética
- Óptica
- Relatividad
- Mecánica cuántica
- Física nuclear
- Hamiltoniano
- Lagrangiano
- Navier-Stokes
- CFD
- Turbulencia avanzada

Responder únicamente:

"Este tema no pertenece al programa de Física 1 de la UNS."
`;
