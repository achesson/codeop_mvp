import React from "react";
import './DisplayCurrentCircuit.css';

function DisplayCurrentCircuit(props) {
    let e = props.exercises;


    return (
      <div className="DisplayCurrentCircuit">
          <h3>Current circuit: {props.circuitNames[props.circuitNamesIX]}</h3>
          <ul >
            {e.map(x => <h3 key={x.exerciseName}>{x.exerciseName} {' '} {x.timeOn}</h3>)}
          </ul>
  
      </div>
    );
  }
  
  export default DisplayCurrentCircuit;