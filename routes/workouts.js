var express = require("express");
var router = express.Router();
const db = require("../model/helper");

//helper function- get all workouts

async function sendAllWorkouts(res) {
  let response = await db("SELECT * FROM workouts;");
  let workouts = response.data;
  response = await db("SELECT * FROM circuits;");
  let circuits= response.data;
  response = await db("SELECT * FROM exercises;");
  let exercises = response.data;

  let circuitsWithExercises = addExercisesToCircuits(circuits, exercises);
  let completeWorkouts = addCircuitsToWorkouts(workouts, circuitsWithExercises)

  res.send(completeWorkouts);
}

async function getWorkout(id) {
  let results = await db(`SELECT * FROM workouts where workoutID = ${id}`);
  return results.data.length === 1 ? results.data[0] : null;
}

//used to turn arrays of values into strings for sql statements
function makeStr(arr) {
  let str = '(';
  for (let n in arr) {
      if (n < arr.length -1) {
          let s = String(arr[n]);
          s = '\'' + s + '\'' + ', ';
          str = str + s;
      } else {
          let s = String(arr[n]);
           s = '\'' + s + '\''+ ')';
          str = str + s;}
  }
  return str
  }
//helper function removes exercises from a circuit object and returns new array of just exercises
// function extractExercisesFromCircuits(circuitsArr) {
//   let exercisesArr = [];
//   for (let c in circuitsArr) {
//       let exercises = circuitsArr[c].exercises
//       circuitIDForThisExercise = circuitsArr[c].circuitID
//       for (e in exercises) {
//       exercises[e].circuitID = (circuitIDForThisExercise)
//       exercisesArr.push(exercises[e]);
      
      
//       }
//   }
// return exercisesArr
// }

//helper- given an array of exercise objects, make an array of arrays containing just the values
function getValuesFromExercisesArr(exerciseObjArr) {
    
  let valuesArr = [];
   for (let e in exerciseObjArr) {
       let tempArr = [];
       Object.entries(exerciseObjArr[e]).forEach(([key, value]) => {
           tempArr.push(value)
       }) 
       valuesArr.push(tempArr);
   }
 return valuesArr;
}
//makes a string of of exercises array for sql statement
function makeExerciseSqlStr(exercisesValuesArr) {
  let finalStr = "";
  for (let c in exercisesValuesArr) {
      if (c < exercisesValuesArr.length -1) {
          finalStr = finalStr + makeStr(exercisesValuesArr[c]) + ','}
      else {
          finalStr = finalStr + makeStr(exercisesValuesArr[c])
      }
  }
return finalStr
}

//gets all the values of a circuit object, returns array of all values and DELETES exercise key
//so exercises need to be extracted with extractExercisesFromCircuits before using this function
  function getValuesFromCircuit(circuit) {
    //circuitsArr.forEach(c => delete c["exercises"]);
   
    let valuesArr = [];
    //  for (let c in circuitsArr) {
    //      let tempArr = [];
    //      Object.entries(circuitsArr[c]).forEach(([key, value]) => {
    //          tempArr.push(value)
    //      }) 
    //      valuesArr.push(tempArr);
    //  }
    Object.entries(circuit).forEach(([key, value]) => {
      valuesArr.push(value)})
   return valuesArr;
 }

//takes an array of arrays- each inner array contains values of circuit obj
//returns a str of the values to be used for sql insert statement
//  function makeCircuitSqlStr(circuitsValuesArr) {
//   let finalStr = "";
//   for (let c in circuitsValuesArr) {
//       if (c < circuitsValuesArr.length -1) {
//           finalStr = finalStr + makeStr(circuitsValuesArr[c]) + ','}
//       else {
//           finalStr = finalStr + makeStr(circuitsValuesArr[c])
//       }
//   }
// return finalStr
// }



//helper function, adds exercises to circuits for GET/SEND requests
  function addExercisesToCircuits(circuitsArr, exercisesArr) {
    circuitsArr.forEach(c => c.exercises = []);
    for (let e in exercisesArr) {
        let circuitIDforthisExercise = exercisesArr[e].circuitID;
        //console.log(e.exerciseName, circuitIDforthisExercise)
        for (let c in circuitsArr) {
            if (circuitIDforthisExercise === circuitsArr[c].circuitID) {
                //console.log('c', c);
                //console.log('circuitsArr[c]', circuitsArr[c])
                circuitsArr[c].exercises.push(exercisesArr[e]); 
           
        }
    }
}
return circuitsArr;
}


//helper function, adds circuits to workouts for GET/SEND requests
function addCircuitsToWorkouts(workoutsArr, circuitsArr) {
  workoutsArr.forEach(w => w.circuits = []);
  for (let c in circuitsArr) {
      let workoutIDForThisCircuit = circuitsArr[c].workoutID 
      for (let w in workoutsArr) {
          if (workoutsArr[w].workoutID === workoutIDForThisCircuit) {
              workoutsArr[w].circuits.push(circuitsArr[c])
          }
      }
  }
return workoutsArr
}




