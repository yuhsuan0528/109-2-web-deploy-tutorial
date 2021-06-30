import "../App.css";
import { useState, useEffect, useLayoutEffect } from "react";
import { Row, Col } from "antd";
import Board from "../Components/Board.js";
import Player from "../Components/Players.js";
import Rightside from "./Rightside.js"
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GAMEINFO_QUERY,
  ROOMINFO_SUBSCRIPTION,
  ASSASSIN_MUTATION
} from "../graphql"

const PlayRoom = ({me, displayStatus, roomName, setInRoom}) => {
  const [membersToChoose, setMembersToChoose] = useState(0)
  const [membersChosen, setMembersChosen] = useState([])
  const [playerStatus,setPlayerStatus] = useState([{name:me, me: true, character: 'null', isLeader: false, isAssigned: false, vote: 'null'}])
  // name, character, me from roomInfo.players.playerList
  // isLeader, isAssigned, vote (name) from roomInfo.players
  const [gameStatus, setGameStatus] = useState({score: [], round: 0})
  const [roomInfo, setRoomInfo] = useState({});
  const [assassinate] = useMutation(ASSASSIN_MUTATION)

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

  // useEffect(()=>{
  //   console.log(roomInfo)
  // },[roomInfo])

  useEffect(() => {
    if(roomInfo.status && roomInfo.players){
      if (roomInfo.status === "pre-game"){
        let newPlayerStatus = []
        for(let i=0; i<roomInfo.players.length; i++){
          let name = roomInfo.players[i].name
          if (name === me) newPlayerStatus.push({name:name, me: true, character: 'null', isLeader: false, isAssigned: false, vote: 'null'})
          else newPlayerStatus.push({name:name, me: false, character: 'null', isLeader: false, isAssigned: false, vote: 'null'})
        }
        // console.log(newPlayerStatus)
        setPlayerStatus(newPlayerStatus)
      } else if (roomInfo.status !== "pre-game" && !roomInfo.status.includes('win') && roomInfo.players.length === roomInfo.num_of_players){
        const self = roomInfo.players.find(player => player.name === me)
        let newPlayerStatus = [... self.players_list]
        for(let i=0; i<newPlayerStatus.length; i++){
          let roomInfoPlayer = roomInfo.players[i]
          newPlayerStatus[i].isLeader = roomInfoPlayer.is_leader
          newPlayerStatus[i].isAssigned = roomInfoPlayer.is_assigned
          newPlayerStatus[i].vote = roomInfoPlayer.vote
        }
        setPlayerStatus(newPlayerStatus)
      }
    }
    
  },[roomInfo.players])

  useEffect(()=>{
    if (roomInfo.status){
      console.log(roomInfo)
      if (roomInfo.status.includes("assign") || roomInfo.status.includes("vote")){
        let newRound = parseInt(roomInfo.status.slice(-1))-1
        setGameStatus(prev => ({... prev, round: newRound}))
      } else if (roomInfo.status.includes("win") && roomInfo.players){
        let newPlayerStatus = []
        for(let i=0; i<roomInfo.players.length; i++){
          let name = roomInfo.players[i].name
          let playerChar = roomInfo.players[i].players_list[i].character
          if (name === me) newPlayerStatus.push({name:name, me: true, character: playerChar, isLeader: false, isAssigned: false, vote: 'null'})
          else newPlayerStatus.push({name:name, me: false, character: playerChar, isLeader: false, isAssigned: false, vote: 'null'})
        }
        // console.log(newPlayerStatus)
        setPlayerStatus(newPlayerStatus)
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

  const playersParams = {
    me: me,
    status: playerStatus,
    membersToChoose: membersToChoose,
    setMembersToChoose: setMembersToChoose,
    membersChosen: membersChosen,
    setMembersChosen: setMembersChosen,
    roomInfo:roomInfo,
    assassinate: assassinate
  }

  const rightsideParams = {
    me: me,
    displayStatus: displayStatus, 
    membersToChoose: membersToChoose, 
    roomName: roomName,
    roomInfo: roomInfo, 
    membersChosen: membersChosen,
    setMembersChosen: setMembersChosen,
    setMembersToChoose: setMembersToChoose, 
    setInRoom: setInRoom
  }


  return (
    <>
      <Row >
        <Col className="Column-1"  xl={{ span: 16}}>
          <Player playersParams={playersParams}/>
          <Board status={gameStatus} roomInfo={roomInfo}/>
        </Col>
        <Col className="Column-2"  xl={{ span: 8}}>
          <Rightside rightsideParams={rightsideParams}/>
        </Col>
      </Row>
    </>);
    
  
};

export default PlayRoom;