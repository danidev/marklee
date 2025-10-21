import { createRoot } from "react-dom/client";
import App from "./App";

// Remove StrictMode to avoid double rendering/effects in development
createRoot(document.getElementById("root")).render(<App />);