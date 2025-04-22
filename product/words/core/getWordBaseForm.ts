import nlp from 'compromise'

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

  const adjective = doc.adjectives()

  const [adjectiveResult] = adjective.conjugate()
  if (adjectiveResult && 'Adjective' in adjectiveResult) {
    return adjectiveResult.Adjective as string
  }

  return word
}
