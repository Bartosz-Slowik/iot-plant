import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/Layout.js";
import SignIn from "./views/SignIn";
import Page404 from "./views/Page404";
import SignUp from "./views/SignUp";
import MyPlants from "./views/MyPlants";
import Plant from "./views/Plant";
import PlantHistory from "./views/PlantHistory.js";
export default function App() {
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);