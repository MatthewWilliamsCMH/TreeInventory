import { gql } from '@apollo/client';

export const DELETE_PHOTO = gql`
  mutation DeletePhoto($fileName: String!) {
    deletePhoto(fileName: $fileName)
  }
`;
