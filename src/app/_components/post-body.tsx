import markdownStyles from './markdown-styles.module.css'
import MermaidScript from './mermaid-script'

type Props = {
  content: string
}

export function PostBody ({ content }: Props) {
  return (
    <div className='max-w-2xl mx-auto'>
      <MermaidScript />
      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
