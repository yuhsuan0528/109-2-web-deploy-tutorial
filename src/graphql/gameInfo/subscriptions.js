import { gql } from '@apollo/client';

export const ROOMINFO_SUBSCRIPTION = gql`
subscription roomInfo($roomName: String!) {
  roomInfo (
    roomName: $roomName
  ) {
    data {
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