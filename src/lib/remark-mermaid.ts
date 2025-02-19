import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

interface CodeNode extends Node {
  type: string
  lang?: string
  value: string
}

export function remarkMermaid(): Plugin {
  return (tree: Node) => {
    visit(tree, 'code', (node: CodeNode) => {
      if (node.lang === 'mermaid') {
        node.type = 'html'
        node.value = `<div class="mermaid">${node.value}</div>`
      }
    })
  }
}
