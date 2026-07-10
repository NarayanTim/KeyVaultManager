import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import "./Global.css"
import App from './App.tsx'
import { ClerkProvider } from '@clerk/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeSetup.tsx'
import env from './context/env.ts'
import { ui } from '@clerk/ui';
import UserProvider  from './context/UserContext.tsx';

if (!env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing auth required prams")
}


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
    <ClerkProvider ui={ui} publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <App />
            </UserProvider>
      </QueryClientProvider>
    </ClerkProvider>
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
