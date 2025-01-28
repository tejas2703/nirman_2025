import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import ConsumerPage from './pages/ConsumerPage/ConsumerPage';



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/consumer" element={<ConsumerPage />} />
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
