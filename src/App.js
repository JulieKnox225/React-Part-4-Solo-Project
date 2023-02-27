import React from "react"
import { nanoid } from 'nanoid'
import Game from "./components/Game"
import Start from "./components/Start"

export default function App() {

    /* STATES */
    const [start, setStart] = React.useState(false);
    const [finished, setFinished] = React.useState(false);
    const [questions, setQuestions] = React.useState([]);
    
    /* USE EFFECTS */
    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(res => res.json())
        .then(data => helpSetQuestions(data.results))
    }, [start]);
    
    /* FUNCTIONS */
    /**
     * helper function to set state: questions
     * creates an array from the data returned from fetch:
     *  >- each question is an object the contains:
     *  >>- id
     *  >>- question 
     *  >>- array of answers
     *  >>>- each answer is an oject that contains:
     *  >>>>- id
     *  >>>>- answer
     *  >>>>- if correct boolean
     *  >>>>- if clicked boolean 
     * @param {object} results 
     */
    function helpSetQuestions(results) {
        const newArr = results.map(element => 
        {
            return {
                id: nanoid(),
                question: element.question,
                answers: [
                    {
                        id: nanoid(),
                        answer: element['correct_answer'],
                        correct: true,
                        isClicked: false
                    },
                    {
                        id: nanoid(),
                        answer: element['incorrect_answers'][0],
                        correct: false,
                        isClicked: false
                    },
                    {
                        id: nanoid(),
                        answer: element['incorrect_answers'][1],
                        correct: false,
                        isClicked: false
                    },
                    {
                        id: nanoid(),
                        answer: element['incorrect_answers'][2],
                        correct: false,
                        isClicked: false
                    }              
                ]
            }
        });
        setQuestions(newArr);
    }

    /**
     * Warning: very inefficient and, I think, buggy
     * toggles the correct answer's isClicked boolean
     * @param {string} questionId 
     * @param {string} answerId 
     */
    function handleClick(questionId, answerId) {
        //only runs if the game isn't finished
        if(!finished) {
            const newArr = questions;
            let question;

            //looks through the entire state: questions
            for(let i = 0; i < questions.length; i++) {
                //looks at each index of the answer array in each question in state: questions
                for(let j = 0; j < questions[i].answers.length; j++) {
                    //toggles whichever answer is already clicked
                    if(questions[i].answers[j].isClicked) {
                        newArr[i].answers[j].isClicked = !newArr[i].answers[j].isClicked;
                    }
                }
            }
            
            //looks for the state: question with the same id as the one sent in then toggles the answer that was clicked
            for(let i = 0; i < questions.length; i++) {
                if(questions[i].id === questionId) {
                    question = questions[i];
                    const index = question.answers.indexOf(question.answers.find(elem => elem.id === answerId));
                    newArr[i].answers[index].isClicked = !newArr[i].answers[index].isClicked;
                }
            }
            setQuestions(newArr);
        
            console.log('click'); //Debugging 
        }
    }
    
    const gameElems = questions.map(question => {
        return <Game 
                    key={question.id} 
                    question={question.question} 
                    questionId = {question.id} 
                    answers={question.answers} 
                    handleClick={handleClick}
                    start={start}
                />
    });

    //Start component will eventually only be rendered before the game starts  
    return (
        <main>
            <Start />  
            {gameElems}
        </main>
    );
}