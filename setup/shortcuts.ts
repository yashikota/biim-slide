import { defineShortcutsSetup } from '@slidev/types'

export default defineShortcutsSetup((nav, base) => [
  ...base,
  // Home で最初のページ(クリックも 0 に戻す)
  { name: 'first_page', key: 'home', fn: () => nav.go(1, 0) },
])
