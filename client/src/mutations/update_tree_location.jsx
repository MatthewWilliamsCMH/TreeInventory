import { gql } from "@apollo/client";

export const UPDATE_TREE_LOCATION = gql`
  mutation updateTreeLocation(
    $id: ID!
    $location: LocationInput
    $hidden: Boolean
  ) {
    updateTreeLocation(
      id: $id
      location: $location
      hidden: $hidden
    ) {
      id
      location {
        northing
        easting
      }
      hidden
    }
  }
`;