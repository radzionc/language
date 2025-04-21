# Language Tools Monorepo

A collection of tools and utilities for language learning and processing.

## Projects

### Words Extractor

A tool that extracts unique words from EPUB books to aid vocabulary learning.

**Features:**
- Extracts words from EPUB files
- Filters out short words, known words, and misspellings
- Converts words to their base form
- Outputs a clean list of unique words

**Usage:**
1. Place an EPUB file as `input.epub` in the `product/words` directory
2. Add known words to `ignore_words.txt`
3. Run the script
4. Get your word list in `output.txt`

```bash
# Install dependencies
yarn

# Navigate to the words project
cd product/words

# Run the tool
yarn start
```

Designed for language learners who listen to audiobooks and want to enhance their vocabulary.
