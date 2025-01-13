import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_TREE } from '../../mutations/add_tree';
import { UPDATE_TREE } from '../../mutations/update_tree';
import './Footer.css';

const Footer = () => {
  const { updatedTree, setUpdatedTree, selectedTree, setSelectedTree, treeLocation, setTreeLocation } = useOutletContext(); //are selectedTree and treeLocation necessary?
  const [addTreeMutation, { loading: addTreeLoading, error: addTreeError }] = useMutation(ADD_TREE); //is addTreeError necessary?
  const [updateTreeMutation, { loading: updateTreeLoading, error: updateTreeError }] = useMutation(UPDATE_TREE); //is updateTreeError necessary?
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!updatedTree?.id) {
        const { data } = await addTreeMutation({
          variables: {
            commonName: updatedTree.commonName,
            variety: updatedTree.variety,
            dbh: updatedTree.dbh,
            photos: updatedTree.photos ? {
              bark: updatedTree.photos.bark,
              summerLeaf: updatedTree.photos.summerLeaf,
              autumnLeaf: updatedTree.photos.autumnLeaf,
              fruit: updatedTree.photos.fruit,
              flower: updatedTree.photos.flower,
              environs: updatedTree.photos.environs
            } : null,
            notes: updatedTree.notes,
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
            lastUpdated: new Date().toLocaleDateString('en-US'),
            installedDate: updatedTree.installedDate,
            installedBy: updatedTree.installedBy,
            felledDate: updatedTree.felledDate,
            felledBy: updatedTree.felledBy,
            careNeeds: updatedTree.careNeeds ? {
              install: updatedTree.careNeeds.install,
              raiseCrown: updatedTree.careNeeds.raiseCrown,
              routinePrune: updatedTree.careNeeds.routinePrune,
              trainingPrune: updatedTree.careNeeds.trainingPrune,
              priorityPrune: updatedTree.careNeeds.priorityPrune,
              pestTreatment: updatedTree.careNeeds.pestTreatment,
              installGrate: updatedTree.careNeeds.installGrate,
              removeGrate: updatedTree.careNeeds.removeGrate,
              fell: updatedTree.careNeeds.fell,
              removeStump: updatedTree.careNeeds.removeStump
            } : null,
            careHistory: updatedTree.careHistory,
            hidden: updatedTree.hidden
          }
        });
        console.log('Tree added:', data.addTree);
        setUpdatedTree(null);
        setSelectedTree(null);
        setTreeLocation(null); //necessary?
        navigate('/')
      }
      else {
        const { data } = await updateTreeMutation({
          variables: {
            id: updatedTree.id,
            commonName: updatedTree.commonName,
            variety: updatedTree.variety,
            dbh: updatedTree.dbh,
            photos: updatedTree.photos ? {
              bark: updatedTree.photos.bark,
              summerLeaf: updatedTree.photos.summerLeaf,
              autumnLeaf: updatedTree.photos.autumnLeaf,
              fruit: updatedTree.photos.fruit,
              flower: updatedTree.photos.flower,
              environs: updatedTree.photos.environs
            } : null,
            notes: updatedTree.notes,
            garden: updatedTree.garden,
            siteInfo: updatedTree.siteInfo ? {
              slope: updatedTree.siteInfo.slope,
              overheadLines: updatedTree.siteInfo.overheadLines,
              treeCluster: updatedTree.siteInfo.treeCluster,
              proximateStructure: updatedTree.siteInfo.proximateStructure,
              proximateFence: updatedTree.siteInfo.proximateFence,
            } : null,
            lastUpdated: new Date().toLocaleDateString('en-US'),
            installedDate: updatedTree.installedDate,
            installedBy: updatedTree.installedBy,
            felledDate: updatedTree.felledDate,
            felledBy: updatedTree.felledBy,
            careNeeds: updatedTree.careNeeds ? {
              install: updatedTree.careNeeds.install,
              raiseCrown: updatedTree.careNeeds.raiseCrown,
              routinePrune: updatedTree.careNeeds.routinePrune,
              trainingPrune: updatedTree.careNeeds.trainingPrune,
              priorityPrune: updatedTree.careNeeds.priorityPrune,
              pestTreatment: updatedTree.careNeeds.pestTreatment,
              installGrate: updatedTree.careNeeds.installGrate,
              removeGrate: updatedTree.careNeeds.removeGrate,
              fell: updatedTree.careNeeds.fell,
              removeStump: updatedTree.careNeeds.removeStump
            } : null,
            careHistory: updatedTree.careHistory,
            hidden: updatedTree.hidden
          }
        });
        console.log('Tree updated:', data.updateTree);
        setUpdatedTree(null);
        setTreeLocation(null); //necessary?
        navigate('/')
      }
    }
    catch (err) {
    }
  };

  const handleCancel = () => {
    setUpdatedTree(null);
    setTreeLocation(null); //necessary?
    navigate('/');
  };

  return (
    <div id='footer'>
      <div id = 'autodata'>
        <p>Last updated: { 
          updatedTree.lastUpdated 
            ? new Date(parseInt(updatedTree.lastUpdated)).toLocaleDateString('en-US') 
            : new Date().toLocaleDateString('en-US')
        }</p>
      </div>
      <div id = 'buttongroup'>
        <button type='submit' onClick={handleSubmit} disabled={updateTreeLoading || addTreeLoading}>
          {updateTreeLoading || addTreeLoading ? 'Updating...' : 'OK'}
        </button>
        <button type='button' onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Footer;