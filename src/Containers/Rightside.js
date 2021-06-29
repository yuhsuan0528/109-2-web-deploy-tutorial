import "../App.css";
import { useState, useEffect } from "react";
import { Button, Modal, Space, Card, message, Spin, Popconfirm, Tag, Divider } from "antd";
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

const Rightside = ({rightsideParams}) => {
const {me, displayStatus, server, membersToChoose, roomName, roomInfo, membersChosen, setMembersToChoose, setInRoom, roomsData} = rightsideParams;
 const assignedNumberList = {5: [2,3,2,3,3],
                              6: [2,3,4,3,4],
                              7: [2,3,3,4,4],
                              8: [3,4,4,5,5],
                              9: [3,4,4,5,5],
                              10:[3,4,4,5,5]}
 

  const [isModalVisible_vote, setIsModalVisible_vote] = useState(false);
  const [isModalVisible_cup, setIsModalVisible_cup] = useState(false);
  const [isModalVisible_rule, setIsModalVisible_rule] = useState(false);
  const [isModalVisible_result, setIsModalVisible_result] = useState(false);

  const [visible_confirmCloseRoom, setVisible_confirmCloseRoom] = useState(false);
  const [visible_confirmLeaveRoom, setVisible_confirmLeaveRoom] = useState(false);

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
    else if(type === "result") setIsModalVisible_result(false);
  };

  const handleCancel = (type) => {
    if(type === "vote") setIsModalVisible_vote(false);
    else if(type === "cup") setIsModalVisible_cup(false);
    else if(type === "rule") setIsModalVisible_rule(false);
    else if(type === "result") setIsModalVisible_result(false);
    else if(type === "conirmCloseRoom") setVisible_confirmCloseRoom(false);
    else if(type === "conirmLeaveRoom") setVisible_confirmLeaveRoom(false);
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


  //console.log(roomInfo);

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

  const checkIsAssassin = () => {
    const self = roomInfo.players.find(player => player.name === me);
    const isMe = self.players_list.find(list => list.name === me);
    const isAssassin = isMe.character === 'A';
    return  isAssassin;
  }

  const checkMissingMembers = () => {
    return roomInfo.players.length < roomInfo.num_of_players
  }

  const checkRoomClosed = () => {
    const roomExist = roomsData.rooms.find(room => room.name === roomName)
    if(roomExist === undefined ) return true;
    else return false; 
  }

  useEffect(()=>{
    if (checkRoomClosed() && Object.keys(roomInfo).length !== 0){
        setCardContent("roomClosed");
      }
  },[roomsData])

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
      
      if (checkMissingMembers() && gameStarted) {
        setCardContent("SomeoneMissing");
      }
      else if(status === 'assign' && checkLeader() ){
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
        setCardContent("character");
        setGameStarted(false);
      }
      else if(status === 'good') {
        setGameStarted(false); 
        setShowGoodWinAnime(true)
        var timeoutID = window.setTimeout(( () => {
          setShowGoodWinAnime(false); 
        }), 5000);
        setCardContent("character");
      }
      else if(status === 'bad') {
        setGameStarted(false); 
        setShowBadWinAnime(true)
        var timeoutID = window.setTimeout(( () => {
          setShowBadWinAnime(false); 
        }), 5000);
        setCardContent("character");
      }
      else if(status === 'assassin' && checkIsAssassin()) {
        setCardContent("isAssassin");
      }
      else if(status === 'assassin' && !checkIsAssassin()) {
        setCardContent("WaitAssassin");
      }
      
     
      else  setCardContent("character");
    }
    //console.log(roomInfo) 
  }, [roomInfo])

   // for vote and cup table
  const cupResults = roomInfo.cup_results;
  const voteResults = roomInfo.vote_results;

  useEffect(()=>{
    if(Object.keys(roomInfo).length !== 0){
      //console.log(cupResults)
      //console.log(voteResults)
      const [status, round, time] = roomInfo.status.split('-');
      if(status === 'cup' || (status === 'assign' && roomInfo.status !== 'assign-1-1')){
        setIsModalVisible_result(true)
      } 
    }
  },[roomInfo.status])


 

  return (
    <>
          
          <div className="right-side-top-area">
            房間名稱：{roomName}
            { roomInfo.host === me ?  
              <Popconfirm
                title="確定要關閉房間嗎？"
                visible={visible_confirmCloseRoom}
                onConfirm={async () => {
                    try{
                        await closeRoom({
                        variables:{
                            roomName: roomName,
                            playerName: me,
                          }
                        })
                        setInRoom(false)
                        setVisible_confirmCloseRoom(false);
                      }
                      catch(e){
                        console.log(e);
                      }  
                  }}
                onCancel={() => handleCancel("conirmCloseRoom")}
              >
              <button 
                  className="right-side-leave-room-button" 
                  bordered={false}
                  onClick={() => setVisible_confirmCloseRoom(true)}>關閉房間</button> 
                  </Popconfirm> : 
                <Popconfirm
                title="確定要離開房間嗎？"
                visible={visible_confirmLeaveRoom}
                onConfirm={async () => {
                    try{
                        await leaveRoom({
                        variables:{
                            roomName: roomName,
                            playerName: me,
                          }
                        })
                        setInRoom(false)
                        setVisible_confirmLeaveRoom(false);
                      }
                      catch(e){
                        console.log(e);
                      }  
                  }}
                onCancel={() => handleCancel("conirmLeaveRoom")}
                > 
                <button 
                  className="right-side-leave-room-button" 
                  bordered={false}
                  onClick={()=>setVisible_confirmLeaveRoom(true)}>離開房間</button>
                  </Popconfirm>
                  }
               
           </div>
           <div className="right-side-character-board">

           <Card  bordered={false} style={{ width: 450 }}>
            
            <div className="right-side-card">
              
              { //style={{padding:"10px",backgroundColor:"white", opacity:"0.5", zIndex:"100"}}
                showStartAnime ?<StartAnime/> : 
                showGoodWinAnime ? <GoodVictoryAnime/> :
                showBadWinAnime ? <BadVictoryAnime/> :
                cardContent === "character" ?  <CharacterTable playerNum={roomInfo.num_of_players} players={roomInfo.players}/> : 
                cardContent === "vote" ? <ChooseVote name={me} roomName={roomName} voted={voted} setVoted={setVoted}/> : 
                cardContent === "cup" ? <ChooseCup name={me} roomName={roomName} cupped={cupped} setCupped={setCupped}/> : 
                cardContent === "team" ? <ChoosePeople number={membersToChoose} membersChosen={membersChosen} roomName={roomName} leaderName={me}/> :
                cardContent === "wait_cup" ?  <h1> <Spin />等待其他玩家出任務 </h1> :
                cardContent === "isAssassin" ? <h1> 請刺客刺殺梅林 </h1> :
                cardContent === "WaitAssassin" ? <h1> <Spin />等待刺客刺殺梅林 </h1> :
                cardContent === "SomeoneMissing" ? <h1> 有玩家離開房間... 請等待 </h1> :
                cardContent === "roomClosed" ? <h1> 房間已關閉.... 請重新開啟遊戲</h1>:
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

            <Modal title="投票紀錄" 
            visible={isModalVisible_vote} 
            onOk={() => handleOk("vote")} 
            onCancel={() => handleCancel("vote")} 
            width={600}>
              <VoteTable results={voteResults} players={roomInfo.players}/>
            </Modal>

            <Modal title="任務結果" 
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

            <Modal title="結果" 
            visible={isModalVisible_result} 
            onOk={() => handleOk("result")} 
            onCancel={() => handleCancel("result")} 
            width={800}>

            { Object.keys(roomInfo).length === 0 ? <div></div> :
              roomInfo.status.includes('assign-1-1') ?  <div></div> :
              roomInfo.status.includes('assign') && (roomInfo.status.includes('-2-1') || roomInfo.status.includes('-3-1')
              || roomInfo.status.includes('-4-1') || roomInfo.status.includes('-5-1')) ?
              <Space>
                <div>
                  {new Array(cupResults[Object.keys(cupResults)[Object.keys(cupResults).length-1]].good).fill(null).map((_, index) => 
                    <img className="right-side-cup-card" src="images/mission_success.jpg" key={`cup_card_good_${index}`} alt="1"/>
                  )}
                  {new Array(cupResults[Object.keys(cupResults)[Object.keys(cupResults).length-1]].bad).fill(null).map((_, index) => 
                    <img className="right-side-cup-card" src="images/mission_fail.jpg" key={`cup_card_bad_${index}`} alt="1"/>
                  )}
                </div>
                <div>
                {
                  cupResults[Object.keys(cupResults)[Object.keys(cupResults).length-1]].player.map((number, index) =>
                    <Tag color="volcano">{`玩家${number+1}`}</Tag>
                  )
                }
                </div>
              </Space> :
              <Space split={<Divider type="vertical" />}>
              
              {
                voteResults.length === 0 || voteResults === undefined ? <div/> :
                new Array(roomInfo.num_of_players).fill(null).map((_, index) => 
                <Space direction="vertical">
                <div style={{fontSize:"20px"}}>{roomInfo.players[index].name}</div>
                <div>
                { 
                  voteResults[voteResults.length-1].vote[voteResults[voteResults.length-1].vote.length-1][index] === 'T' ? 
                  <img className="right-side-cup-card" src="images/symbol_vote_yay.jpg" key={`vote_yay_${index}`} alt="1"/>:
                  <img className="right-side-cup-card" src="images/symbol_vote_nay.jpg" key={`vote_nay_${index}`} alt="1"/>
                }
                </div>
                </Space>
                )
              }
              
              </Space>
            }
            </Modal>
    </>)
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

  { 
                  voteResults[voteResults.length-1].vote[voteResults[voteResults.length-1].vote.length-1][index] === 'T' ? 
                  <img className="right-side-cup-card" src="images/symbol_vote_yay.jpg" key={`vote_yay_${index}`} alt="1"/>:
                  <img className="right-side-cup-card" src="images/symbol_vote_nay.jpg" key={`vote_nay_${index}`} alt="1"/>
                }
  */