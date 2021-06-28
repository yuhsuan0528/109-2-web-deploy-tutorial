import { gql } from '@apollo/client';

export const ROOM_PLAYERS_QUERY = gql`
  query roomPlayers($roomName: String!){
    roomPlayers(roomName: $roomName){
        name
    }
  }
`;

export const PLAYER_LIST_QUERY = gql`
  query playerList($playerName: String!){
    name
    character
    me
  }
`;
