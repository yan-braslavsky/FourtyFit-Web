// functions/src/index.ts
import * as functions from "firebase-functions";
import * as equipmentFunctions from "./equipment";
import * as exerciseFunctions from "./exercises";

export const addEquipment = functions.https.onRequest(equipmentFunctions.addEquipment);
export const updateEquipment = functions.https.onRequest(equipmentFunctions.updateEquipment);
export const removeEquipment = functions.https.onRequest(equipmentFunctions.removeEquipment);

export const addExercise = functions.https.onRequest(exerciseFunctions.addExercise);
export const updateExercise = functions.https.onRequest(exerciseFunctions.updateExercise);
export const removeExercise = functions.https.onRequest(exerciseFunctions.removeExercise);
