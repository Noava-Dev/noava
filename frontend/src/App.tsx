import { useEffect } from 'react';
import './App.css';
import Home from './pages/Home/Home';

function App() {
  console.log(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => console.log(data.status))
      .catch(console.error);
  }, []);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
