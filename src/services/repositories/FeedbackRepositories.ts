import { Feedback, FeedbackEntry, FeedbackStatus } from "@/types/Types";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

class FeedbackRepositories {
  /** Cria a avaliação já como "pending" — só fica pública após aprovação do admin. */
  static async createFeedback(feedback: Feedback): Promise<string | null> {
    try {
      const ref = await addDoc(collection(db, "feedbacks"), {
        ...feedback,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      return ref.id;
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      return null;
    }
  }

  /**
   * Busca todas as avaliações (sem filtro de status no Firestore, pra não
   * exigir índice composto) — quem chama filtra por status no cliente.
   * Avaliações antigas sem o campo `status` são tratadas como "approved".
   */
  static async getAllFeedbacks(): Promise<FeedbackEntry[]> {
    const snap = await getDocs(collection(db, "feedbacks"));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        rating: data.rating ?? 0,
        message: data.message ?? "",
        status: (data.status as FeedbackStatus | undefined) ?? "approved",
        reply: data.reply ?? undefined,
        repliedAt: data.repliedAt?.toDate(),
        createdAt: data.createdAt?.toDate() ?? new Date(),
      };
    });
  }
}

export default FeedbackRepositories;
