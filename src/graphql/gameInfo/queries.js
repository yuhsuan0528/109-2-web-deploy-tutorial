import { gql } from '@apollo/client';

export const GAMEINFO_QUERY = gql`
query roomInfo ($roomName: String!){
  roomInfo ( roomName: $roomName ) {
    name
    host
    num_of_players
    status
    players {
      name
      is_leader
      is_assigned
      vote
      players_list{
        name
        me
        character
      }
    }
    cup_results {
      good
      bad
      player
    }
    vote_results {
      vote
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
