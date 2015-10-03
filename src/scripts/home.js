import Gena from "./gena"

window.ga = new Gena({
  geneLength: 15,
  mutateProbability: 0.5,
  doneFitness: 1,
  populationSize: 20,
  generationsSize: 150,
  getFitness: function(gene) {
    var tar = 111111111100011
    return 1 - Math.abs(+gene - tar) / tar
  },
  done: function(gene) {
    console.log("Get Result:", gene)
  },
  onGeneration: function(generation, genes) {
    console.log(generation, genes)
  },
  outOfGenerationsSize: function(generations, fitnesses) {
    console.log(generations, fitnesses)
  }
})

ga.start()
