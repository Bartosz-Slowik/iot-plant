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
  console.log('Is Auth:', localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignIn />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route path="MyPlants" element={<MyPlants />} />
          <Route path="Plant" element={<Plant />} />
          <Route path="PlantHistory" element={<PlantHistory />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

//ReactDOM.render(<App />, document.getElementById('root'));
