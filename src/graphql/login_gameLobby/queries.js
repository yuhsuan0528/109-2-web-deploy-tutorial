import { gql } from '@apollo/client';


export const ROOM_QUERY = gql`
  query rooms(
    $playerName: String!
    $keyword: String
  ) {
    rooms(
      playerName: $playerName
      keyword: $keyword
    ) {
      name
      host
      num_of_players
      passwd
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
