import { gql } from '@apollo/client';

export const DELETE_PHOTO = gql`
  mutation deletePhoto($publicId: String!) {
    deletePhoto(publicId: $publicId)
  }
`;
