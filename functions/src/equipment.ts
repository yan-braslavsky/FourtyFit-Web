// functions/src/equipment.ts
import * as functions from "firebase-functions";
import * as cors from "cors";
import { db, storage } from "./admin";

const corsHandler = cors({ origin: true });

export const addEquipment = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { name, description, imageUrl } = request.body;

      if (!name || !description || !imageUrl) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
      }

      const equipmentRef = db.collection("equipment").doc();
      await equipmentRef.set({
        name,
        description,
        imageUrl,
      });

      response.status(200).send({ success: true, id: equipmentRef.id });
    } catch (error) {
      console.error("Error in addEquipment function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});

export const updateEquipment = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { id, name, description, imageUrl } = request.body;

      if (!id || !name || !description || !imageUrl) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
      }

      const equipmentRef = db.collection("equipment").doc(id);
      await equipmentRef.update({
        name,
        description,
        imageUrl,
      });

      response.status(200).send({ success: true });
    } catch (error) {
      console.error("Error in updateEquipment function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});

export const removeEquipment = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { id } = request.body;

      console.log(`Attempting to delete equipment with id: ${id}`);

      const equipmentRef = db.collection("equipment").doc(id);
      const equipment = await equipmentRef.get();

      if (!equipment.exists) {
        console.log(`Equipment with id ${id} not found`);
        response.status(404).send({ error: "Equipment not found" });
        return;
      }

      const equipmentData = equipment.data();
      console.log("Equipment data:", equipmentData);

      if (!equipmentData || !equipmentData.imageUrl) {
        console.log("Invalid equipment data or missing imageUrl");
        response.status(400).send({ error: "Invalid equipment data" });
        return;
      }

      const { imageUrl } = equipmentData;

      console.log(`Attempting to delete image: ${imageUrl}`);

      // Delete the image from Storage
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        const bucket = storage.bucket();
        try {
          await bucket.file(`equipment/${fileName}`).delete();
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
      await equipmentRef.delete();

      console.log("Delete operation completed successfully");
      response.status(200).send({ success: true });
    } catch (error) {
      console.error("Error in removeEquipment function:", error);
      if (error instanceof Error) {
        response.status(500).send({ error: error.message });
      } else {
        response.status(500).send({ error: "An unknown error occurred" });
      }
    }
  });
});
