import { definePreparserSetup } from '@slidev/types'

// 本番ビルドでは、スライドの生のノート(note)が捨てられ、HTML にしたもの(noteHTML)だけが残る。
// セリフ欄は生のノートを 1 行ずつ読むので、frontmatter の biimNote に写しておく(frontmatter はビルド後も残る)。
export default definePreparserSetup(() => [
  {
    async transformNote(note, frontmatter) {
      if (note)
        frontmatter.biimNote = note
      return note
    },
  },
])
