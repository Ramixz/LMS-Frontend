import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  access_token: string;
  refresh_token: string;
  previous_url: string;
  addRefreshToken: (token: string) => void;
  addToken: (token: string) => void;
  addPreviousUrl: (url: string) => void;
  removeToken: () => void;
};

const useAuthStorage = create<Store>()(
  persist(
    (set) => ({
      access_token: "",
      refresh_token: "",
      previous_url: "",
      addToken: async (token: string) => set({ access_token: token }),
      addRefreshToken: (token: string) => set({ refresh_token: token }),
      addPreviousUrl: (url: string) => set({ previous_url: url }),
      removeToken: () => set({ access_token: "", refresh_token: "" }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStorage;
