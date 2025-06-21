
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDynamicStyles } from './utils/dynamic-styles'

// تطبيق الأنماط الديناميكية عند تحميل التطبيق
initializeDynamicStyles();

createRoot(document.getElementById("root")!).render(<App />);
