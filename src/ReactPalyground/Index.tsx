import ReactPlayground from './ReactPlayground'
import { PlaygroundProvider } from './components/PlaygroundContext'

const Index = () => {
  return (
    <PlaygroundProvider>
      <ReactPlayground />
    </PlaygroundProvider>
  )
}

export default Index
