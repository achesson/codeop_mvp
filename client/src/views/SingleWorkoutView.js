import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import Error404View from './Error404View';
//import Timer from './Timer'
import DisplayTextSingleWorkout from "./DisplayTextSingleWorkout"
import './SingleWorkoutView.css';
/*
{
  workoutID: 0,
  workoutName: "my first workout",
  restBetweenCircuits: "60",
  circuits: 
 [{name: "A", exercises: [
              {exerciseName: "jump squats", timeOn: "30", timeOff:"10", id:1},
              {exerciseName: "burpees", timeOn: "30", timeOff:"10", id:2},
              {exerciseName: "push ups", timeOn: "30", timeOff:"10", id:3},
              ],
    numberOfSets: "4", restTimeBetweenSets: "60"},

  {name: "B", exercises: [
    {exerciseName: "plank hold", timeOn: "60", timeOff:"10", id:4},
    {exerciseName: "superman hold", timeOn: "30", timeOff:"10", id:5},
    ], 
    numberOfSets: "2", restTimeBetweenSets: "30"}],
}


*/


function SingleWorkoutView(props) {
    let { id } = useParams();  // get user ID from URL
    let workout = props.workoutLibrary.find(w => w.workoutID === Number(id));

    //let workout = getWorkoutById(id);
    const [featuredWorkout, setFeaturedWorkout] = useState(null)
    
    
    async function getWorkoutById(id) {
        try {
          let response = await fetch(`/workouts/${id}`);
          if (response.ok) {
            let workout = await response.json();
            setFeaturedWorkout(workout);
          } else {
            console.log(`error: ${response.status} ${response.statusText}`);
          }
        } catch (err) {
          console.log(`Server error: ${err.message}`);
        }
      }

      useEffect(() => {
    
        getWorkoutById(id);
        
      }, []);

    // Return 404 if workout doesn't exist
    if (!workout) {
        return <Error404View />;
    } 
    //let circuits = workout.circuits;
   

    return (
        <div className="SingleWorkoutView">
        <span className="grid" >
        <DisplayTextSingleWorkout workout={workout} />
           
        
         
        </span>
    
        
       
         

        
          
            <Link to="/workouts/">back</Link>
        </div>
    );
}

export default SingleWorkoutView;