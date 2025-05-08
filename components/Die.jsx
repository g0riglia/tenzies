import dieOne from "./DiceFaces/one.png"
import dieTwo from "./DiceFaces/two.png"
import dieThree from "./DiceFaces/three.png"
import dieFour from "./DiceFaces/four.png"
import dieFive from "./DiceFaces/five.png"
import dieSix from "./DiceFaces/six.png"

export default function Die(props) {
    const dieArr = [dieOne, dieTwo, dieThree, dieFour, dieFive, dieSix]

    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
        backgroundImage: `url("${dieArr[props.value - 1]}")`,
        backgroundSize: "cover"
    }
    
    return (
        <button 
            style={styles}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, 
            ${props.isHeld ? "held" : "not held"}`}
        ></button>
    )
}