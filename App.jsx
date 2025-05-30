import { useState, useRef, useEffect } from "react"
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [rolls, setRolls] = useState(0)
    const [timer, setTimer] = useState(0)
    const [currentScore, setCurrentScore] = useState(() => {
        const bestScoreStr = localStorage.getItem("bestScore")
        return bestScoreStr ? JSON.parse(bestScoreStr) : null
    })

    const buttonRef = useRef(null)
    const intervalRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
            clearInterval(intervalRef.current)
            updateBestScore()
        }
    }, [gameWon])

    useEffect(() => {
        if (rolls !== 1) {
            return
        }
        
        intervalRef.current = setInterval(() => {
            setTimer(prev => prev + 1)
        }, 1000)
    }, [rolls])


    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
            setRolls(prev => prev + 1)
        } else {
            setDice(generateAllNewDice())
            setRolls(0)
            setTimer(0)
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }
    
    function updateBestScore() {
        const thisGameScore = { rolls, time: timer }
        const bestScoreStr = localStorage.getItem("bestScore")
        const bestScore = bestScoreStr ? JSON.parse(bestScoreStr) : null

        if (
            !bestScore ||
            thisGameScore.time < bestScore.time
        ) {
            localStorage.setItem("bestScore", JSON.stringify(thisGameScore))
            setCurrentScore(thisGameScore)
        }
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <div className="score">
                {rolls > 0 ? <p><i className="fa-solid fa-dice"></i> Rolls: {rolls}</p> : null}
                {rolls > 0 ? <p><i className="fa-regular fa-clock"></i> Time: {timer > 60 ? `01:${timer - 60}` : `00:${timer}`}</p> : null}
            </div>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
            {currentScore ? <p>🏆 Best Score: Time: {currentScore.time > 60 ? `01:${currentScore.time - 60}` : `00:${currentScore.time}`} Rolls: {currentScore.rolls}</p> : null}
        </main>
    )
}