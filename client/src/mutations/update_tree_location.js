import { gql } from '@apollo/client';

export const UPDATE_TREE_LOCATION = gql`
  mutation updateTreeLocation($id: ID!, $location: LocationInput) {
    updateTreeLocation(id: $id, location: $location) {
      id
      location {
        northing
        easting
      }
    }
  }
`;
