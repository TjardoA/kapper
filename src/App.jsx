import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Planner from './pages/Planner'
import Keune from './pages/Keune'
import Tarieven from './pages/Tarieven'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/afspraak" element={<Planner />} />
        <Route path="/keune" element={<Keune />} />
        <Route path="/tarieven" element={<Tarieven />} />
      </Routes>
    </HashRouter>
  )
}
