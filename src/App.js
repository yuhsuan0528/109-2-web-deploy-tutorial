
import './App.css';
import { useState, useEffect, useLayoutEffect } from "react";
import { message } from "antd";
import { useQuery } from '@apollo/react-hooks';
import SignIn from './Containers/SignIn.js';
import PlayRoom from './Containers/PlayRoom.js';
import GameLobby from './Containers/GameLobby.js';
import {
  ROOM_QUERY,
  ROOM_SUBSCRIPTION
} from './graphql';

const LOCALSTORAGE_KEY = "save-me";

const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState(savedMe || "");

  const [inRoom, setInRoom] = useState(false);

  const [roomName, setRoomName] = useState("");

  const [searchRoomName, setSearchRoomName] = useState("");
  const [showAllRooms, setShowAllRooms] = useState(false);
  // console.log(roomName)
  
  const displayStatus = (payload) => {
    if(payload.msg){
      const { type, msg } = payload;
      const content = {
        content: msg, duration : 1.0 };
      switch (type){
        case 'success':
          message.success(content)
          break
        case 'error':
        default:
          message.error(content)
          break
      }}
  }
  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [signedIn]);

    const { loading, error, data: roomsData, subscribeToMore } = useQuery(ROOM_QUERY, {
                                                                              variables:{ playerName: me, keyword: searchRoomName},
                                                                            });

   

   useLayoutEffect(() => {
    try {
      subscribeToMore({
        document: ROOM_SUBSCRIPTION,
        variables:{ playerName: me},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          // console.log(subscriptionData.data)
          // console.log(subscriptionData.data.room.data)
          const newRoom = subscriptionData.data.room.data;
          return { rooms: newRoom};
          //return newRoom;
        },
      });
    } catch (e) {
      // console.log(e);
    }
  }, [subscribeToMore, inRoom]);
   console.log(me);
   console.log(searchRoomName);
      console.log(roomsData);
   console.log(loading);
  return (
    <div >
      {signedIn ? inRoom ? (<PlayRoom me={me} displayStatus={displayStatus} roomName={roomName} setInRoom={setInRoom} roomsData={roomsData}/>) :
        (<GameLobby me={me} setInRoom={setInRoom} inRoom={inRoom} displayStatus={displayStatus} setRoomName={setRoomName} 
          data={roomsData} loading={loading} setSearchRoomName={setSearchRoomName} />) : 
        (<SignIn me={me} setMe={setMe} setSignedIn={setSignedIn} displayStatus={displayStatus} />)}
    </div>
    );
};
export default App;
