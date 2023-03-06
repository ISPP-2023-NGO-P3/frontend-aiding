import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import CreateUser from "./components/CreateUser";
import ViewUser from "./components/ViewUser";
import EditUser from "./components/EditUser";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/createuser" element={<CreateUser />} />
          <Route exact path="/viewuser/:id" element={<ViewUser />} />
          <Route exact path="/edituser/:id" element={<EditUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
