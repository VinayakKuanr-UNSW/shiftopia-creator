
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/theme.css'

// Add global styles
const style = document.createElement('style')
style.textContent = `
  html, body, #root {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  #root {
    display: flex;
    flex-direction: column;
  }
  
  * {
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.5);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(128, 128, 128, 0.8);
  }

  .theme-glass ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
  }

  .theme-glass ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`
document.head.appendChild(style)

createRoot(document.getElementById("root")!).render(<App />);
