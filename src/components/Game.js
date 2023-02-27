import React from "react"
import { decode } from "html-entities"

/**
 * - Problems:
 *  >- answers rearrange themselves when clicked sometimes
 *      >>- randomizeAnswers() is not being called so I'm not sure why it is doing that?
 * - Props:
 *  >- key={question.id} 
 *  >- question={question.question} 
 *  >- questionId = {question.id} 
 *  >- answers={question.answers} 
 *  >- handleClick={handleClick}
 *  >- start={start}
 */

export default function Game(props) {
    console.log('game'); //Debugging 
    
    /* STATES */
    const [randomizeAnswersArr, setRandomizeAnswersArr] = React.useState(() => randomizeAnswers());

    const [answerElems, setAnswerElems] = React.useState(() => randomizeAnswersArr.map((answer, index) => {
        return (
            <div 
                key={answer.id} 
                className="answer" 
                onClick={() => {
                    props.handleClick(props.questionId, answer.id);
                    updateClick();
                }}
            >
                <p>{decode(answer.answer)}</p>
            </div>
        )
    }));

    /* USE EFFECTS */
    
    React.useEffect(() => {
        setRandomizeAnswersArr(randomizeAnswers());
    }, [props.start]);
    
    /* FUNCTIONS */
    
    /**
     * @returns copy of props.answers with the correct answer 'shuffled' in
     */
    function randomizeAnswers() {
        console.log('randomizeAnswers'); //Debugging 

        //pick a random index for the correct answer to go
        let ranNum = Math.floor(Math.random() * 4); 

        //make a copy of props.answer to edit
        const newArr = props.answers;

        //remove the correct answer
        const correct = newArr.shift();

        //add the correct answer back in a random spot
        newArr.splice(ranNum, 0, correct);
        
        return newArr;
    }

    /**
     * Warning: buggy (I think)
     * helper function since App's handle click does not update the appearance (for some reason?)
     * replaces state with the same JSX elements but checks for if clicked or not and updates className accordingly
     */
    function updateClick() {
        console.log('run'); //Debugging 

        setAnswerElems(randomizeAnswersArr.map(answer => {
            return (
                <div 
                    key={answer.id} 
                    className={answer.isClicked ? "clicked" : "answer" }
                    onClick={() => {
                        props.handleClick(props.questionId, answer.id);
                        updateClick();
                    }}
                >
                    <p>{decode(answer.answer)}</p>
                </div>
            )
        }));
    };
    
    
    return (
        <div>
            <p className="game--question">{decode(props.question)}</p>
            <div className="answers">
               {answerElems}
            </div>
            <hr/>
        </div>
    );
}
