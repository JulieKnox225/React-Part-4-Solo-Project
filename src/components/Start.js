import React from "react"

export default function Start(props) {
    return (
        <div className="startPage">
            <h1>Quizzical</h1>
            <button onClick={props.startGame}>Start Quiz</button>
        </div>
    )
}