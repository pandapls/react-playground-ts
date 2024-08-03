import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { PlaygroundContext } from "../PlaygroundContext"
import CompilerWorker from "./compiler.worker?worker";
import Message from '../Message/Index'
import iframeRaw from './iframe.html?raw';
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { COMPILER_WORKER_SYM } from "./compiler.worker";
import { debounce } from "lodash-es";
interface MessageData {
  data: {
    type: string
    message: string
  }
}
const Preview = () => {
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState('');
  const compilerWorkerRef = useRef<Worker>();
  useEffect(() => {
    if (!compilerWorkerRef.current) {
      compilerWorkerRef.current = new CompilerWorker();
      compilerWorkerRef.current.addEventListener('message', ({ data }) => {
        if (data.type === COMPILER_WORKER_SYM) {
          setCompiledCode(data.data);
        } else {
        }
      })
    }
  }, [])
  useEffect(debounce(() => {
    compilerWorkerRef.current?.postMessage(files);
  }, 500), [files])

  const getIframeUrl = () => {
    const res = iframeRaw.replace(
      '<script type="importmap"></script>',
      `<script type="importmap">
        ${files[IMPORT_MAP_FILE_NAME].value}
      </script>`
    ).replace(
      '<script type="module" id="appSrc"></script>',
      `<script type="module" id="appSrc">${compiledCode}</script>`
    )

    return URL.createObjectURL(new Blob([res], { type: 'text/html' }))
  }
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode])

  const [error, setError] = useState('');
  const handleMessage = useCallback((msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === 'ERROR' && message) {
      setError(message);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage])

  return (
    <div style={{ height: '100%' }}>
      <iframe src={iframeUrl} style={{ width: '100%', height: '100%', padding: 0, border: 'none' }} />
      <Message type="error" content={error} />
    </div>
  )
}

export default Preview
