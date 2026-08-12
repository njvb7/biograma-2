# CruciLab

Creador y resolutor de crucigramas 100% local.

## Incluye

- Editor de respuestas y pistas.
- Generación automática del tablero buscando cruces entre letras.
- Hasta 20 términos por crucigrama.
- Selección de palabra horizontal/vertical.
- Comprobación de respuestas.
- Pista de una letra.
- Vista de solución.
- Reinicio.
- Progreso por palabras completas.
- Impresión de una versión en blanco.
- Modo claro y oscuro.
- Tres crucigramas preparados de 12 términos:
  - Razones trigonométricas.
  - Historia de Punta Arenas.
  - Sinónimos y antónimos.

## Cómo usar

No necesita npm, Node.js, API ni conexión a internet para funcionar una vez descargado.

1. Descomprime el ZIP.
2. Abre `index.html`.
3. Elige un ejemplo o edita las palabras y pistas.
4. Presiona **Generar crucigrama**.

## Publicar gratis con GitHub Pages

1. Crea un repositorio.
2. Sube todos los archivos.
3. En GitHub, abre **Settings → Pages**.
4. Selecciona la rama `main` y `/root`.
5. Guarda.

## Estructura

- `index.html`: interfaz.
- `style.css`: diseño.
- `data.js`: tres ejemplos precargados.
- `crossword.js`: motor de construcción del crucigrama.
- `app.js`: interacción de la página.

## Cómo funciona el generador

El motor:

1. Normaliza las respuestas (quita espacios y tildes para el tablero).
2. Ordena y prueba diferentes palabras iniciales.
3. Busca letras coincidentes con las palabras ya ubicadas.
4. Rechaza posiciones que provoquen colisiones o palabras pegadas incorrectamente.
5. Puntúa las alternativas según cantidad de cruces y compacidad.
6. Ejecuta múltiples intentos y conserva el mejor tablero.

Si una lista tiene palabras que no comparten suficientes letras, el programa lo informa y muestra cuáles no pudo conectar.

## Nota sobre Historia de Punta Arenas

Las pistas del ejemplo histórico fueron preparadas a partir de fuentes patrimoniales chilenas, principalmente Memoria Chilena, Museo Regional de Magallanes y Consejo de Monumentos Nacionales.
