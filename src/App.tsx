import { FC } from 'react';

import Container from './components/Container';
import Drawing from './components/Drawing';
import Word from './components/Word';
import Keyboard from './components/Keyboard';
import Message from './components/Message';
import { WordProvider } from './context/useWordContext';

import './App.css'


const App: FC = () => {
  return (
    <WordProvider>
      <Container>
        <Drawing />
        <Word />
        <Keyboard />
        <Message />
      </Container>
    </WordProvider>
  )
}

export default App;

