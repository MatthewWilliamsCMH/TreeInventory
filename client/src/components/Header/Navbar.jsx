import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"

function Navbar() {
  return (
      <nav id="navbar">
        <p><Link to="/">Home</Link> | <Link to="/TreeInventory">Inventory</Link></p>
      </nav>
  );
};

export default Navbar;