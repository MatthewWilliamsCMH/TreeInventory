import React, { useEffect, useState } from "react";
import "./Header.css";

function DangerFlags({ formValues }) {
  // State to track nonnative and invasive status
  const [nonnativeStatus, setNonnativeStatus] = useState(false);
  const [invasiveStatus, setInvasiveStatus] = useState(false);

  useEffect(() => {
    if (formValues) {
      setNonnativeStatus(formValues.nonnative || false);
      setInvasiveStatus(formValues.invasive || false);
    }
  }, [formValues]);

  return (
    <div id="reactcontainer">
        {nonnativeStatus && <p className="danger">Nonnative</p>}
        {invasiveStatus && <p className="danger">Invasive</p>}
    </div>
  );
}

export default DangerFlags;
