import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($userName: String!, $userPassword: String!) {
    loginUser(userName: $userName, userPassword: $userPassword) {
      userName
    }
  }
`;
