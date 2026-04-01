
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./app.css"
import ListPage from './pages/ListPage';
import PageDetail from './pages/PageDetail';
import AddPage from './pages/AddPage';
import UpdatePage from './pages/UpdatePage';

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
            <Route path="/add" element={<AddPage />} />
            <Route path="/view/:id" element={<PageDetail />} />
            <Route path="/update/:id" element={<UpdatePage />} />
          </Routes>
        </main>
      </BrowserRouter>

    </>
  )
}

export default App
