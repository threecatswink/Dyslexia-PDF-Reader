import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import ToolPage from './pages/ToolPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ToolPage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
