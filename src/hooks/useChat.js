import { useState } from "react";

const useChat = (server) => {

    const [messages, setMessages] = useState([]);
    const [status, setStatus ] = useState({});
    
    
    server.onmessage = (m) => { // 接收server來的message
      onEvent(JSON.parse(m.data));
    };
    server.sendEvent = (e) => server.send(JSON.stringify(e));

    const startChat = (me, friend) => {
        console.log('Start Chat!!!');
        console.log(friend);

        server.sendEvent({
           type: 'CHAT',
           data: { to: friend, name: me },
           //data: { key },
        });
    };
  
    const sendMessage = (payload) => {
      console.log(payload);
      const { me, friend, body } = payload;
      server.sendEvent({
          type: 'MESSAGE',
          data: { to: friend, name: me, body: body },
      });
    };


    const onEvent = (e) => { 
    // 看收到的message是哪個type然後作相對應的動作
        const { type } = e;
        switch (type) {
          case 'CHAT': {
            setMessages(e.data.messages);
            break;
          }
          case 'MESSAGE': {
            setMessages([...messages, e.data.message]);
            break;
          }
        }
      };
  
      
  
    /*
    client.onmessage = (byteString) =>{
        const { data } = byteString;
        const [task, payload] = JSON.parse(data);
        switch (task) {
            case "output" : {
                setMessage(() =>
                    [...messages, ...payload]); break; }
            case "status" : {
                setStatus(payload); break; }
            default: break;
        }
    }
    
    const sendData = async (data) => {
        await client.send(
            JSON.stringify(data));
    };
    */
    return { status, messages, sendMessage, startChat };
}

export default useChat;