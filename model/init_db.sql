DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS circuits;
DROP TABLE IF EXISTS workouts;

CREATE TABLE workouts (
    workoutID INT NOT NULL AUTO_INCREMENT, 
    workoutName VARCHAR(40), 
    restBetweenCircuits VARCHAR(40), 
    PRIMARY KEY (workoutID)
);

INSERT INTO workouts (workoutName, restBetweenCircuits)
    VALUES ('my-first-workout',  '60');
           

CREATE TABLE circuits (
    circuitID INT NOT NULL AUTO_INCREMENT, 
    workoutID INT NOT NULL, 
    circuitName VARCHAR(40), 
    restTimeBetweenSets VARCHAR(40), 
    numberOfSets VARCHAR(40), 
    PRIMARY KEY (circuitID), 
    FOREIGN KEY (workoutID) REFERENCES workouts (workoutID) ON DELETE CASCADE);

INSERT INTO circuits (workoutID, circuitName, restTimeBetweenSets, numberOfSets)
    VALUES (LAST_INSERT_ID(), 'A', '60', '4');
           
CREATE TABLE exercises (
    id INT NOT NULL AUTO_INCREMENT, 
    circuitID INT NOT NULL, 
    exerciseName VARCHAR(40), 
    timeOn VARCHAR(40), 
    timeOff VARCHAR(40), 
    PRIMARY KEY (id), 
    FOREIGN KEY (circuitID) REFERENCES circuits (circuitID) ON DELETE CASCADE);
    
INSERT INTO exercises (circuitID, exerciseName, timeOn, timeOff)
    VALUES (LAST_INSERT_ID(), 'jump squats', '30', '10'),
           (LAST_INSERT_ID(), 'burpees', '30', '10'),
           (LAST_INSERT_ID(), 'push ups', '30', '10');
        


INSERT INTO circuits (workoutID, circuitName, restTimeBetweenSets, numberOfSets)
        VALUES (LAST_INSERT_ID(), 'B', '30', '2');


INSERT INTO exercises (circuitID, exerciseName, timeOn, timeOff)
      VALUES (LAST_INSERT_ID(), 'plank hold', '60', '10'),
             (LAST_INSERT_ID(), 'superman hold', '60', '10');