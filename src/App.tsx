import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./features/auth/RequireAuth";
import Header from "./components/Header";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Home from "./components/Home";
import Dashboard from "./features/track/Dashboard";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />}/>
        <Route path="signup" element={<Signup />}/>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<Header />}>
          <Route index  element={<Home />}/>
          <Route path="dashboard" element={<Dashboard />}/>
        </Route>
      </Route>
  </Routes>
  )
}

export default App;