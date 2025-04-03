
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/theme.css'

// Add global styles
const style = document.createElement('style')
style.textContent = `
  html, body, #root {
    height: 100%;
    width: 100%;
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
`
document.head.appendChild(style)

createRoot(document.getElementById("root")!).render(<App />);
