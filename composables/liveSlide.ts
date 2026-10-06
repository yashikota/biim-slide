import type { MaybeRef } from 'vue'
import { computed, unref } from 'vue'
import { useNav } from '@slidev/client'
import { useDynamicSlideInfo } from '@slidev/client/composables/useSlideInfo.ts'

// 開発中は、Slidev が dev サーバーから最新のスライド情報(タイトル・ノート)を取得し、HMR でも更新される。
// route.meta はサーバー起動時の内容のままで、書き換えてもリロードしないと変わらない。
// 本番ビルドでは useDynamicSlideInfo が route.meta をそのまま返す。

export interface Comment {
  /** このコメントが出るクリック番号(0 始まり) */
  click: number
  text: string
}

/**
 * ノート(<!-- --> のコメント)を 1 行 1 コメントに分ける(空行は無視)。
 * 行頭の印でどのクリックで出すかを指定できる:
 *   [click]     直前のコメントの次のクリック(印なしの行と同じ)
 *   [click:N]   N クリック目
 *   [click+N]   直前のコメントから N クリック後
 * 印のない行は、直前のコメントの次のクリック(最初の行は 0 クリック目)。
 */
export function parseComments(note: string | undefined | null): Comment[] {
  const comments: Comment[] = []
  let prev = -1
  for (const raw of (note ?? '').split('\n')) {
    const line = raw.trim()
    if (!line)
      continue
    const m = line.match(/^\[click(?::(\d+)|\+(\d+))?\]\s*/)
    const click = m?.[1] != null
      ? Number(m[1])
      : m?.[2] != null
        ? prev + Number(m[2])
        : prev + 1
    comments.push({ click: Math.max(click, 0), text: m ? line.slice(m[0].length) : line })
    prev = Math.max(click, 0)
  }
  return comments
}

/** 指定したクリック時点で表示するコメント(その時点までで最後に出たもの) */
export function commentAt(comments: Comment[], click: number) {
  let current = ''
  for (const c of comments) {
    if (c.click <= click)
      current = c.text
  }
  return current
}

export function useLiveSlide(no: MaybeRef<number>) {
  const { slides } = useNav()
  const { info } = useDynamicSlideInfo(no)
  const meta = computed(() => slides.value[unref(no) - 1]?.meta?.slide)
  const title = computed(() => info.value?.title ?? meta.value?.title ?? '')
  const frontmatter = computed<Record<string, any>>(() => info.value?.frontmatter ?? meta.value?.frontmatter ?? {})
  const comments = computed(() => parseComments(info.value ? info.value.note : meta.value?.note))
  return { title, comments, frontmatter }
}
