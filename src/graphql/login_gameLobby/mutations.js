import { gql } from '@apollo/client';


export const CREATE_ROOM_MUTATION = gql`
  mutation createRoom(
    $roomName: String!
    $hostName: String!
    $num: Int!
    $passwd: String!
  ) {
    createRoom (
      roomName: $roomName
      hostName: $hostName
      num: $num
      passwd: $passwd
    )
  }
`;

export const JOIN_ROOM_MUTATION = gql`
  mutation joinRoom(
  $roomName: String!
  $playerName: String!
  $passwd: String!
  ) {
    joinRoom (
      roomName: $roomName
      playerName: $playerName
      passwd: $passwd
    )
  }
`;


export const SIGN_IN_MUTATION = gql`
  mutation logIn(
    $name: String!
  ) {
    logIn (
      name: $name
    )
  }
`;

export const SEARCH_ROOM = gql`
mutation searchRoom(
    $playerName: String!
    $keyword: String
  ) {
    searchRoom (
      playerName: $playerName
      keyword: $keyword
    )
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


export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage(
    $name1: String!
    $name2: String! 
    $body: String!
  ) {
    createMessage(
        name1: $name1
        name2: $name2
        body: $body
    ) {
      sender{
        name
      }
      body
    }
  }
`;
*/