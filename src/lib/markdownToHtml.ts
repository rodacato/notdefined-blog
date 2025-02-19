import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { remarkMermaid } from './remark-mermaid'
import rehypeHighlight from 'rehype-highlight'
import rehypeHighlightCodeLines from 'rehype-highlight-code-lines'

export default async function markdownToHtml (markdown: string) {
  const result = await unified()
    .use(remarkParse) // Parse markdown string into markdown AST (Abstract Syntax Tree)
    .use(remarkMermaid) // Convert Mermaid diagram code blocks into HTML divs
    .use(remarkRehype, { // Transform markdown AST into HTML AST
      allowDangerousHtml: true
    })
    .use(rehypeHighlight) // Add syntax highlighting to code blocks
    .use(rehypeHighlightCodeLines, { // Add line numbers to highlighted code blocks
      showLineNumbers: true,
      lineContainerTagName: 'div'
    })
    .use(rehypeStringify, { allowDangerousHtml: true }) // Convert final HTML AST back to string
    .process(markdown)

  return result.toString()
}
