import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './views/Layout';
import SignIn from './views/SignIn';
import Page404 from './views/Page404';
import SignUp from './views/SignUp';
import MyPlants from './views/MyPlants';
import NewPlant from './views/NewPlant';
import Plants from './views/Plants';
import PlantHistory from './views/PlantHistory';
import SampleHistory from './views/SampleHistory';

export default function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  console.log('Is Auth:', localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignIn />} />
        <Route path="SignIn" element={<SignIn />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route path="MyPlants" element={<MyPlants />} />
          <Route path="NewPlant" element={<NewPlant />} />
          <Route path="Plants/:id" element={<Plants />} />
          <Route path="PlantHistory/:id" element={<PlantHistory />} />
          <Route path="SampleHistory" element={<SampleHistory />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

//ReactDOM.render(<App />, document.getElementById('root'));
