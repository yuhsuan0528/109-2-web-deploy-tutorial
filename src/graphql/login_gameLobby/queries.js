import { gql } from '@apollo/client';


export const ROOM_QUERY = gql`
  query rooms {
    rooms {
      name
      host
      num_of_players
      players {
        name
      }
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
