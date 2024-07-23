import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

export const deleteEquipment = functions.https.onCall(async (data, _context) => {
  try {
    const { id } = data;

    console.log(`Attempting to delete equipment with id: ${id}`);

    const equipmentRef = db.collection("equipment").doc(id);
    const equipment = await equipmentRef.get();

    if (!equipment.exists) {
      console.log(`Equipment with id ${id} not found`);
      throw new functions.https.HttpsError("not-found", "Equipment not found");
    }

    const equipmentData = equipment.data();
    console.log("Equipment data:", equipmentData);

    if (!equipmentData || !equipmentData.imageUrl) {
      console.log("Invalid equipment data or missing imageUrl");
      throw new functions.https.HttpsError("invalid-argument", "Invalid equipment data");
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
    return { success: true };
  } catch (error) {
    console.error("Error in deleteEquipment function:", error);
    if (error instanceof Error) {
      throw new functions.https.HttpsError("internal", `An error occurred while deleting the equipment: ${error.message}`, error);
    } else {
      throw new functions.https.HttpsError("internal", "An unknown error occurred while deleting the equipment", error);
    }
  }
});
