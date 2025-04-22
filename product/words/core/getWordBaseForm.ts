import nlp from 'compromise'
import Three from 'compromise/types/view/three'

const getAdjective = (doc: Three) => {
  const adjective = doc.adjectives()
  const [adjectiveResult] = adjective.conjugate()
  if (adjectiveResult && 'Adjective' in adjectiveResult) {
    return adjectiveResult.Adjective as string
  }
}

export const getWordBaseForm = (word: string): string => {
  const doc = nlp(`${word} to`)

  const singularForm = doc.nouns().toSingular().text()
  if (singularForm && singularForm !== word) {
    return singularForm
  }

  const baseForm = doc.verbs().toInfinitive().text()
  if (baseForm && baseForm !== word) {
    return baseForm
  }

  const adjective = getAdjective(doc)
  if (adjective) {
    return adjective
  }

  const adverb = doc.adverbs().text()
  if (adverb) {
    if (adverb.endsWith('ibly')) {
      const adjective = getAdjective(nlp(adverb.slice(0, -4) + 'ible'))
      if (adjective) {
        return adjective
      }
    }
  }

  console.log('Unknown word', word)

  return word
}
