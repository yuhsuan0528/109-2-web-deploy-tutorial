import { gql } from '@apollo/client';


export const ROOM_SUBSCRIPTION = gql`
  subscription room( $playerName: String! ) {
      room( playerName: $playerName ) {
        data {
          name
          host
          num_of_players
           players {
              name
            }
        }  
      }
    }
  
`;


/*  for reference
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