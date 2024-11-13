import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery, gql } from "@apollo/client";

const GET_TREES = gql`
  query GetTrees {
    trees {
      id
      species {
        commonName
        scientificName
      }
      genus
      garden
      location {
        northing
        easting
      }
      photo
    }
  }
`;

const TreeMap = () => {
  const { loading, error, data } = useQuery(GET_TREES); // fetch trees
  const mapRef = useRef(null); // Use ref for map container
  const map = useRef(null); // Use ref to store Leaflet map instance

  useEffect(() => {
    // Initialize map only once when mapRef is available
    if (mapRef.current && !map.current) {
      map.current = L.map(mapRef.current).setView([39.97768230836944, -83.04934859084177], 30);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.current);
    }

    // Add markers for each tree if data is available
    if (data && data.trees) {
      data.trees.forEach((tree) => {
        const { northing, easting } = tree.location[0];
        const popupContent = `
          <b>${tree.species[0]?.commonName || "Unknown"}</b><br>
          Genus: ${tree.genus}<br>
          Garden: ${tree.garden}
        `;
        L.marker([northing, easting])
          .bindPopup(popupContent)
          .addTo(map.current); // Add marker to the map
      });
    }

    // Cleanup on unmount (optional but recommended)
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [data]); // Only rerun the effect when data changes

  if (loading) return <p>Loading trees...</p>;
  if (error) return <p>Error fetching trees: {error.message}</p>;

  return <div ref={mapRef} style={{ height: '100vh', width: '100vw' }}></div>;
};

export default TreeMap;
