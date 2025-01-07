import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Header.css";

function Header() {
// function Header({ formValues }) {
  // Access the context safely
  const context = useOutletContext();
  const formValues = context ? context.formValues : null;

  // State to track nonnative and invasive status
  // const [nonnativeStatus, setNonnativeStatus] = useState(false);
  // const [invasiveStatus, setInvasiveStatus] = useState(false);

  //I want to print "Nonnative" and "Invasive" in the header when these values are true, but they need to be cleared when the user navigates to the map or the inventory; they should only be visible on the forms. Maybe the way to do that is to create anotehr component that sits on top of the header and only show taht component on the forms. Need to think this through.
  // useEffect(() => {
  //   if (formValues) {
  //     setNonnativeStatus(formValues.nonnative || false);
  //     setInvasiveStatus(formValues.invasive || false);
  //   }
  // }, [formValues]);

  return (
    <div id="reactcontainer">
      <div>
        <header id="header">
          <h1>Summit Chase Tree Inventory</h1>
        </header>
      </div>
      {/* <div>
        {nonnativeStatus && <p className="danger">Nonnative</p>}
        {invasiveStatus && <p className="danger">Invasive</p>}
      </div> */}
    </div>
  );
}

export default Header;
