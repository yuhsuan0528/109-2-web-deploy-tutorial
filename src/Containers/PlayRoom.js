import "../App.css";
import { useState, useEffect, useLayoutEffect } from "react";
import { Row, Col } from "antd";
import Board from "../Components/Board.js";
import Player from "../Components/Players.js";
import Rightside from "./Rightside.js"
import { useQuery } from '@apollo/react-hooks';
import {
  GAMEINFO_QUERY,
  ROOMINFO_SUBSCRIPTION,
  PLAYER_LIST_QUERY,
  PLAYER_LIST_SUBSCRIPTION
} from "../graphql"

const PlayRoom = ({me, displayStatus, roomName}) => {
  const [membersToChoose, setMembersToChoose] = useState(4)
  const [membersChosen, setMembersChosen] = useState([])
  const [playerStatus,setPlayerStatus] = useState([
    {name:'1', me: true, character: 'P', isLeader: false, isAssigned: true, vote: 'true'},
    {name:'2', me: false, character: 'M', isLeader: true, isAssigned: true, vote: 'true'},
    {name:'3', me: false, character: 'null', isLeader: false, isAssigned: false, vote:'false'},
    {name:'4', me: false, character: 'null', isLeader: false, isAssigned: true, vote: 'true'},
    {name:'5', me: false, character: 'M', isLeader: false, isAssigned: false, vote: 'false'},
    {name:'6', me: false, character: 'null', isLeader: false, isAssigned: true, vote: 'true'},
  ])
  // name, character, me from roomInfo.players.playerList
  // isLeader, isAssigned, vote from roomInfo.players
  const [gameStatus, setGameStatus] = useState({score: [], round: 0})

  const [roomInfo, setRoomInfo] = useState({});

  // ----------- gameInfo -------------------
  const { loading, error, data, subscribeToMore } = useQuery(GAMEINFO_QUERY,{variables: { roomName: roomName},});

  useLayoutEffect( () => {
    try {
      subscribeToMore({
        document: ROOMINFO_SUBSCRIPTION,
        variables: { roomName: roomName},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newRoomInfo = subscriptionData.data.roomInfo.data;
          setRoomInfo(newRoomInfo);
          return newRoomInfo;
        },
      });
    } catch (e) {
      console.log(e);
  }
  }, [subscribeToMore]);

  useEffect(()=>{
    if(!loading) {
      setRoomInfo(data.roomInfo);
    }
  },[data])
  useEffect(() => {
    // console.log(roomInfo)
  }, [roomInfo])
  

  // const playerList = useQuery(PLAYER_LIST_QUERY,{variables: { playerName: me},});
  // if (playerList.error) console.log('Error:', playerList.error);
  // if (!playerList.loading) console.log("query: ", playerList.data)

  // useEffect(()=>{
  //   if(!playerList.loading) {
  //     setPlayerList1(playerList.data.playerList)
  //     console.log(playerList.data)
  //   }
  // },[playerList.data])

  // useLayoutEffect( () => {
  //   try {
  //     playerList.subscribeToMore({
  //       document: PLAYER_LIST_SUBSCRIPTION,
  //       variables: { playerName: me},
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData.data) return prev;
  //         const newPlayerList = subscriptionData.data.playerList.data;
  //         console.log("newPlayerList: ", newPlayerList)
  //         return newPlayerList;
  //       },
  //     });
  //   } catch (e) {
  //     console.log(e);
  // }
  // }, [subscribeToMore]);

  useEffect(() => {
    console.log(roomInfo)
    if (roomInfo.status !== "pre-game" && roomInfo.players){
      const self = roomInfo.players.find(player => player.name === me)
      let newPlayerStatus = [... self.players_list]
      for(let i=0; i<newPlayerStatus.length; i++){
        let roomInfoPlayer = roomInfo.players[i]//match name
        newPlayerStatus[i].isLeader = roomInfoPlayer.is_leader
        newPlayerStatus[i].isAssigned = roomInfoPlayer.is_assigned
        newPlayerStatus[i].vote = roomInfoPlayer.vote
      }
      setPlayerStatus(newPlayerStatus)
    }
    
  },[roomInfo.players])

  useEffect(()=>{
    if (roomInfo.status){
      if (roomInfo.status.includes("assign") || roomInfo.status.includes("vote")){
        let newRound = parseInt(roomInfo.status.slice(-1))-1
        console.log(newRound)
        setGameStatus(prev => ({... prev, round: newRound}))
      }
    }
  }, [roomInfo.status])

  useEffect(() => {
    if (roomInfo.cup_results){
      let newScore = []
      for(let i=0; i<roomInfo.cup_results.length; i++){
        if (roomInfo.cup_results[i].bad===0) newScore.push(1)
        else newScore.push(0)
      }
      setGameStatus(prev => ({... prev, score: newScore}))
    } else {
      setGameStatus(prev => ({... prev, score: []}))
    }
  }, [roomInfo.cup_results])
  useEffect(() => {
    console.log(gameStatus)
  }, [gameStatus])
  

  return (
    <>
      <Row >
        <Col className="Column-1"  xl={{ span: 16}}>
          <Player status={playerStatus} setMembersToChoose={setMembersToChoose} setMembersChosen={setMembersChosen} membersChosen={membersChosen} membersToChoose={membersToChoose}/>
          <Board status={gameStatus}/>
        </Col>
        <Col className="Column-2"  xl={{ span: 8}}>
          <Rightside me={me} membersToChoose={membersToChoose} roomName={roomName} roomInfo={roomInfo} displayStatus={displayStatus} membersChosen={membersChosen} setMembersToChoose={setMembersToChoose}/>
        </Col>
      </Row>
    </>);
    
  
};

export default PlayRoom;


/*
  return (
    <>
      <div className="App-title">
        <h1>{me}'s Chat Room</h1> 
      </div>
      <div className="App-messages">
        <Tabs 
          type="editable-card"
          activeKey={activeKey}
          onChange={handleChange}
          onEdit={(targetKey, action) => {
              if( action == "add") addChatBox();
              else if( action == "remove") {
                let newKey = removeChatBox(targetKey, activeKey) 
                handleChange(newKey);
              }
          }}
        >
          {chatBoxes.map(({ friend, key, chatLog }) =>{
            return (
              <TabPane tab={friend} key={key} closable={true}>
                <p> {friend}'s chatbox.</p>
              </TabPane>
            );
          })}
        </Tabs>
        
        
        {
        messages.length === 0 ? (<p style={{ color: '#ccc'}}> No messages ... </p>) :
          (messages.map(({ name, body}, i) => (name === me) ? 
            <p className="App-message App-message-me" key={i}> 
              {body} <Tag color="#2db7f5">{name}</Tag>                
            </p>    :  
            <p className="App-message" key={i}> 
              <Tag color="blue">{name}</Tag> {body} 
            </p>    

          
        ))}
    

      </div>
      <ChatModal
        visible={modalVisible}
        onCreate={({ name }) => {
          setActiveFriend(name);
          //startChat(me, activeFriend);
          setActiveKey(createChatBox(name, me));
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
      <Input.Search
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Enter message here...."
        enterButton="Send"
        size="large"
        onSearch={(msg) => { 
          if(!msg){
            displayStatus({
              type: "error",
              msg: "Please enter message.",
            });
            return;
          } else if(activeKey === ""){
            displayStatus({
              type: "error",
              msg: "Please add a chatbox first.",
            });
            setMessageInput("");
            return;
          }
          sendMessage({ key: activeKey, me: me, friend: activeFriend, body: msg });
          setMessageInput(""); 
        }}
      ></Input.Search>
    </>
  );*/