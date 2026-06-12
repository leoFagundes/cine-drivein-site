import { Feedback } from "@/types/Types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

class FeedbackRepositories {
  static async createFeedback(feedback: Feedback) {
    try {
      await addDoc(collection(db, "feedbacks"), {
        ...feedback,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      return false;
    }
  }
}

export default FeedbackRepositories;
