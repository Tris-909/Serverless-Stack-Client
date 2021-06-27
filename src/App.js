import React from "react";
import Routes from "./Route";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";

function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <Navbar.Brand className="font-weight-bold text-muted">
          Scratch
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;