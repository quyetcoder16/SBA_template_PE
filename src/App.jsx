
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./app.css"
import ListPage from './pages/ListPage';

function App() {

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\./g, '/');


  return (
    <>
      <BrowserRouter>
        <header className="header px-5">
          <div className="logo-section">Logo</div>
          <div className="date-section">Date: {currentDate}</div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/add" element={<>djd</>} />
            <Route path="/view/:id" element={<>dd</>} />
          </Routes>
        </main>
      </BrowserRouter>

    </>
  )
}

export default App
