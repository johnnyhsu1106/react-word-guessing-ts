import { useMemo } from 'react'
import { useWordContext, IWordContext } from '../context/useWordContext';

const Keyboard = () => {
  const {
    correctLetters,
    incorrectLetters,
    hasFoundWinner,
    isGameOver,
    handleGuessedLetterAdd
  }: IWordContext = useWordContext();
  
  const isDisabled = hasFoundWinner || isGameOver;

  // Generate Keys from 'a' to 'z', only generated once.
  const keys = useMemo(() => {
    const keys = [];
    for (let i = 0; i < 26; i++) {
      keys.push(String.fromCharCode('a'.charCodeAt(0) + i))
    }
    return keys;
  }, []);

  return (
    <div className='keyboard-container'>
      <div className='keyboard'>
        {keys.map((key) => {
          const isActive = correctLetters.has(key);
          const isInactive = incorrectLetters.has(key);
          const btnClassName = `key ${isActive ? 'active' : ''} ${isInactive ? 'inactive' : ''}`;
          return (
            <button
              className={btnClassName} 
              key={key}
              disabled={isActive || isInactive || isDisabled} 
              onClick={() => { handleGuessedLetterAdd(key) }}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Keyboard