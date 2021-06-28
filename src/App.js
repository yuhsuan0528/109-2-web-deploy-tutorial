
import './App.css';
import { useState, useEffect } from "react";
import { message } from "antd";
import SignIn from './Containers/SignIn.js';
import PlayRoom from './Containers/PlayRoom.js';
import GameLobby from './Containers/GameLobby.js';

const LOCALSTORAGE_KEY = "save-me";

const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState(savedMe || "");

  const [inRoom, setInRoom] = useState(false);

  const [roomName, setRoomName] = useState("");
  console.log(roomName)
  
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


  return (
    <div >
      {signedIn ? inRoom ? (<PlayRoom me={me} displayStatus={displayStatus} roomName={roomName}/>) :
        (<GameLobby me={me} setInRoom={setInRoom} displayStatus={displayStatus} setRoomName={setRoomName}/>) : 
        (<SignIn me={me} setMe={setMe} setSignedIn={setSignedIn} displayStatus={displayStatus} />)}
    </div>
    );
};
export default App;
