import { Allotment } from "allotment";
import 'allotment/dist/style.css'
import Header from "./components/Header/Index";
import CodeEditor from "./components/CodeEditor/Index";
import Preview from "./components/Preview/Index";
import './index.scss';
import { useContext } from "react";
import { PlaygroundContext } from "./components/PlaygroundContext";

const ReactPlayground = () => {
  const { theme } = useContext(PlaygroundContext);
  return <div className={theme} style={{ height: '100vh' }}>
    <Header />
    <Allotment defaultSizes={[100, 100]}>
      <Allotment.Pane minSize={500}>
        <CodeEditor />
      </Allotment.Pane>
      <Allotment.Pane minSize={0}>
        <Preview />
      </Allotment.Pane>
    </Allotment>
  </div>
}

export default ReactPlayground;