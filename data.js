const PRESETS = {
  biologiaCelular: {
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
      { answer: "ATP", clue: "Molécula que funciona como principal fuente inmediata de energía para muchas funciones celulares." },
      { answer: "DIFUSION", clue: "Movimiento neto de partículas desde una zona de mayor concentración hacia una de menor concentración." },
      { answer: "OSMOSIS", clue: "Movimiento de agua a través de una membrana semipermeable debido a diferencias en la concentración de solutos." }
    ]
  },

  genetica: {
    title: "Genética y herencia",
    entries: [
      { answer: "GEN", clue: "Segmento de ADN que contiene información relacionada con una característica o función biológica." },
      { answer: "ALELO", clue: "Variante de un gen." },
      { answer: "GENOTIPO", clue: "Conjunto de alelos que posee un individuo." },
      { answer: "FENOTIPO", clue: "Características observables de un organismo, resultado de la interacción entre genotipo y ambiente." },
      { answer: "HOMOCIGOTO", clue: "Individuo que posee dos alelos iguales para un gen." },
      { answer: "HETEROCIGOTO", clue: "Individuo que posee dos alelos diferentes para un gen." },
      { answer: "MUTACION", clue: "Cambio en la secuencia del ADN." },
      { answer: "CROMOSOMA", clue: "Estructura formada por ADN asociado a proteínas que contiene material genético." },
      { answer: "MITOSIS", clue: "División celular que produce dos células hijas genéticamente muy similares a la célula original." },
      { answer: "MEIOSIS", clue: "División celular que produce células haploides y contribuye a la variabilidad genética." },
      { answer: "TRANSCRIPCION", clue: "Proceso mediante el cual se utiliza ADN como molde para producir ARN." },
      { answer: "TRADUCCION", clue: "Proceso mediante el cual el ribosoma utiliza el ARNm para formar una cadena de aminoácidos." }
    ]
  },

  ecologia: {
    title: "Ecología y evolución",
    entries: [
      { answer: "ECOSISTEMA", clue: "Conjunto de seres vivos y factores abióticos que interactúan en un lugar determinado." },
      { answer: "POBLACION", clue: "Individuos de una misma especie que habitan una zona determinada." },
      { answer: "COMUNIDAD", clue: "Conjunto de poblaciones de diferentes especies que interactúan." },
      { answer: "BIOTICO", clue: "Componente vivo de un ecosistema." },
      { answer: "ABIOTICO", clue: "Componente no vivo de un ecosistema, como temperatura, luz, agua o pH." },
      { answer: "HABITAT", clue: "Lugar donde vive un organismo." },
      { answer: "NICHO", clue: "Papel que desempeña una especie dentro de su ecosistema." },
      { answer: "PRODUCTOR", clue: "Organismo que produce materia orgánica a partir de sustancias inorgánicas, generalmente mediante fotosíntesis." },
      { answer: "CONSUMIDOR", clue: "Organismo que obtiene materia y energía alimentándose de otros organismos." },
      { answer: "DESCOMPONEDOR", clue: "Organismo que degrada materia orgánica y contribuye al reciclaje de nutrientes." },
      { answer: "ADAPTACION", clue: "Característica heredable que aumenta la aptitud de un organismo en un ambiente determinado." },
      { answer: "SELECCIONNATURAL", clue: "Proceso por el cual ciertas características heredables aumentan su frecuencia porque favorecen la supervivencia o reproducción en un ambiente determinado." }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PRESETS;
}
