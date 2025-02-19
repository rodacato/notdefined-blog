import { visit } from 'unist-util-visit';
import { Plugin } from 'unified';
import { Node } from 'unist';

interface CodeNode extends Node {
  type: string;
  lang?: string;
  value: string;
}

export const remarkMermaid: Plugin = () => {
  return (tree: Node, file) => { 
    visit(tree, 'code', (node: CodeNode) => {
      if (node.lang === 'mermaid') {
        node.type = 'html';
        node.value = `<div class="mermaid">${node.value}</div>`;
      }
    });
  };
};
