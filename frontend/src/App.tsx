import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        richColors
        position="top-right"
        closeButton
        duration={3500}
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />
    </>
  );
}

export default App;