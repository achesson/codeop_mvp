
import React from 'react';
import './DisplaySingleCircuitComponent.css'


function DisplaySingleCircuitComponent(props) {

    return (
        <div className="DisplaySingleCircuitComponent" >
            <h3>{props.c.circuitName} </h3>
           
           <span id="exercises">
           { props.c.exercises.map((e)=> (
             <p key={e.exerciseName}>  {e.exerciseName} {' '} {e.timeOn} {':'} {e.timeOff} </p>))}
            </span>

           <h4> {props.c.numberOfSets} {' Sets - '}
            {props.c.restTimeBetweenSets}{' seconds rest between sets'} </h4>
    </div>

    );
}

export default DisplaySingleCircuitComponent;

