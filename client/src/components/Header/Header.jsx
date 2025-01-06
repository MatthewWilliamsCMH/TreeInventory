import React from "react";

import "./Header.css";

//import something here to get values for nonnative and invasive? variables need to be something like "selectedTree.nonnative"?

function Header() {
  // if (tree) {
  //   const nonnative = tree.nonnative || null;
  //   const invasive = tree.invasive || null;
  // }

  return (
    <div id = "reactcontainer">
      <div>
        <header id = "header">
          <h1>Summit Chase Tree Inventory</h1>
        </header>
      </div>
      {/* <div>
        {nonnative && <p className = "danger">Nonnative</p>}
        {invasive && <p className = "danger">Invasive</p>}
      </div> */}
    </div>
  );
};

export default Header;