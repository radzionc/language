import { order } from '@lib/utils/array/order'
import nlp from 'compromise'
import Three from 'compromise/types/view/three'

const getAdjective = (doc: Three) => {
  const adjective = doc.adjectives()
  const [adjectiveResult] = adjective.conjugate()
  if (adjectiveResult && 'Adjective' in adjectiveResult) {
    return adjectiveResult.Adjective as string
  }
}

const adverbAdjectiveSuffixes: Record<string, string> = {
  ibly: 'ible',
  ably: 'able',
  ally: 'al',
  ily: 'y',
  ly: '',
}

const adverbSuffixes = order(
  Object.keys(adverbAdjectiveSuffixes),
  (suffix) => suffix.length,
  'desc',
)

export const getWordBaseForm = (word: string): string => {
  const doc = nlp(`${word} to`)

  const singularForm = doc.nouns().toSingular().text()
  if (singularForm) {
    return singularForm
  }

  const baseForm = doc.verbs().toInfinitive().text()
  if (baseForm) {
    return baseForm.replace(' to', '')
  }

  const adjective = getAdjective(doc)
  if (adjective) {
    return adjective
  }

  const adverb = doc.adverbs().text()
  if (adverb) {
    const suffix = adverbSuffixes.find((suffix) => adverb.endsWith(suffix))
    if (suffix) {
      const replacement = adverbAdjectiveSuffixes[suffix]
      const adjective = getAdjective(
        nlp(adverb.slice(0, -suffix.length) + replacement),
      )
      if (adjective) {
        return adjective
      }
    }
  }

  return word
}
