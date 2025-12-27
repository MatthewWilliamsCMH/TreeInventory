import { gql } from '@apollo/client';

export const DELETE_PHOTO = gql`
  mutation deletePhoto($fileName: String!) {
    deletePhoto(fileName: $fileName)
  }
`;
