import { gql } from '@apollo/client';


export const ROOM_PLAYERS_SUBSCRIPTION = gql`
  subscription roomPlayer($roomName: String!){
  roomPlayer(roomName: $roomName){
        data{
          name
        }
  }
}
`

export const PLAYER_LIST_SUBSCRIPTION = gql`
  subscription playerList($playerName: String!){
    data{
      name
      character
    me
    }
  }
`