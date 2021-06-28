import "../App.css";
import { useState, useEffect } from "react";
import { Button, Modal, Space, Card, message, Spin } from "antd";
import { useMutation } from '@apollo/react-hooks';
import ChatRoom from "../Components/rightside/ChatRoom.js";
import VoteTable from "../Components/rightside/VoteTable.js";
import CharacterTable from "../Components/rightside/CharacterTable.js";
import CupTable from "../Components/rightside/CupTable.js";
import Rule from "../Components/rightside/Rule.js";
import ChooseVote from "../Components/rightside/ChooseVote.js";
import ChooseCup from "../Components/rightside/ChooseCup.js";
import ChoosePeople from "../Components/rightside/ChoosePeople.js";
import {
  START_GAME_MUTATION,
  LEAVE_ROOM_MUTATION,
  CLOSE_ROOM_MUTATION
} from "../graphql"
import StartAnime from '../Components/Anime/StartAnime.js';
import GoodVictoryAnime from '../Components/Anime/GoodVictoryAnime.js';
import BadVictoryAnime from '../Components/Anime/BadVictoryAnime.js';

const Rightside = ({me, displayStatus, server, membersToChoose, roomName, roomInfo, membersChosen, setMembersToChoose, setInRoom}) => {

  const assignedNumberList = {5: [2,3,2,3,3],
                              6: [2,3,4,3,4],
                              7: [2,3,3,4,4],
                              8: [3,4,4,5,5],
                              9: [3,4,4,5,5],
                              10:[3,4,4,5,5]}
 

  const [isModalVisible_vote, setIsModalVisible_vote] = useState(false);
  const [isModalVisible_cup, setIsModalVisible_cup] = useState(false);
  const [isModalVisible_rule, setIsModalVisible_rule] = useState(false);

  const [cardContent, setCardContent] = useState("character");

  const [voted, setVoted] = useState(false);
  const [cupped, setCupped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [showStartAnime, setShowStartAnime] = useState(false);
  const [showGoodWinAnime, setShowGoodWinAnime] = useState(false);
  const [showBadWinAnime, setShowBadWinAnime] = useState(false);


  const showModal = (type) => {
    if(type === "vote") setIsModalVisible_vote(true);
    else if(type === "cup") setIsModalVisible_cup(true);
    else if(type === "rule") setIsModalVisible_rule(true);
    
  };

  const handleOk = (type) => {
    if(type === "vote") setIsModalVisible_vote(false);
    else if(type === "cup") setIsModalVisible_cup(false);
    else if(type === "rule") setIsModalVisible_rule(false);
  };

  const handleCancel = (type) => {
    if(type === "vote") setIsModalVisible_vote(false);
    else if(type === "cup") setIsModalVisible_cup(false);
    else if(type === "rule") setIsModalVisible_rule(false);
  };

  const openNotification = (type) => {
    if(type === "vote"){
      setCardContent("vote");
      message.info('該你投票嚕!!!!');
    }
    else if(type === "cup"){
      setCardContent("cup");
      message.info('該你出任務嚕!!!!');
    }
    else if(type === "team"){
      setCardContent("team");
      message.info('該你派票嚕!!!!')
    }
    else if(type === "waitAssign"){
      setCardContent("waitAssign");
    }
  };
  // console.log(roomInfo);

  

  const playerNum = 5;

  // handle GraphQL
  const [startGame] = useMutation(START_GAME_MUTATION);
  const [leaveRoom] = useMutation(LEAVE_ROOM_MUTATION);
  const [closeRoom] = useMutation(CLOSE_ROOM_MUTATION);

  const checkLeader = () => {
    for(var i=0; i<roomInfo.players.length; i++){
      if(me === roomInfo.players[i]['name']){
        return roomInfo.players[i]['is_leader'];
      }
    }
    return null;
  }

  const checkIsAssigned = () => {
    for(var i=0; i<roomInfo.players.length; i++){
      if(me === roomInfo.players[i]['name']){
        return roomInfo.players[i]['is_assigned'];
      }
    }
    return null;
  }


  useEffect(()=>{
    if(Object.keys(roomInfo).length !== 0){
      const [status, round, time] = roomInfo.status.split('-');
      setVoted(false);
      setCupped(false);
      setShowStartAnime(false);
      // console.log(status);
      if(status === 'assign' && !gameStarted){
        setShowStartAnime(true)
        var timeoutID = window.setTimeout(( () => {
          setShowStartAnime(false); 
        }), 5000);
      }

      if(status === 'assign' && checkLeader() ){
        openNotification("team");
        setMembersToChoose(assignedNumberList[roomInfo.num_of_players][round-1]);
        setGameStarted(true)
      }
      else if(status === 'assign') {
        setGameStarted(true);
        openNotification("waitAssign");
      }
      else if (status === "vote") openNotification("vote");
      else if(status === 'cup' && checkIsAssigned()) openNotification("cup");
      else if (status === 'cup') setCardContent("wait_cup");
      else if (status === 'pre') {
        openNotification("character");
        setGameStarted(false);
      }
      else if(status === 'bad') {
        setGameStarted(false); 
        setShowGoodWinAnime(true)
        var timeoutID = window.setTimeout(( () => {
          setShowGoodWinAnime(false); 
        }), 5000);
      }
      else if(status === 'good') {
        setGameStarted(false); 
        setShowBadWinAnime(true)
        var timeoutID = window.setTimeout(( () => {
          setShowBadWinAnime(false); 
        }), 5000);
      }
      else  openNotification("character");
    }
    console.log(roomInfo) 
  }, [roomInfo])


  // for vote and cup table
  const cupResults = roomInfo.cup_results;
  const voteResults = roomInfo.vote_results;

  return (
    <>
          
          <div className="right-side-top-area">
            <button 
            className="right-side-leave-room-button" 
            bordered={false}
            onClick={async () => {
              try{
                  await leaveRoom({
                  variables:{
                      roomName: roomName,
                      playerName: me,
                    }
                  })
                  setInRoom(false)
                }
                catch(e){
                  console.log(e);
                }  
            }}>離開房間</button>
            
            { roomInfo.host === me ?  <button 
            className="right-side-leave-room-button" 
            bordered={false}
            onClick={async () => {
              try{
                  await closeRoom({
                  variables:{
                      roomName: roomName,
                      playerName: me,
                    }
                  })
                  setInRoom(false)
                }
                catch(e){
                  console.log(e);
                }  
            }}>關閉房間</button> : <div></div>
            }
          </div>
           <div className="right-side-character-board">

           <Card  bordered={false} style={{ width: 450 }}>
            
            <div className="right-side-card">
              
              { //style={{padding:"10px",backgroundColor:"white", opacity:"0.5", zIndex:"100"}}
                showStartAnime ?<StartAnime/> : 
                showGoodWinAnime ? <GoodVictoryAnime/> :
                showBadWinAnime ? <BadVictoryAnime/> :
                cardContent === "character" ?  <CharacterTable playerNum={playerNum}/> : 
                cardContent === "vote" ? <ChooseVote name={me} roomName={roomName} voted={voted} setVoted={setVoted}/> : 
                cardContent === "cup" ? <ChooseCup name={me} roomName={roomName} cupped={cupped} setCupped={setCupped}/> : 
                cardContent === "team" ? <ChoosePeople number={membersToChoose} membersChosen={membersChosen} roomName={roomName} leaderName={me}/> :
                cardContent === "wait_cup" ?  <h1> <Spin />等待其他玩家出任務 </h1> :
                <h1> <Spin />等待其他玩家派票 </h1>
              }
              
            </div>

          </Card>
            
            
            <Space>
              <Button className="right-side-button" bordered={false} onClick={() => showModal("cup")}>任務結果</Button>
              <Button className="right-side-button" bordered={false} onClick={() => showModal("vote")}>投票紀錄</Button>
              <Button className="right-side-button" bordered={false} onClick={() => showModal("rule")}>遊戲規則</Button>
              { 
                (roomInfo.host === me && !gameStarted )? <Button 
                className="right-side-button" 
                bordered={false} 
                onClick={ async () => {
                  if(roomInfo.num_of_players !== roomInfo.players.length) {
                    displayStatus({
                        type:"error",
                        msg: "The room is not full yet",
                      });
                  }
                  else{
                    try{
                      await startGame({
                      variables:{
                          roomName: roomName,
                          playerName: me,
                        }
                      })
                    }
                    catch(e){
                      console.log(e);
                    }      
                  }}}>
                開始遊戲
                </Button> :
                <Button className="right-side-button" bordered={false} disabled>開始遊戲</Button> 
              }
            </Space>
          </div>
            <ChatRoom me={me} displayStatus={displayStatus} roomName={roomName}/>

            <Modal title="派票紀錄" 
            visible={isModalVisible_vote} 
            onOk={() => handleOk("vote")} 
            onCancel={() => handleCancel("vote")} 
            width={600}>
              <VoteTable results={voteResults}/>
            </Modal>

            <Modal title="投票結果" 
            visible={isModalVisible_cup} 
            onOk={() => handleOk("cup")} 
            onCancel={() => handleCancel("cup")} 
            width={900}>
              <CupTable results={cupResults}/>
            </Modal>

            <Modal title="遊戲規則" 
            visible={isModalVisible_rule} 
            onOk={() => handleOk("rule")} 
            onCancel={() => handleCancel("rule")} 
            width={800}>
              <Rule/>
            </Modal>
    </>);
    
  
};

export default Rightside;

/* 
<Button className="right-side-button" bordered={false} onClick={() => setCardContent("character")}>看角色</Button>
Test Data
const cupResults = [
    {good: 1, bad: 1, player: [1,2]},
    {good: 3, bad: 0, player: [1,2,4]},
    {good: 2, bad: 1, player: [2,4,5]},
  ]

  const voteResults = [
    [
      ['W','W','B','B','B'],
      ['W','W','W','W','W']
    ],
    [
      ['W','B','B','B','B'],
      ['B','B','B','W','W'],
      ['W','W','B','B','B'],
      ['W','W','W','W','W']
    ]   
  ]
  */