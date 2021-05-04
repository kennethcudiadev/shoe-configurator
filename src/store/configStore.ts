import { create } from "zustand";

// Define parts of the shoe
type Part = "upper" | "sole" | "laces";
// Define material types (matte or glossy)
type MaterialType = "matte" | "glossy";

// Store structure
type Store = {
  colors: Record<Part, string>; // Store the colors for each part of the shoe
  materialsType: MaterialType; // Store the selected material type
  lastInteraction: number; // Track the last interaction time

  bumpInteraction: () => void; // Function to update last interaction time
  setColor: (part: Part, color: string) => void; // Function to set the color for a specific part
  setMaterialType: (m: MaterialType) => void; // Function to set the material type (matte/glossy)
};

// Create the store with Zustand
export const useConfigStore = create<Store>((set) => ({
  colors: {
    upper: "#ffffff", // Default color for upper part
    sole: "#ffffff", // Default color for sole part
    laces: "#ffffff", // Default color for laces
  },

  materialsType: "matte", // Default material type
  lastInteraction: Date.now(), // Initialize last interaction with the current time

  // Update interaction time
  bumpInteraction: () =>
    set(() => ({
      lastInteraction: Date.now(),
    })),

  // Update color for a specific part of the shoe
  setColor: (part, color) =>
    set((state) => ({
      lastInteraction: Date.now(),
      colors: { ...state.colors, [part]: color },
    })),

  // Update material type (matte or glossy)
  setMaterialType: (m) =>
    set(() => ({
      lastInteraction: Date.now(),
      materialsType: m,
    })),
}));
