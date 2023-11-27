import React, { useState, useRef, useEffect } from 'react';
import './Type.css';
import Button from '@mui/material/Button';
import CopyrightIcon from '@mui/icons-material/Copyright';
import script from './script';

// Word component without reassignment
const Word = React.memo(function Word(props) {
  const { text, active, correct } = props;

  const getClassName = () => {
    if (correct === true) {
      return 'correct';
    }
    if (correct === false) {
      return 'incorrect';
    }
    if (active) {
      return 'active';
    }
    // If the word is not active, set text color to white
    return 'inactive';
  };

  return <span className={getClassName()}>{text} </span>;
});

function Timer(props) {
  const { correctWords, startCount, resetTimer } = props; // Include resetTimer prop
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    let id;
    if (startCount) {
      id = setInterval(() => {
        // do the work
        setTimeTaken((oldTime) => oldTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCount]);

  useEffect(() => {
    // Reset the timer when startCount changes (Redo button is clicked)
    if (!startCount) {
      setTimeTaken(0);
    }
  }, [startCount]);

  const min = timeTaken / 60;

  return (
    <div className="counter">
      <div className="num">Time: {timeTaken}</div>
      <div className="stats">Speed: {((correctWords / min) || 0).toFixed(2)} WPM</div>
    </div>
  );
}

const Type = () => {
  const [input, setInput] = useState('');
  const para = useRef(script());

  const [startCount, setStartCount] = useState(false);
  const [active, setActive] = useState(0);
  const [correctWord, setCorrectWord] = useState([]);

  const checkInput = (value) => {
    if (!startCount) {
      setStartCount(true);
    }

    // validation and word count

    if (value.endsWith(' ')) {
      if (active === para.current.length - 1) {
        // overflow
        setStartCount(false);
        setInput('Completed');
        return;
      }

      setActive((index) => index + 1);
      setInput(' ');

      // correct word
      setCorrectWord((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[active] = word === para.current[active];
        return newResult;
      });
    } else {
      setInput(value);
    }
  };

  const resetState = () => {
    setInput('');
    setStartCount(false);
    setActive(0);
    setCorrectWord([]);
  };

  return (
    <div className="container">
      <div className="header">Turbo Tap</div>
      <div className="contentContainer">
        <Timer
          startCount={startCount}
          correctWords={correctWord.filter(Boolean).length}
          resetTimer={() => setInput(0)} // Pass a function to reset the timer
        />
        <div className="content">
          <p id="paragraph">
            {para.current.map((word, index) => (
              <Word key={index} text={word} active={index === active} correct={correctWord[index]} />
            ))}
          </p>
          <div className="text">
            <input type="text" value={input} onChange={(e) => checkInput(e.target.value)} />
            <Button variant="contained" className="redo" onClick={resetState}>
              Redo
            </Button>
          </div>
        </div>
      </div>
      <div className="footer">
        <CopyrightIcon className="copy" />CODED BY AKHIL ALLE
      </div>
    </div>
  );
};

export default Type;
