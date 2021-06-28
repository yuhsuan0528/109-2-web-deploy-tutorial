import { gql } from '@apollo/client';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription message (
    $roomName: String!
  ) {
    message (
      roomName: $roomName
    ) {
      data {
        sender {
          name
        }
        body
      }  
    }
  }
`;


/* for reference 
export const MESSAGE_SUBSCRIPTION = gql`
    subscription ($chatBoxName: String!) {
      message(chatBoxName: $chatBoxName){
        data{
          sender{
            name
          }
          body
        }
      }
    }
`;
*/