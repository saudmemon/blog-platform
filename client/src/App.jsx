import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import EditorPage from './pages/EditorPage';

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
        </Routes>
      </main>
    </Router>
  );
}

export default App;
