import type { FC } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Classes from './pages/Classes'
import Events from './pages/Events'
import Store from './pages/Store'

const App: FC = () => {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: 16 }}>
        <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <strong>Sharity Web</strong>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/">Home</Link>
            <Link to="/sharity-web/classes">Classes</Link>
            <Link to="/sharity-web/events">Events</Link>
            <Link to="/sharity-web/store">Store</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/events" element={<Events />} />
            <Route path="/store" element={<Store />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
