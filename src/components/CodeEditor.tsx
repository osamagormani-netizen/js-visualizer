"use client";

import { useTheme } from "next-themes";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useEffect, useState, useRef, useCallback } from "react";

interface CodeEditorProps {
  code: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  highlightLines?: number[];
}

export function CodeEditor({ code, onChange, readOnly = false, highlightLines = [] }: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationsRef = useRef<string[]>([]);

  useEffect(() => setMounted(true), []);

  const updateDecorations = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const newDecorations = highlightLines.map((line) => ({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'highlighted-line',
      },
    }));

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [highlightLines]);

  useEffect(() => {
    updateDecorations();
  }, [updateDecorations]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    updateDecorations();
  };

  if (!mounted) {
    return (
      <div className="h-full w-full bg-card border border-card-border rounded-lg flex items-center justify-center text-muted text-sm">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-card-border">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => onChange?.(value ?? "")}
        theme={theme === "dark" ? "vs-dark" : "light"}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "var(--font-geist-mono), 'Fira Code', monospace",
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          readOnly,
          wordWrap: "on",
          tabSize: 2,
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: readOnly ? "none" : "line",
          domReadOnly: readOnly,
        }}
      />
    </div>
  );
}
