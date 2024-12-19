import React from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_TREE } from "../../mutations/add_tree";
import { UPDATE_TREE } from "../../mutations/update_tree";
import "./Footer.css";

const Footer = () => {
  const { formValues, setFormValues, selectedTree, setSelectedTree } = useOutletContext();
  const [addTreeMutation, { loading: addLoading, error: addError }] = useMutation(ADD_TREE);
  const [updateTreeMutation, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_TREE);
  const navigate = useNavigate();
console.log(selectedTree)

  const handleSubmit = async () => {
    try {
      if (!formValues?.id) {
        const { data } = await addTreeMutation({
          variables: {
            species: formValues.species ? {
              commonName: formValues.species.commonName,
              scientificName: formValues.species.scientificName
            } : null,
            variety: formValues.variety,
            dbh: formValues.dbh,
            photos: formValues.photos,
            notes: formValues.notes,
            nonnative: formValues.nonnative,
            invasive: formValues.invasive,
            location: formValues.location ? {
              northing: formValues.location.northing,
              easting: formValues.location.easting
            } : null,
            garden: formValues.garden,
            siteInfo: formValues.siteInfo ? {
              slope: formValues.siteInfo.slope,
              overheadLines: formValues.siteInfo.overheadLines,
              treeCluster: formValues.siteInfo.treeCluster,
              proximateStructure: formValues.siteInfo.proximateStructure,
              proximateFence: formValues.siteInfo.proximateFence,
            } : null,
            lastVisited: new Date().toLocaleDateString("en-US"),
            installedDate: formValues.installedDate,
            installedBy: formValues.installedBy,
            felledDate: formValues.felledDate,
            felledBy: formValues.felledBy,
            maintenanceNeeds: formValues.maintenanceNeeds ? {
              install: formValues.maintenanceNeeds.install,
              raiseCrown: formValues.maintenanceNeeds.raiseCrown,
              routinePrune: formValues.maintenanceNeeds.routinePrune,
              trainingPrune: formValues.maintenanceNeeds.trainingPrune,
              priorityPrune: formValues.maintenanceNeeds.priorityPrune,
              pestTreatment: formValues.maintenanceNeeds.pestTreatment,
              installGrate: formValues.maintenanceNeeds.installGrate,
              removeGrate: formValues.maintenanceNeeds.removeGrate,
              fell: formValues.maintenanceNeeds.fell,
              removeStump: formValues.maintenanceNeeds.removeStump
            } : null,
            careHistory: formValues.careHistory,
            hidden: formValues.hidden
          }
        });
        console.log("Tree added:", data.addTree);
        setFormValues(null);
        setSelectedTree(null);
        console.log("1")
        navigate("/")
      }
      else {
        const { data } = await updateTreeMutation({
          variables: {
            id: formValues.id,
            species: formValues.species ? {
              commonName: formValues.species.commonName,
              scientificName: formValues.species.scientificName
            } : null,
            variety: formValues.variety,
            dbh: formValues.dbh,
            photos: formValues.photos,
            notes: formValues.notes,
            nonnative: formValues.nonnative,
            invasive: formValues.invasive,
            location: formValues.location ? {
              northing: formValues.location.northing,
              easting: formValues.location.easting
            } : null,
            garden: formValues.garden,
            siteInfo: formValues.siteInfo ? {
              slope: formValues.siteInfo.slope,
              overheadLines: formValues.siteInfo.overheadLines,
              treeCluster: formValues.siteInfo.treeCluster,
              proximateStructure: formValues.siteInfo.proximateStructure,
              proximateFence: formValues.siteInfo.proximateFence,
            } : null,
            lastVisited: new Date().toLocaleDateString("en-US"),
            installedDate: formValues.installedDate,
            installedBy: formValues.installedBy,
            felledDate: formValues.felledDate,
            felledBy: formValues.felledBy,
            maintenanceNeeds: formValues.maintenanceNeeds ? {
              install: formValues.maintenanceNeeds.install,
              raiseCrown: formValues.maintenanceNeeds.raiseCrown,
              routinePrune: formValues.maintenanceNeeds.routinePrune,
              trainingPrune: formValues.maintenanceNeeds.trainingPrune,
              priorityPrune: formValues.maintenanceNeeds.priorityPrune,
              pestTreatment: formValues.maintenanceNeeds.pestTreatment,
              installGrate: formValues.maintenanceNeeds.installGrate,
              removeGrate: formValues.maintenanceNeeds.removeGrate,
              fell: formValues.maintenanceNeeds.fell,
              removeStump: formValues.maintenanceNeeds.removeStump
            } : null,
            careHistory: formValues.careHistory,
            hidden: formValues.hidden
          }
        });
        console.log("Tree updated:", data.updateTree);
        setFormValues(null);
        navigate("/")
      }
    }
    catch (err) {
    }
  };

  const handleCancel = () => {
    setFormValues(null);
    navigate("/");
  };

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