import { gql } from '@apollo/client';

export const GET_SPECIES = gql`
  query getSpecies {
    getSpecies {
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