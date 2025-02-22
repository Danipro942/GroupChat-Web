import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRouter from "./pages/index.tsx";
import UserContext from "./Context/userContext.tsx";
import SocketProvider from "./Socket/SocketContext.tsx";
import SelectContext from "./Context/useSelectContext.tsx";
import ChatsProvider from "./Context/ChatsContext.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContext>
        <SelectContext>
          <ChatsProvider>
            <SocketProvider>
              <AppRouter />
            </SocketProvider>
          </ChatsProvider>
        </SelectContext>
      </UserContext>
    </QueryClientProvider>
  </StrictMode>
);
