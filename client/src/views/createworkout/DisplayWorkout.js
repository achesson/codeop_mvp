import React from "react";
import './DisplayWorkout.css';

function DisplayWorkout(props) {
  let circuits = props.circuits;
  

    return (
      <div className="DisplayWorkout">
          <h3> 2. Add Workout to Library </h3>
        { circuits.map(c=> 
        <h2 key={c.circuitName}>{c.circuitName}
          {c.exercises.map(e => <p key={e.exerciseName}>
            {e.exerciseName} {' '} {e.timeOn} {':'} {e.timeOff}
          </p>)}
        
        </h2>)
         

        }
             
          <ul >
         
          </ul>
               

  
      </div>
    );
  }
  
  export default DisplayWorkout;