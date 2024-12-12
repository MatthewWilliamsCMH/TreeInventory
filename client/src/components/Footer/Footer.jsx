import React from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_TREE } from "../../mutations/update_tree";
import { ADD_TREE } from "../../mutations/add_tree";
import "./Footer.css";

const Footer = () => {
  const { updatedTree, setUpdatedTree } = useOutletContext();
  const [updateTreeMutation, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_TREE);
  const [addTreeMutation, { loading: addLoading, error: addError }] = useMutation(ADD_TREE);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!updatedTree?.id) {
        const { data } = await addTreeMutation({
          variables: {
            id: updatedTree.id,
            lastVisited: new Date().toLocaleDateString("en-US"),
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
        console.log("Tree added:", data.addTree);
           }
      else {

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
        alert("1")
        console.log("Tree updated:", data.updateTree);
        alert ("2")
        setUpdatedTree(null);
        alert("3")
        navigate("/");
        alert("4")
      }
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
      <button type="submit" onClick={handleSubmit} disabled={updateLoading || addLoading}>
        {updateLoading || addLoading ? "Updating..." : "OK"}
      </button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Footer;
