import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ListLocks from './pages/ListLocks';
import SelectDex from './pages/SelectDex';
import Pair from './pages/Pair';

function getLibrary(provider) {
  return new Web3Provider(provider);
}

function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Routes>
            <Route exact path="/pair" element={<Pair />} />
            <Route exact path="/" element={<SelectDex />} />
            <Route exact path="/list_locks" element={<ListLocks />} />
          </Routes>
        </Web3ReactProvider>
      </LocalizationProvider>
    </BrowserRouter>
  );
}

export default App;
