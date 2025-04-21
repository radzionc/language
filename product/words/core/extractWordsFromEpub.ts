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
        // Base case: all chapters processed
        if (chapterIndex >= chapters.length) {
          resolve(wordSet)
          return
        }

        // Process current chapter
        const chapter = chapters[chapterIndex]
        epub.getChapter(chapter.id, (error: Error | null, text: string) => {
          if (error) {
            reject(error)
            return
          }

          // Extract words from text
          const strippedText = text.replace(/<[^>]*>/g, ' ') // Strip HTML tags

          // Split text into sentences to handle capitalization
          const sentences = strippedText.split(/[.!?]+/)

          sentences.forEach((sentence) => {
            const words = sentence
              .replace(/[^\w\s-]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .split(' ')
              .filter((word) => word.length > 0)
              .filter((word) => !/\d/.test(word))

            // Process each word in the sentence
            if (words.length > 0) {
              // Add first word (lowercase) if it exists
              const firstWord = words[0].toLowerCase()
              if (firstWord.length > 0) {
                wordSet.add(firstWord)
              }

              // For remaining words, skip words that start with uppercase (likely names)
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

      // Start processing from the first chapter
      processChapter(0)
    })

    epub.on('error', (error: Error) => {
      reject(error)
    })

    // Start parsing the epub
    epub.parse()
  })
}
