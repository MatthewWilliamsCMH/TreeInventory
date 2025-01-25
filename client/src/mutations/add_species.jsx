import { gql } from '@apollo/client';

export const ADD_SPECIES = gql`
  mutation addSpecies(
    $commonName: String!
    $scientificName: String!
    $family: String!
    $markerColor: String!
    $nonnative: Boolean!
    $invasive: Boolean!
  ) {
    addSpecies(
      commonName: $commonName
      scientificName: $scientificName
      family: $family
      markerColor: $markerColor
      nonnative: $nonnative
      invasive: $invasive
    ) {
      commonName
      scientificName
      family
      markerColor
      nonnative
      invasive
    }
  }
`;