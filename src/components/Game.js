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
 *  >- finished={finished}
 */

export default function Game(props) {
    console.log('game'); //Debugging 

    
    /* STATES */
    const [randomizeAnswersArr, setRandomizeAnswersArr] = React.useState(() => randomizeAnswers());

    const [answerElems, setAnswerElems] = React.useState(() => randomizeAnswersArr.map((answer, index) => {
        return (
            <div 
                key={answer.id} 
                className="game--answer" 
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
    
    /**
     * if (props.finished) ? display the correct answers and incorrectly clicked answers
     */
    React.useEffect(() => {
        if(props.finished) {
            setAnswerElems(randomizeAnswersArr.map(answer => {
                return (
                    <div 
                        key={answer.id} 
                        className={
                            (answer.isClicked && answer.correct === false) 
                                ? 'game--incorrect'
                            : (answer.correct) 
                                ? 'game--correct'
                            : 'game--answer'
                            }
                        onClick={() => {
                            props.handleClick(props.questionId, answer.id);
                            updateClick();
                        }}
                        >
                        <p>{decode(answer.answer)}</p>
                    </div>
                )
            }));
        }
    }, [props.finished]);
    
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
       if(!props.finished) {
           setAnswerElems(randomizeAnswersArr.map(answer => {
                //console.log(answer.isClicked, answer.correct); //Debugging 
                return (
                    <div 
                        key={answer.id} 
                        className={answer.isClicked ? "game--clicked" : "game--answer" }
                        onClick={() => {
                            props.handleClick(props.questionId, answer.id);
                            updateClick();
                        }}
                        >
                        <p>{decode(answer.answer)}</p>
                    </div>
                )
            }));
       }
    };
    
    
    return (
        <div>
            <h5 className="game--question">{decode(props.question)}</h5>
            <div className="game--answers">
               {answerElems}
            </div>
            <hr/>
        </div>
    );
}