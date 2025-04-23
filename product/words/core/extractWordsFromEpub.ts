import EPub from 'epub'

export const extractWordsFromEpub = async (
  filePath: string,
): Promise<Set<string>> => {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath)
    const wordSet = new Set<string>()

    epub.on('end', () => {
      const chapters = [...epub.flow]

      const processChapter = (chapterIndex: number) => {
        if (chapterIndex >= chapters.length) {
          resolve(wordSet)
          return
        }

        const chapter = chapters[chapterIndex]
        epub.getChapter(chapter.id, (error: Error | null, text: string) => {
          if (error) {
            reject(error)
            return
          }

          const strippedText = text.replace(/<[^>]*>/g, ' ')

          const sentences = strippedText.split(/[.!?]+/)

          sentences.forEach((sentence) => {
            const words = sentence
              .replace(/[^\w\s-]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .split(' ')
              .filter((word) => word.length > 0)
              .filter((word) => !/\d/.test(word))

            if (words.length > 0) {
              const firstWord = words[0].toLowerCase()
              if (firstWord.length > 0) {
                wordSet.add(firstWord)
              }

              words.slice(1).forEach((word) => {
                if (word.length > 0 && !/^[A-Z]/.test(word)) {
                  wordSet.add(word.toLowerCase())
                }
              })
            }
          })

          processChapter(chapterIndex + 1)
        })
      }

      processChapter(0)
    })

    epub.on('error', (error: Error) => {
      reject(error)
    })

    epub.parse()
  })
}
