import { useState, useEffect, useMemo, useCallback, useContext, createContext, ReactNode } from 'react'
import  BODY_PARTS  from '../utils/body';

interface WordProviderProps {
  children: ReactNode
};

export interface IWordContext {
    word: string;
    numOfIncorrectGuess: number;
    hasFoundWinner: boolean;
    isGameOver: boolean;
    guessedLetters: Set<string>;
    correctLetters: Set<string>;
    incorrectLetters: Set<string>;
    handleGuessedLetterAdd: (letters: string) => void;
    handleNextButtonClick: () => void;
};

const API_ENDPOINT:string = 'https://random-word-api.vercel.app/api?words=1';
const WordContext = createContext<IWordContext | null>(null);


const useWordContext = () => {
  const context = useContext(WordContext);
  if (context === null) {
    throw new Error('useWordContext must be used within a WordProvider');
  }
  return context;
};


const WordProvider = ({ children }: WordProviderProps) => {
  const [word, setWord] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  
  const [correctLetters, incorrectLetters, isGameOver] = useMemo<[Set<string>, Set<string>, boolean]>(() => {
    const wordSet = new Set<string>(word);
    const correctLetters = new Set<string>();
    const incorrectLetters = new Set<string>();

    for (const guessLetter of guessedLetters) {
      if (wordSet.has(guessLetter)) {
        correctLetters.add(guessLetter);
      } else {
        incorrectLetters.add(guessLetter);
      }
    }
    // Once the incorrectness guess is more than 5 times, game over
    const isGameOver = incorrectLetters.size >= BODY_PARTS.length; 
    
    return [correctLetters, incorrectLetters, isGameOver];
  }, [guessedLetters]);


  const setRandomWord = async (): Promise<void> => {
    try {
      const res = await fetch(API_ENDPOINT);
      if (!res.ok) {
        throw new Error('Invalid Https request');
      }
      const data = await res.json();
      const [word] = data;

      setWord(word);

    } catch (error: any) {
      throw new Error(error);
    };
  };

  const hasFoundWinner = useMemo<boolean>(() => {
    if (word === '') {
      return false;
    }
    
    for (let letter of word) {
      if (!guessedLetters.has(letter)) {
        return false;
      }
    }
    return true;
  }, [guessedLetters]);


  const handleGuessedLetterAdd = useCallback((letter: string): void => {
    if (guessedLetters.has(letter) || isGameOver || hasFoundWinner) {
      return;
    }
    setGuessedLetters((prevGuessedLetters) => {
      return new Set([...prevGuessedLetters, letter]);
    })
    
  }, [guessedLetters, isGameOver, hasFoundWinner]);


  useEffect(() => {
    setRandomWord();
  }, [])


  // Handle Key(letters) Press  Event
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { key } = e;
      // only a to z is valid
      if (!key.match(/^[a-z]$/) && !key.match(/^[A-Z]$/)) {
        return;
      }

      handleGuessedLetterAdd(key.toLowerCase());
    }

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    }
  }, [guessedLetters]);


  // Handle Key(Enter) Press Event - get new word to start new game
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { key } = e;
      if (key !== 'Enter') {
        return;
      };

      setRandomWord();
      setGuessedLetters(new Set());
    }

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    }
  }, [])


  const handleNextButtonClick = (): void => {
    setRandomWord();
    setGuessedLetters(new Set());
  };

  const value: IWordContext = {
    word,
    numOfIncorrectGuess: incorrectLetters.size,
    hasFoundWinner,
    isGameOver,
    guessedLetters,
    correctLetters,
    incorrectLetters,
    handleGuessedLetterAdd,
    handleNextButtonClick
  };

  return (
    <WordContext.Provider value={value}>
      {children}
    </WordContext.Provider>
  )
}

export { useWordContext, WordProvider };
