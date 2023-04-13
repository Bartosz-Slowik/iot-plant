import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/Layout.js";
import SignIn from "./views/SignIn";
import Page404 from "./views/Page404";
import SignUp from "./views/SignUp";
import MyPlants from "./views/MyPlants";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SignIn />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="MyPlants" element={<MyPlants />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);