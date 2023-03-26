import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Pair from './pages/Pair';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/pair" element={<Pair />} />
        <Route exact path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
