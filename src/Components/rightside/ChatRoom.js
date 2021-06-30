import '../../App.css';
import { useState } from "react";
import { useMutation } from '@apollo/react-hooks';
import { Input } from "antd";
import ChatBox from "./ChatBox.js"
import { CREATE_MESSAGE_MUTATION } from '../../graphql';

const ChatRoom = ({me, displayStatus, roomName}) => {

  const [messageInput, setMessageInput] = useState("");

  // handle GraphQL
  const [createMessage] = useMutation(CREATE_MESSAGE_MUTATION);

  var objDiv = document.getElementById("chatRoom");
  if(objDiv !== null){
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  

  return (
    <>  
      <div className="right-side-message">
      <div className="right-side-messagebox" id="chatRoom">
        {
           <ChatBox name1={me} roomName={roomName} />
        }
      </div>
      <div className="right-side-message-input-block">
      <Input.Search
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Enter message here...."
        enterButton="Send"
        size="large"
        
        onSearch={ (msg) => { 
          if(!msg){
            displayStatus({
              type: "error",
              msg: "Please enter message.",
            });
            return;
          }
          console.log(msg)
          try{
             createMessage({
              variables:{
                roomName: roomName,
                playerName: me,
                body: msg,
              }
            })
            setMessageInput("")
          }
          catch(e){
            console.log(e)
          }
        }}
      ></Input.Search>
      </div>
      </div>
      
    </>
  );
};

export default ChatRoom;