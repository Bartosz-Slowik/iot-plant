import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './views/Layout';
import SignIn from './views/SignIn';
import Page404 from './views/Page404';
import SignUp from './views/SignUp';
import MyPlants from './views/MyPlants';
import Plant from './views/Plant';
import PlantHistory from './views/PlantHistory';

export default function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={isAuthenticated ? <Navigate to="/MyPlants" /> : <SignIn />}
        />
        <Route path="SignUp" element={<SignUp />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout />
            ) : (
              <Navigate to="/" replace state={{ from: '/' }} />
            )
          }
        >
          {isAuthenticated ? (
            <>
              <Route path="MyPlants" element={<MyPlants />} />
              <Route path="Plant" element={<Plant />} />
              <Route path="PlantHistory" element={<PlantHistory />} />
            </>
          ) : (
            <Route path="*" element={<Page404 />} />
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
