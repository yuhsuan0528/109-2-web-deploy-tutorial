import { gql } from '@apollo/client';


export const ASSASSIN_MUTATION = gql`
  mutation assassin(
    $roomName: String!
    $playerName: String!
    $targetName: String!
  ) {
    assassin (
      roomName: $roomName
      playerName: $playerName
      targetName: $targetName
    )
  }
`;