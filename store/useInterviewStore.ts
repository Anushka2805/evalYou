import { create } from "zustand";

export type Interview = {
  id: string;
  title: string;
  date: string;
  role: string;
  mode: string;
  difficulty: string;
  scores: {
    overall: number;
    confidence: number;
    communication: number;
    body: number;
    content: number;
  };
};

type State = {
  interviews: Interview[];
  selectedId: string | null;
  addInterview: (i: Interview) => void;
  selectInterview: (id: string) => void;
};

export const useInterviewStore = create<State>((set) => ({
  interviews: [
    {
      id: "1",
      title: "Software Engineer Interview",
      date: "2026-02-23",
      role: "Software Engineer",
      mode: "Neutral",
      difficulty: "Medium",
      scores: { overall: 81, confidence: 80, communication: 83, body: 76, content: 79 },
    },
    {
      id: "2",
      title: "Product Manager Practice",
      date: "2026-02-18",
      role: "Product Manager",
      mode: "Friendly",
      difficulty: "Easy",
      scores: { overall: 74, confidence: 70, communication: 76, body: 72, content: 78 },
    },
  ],
  selectedId: null,
  addInterview: (i) =>
    set((s) => ({
      interviews: [i, ...s.interviews],
    })),
  selectInterview: (id) => set({ selectedId: id }),
}));