"use client";
import { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidScript() {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  return null; // No renderiza nada, solo ejecuta Mermaid en el cliente
}
