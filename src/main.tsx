import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SoundProvider } from './context/SoundContext.tsx'
import SmoothScroll from './components/SmoothScroll.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScroll>
      <SoundProvider>
        <App />
      </SoundProvider>
    </SmoothScroll>
  </StrictMode>,
)
