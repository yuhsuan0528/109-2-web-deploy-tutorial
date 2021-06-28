import { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { Tag } from "antd";
import '../../App.css';
import {
  ROOMCHAT_QUERY,
  MESSAGE_SUBSCRIPTION,
} from '../../graphql';

const ChatBox = ({name1, roomName}) => {

  // handle with GraphQL
  const { loading, error, data, subscribeToMore } = useQuery(ROOMCHAT_QUERY,{
                                                            variables: { roomName: roomName},
                                                          });


  useEffect(() => {
    if(!error){
        try {
        subscribeToMore({
          document: MESSAGE_SUBSCRIPTION,
          variables: { roomName: roomName },
          updateQuery: (prev, { subscriptionData }) => { 
            if (!subscriptionData.data) return prev;
            console.log(subscriptionData.data)
            console.log(subscriptionData.data.message)
            const newMessage = subscriptionData.data.message;
            return({ 
              roomChat: [ ...prev.roomChat, newMessage],
            });
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [subscribeToMore]);

  return (
    <>
      {
        data === undefined ? <div></div> :
          data.roomChat.length === 0 ? (<p style={{ color: '#ccc'}}> No messages ... </p>) :
          (data.roomChat.map(({ sender, body }, i) => (sender.name === name1) ? 
          (<p className="App-message App-message-me" key={i}> 
            {body} <Tag color="#2db7f5">{sender.name}</Tag>                
          </p> )   :  
          (<p className="App-message" key={i}> 
            <Tag color="blue">{sender.name}</Tag> {body} 
          </p> )
          )
        )
      }
      
    </>
  );
};

export default ChatBox;


/* Test data
let data = {
      chatBox:[{
        sender:{
          name:"Mary"
        },
        body:"HI"
      },
      {
        sender:{
          name:"John"
        },
        body:"HI"
      },
      {
        sender:{
          name:"Mary"
        },
        body:"How r u"
      },
      {
        sender:{
          name:"Mary"
        },
        body:"HI"
      },
      {
        sender:{
          name:"John"
        },
        body:"HI"
      },
      {
        sender:{
          name:"Mary"
        },
        body:"How r u"
      },
      {
        sender:{
          name:"Mary"
        },
        body:"HI"
      },
      {
        sender:{
          name:"John"
        },
        body:"HI"
      },
      {
        sender:{
          name:"Mary"
        },
        body:"How r u"
      }]
    }
*/