import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import EditorPage from './pages/EditorPage';

// Simple 404 Not Found Component
const NotFound = () => (
  <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>404</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Page not found</p>
    <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>← Back to Home</a>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/create" element={<EditorPage />} />
          <Route path="/edit/:id" element={<EditorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
