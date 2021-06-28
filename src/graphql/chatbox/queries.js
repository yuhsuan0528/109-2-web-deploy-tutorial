import { gql } from '@apollo/client';


export const ROOMCHAT_QUERY = gql`
  query roomChat(
    $roomName: String!
  ) {
    roomChat (
      roomName: $roomName
    ) {
      sender {
        name
      }
      body
    }
  }
`;

/* for reference
export const  CHATBOX_QUERY = gql`
  query($name: String!){
    chatBox(name:$name){
      sender{
        name
      }
      body    
    }
  }
`;
*/
