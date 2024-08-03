import MonacoEditor, { EditorProps, OnMount } from '@monaco-editor/react'
import { createATA } from './ata'
import { editor } from 'monaco-editor'
export interface EditorFile {
  name: string
  value: string
  language: string
}

interface Props {
  file: EditorFile,
  onChange?: EditorProps['onChange'],
  options?: editor.IStandaloneDiffEditorConstructionOptions
}

const Editor = (props: Props) => {
  const { file, onChange, options } = props;

  const handleEditorMount: OnMount = (editor, monaco) => {
    if (options?.theme) {
      monaco.editor.setTheme(options.theme);
    }
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true
    })

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
    })

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue())
    })

    ata(editor.getValue())
  }

  return (
    <MonacoEditor
      height='100%'
      path={file.name}
      language={file.language}
      onMount={handleEditorMount}
      onChange={onChange}
      value={file.value}
      options={
        {
          fontSize: 14,
          // 是否到最后一行依然可以滚动
          scrollBeyondLastLine: false,
          // 缩略图开关
          minimap: {
            enabled: false,
          },
          // 横向纵向滚动条宽度
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6
          },
          ...options
        }
      }
    />
  )
}

export default Editor
