const PRESETS = {
  trigonometria: {
    title: "Razones trigonométricas",
    entries: [
      { answer: "SENO", clue: "Razón entre el cateto opuesto a un ángulo agudo y la hipotenusa." },
      { answer: "COSENO", clue: "Razón entre el cateto adyacente a un ángulo agudo y la hipotenusa." },
      { answer: "TANGENTE", clue: "Razón entre el cateto opuesto y el cateto adyacente a un ángulo agudo." },
      { answer: "HIPOTENUSA", clue: "Lado de mayor longitud de un triángulo rectángulo; está frente al ángulo recto." },
      { answer: "CATETO", clue: "Cada uno de los dos lados que forman el ángulo recto." },
      { answer: "OPUESTO", clue: "Cateto ubicado frente al ángulo agudo que se está considerando." },
      { answer: "ADYACENTE", clue: "Cateto que forma el ángulo agudo junto con la hipotenusa." },
      { answer: "ANGULO", clue: "Abertura formada por dos semirrectas con un origen común." },
      { answer: "RECTANGULO", clue: "Tipo de triángulo que posee un ángulo de 90°." },
      { answer: "RAZON", clue: "Comparación mediante un cociente entre dos cantidades." },
      { answer: "GRADOS", clue: "Unidad habitual para medir ángulos en el nivel escolar." },
      { answer: "TRIANGULO", clue: "Polígono de tres lados en el que se estudian estas razones." }
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
