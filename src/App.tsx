import type { FC } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/sharity-web/Home'
import Classes from './pages/sharity-web/Classes'
import Events from './pages/sharity-web/Events'
import Store from './pages/sharity-web/Store'

const App: FC = () => {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: 16 }}>
        <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <strong>Sharity Web</strong>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/sharity-web/">Home</Link>
            <Link to="/sharity-web/classes">Classes</Link>
            <Link to="/sharity-web/events">Events</Link>
            <Link to="/sharity-web/store">Store</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/sharity-web/" element={<Home />} />
            <Route path="/sharity-web/classes" element={<Classes />} />
            <Route path="/sharity-web/events" element={<Events />} />
            <Route path="/sharity-web/store" element={<Store />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
