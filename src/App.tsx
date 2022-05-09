import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Main } from './pages/Main';

import { useAppSelector } from './core/hooks/redux';

const App = () => {
  const { token } = useAppSelector((state) => state.userReducer);

  return (
    <BrowserRouter basename="/">
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate replace to="/main" /> : <Navigate replace to="/home" />}
          />
          <Route path="/login" element={token ? <Navigate replace to="/main" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate replace to="/main" /> : <Signup />} />
          <Route path="/main" element={token ? <Main /> : <Navigate replace to="/home" />} />
          <Route path="/home" element={token ? <Navigate replace to="/main" /> : <Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
