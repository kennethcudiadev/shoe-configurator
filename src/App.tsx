import Scene from "./three/Scene";
import { useConfigStore } from "./store/configStore";

function App() {
  const setColor = useConfigStore((s) => s.setColor); // State setter for colors
  const setMaterialType = useConfigStore((s) => s.setMaterialType); // State setter for material type (matte/glossy)
  const materialsType = useConfigStore((s) => s.materialsType); // Current material type

  /* ---------- Screenshot with Watermark ---------- */

  // Function to take a screenshot of the 3D canvas with a watermark
  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas"); // Get the canvas element
    if (!canvas) return; // If no canvas found, exit

    const original = canvas as HTMLCanvasElement;

    // Create a new canvas to draw the screenshot on
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = original.width;
    exportCanvas.height = original.height;

    const ctx = exportCanvas.getContext("2d"); // 2D context to draw
    if (!ctx) return; // If no context found, exit

    // Draw the 3D rendered image onto the new canvas
    ctx.drawImage(original, 0, 0);

    // Set up the watermark style
    ctx.font = `${exportCanvas.width * 0.04}px Arial`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
    ctx.textAlign = "right";

    // Add the watermark text to the bottom-right corner
    ctx.fillText("Air Trainer Custom", exportCanvas.width - 40, exportCanvas.height - 40);

    // Convert the canvas to a data URL for download
    const dataUrl = exportCanvas.toDataURL("image/png");

    // Create a temporary download link and trigger the download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `shoe-${Date.now()}.png`;
    link.click();
  };

  /* ---------- UI ---------- */

  const colorPalette = [
    "#ffffff", "#000000", "#1f3a57", "#7e5a3c", "#7b8a35", "#d3d3d3",
  ]; // Available color palette for the shoe parts

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* LEFT — 3D VIEWER */}
      <div className="flex-1 min-h-0 relative">
        <Scene /> {/* 3D Scene where the shoe is rendered */}
      </div>

      {/* RIGHT — CONTROL PANEL */}
      <div className="w-80 border-l border-gray-200 p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-semibold mb-6">
            Shoe Configurator {/* Title of the configurator */}
          </h1>

          {/* MATERIAL TOGGLE */}
          <div className="mb-8">
            <h2 className="text-sm font-medium mb-3">
              Material Finish {/* Header for material selection */}
            </h2>

            <div className="flex gap-3">
              {/* Buttons for selecting between Matte and Glossy material */}
              <button
                onClick={() => setMaterialType("matte")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition
                ${materialsType === "matte" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
              >
                Matte {/* Matte button */}
              </button>

              <button
                onClick={() => setMaterialType("glossy")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition
                ${materialsType === "glossy" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
              >
                Glossy {/* Glossy button */}
              </button>
            </div>
          </div>

          {/* COLOR PICKERS */}
          {/* Iterate over shoe parts to create a color picker for each part */}
          {["upper", "sole", "laces"].map((part) => (
            <div key={part} className="mb-6">
              <h2 className="text-sm font-medium mb-3 capitalize">
                {part} {/* Display part name (upper, sole, laces) */}
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {/* Iterate over color palette to create color buttons */}
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(part as any, color)} // Set the selected color for the part
                    className={`w-10 h-10 rounded-full border transition`}
                    style={{ backgroundColor: color }} // Set button background to the color
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SCREENSHOT BUTTON */}
        <button
          onClick={handleScreenshot} // Trigger screenshot on click
          className="w-full border border-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
        >
          Download Screenshot {/* Button to download the screenshot */}
        </button>
      </div>
    </div>
  );
}

export default App;
