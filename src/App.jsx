import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Home from './pages/Home';
import Pair from './pages/Pair';

function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route exact path="/pair" element={<Pair />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </LocalizationProvider>
    </BrowserRouter>
  );
}

export default App;
