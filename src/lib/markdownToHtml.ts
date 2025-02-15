import { unified } from 'unified'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeHighlightCodeLines from 'rehype-highlight-code-lines'

export default async function markdownToHtml (markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeHighlight)
    .use(rehypeHighlightCodeLines, {
      showLineNumbers: true,
      lineContainerTagName: 'div'
    })
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}
