import { gql } from '@apollo/client';


export const START_GAME_MUTATION = gql`
mutation startGame(
  $roomName: String!
  $playerName: String!
) {
  startGame (
    roomName: $roomName
    playerName: $playerName
  )
}
`;

export const ASSIGN_MUTATION = gql`
mutation assign(
  $roomName: String!
  $leaderName: String!
  $assignedNames: [String!]!
) {
  assign (
    roomName: $roomName
    leaderName: $leaderName
    assignedNames: $assignedNames
  )
}
`;

export const VOTE_MUTATION = gql`
mutation vote(
  $roomName: String!
  $playerName: String!
  $agree: Boolean!
) {
  vote (
    roomName: $roomName
    playerName: $playerName
    agree: $agree
  )
}
`;

export const CUP_MUTATION = gql`
mutation cup(
  $roomName: String!
  $playerName: String!
  $agree: Boolean!
) {
  cup (
    roomName: $roomName
    playerName: $playerName
    agree: $agree
  )
}
`; 


/* for reference
export const CREATE_CHATBOX_MUTATION = gql`
  mutation createChatBox(
    $name1: String! 
    $name2: String!
  ) {
    createChatBox(
        name1: $name1 
        name2: $name2
    ) {
      sender{
        name
      }
      body
    }
  }
`;


export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage(
    $name1: String!
    $name2: String! 
    $body: String!
  ) {
    createMessage(
        name1: $name1
        name2: $name2
        body: $body
    ) {
      sender{
        name
      }
      body
    }
  }
`;
*/