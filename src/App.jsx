import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import DailyJournal from './pages/DailyJournal';
import ResearchPapers from './pages/ResearchPapers';

import AboutMe from './pages/AboutMe';
import Certifications from './pages/Certifications';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/journal" element={<DailyJournal />} />
          <Route path="/papers" element={<ResearchPapers />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
