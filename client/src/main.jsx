import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";
import App from "./App.jsx";

//CREATE CLIENT
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          duration: 2500,
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
