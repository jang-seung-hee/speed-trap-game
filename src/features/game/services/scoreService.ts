import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from "firebase/firestore";

export interface HighScore {
    id?: string;
    name: string;
    score: number;
    date: any; // Firestore Timestamp
}

const COLLECTION_NAME = "highscores";

export const scoreService = {
    // 스코어 등록
    async addScore(name: string, score: number) {
        try {
            await addDoc(collection(db, COLLECTION_NAME), {
                name,
                score,
                date: serverTimestamp(),
            });
            return true;
        } catch (error) {
            console.error("Error adding score: ", error);
            return false;
        }
    },

    // 상위 스코어 조회
    async getTopScores(limitCount: number = 10): Promise<HighScore[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                orderBy("score", "desc"),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            const scores: HighScore[] = [];

            querySnapshot.forEach((doc) => {
                scores.push({
                    id: doc.id,
                    ...doc.data(),
                } as HighScore);
            });

            return scores;
        } catch (error) {
            console.error("Error getting scores: ", error);
            return [];
        }
    }
};
