
import axios from 'axios';

export const fetchQuestions = async () => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
        const questions = response.data.results.map((item) => ({
            question: item.question,
            choices: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
            answer: item.correct_answer,
        }));
        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
};