// GET workouts list
router.get("/", async function(req, res, next) {
  sendAllWorkouts(res);

});

// GET one workout
router.get("/:id", async function(req, res, next) {
  //get id from url param
  let id = Number(req.params.id);
  //define sql string
  let sql = `
  SELECT * FROM workouts
  WHERE workoutID = ${id}
  `;
  try {
    //check if there is a workout by this id
    let existsWorkout = await getWorkout(id);
    if (existsWorkout) {
      let workout = await db(`SELECT * FROM workouts where workoutID = ${id}`);
      
      //get circuits in this workout
      let circuits = await db(`SELECT * FROM circuits where workoutID = ${id}`);
      
      //create an array with circuitID for each circuit
      let circuitIDsArr = circuits.data.map(n=> n.circuitID)
      //turn circuitIDsArr into a sql string e.g. [0,1] to '(0, 1)'
      let circuitIDsArrSql = makeStr(circuitIDsArr);
      //get exercises- select exercises where circuitID is in circuit ids
      let exercises = await db(`SELECT * FROM exercises where circuitID IN ${circuitIDsArrSql}`);
      //get the arrays of circuits and exercise objects 
      let circuitsArr = circuits.data;
      //needed for function
      //circuitsArr.forEach(c => c.exercises = []);
      let exercisesArr = exercises.data;
      let resultCircuits = addExercisesToCircuits(circuitsArr, exercisesArr);
      let workoutdata = workout.data[0];
      workoutdata.circuits = resultCircuits;


      res.status(200);
      res.send(workoutdata); //workout
    } else {
      res.status(404).send({ error: "Workout not found" });
    }
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

// INSERT a new workout into the DB
router.post("/", async function(req, res, next) {
  //get info from the request body
  
  let {workoutName, restBetweenCircuits, circuits} = req.body;
  let sql = `
  INSERT INTO workouts (workoutName, restBetweenCircuits)
      VALUES ('${workoutName}', '${restBetweenCircuits}');
  SELECT LAST_INSERT_ID(); 
`; 
  

  //update db
  try {
    let result = await db(sql);
    //gets the workoutID that was created upon inserting to workouts table
    let workoutId = result.data[0].insertId;

    //for each circuit
    for (let c in circuits) {
          let currentCircuit = circuits[c];
          //remove exercises
          let exercisesObjArr = currentCircuit.exercises;
          
          //delete exercises
          delete currentCircuit.exercises;
          //sort circuit object to order is uniform
          let sortedCircuit = Object.fromEntries(Object.entries(currentCircuit).sort());
          //get values frmo the circuit
          let circuitsValues = getValuesFromCircuit(sortedCircuit);
          //make circuitValuesStr
          circuitsValues.unshift(workoutId);
          //insert circuit into circuits table
          let circuitsValuesStr = makeStr(circuitsValues);

          let sqlCircuit = `
          INSERT INTO circuits (workoutID, circuitName, numberOfSets, restTimeBetweenSets)
              VALUES ${circuitsValuesStr};
        `;  
          let resultCircuit = await db(sqlCircuit);
          //get the insert ID of circuits after it is submitted
          let circuitId = resultCircuit.data[0].insertId;
          //insert exercises in batch
        
          //sort exercise objects so order of keys is uniform
          let sortedexercises = exercisesObjArr.map(exerciseobj => Object.fromEntries(Object.entries(exerciseobj).sort()))
          let exercisesValuesArr = getValuesFromExercisesArr(sortedexercises);
          exercisesValuesArr.forEach(e => e.unshift(circuitId));
          let exercisesValuesStr = makeExerciseSqlStr(exercisesValuesArr);
          let sqlExercises = `
          INSERT INTO exercises (circuitID, exerciseName, timeOff, timeOn)
              VALUES ${exercisesValuesStr};
        `;
        console.log("sqlExercises", sqlExercises);
        let resultExercises = await db(sqlExercises);
    }
    
    //at end of for loop- send success code
    res.status(201);
    sendAllWorkouts(res);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// DELETE a workout from the DB
router.delete("/:id", async function(req, res, next) {
  //get id from url params
  let id = Number(req.params.id);
  //define sql string
  let sql = `
 DELETE FROM workouts
 WHERE workoutID = ${id}
 `;

 
  //update database
  try {
    let workout = await getWorkout(id);
    //let result = await db(`SELECT * FROM workouts WHERE workoutID = ${id}`);
    if (workout) {
      await db(sql);
      sendAllWorkouts(res);
    } else {
      res.status(404).send({ error: "Workout not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
