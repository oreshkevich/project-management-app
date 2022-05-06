import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Main } from './pages/Main';

const App = () => {
  const user = localStorage.getItem('user') || '';

  return (
    <>
      <BrowserRouter basename="/">
        <Header />
        <main className="main">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate replace to="/main" /> : <Navigate replace to="/home" />}
            />
            <Route path="/login" element={user ? <Navigate replace to="/main" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate replace to="/main" /> : <Signup />} />
            <Route path="/main" element={user ? <Main /> : <Navigate replace to="/home" />} />
            <Route path="/home" element={user ? <Navigate replace to="/main" /> : <Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
