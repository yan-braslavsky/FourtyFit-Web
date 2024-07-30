// functions/src/exercises.ts
import * as functions from "firebase-functions";
import cors from "cors";
import { db, storage } from "./admin";

const corsHandler = cors({ origin: true });

export const addExercise = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { name, description, imageUrl, equipmentIds } = request.body;

      if (!name || !description || !imageUrl || !equipmentIds) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
      }

      const exerciseRef = db.collection("exercises").doc();
      await exerciseRef.set({
        name,
        description,
        imageUrl,
        equipmentIds,
      });

      response.status(200).send({ success: true, id: exerciseRef.id });
    } catch (error) {
      console.error("Error in addExercise function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});

export const updateExercise = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { id, name, description, imageUrl, equipmentIds } = request.body;

      if (!id || !name || !description || !imageUrl || !equipmentIds) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
      }

      const exerciseRef = db.collection("exercises").doc(id);
      const oldExercise = await exerciseRef.get();

      if (!oldExercise.exists) {
        throw new functions.https.HttpsError("not-found", "Exercise not found");
      }

      const oldData = oldExercise.data();

      // Check if the image URL has changed
      if (oldData && oldData.imageUrl !== imageUrl) {
        // Delete the old image
        const oldImageFileName = oldData.imageUrl.split("/").pop();
        if (oldImageFileName) {
          const bucket = storage.bucket();
          try {
            await bucket.file(`exercises/${oldImageFileName}`).delete();
            console.log("Old image deleted successfully");
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
            // Continue with update even if image deletion fails
          }
        }
      }

      await exerciseRef.update({
        name,
        description,
        imageUrl,
        equipmentIds,
      });

      response.status(200).send({ success: true });
    } catch (error) {
      console.error("Error in updateExercise function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});

export const removeExercise = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { id } = request.body;

      console.log(`Attempting to delete exercise with id: ${id}`);

      const exerciseRef = db.collection("exercises").doc(id);
      const exercise = await exerciseRef.get();

      if (!exercise.exists) {
        console.log(`Exercise with id ${id} not found`);
        response.status(404).send({ error: "Exercise not found" });
        return;
      }

      const exerciseData = exercise.data();
      console.log("Exercise data:", exerciseData);

      if (!exerciseData || !exerciseData.imageUrl) {
        console.log("Invalid exercise data or missing imageUrl");
        response.status(400).send({ error: "Invalid exercise data" });
        return;
      }

      const { imageUrl } = exerciseData;

      console.log(`Attempting to delete image: ${imageUrl}`);

      // Delete the image from Storage
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        const bucket = storage.bucket();
        try {
          await bucket.file(`exercises/${fileName}`).delete();
          console.log("Image deleted successfully");
        } catch (deleteError) {
          console.error("Error deleting image:", deleteError);
          // Continue with document deletion even if image deletion fails
        }
      } else {
        console.log("No filename extracted from imageUrl");
      }

      console.log(`Deleting document with id: ${id}`);

      // Delete the document from Firestore
      await exerciseRef.delete();

      console.log("Delete operation completed successfully");
      response.status(200).send({ success: true });
    } catch (error) {
      console.error("Error in removeExercise function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});
