import React from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_TREE } from "../../mutations/add_tree";
import { UPDATE_TREE } from "../../mutations/update_tree";
import "./Footer.css";

const Footer = () => {
  const { updatedTree, setUpdatedTree } = useOutletContext();
  const [addTreeMutation, { loading: addLoading, error: addError }] = useMutation(ADD_TREE);
  const [updateTreeMutation, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_TREE);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!updatedTree?.id) {
        const { data } = await addTreeMutation({
          variables: {
            // id: updatedTree.id,
            species: updatedTree.species ? {
              commonName: updatedTree.species.commonName,
              scientificName: updatedTree.species.scientificName
            } : null,
            variety: updatedTree.variety,
            dbh: updatedTree.dbh,
            photos: updatedTree.photos,
            notes: updatedTree.notes,
            nonnative: updatedTree.nonnative,
            invasive: updatedTree.invasive,
            location: updatedTree.location ? {
              northing: updatedTree.location.northing,
              easting: updatedTree.location.easting
            } : null,
            garden: updatedTree.garden,
            siteInfo: updatedTree.siteInfo ? {
              slope: updatedTree.siteInfo.slope,
              overheadLines: updatedTree.siteInfo.overheadLines,
              treeCluster: updatedTree.siteInfo.treeCluster,
              proximateStructure: updatedTree.siteInfo.proximateStructure,
              proximateFence: updatedTree.siteInfo.proximateFence,
            } : null,
            lastVisited: new Date().toLocaleDateString("en-US"),
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
            careHistory: updatedTree.careHistory,
            hidden: updatedTree.hidden
          }
        });
        console.log("Tree added:", data.addTree);
        setUpdatedTree(null);
        navigate("/");
           }
      else {

      const { data } = await updateTreeMutation({
        variables: {
          id: updatedTree.id,
          species: updatedTree.species ? {
            commonName: updatedTree.species.commonName,
            scientificName: updatedTree.species.scientificName
          } : null,
          variety: updatedTree.variety,
          dbh: updatedTree.dbh,
          photos: updatedTree.photos,
          notes: updatedTree.notes,
          nonnative: updatedTree.nonnative,
          invasive: updatedTree.invasive,
          location: updatedTree.location ? {
            northing: updatedTree.location.northing,
            easting: updatedTree.location.easting
          } : null,
          garden: updatedTree.garden,
          siteInfo: updatedTree.siteInfo ? {
            slope: updatedTree.siteInfo.slope,
            overheadLines: updatedTree.siteInfo.overheadLines,
            treeCluster: updatedTree.siteInfo.treeCluster,
            proximateStructure: updatedTree.siteInfo.proximateStructure,
            proximateFence: updatedTree.siteInfo.proximateFence,
          } : null,
          lastVisited: updatedTree.lastVisited,
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
          careHistory: updatedTree.careHistory,
          hidden: updatedTree.hidden
        }
      });

      if (data) {
        console.log("Tree updated:", data.updateTree);
        setUpdatedTree(null);
        navigate("/");
      }
      }
    } catch (err) {
      console.error("Unable to update data.", err);
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
