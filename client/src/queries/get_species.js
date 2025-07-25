import { gql } from '@apollo/client';

export const GET_SPECIES = gql`
  query getSpecies {
    species: getSpecies {
      id
      family
      commonName
      scientificName
      nonnative
      invasive
      markerColor
    }
  }
`;
