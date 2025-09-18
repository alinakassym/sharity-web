import type { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/sharity-web/Home'
import Classes from './pages/sharity-web/Classes'
import Events from './pages/sharity-web/Events'
import Store from './pages/sharity-web/Store'

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sharity-web/" element={<Home />} />
        <Route path="/sharity-web/classes" element={<Classes />} />
        <Route path="/sharity-web/events" element={<Events />} />
        <Route path="/sharity-web/store" element={<Store />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
