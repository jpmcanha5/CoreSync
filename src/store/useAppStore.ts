import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  isAuthenticated: boolean;
  userName: string;
  idade: string;
  genero: string;
  streak: number;
  frequencia: number;
  objetivo: string;
  nivel: string;
  comprometimento: string;
  fezCheckInHoje: boolean; 

  login: (name: string) => void;
  logout: () => void;
  registrarUsuario: (nome: string, idade: string, genero: string, objetivo: string, nivel: string, comprometimento: string) => void;
  setParametros: (objetivo: string, nivel: string, comprometimento: string) => void;
  fazerCheckIn: () => void;
  finalizarTreino: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Estado Inicial
      isAuthenticated: false,
      userName: "", 
      idade: "",
      genero: "",
      streak: 0,
      frequencia: 0,
      fezCheckInHoje: false,
      objetivo: "Hipertrofia",
      nivel: "Iniciante",
      comprometimento: "3-4 dias",

      login: (name) => set({ isAuthenticated: true, userName: name }),
      
      logout: () => set({ 
        isAuthenticated: false, userName: "", idade: "", genero: "", 
        streak: 0, frequencia: 0, fezCheckInHoje: false 
      }),
      
      registrarUsuario: (nome, idade, genero, objetivo, nivel, comprometimento) => set({ 
        isAuthenticated: true, userName: nome, idade, genero, objetivo, nivel, comprometimento,
        streak: 0, frequencia: 0, fezCheckInHoje: false 
      }),

      setParametros: (objetivo, nivel, comprometimento) => set({ objetivo, nivel, comprometimento }),
      
      fazerCheckIn: () => set((state) => ({
        fezCheckInHoje: true,
        streak: state.streak + 1,
        frequencia: Math.min(state.frequencia + 15, 100)
      })),

      finalizarTreino: () => set((state) => ({ 
        fezCheckInHoje: true,
        streak: state.streak === 0 ? 1 : state.streak, 
      })),
    }),
    {
      name: 'coresync-storage', // Nome único para o arquivo de memória no celular
      storage: createJSONStorage(() => AsyncStorage), // Define que vamos usar o AsyncStorage do celular
    }
  )
);