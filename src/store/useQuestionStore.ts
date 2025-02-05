import { create } from 'zustand';

interface QuestionStore {
  answers: Record<string, string[]>;
  setAnswer: (questionId: string, answer: string[]) => void;
  resetAnswers: () => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  answers: {},
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  resetAnswers: () => set({ answers: {} }),
}));
