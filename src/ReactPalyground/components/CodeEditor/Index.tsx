import FileNameList from './FileNameList/Index'
import Editor from './Editor';
import { useContext } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';
import { debounce } from 'lodash-es';
const CodeEditor = () => {
  const { files, setFiles, selectedFileName, theme } = useContext(PlaygroundContext)

  const file = files[selectedFileName]
  function onEditorChange(value?: string) {
    if (!value) {
      return;
    }
    files[file.name].value = value;
    setFiles({ ...files })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'visible' }}>
      <FileNameList />
      <Editor file={file} onChange={debounce(onEditorChange, 1000)} options={{
        theme: `vs-${theme}`
      }} />
    </div>
  )
}

export default CodeEditor
