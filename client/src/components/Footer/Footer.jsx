import React from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_TREE } from "../../mutations/update_tree";
import "./Footer.css";

const Footer = () => {
  const { updatedTree, setUpdatedTree } = useOutletContext();
  const [updateTreeMutation, { loading, error }] = useMutation(UPDATE_TREE);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!updatedTree?.id) {
        console.log("No tree to update.");
        return;
      }

      const { data } = await updateTreeMutation({
        variables: {
          id: updatedTree.id,
          lastVisited: updatedTree.lastVisited,
          species: updatedTree.species ? {
            commonName: updatedTree.species.commonName,
            scientificName: updatedTree.species.scientificName
          } : null,
          variety: updatedTree.variety,
          garden: updatedTree.garden,
          location: updatedTree.location ? {
            northing: updatedTree.location.northing,
            easting: updatedTree.location.easting
          } : null,
          dbh: updatedTree.dbh,
          installedDate: updatedTree.installedDate,
          installedBy: updatedTree.installedBy,
          felledDate: updatedTree.felledDate,
          felledBy: updatedTree.felledBy,
          maintenanceNeeds: updatedTree.maintenanceNeeds ? {
            install: updatedTree.maintenanceNeeds.install,
            raiseCrown: updatedTree.maintenanceNeeds.raiseCrown,
            routinePrune: updatedTree.maintenanceNeeds.routinePrune,
            trainingPrune: updatedTree.maintenanceNeeds.trainingPrune,
            priorityPrune: updatedTree.maintenanceNeeds.priorityPrune,
            pestTreatment: updatedTree.maintenanceNeeds.pestTreatment,
            installGrate: updatedTree.maintenanceNeeds.installGrate,
            removeGrate: updatedTree.maintenanceNeeds.removeGrate,
            fell: updatedTree.maintenanceNeeds.fell,
            removeStump: updatedTree.maintenanceNeeds.removeStump
          } : null,
          siteInfo: updatedTree.siteInfo ? {
            slope: updatedTree.siteInfo.slope,
            overheadLines: updatedTree.siteInfo.overheadLines,
            treeCluster: updatedTree.siteInfo.treeCluster,
            proximateStructure: updatedTree.siteInfo.proximateStructure,
            proximateFence: updatedTree.siteInfo.proximateFence,
          } : null,
          careHistory: updatedTree.careHistory,
          notes: updatedTree.notes,
          photos: updatedTree.photos,
          nonnative: updatedTree.nonnative,
          invasive: updatedTree.invasive
        }
      });

      if (data) {
        console.log(data)
        console.log("Tree updated:", data.updateTree);
        setUpdatedTree(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Unable to update tree.", err);
    }
  };

  const handleCancel = () => {
    setUpdatedTree(null);
    navigate("/");
  };

  // Only render footer buttons if there's an updated tree
  if (!updatedTree) return null;

  return (
    <div id="footer">
      <button type="submit" onClick={handleSubmit} disabled={loading}>
        {loading ? "Updating..." : "OK"}
      </button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Footer;