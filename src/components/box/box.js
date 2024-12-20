
'use client'
import { useEffect, useRef, useState } from 'react';
import { fetchQuestions } from '@/utils/fetchquestion';
import './box.css';
import Image from 'next/image';
import Logo from '@/img/Logo.png';


export default function Home() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState('');
    const [quizOver, setQuizOver] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [timer, setTimer] = useState(15);

    const correctSoundRef = useRef(null);
    const incorrectSoundRef = useRef(null);


    useEffect(() => {
        correctSoundRef.current = new Audio('/assets/correct.mp3');
        incorrectSoundRef.current = new Audio('/assets/incorrect.mp3');

        correctSoundRef.current.addEventListener('canplaythrough', () => console.log('Correct sound ready'));
        incorrectSoundRef.current.addEventListener('canplaythrough', () => console.log('Incorrect sound ready'));

        correctSoundRef.current.onerror = () => console.error('Failed to load correct.mp3');
        incorrectSoundRef.current.onerror = () => console.error('Failed to load incorrect.mp3');
    }, []);




    useEffect(() => {
        (async () => {
            const fetchedQuestions = await fetchQuestions();
            setQuestions(fetchedQuestions);
        })();
    }, []);

    useEffect(() => {
        if (timer === 0) {
            handleNext();
        }

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleChoiceSelect = (choice) => {
        setSelectedChoice(choice);

        if (choice === questions[currentIndex].answer) {
            setFeedback({ [choice]: 'correct' });
            correctSoundRef.current?.play();
        } else {
            setFeedback({ [choice]: 'incorrect', [questions[currentIndex].answer]: 'correct' });
            incorrectSoundRef.current?.play();
        }
    };

    const handleNext = () => {
        if (selectedChoice === questions[currentIndex].answer) {
            setScore(score + 1);
        }

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedChoice('');
            setFeedback({});
            setTimer(30);
        } else {
            setQuizOver(true);
        }
    };

    const resetQuiz = async () => {
        setQuizOver(false);
        setScore(0);
        setCurrentIndex(0);
        setSelectedChoice('');
        setFeedback({});
        setTimer(30);
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
    };

    if (questions.length === 0) return <div className='lod'>Loading....</div>;

    return (
        <div className="container">
            {!quizOver ? (
                <>
                    <Image src={Logo} alt="Quiz Logo" width={100} height={100} />
                    {/* <Image src="/assets/Logo.png" alt="Logo" width={200} height={100} /> */}
                    <p className="question">{questions[currentIndex].question}</p>
                    <div className="timer">Time Left: {timer}s</div>
                    <div className="choices">
                        {questions[currentIndex].choices.map((choice, index) => (
                            <button
                                key={index}
                                className={`choice ${feedback[choice] || ''}`}
                                onClick={() => handleChoiceSelect(choice)}
                                disabled={!!feedback[choice]}
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                    <button className="btn" onClick={handleNext} disabled={!selectedChoice}>
                        {currentIndex + 1 === questions.length ? 'Finish' : 'Next'}
                    </button>
                </>
            ) : (
                <div className="scoreCard">
                    <h2>Quiz Over</h2>
                    <p>
                        You scored {score} out of {questions.length}
                    </p>
                    <button className="btn" onClick={resetQuiz}>
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}


