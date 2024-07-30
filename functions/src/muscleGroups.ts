// functions/src/muscleGroups.ts
import * as functions from "firebase-functions";
import cors from "cors";
import { db, storage } from "./admin";
import muscleGroupsData from "./muscleGroups.json";

const corsHandler = cors({ origin: true });

export interface Muscle {
  name: string;
  imageUrl: string;
  description: string;
}

export interface MuscleGroup {
  id?: string;
  name: string;
  muscles: Muscle[];
  imageUrl: string;
}

interface MuscleGroupData {
  muscles?: Muscle[];
  imageUrl?: string;
  [key: string]: any;
}

export const resetMuscleGroups = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const muscleGroupsRef = db.collection("muscleGroups");
      const snapshot = await muscleGroupsRef.get();
      const bucket = storage.bucket();

      // Delete all existing muscle groups and their images
      const batch = db.batch();
      for (const doc of snapshot.docs) {
        const muscleGroup = doc.data() as MuscleGroup;
        for (const muscle of muscleGroup.muscles) {
          const imageFileName = muscle.imageUrl.split("/").pop();
          if (imageFileName) {
            try {
              await bucket.file(`muscleGroups/${imageFileName}`).delete();
              console.log(`Deleted image: ${imageFileName}`);
            } catch (deleteError) {
              console.error("Error deleting image:", deleteError);
            }
          }
        }
        batch.delete(doc.ref);
      }
      await batch.commit();
      console.log("Existing muscle groups deleted");

      // Upload new muscle groups from the local JSON file
      const uploadBatch = db.batch();
      Object.entries(muscleGroupsData).forEach(([groupName, groupData]) => {
        const docRef = muscleGroupsRef.doc();
        let muscles: Muscle[] = [];
        let imageUrl = "";

        const processGroupData = (data: MuscleGroupData) => {
          if (Array.isArray(data.muscles)) {
            muscles = muscles.concat(data.muscles);
          }
          if (data.imageUrl) {
            imageUrl = data.imageUrl;
          }
        };

        if (typeof groupData === "object" && groupData !== null) {
          if ("muscles" in groupData || "imageUrl" in groupData) {
            processGroupData(groupData as MuscleGroupData);
          } else {
            // Handle nested structure (e.g., Arms, Legs)
            Object.values(groupData).forEach((subGroup: MuscleGroupData) => {
              processGroupData(subGroup);
            });
          }
        }

        uploadBatch.set(docRef, {
          name: groupName,
          muscles: muscles,
          imageUrl: imageUrl,
        });
      });
      await uploadBatch.commit();
      console.log("New muscle groups uploaded");

      response.status(200).send({ success: true, message: "Muscle groups reset and uploaded successfully" });
    } catch (error) {
      console.error("Error in resetMuscleGroups function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});


export const uploadMuscleGroups = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    try {
      const batch = db.batch();
      const muscleGroupsRef = db.collection("muscleGroups");

      Object.entries(request.body).forEach(([groupName, muscles]) => {
        const docRef = muscleGroupsRef.doc();
        batch.set(docRef, { name: groupName, muscles });
      });

      await batch.commit();

      response.status(200).send({ success: true, message: "Muscle groups uploaded successfully" });
    } catch (error) {
      console.error("Error uploading muscle groups:", error);
      response.status(500).send({ success: false, error: "Failed to upload muscle groups" });
    }
  });
});

export const addMuscleGroup = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { name, muscles } = request.body;

      if (!name || !muscles) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
      }

      const muscleGroupRef = db.collection("muscleGroups").doc();
      await muscleGroupRef.set({
        name,
        muscles,
      });

      response.status(200).send({ success: true, id: muscleGroupRef.id });
    } catch (error) {
      console.error("Error in addMuscleGroup function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});


export const updateMuscleGroup = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { id, name, muscles, imageUrl } = request.body;

      if (!id || !name || !muscles || !imageUrl) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
      }

      const muscleGroupRef = db.collection("muscleGroups").doc(id);
      const oldMuscleGroup = await muscleGroupRef.get();

      if (!oldMuscleGroup.exists) {
        throw new functions.https.HttpsError("not-found", "Muscle group not found");
      }

      const oldData = oldMuscleGroup.data() as MuscleGroup;
      const bucket = storage.bucket();

      // Delete old main image if it has changed
      if (oldData.imageUrl !== imageUrl) {
        const oldImageFileName = oldData.imageUrl.split("/").pop();
        if (oldImageFileName) {
          try {
            await bucket.file(`muscleGroups/${oldImageFileName}`).delete();
            console.log(`Deleted old main image: ${oldImageFileName}`);
          } catch (deleteError) {
            console.error("Error deleting old main image:", deleteError);
          }
        }
      }

      // Delete old muscle images if they have changed or been removed
      for (const oldMuscle of oldData.muscles) {
        const muscleStillExists = muscles.some((newMuscle: Muscle) =>
          newMuscle.name === oldMuscle.name && newMuscle.imageUrl === oldMuscle.imageUrl
        );
        if (!muscleStillExists) {
          const oldMuscleImageFileName = oldMuscle.imageUrl.split("/").pop();
          if (oldMuscleImageFileName) {
            try {
              await bucket.file(`muscleGroups/${oldMuscleImageFileName}`).delete();
              console.log(`Deleted old muscle image: ${oldMuscleImageFileName}`);
            } catch (deleteError) {
              console.error("Error deleting old muscle image:", deleteError);
            }
          }
        }
      }

      // Update the muscle group
      await muscleGroupRef.update({
        name,
        muscles,
        imageUrl,
      });

      response.status(200).send({ success: true, message: "Muscle group updated successfully" });
    } catch (error) {
      console.error("Error in updateMuscleGroup function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});

export const removeMuscleGroup = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { id } = request.body;

      if (!id) {
        throw new functions.https.HttpsError("invalid-argument", "Missing muscle group ID");
      }

      const muscleGroupRef = db.collection("muscleGroups").doc(id);
      const muscleGroup = await muscleGroupRef.get();

      if (!muscleGroup.exists) {
        response.status(404).send({ error: "Muscle group not found" });
        return;
      }

      const muscleGroupData = muscleGroup.data() as MuscleGroup;
      const bucket = storage.bucket();

      // Delete all images associated with the muscle group
      for (const muscle of muscleGroupData.muscles) {
        const imageFileName = muscle.imageUrl.split("/").pop();
        if (imageFileName) {
          try {
            await bucket.file(`muscleGroups/${imageFileName}`).delete();
            console.log(`Deleted image: ${imageFileName}`);
          } catch (deleteError) {
            console.error("Error deleting image:", deleteError);
          }
        }
      }

      // Delete the document from Firestore
      await muscleGroupRef.delete();

      response.status(200).send({ success: true });
    } catch (error) {
      console.error("Error in removeMuscleGroup function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});


