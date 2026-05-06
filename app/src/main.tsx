import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "sonner"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <CartProvider>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#F5E6E0',
                border: '1px solid #D4B8B0',
                color: '#B85C6E',
              },
            }}
          />
          <App />
        </CartProvider>
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
