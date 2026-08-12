const PRESETS = {
  bc: {
    title: "Biología celular",
    entries: [
      { answer: "CELULA", clue: "Unidad estructural y funcional básica de los seres vivos." },
      { answer: "PROCARIONTE", clue: "Célula sin núcleo definido; su ADN se encuentra en el citoplasma." },
      { answer: "EUCARIONTE", clue: "Célula que posee un núcleo delimitado por una membrana." },
      { answer: "MEMBRANAPLASMATICA", clue: "Estructura que delimita la célula y regula el intercambio de sustancias con el medio." },
      { answer: "CITOPLASMA", clue: "Región celular donde se encuentran los orgánulos y ocurren diversas reacciones metabólicas." },
      { answer: "NUCLEO", clue: "Orgánulo que contiene la mayor parte del ADN en las células eucariontes." },
      { answer: "MITOCONDRIA", clue: "Orgánulo donde ocurre principalmente la respiración celular y se produce ATP." },
      { answer: "RIBOSOMA", clue: "Estructura encargada de sintetizar proteínas." },
      { answer: "ADN", clue: "Molécula que almacena la información genética." },
      { answer: "ATP", clue: "Molécula que funciona como principal fuente inmediata de energía para muchas funciones celulares." }
    
    ]
  },

  puntaArenas: {
    title: "Historia de Punta Arenas",
    entries: [
      { answer: "PUNTA ARENAS", clue: "Ciudad que se consolidó como principal asentamiento chileno en el estrecho tras el traslado de la colonia desde Fuerte Bulnes." },
      { answer: "FUERTE BULNES", clue: "Asentamiento fundado en 1843 para afianzar la soberanía chilena en el extremo austral." },
      { answer: "MAGALLANES", clue: "Nombre del estrecho y de la región cuya colonización impulsó el crecimiento de Punta Arenas." },
      { answer: "ESTRECHO", clue: "Paso marítimo junto al cual se desarrolló Punta Arenas y que conecta los océanos Atlántico y Pacífico." },
      { answer: "CROATAS", clue: "Grupo de inmigrantes cuya llegada a Magallanes aumentó especialmente a comienzos del siglo XX." },
      { answer: "INMIGRANTES", clue: "Personas provenientes de distintos países europeos que contribuyeron fuertemente al crecimiento de la ciudad." },
      { answer: "GANADERIA", clue: "Actividad económica vinculada especialmente a la crianza ovina que impulsó la economía magallánica." },
      { answer: "ORO", clue: "Recurso cuyo hallazgo a fines de la década de 1860 estimuló nuevas migraciones hacia Magallanes." },
      { answer: "SOBERANIA", clue: "Objetivo político que motivó la ocupación chilena del estrecho durante el siglo XIX." },
      { answer: "COLONIZACION", clue: "Proceso iniciado por el Estado chileno en Magallanes a partir de 1843." },
      { answer: "SARA BRAUN", clue: "Nombre asociado a un destacado palacio y al cementerio histórico de Punta Arenas." },
      { answer: "PALACIO", clue: "Tipo de inmueble patrimonial asociado a las familias Braun y Menéndez en el centro histórico de la ciudad." }
    ]
  },

  sinonimos: {
    title: "Sinónimos y antónimos",
    entries: [
      { answer: "ALEGRE", clue: "Sinónimo de feliz." },
      { answer: "RAPIDO", clue: "Antónimo de lento." },
      { answer: "COMENZAR", clue: "Sinónimo de iniciar." },
      { answer: "OSCURO", clue: "Antónimo de claro." },
      { answer: "VALIENTE", clue: "Sinónimo de valeroso." },
      { answer: "ABUNDANTE", clue: "Antónimo de escaso." },
      { answer: "HERMOSO", clue: "Sinónimo de bello." },
      { answer: "CERCANO", clue: "Antónimo de lejano." },
      { answer: "FINALIZAR", clue: "Sinónimo de terminar." },
      { answer: "DEBIL", clue: "Antónimo de fuerte." },
      { answer: "SILENCIOSO", clue: "Sinónimo de callado." },
      { answer: "GENEROSO", clue: "Antónimo de egoísta." }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PRESETS;
}
