import { gql } from '@apollo/client';

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage(
    $roomName: String!
    $playerName: String!
    $body: String
  ) {
    createMessage (
      roomName: $roomName
      playerName: $playerName
      body: $body
    ) {
      sender {
        name
      }
      body
    }
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

*/