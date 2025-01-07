import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Header.css";

function Header() {
  // Access the context safely
  const context = useOutletContext();
  const selectedTree = context ? context.selectedTree : null;

  // State to track nonnative and invasive status
  const [nonnativeStatus, setNonnativeStatus] = useState(false);
  const [invasiveStatus, setInvasiveStatus] = useState(false);

  // Update states when selectedTree changes
  useEffect(() => {
    if (selectedTree) {
      setNonnativeStatus(selectedTree.nonnative || false);  // Set to false if not available
      setInvasiveStatus(selectedTree.invasive || false);    // Set to false if not available
    }
  }, [selectedTree]);  // Only re-run when selectedTree changes

  return (
    <div id="reactcontainer">
      <div>
        <header id="header">
          <h1>Summit Chase Tree Inventory</h1>
        </header>
      </div>
      <div>
        {nonnativeStatus && <p className="danger">Nonnative</p>}
        {invasiveStatus && <p className="danger">Invasive</p>}
      </div>
    </div>
  );
}

export default Header;
