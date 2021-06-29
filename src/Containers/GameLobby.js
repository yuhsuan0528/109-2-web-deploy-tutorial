import "../App.css";
import { Button, Space, Divider, Tag, Modal, Input, Select, Switch } from "antd";
import { useState, useLayoutEffect } from "react";
import { useMutation } from '@apollo/react-hooks';
import { UserAddOutlined, FrownOutlined, UserOutlined, TagOutlined, LockOutlined } from '@ant-design/icons';
import {
  CREATE_ROOM_MUTATION,
  JOIN_ROOM_MUTATION
} from '../graphql';


const { Option } = Select;

const GameLobby = ({me, setInRoom, inRoom, displayStatus, setRoomName, data, loading, setSearchRoomName}) => {

  const [isModalVisible_password, setIsModalVisible_password] = useState(false);
  const [isModalVisible_create, setIsModalVisible_create] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomNum, setCreateRoomNum] = useState(5);
  const [createRoomPW, setCreateRoomPW] = useState("#$%#$%#$%#$%#$%#$%#$%");
  const [usePassword, setUsePassword] = useState(false);

  const [targetRoomName, setTargetRoomName] = useState("");

  const [inputName, setInputName] = useState("");
  

  
  // handle with modals
  const showModal = (type, name) => {
    if(type === "password") {
      setIsModalVisible_password(true);
      setTargetRoomName(name);
    }
    else if(type === "create") setIsModalVisible_create(true);
  };

  const handleOk = async (type) => {
    if(type === "password"){
      if(passwordInput === ""){
        displayStatus({
          type:"error",
          msg: "Missing Password",
        });
      }
      else {
        try{
            await joinRoom({
            variables:{
                roomName: targetRoomName,
                playerName: me,
                passwd: passwordInput,
              }
            })
            setRoomName(targetRoomName);
            setInRoom(true);   
          }
          catch(e){
            displayStatus({
              type:"error",
              msg: "密碼錯誤!!!QQ",
            });
          }
        setIsModalVisible_password(false);
      }
    }
    else if (type === "create"){
      if(checkNameUsed(createRoomName)){
        displayStatus({
          type:"error",
          msg: "Room Name is Used! Please Enter another name!",
        });
      }
      else{
        setIsModalVisible_create(false);
        console.log(createRoomPW);
        await createRoom({
          variables:{
            roomName: createRoomName,
            hostName: me,
            num: createRoomNum,
            passwd: createRoomPW,
          }
        })
        setRoomName(createRoomName);
        setInRoom(true);
      }   
    }
  };

  const handleCancel = (type) => {
    if(type === "password") setIsModalVisible_password(false);
    else if(type === "create") setIsModalVisible_create(false);
  };


  const handleCreateRoomName = (e) => {
    setCreateRoomName(e.target.value);
  }

  const handleCreateRoomPW = (e) => {
    if(usePassword) setCreateRoomPW(e.target.value);
  }

  const handleSearchRoomName = (e) => {
    setInputName(e.target.value)
  }

  const handleCreateRoomNum = (value) => {
    setCreateRoomNum(parseInt(value, 10));
  }

  const handlePassword = (e) => {
    //console.log(e.target.value);
    setPasswordInput(e.target.value);
  }

 
  const handleSwitchChange = (checked) => {
    //console.log('radio checked', e.target.value);
    if(checked) setUsePassword(true);
    else {
      setUsePassword(false);
      setCreateRoomPW("#$%#$%#$%#$%#$%#$%#$%");
    }
  };
  // handle with GraphQL
  

  const [createRoom] = useMutation(CREATE_ROOM_MUTATION);
  const [joinRoom] = useMutation(JOIN_ROOM_MUTATION);


console.log(data);

  const checkIsMemberInRoom = (name) => {
    for(var i=0; i<data.rooms.length; i++){    
      if(data.rooms[i].name === name){
        for(var j=0; j<data.rooms[i].players.length; j++){
          if(data.rooms[i].players[j].name === me){
            return true
          }
          
        }
      }
    }
    return false;
  }

  const checkNameUsed = (name) => {
    const sameName = data.rooms.find(room => room.name === name);
    if(sameName === undefined) return false;
    else return true;
  }

  return (

    <>
    <div className="game-lobby-main-block">
      <div className="game-lobby-top-area">
      <Space>
        <Button className="game-lobby-main-button" bordered={false} size="large" onClick={() => showModal("create", '_')}>建立房間</Button>
        <Input style={{ width: 200 }} placeholder="搜尋房間" onChange={handleSearchRoomName}/>
        <Button className="game-lobby-main-button" bordered={false} size="large" onClick={() => setSearchRoomName(inputName)}>搜尋房間</Button>
        <Button className="game-lobby-main-button" bordered={false} size="large" onClick={() => setSearchRoomName('')}>顯示所有房間</Button>
      </Space>
      </div>
      <Space direction="vertical" split={<Divider />}>
        { loading?  (<div> Loading </div>) : 
          data.rooms.map( ({name, players, num_of_players, passwd}, index) => 
            (<Space key={`room${index}`}>
              <div className="game-lobby-room">
                <p className="game-lobby-room-name"> {name}
                  <div> 
                    <Tag color="#A6C2CE" icon={<UserOutlined />}> {players.length}/{num_of_players} </Tag>
                    <Tag color="#BCBCBC" ><TagOutlined />{` room_${index}`}</Tag>
                    {
                      passwd === "#$%#$%#$%#$%#$%#$%#$%" ? <div></div>: 
                      <Tag color="#EA7171" ><LockOutlined /> Password </Tag>
                    }
                  </div>
                </p>
                
                <div className="game-lobby-button">
                  { 
                    players.length >= num_of_players && !checkIsMemberInRoom(name) ? <Button bordered={false} block={true} disabled={true} size="large"> <FrownOutlined /> 房間已滿</Button> :
                    passwd !== "#$%#$%#$%#$%#$%#$%#$%" ? <Button bordered={false} block={true} size="large" onClick={() => showModal("password", name)}> <UserAddOutlined />加入房間</Button> :
                    <Button 
                    bordered={false} 
                    block={true} 
                    size="large" 
                    onClick={ async () => {     
                          try{
                            await joinRoom({
                            variables:{
                                roomName: name,
                                playerName: me,
                                passwd: "#$%#$%#$%#$%#$%#$%#$%",
                              }
                            })
                            setRoomName(name);
                            setInRoom(true);   
                          }
                          catch(e){
                            // console.log(e)
                          }
                          }}> 
                      <UserAddOutlined />加入房間
                    </Button>
                  }
                </div>
              </div>
            </Space>)) 
        }
        
      </Space>

    </div>
    <Modal title="房間密碼" 
      visible={isModalVisible_password} 
      onOk={() => handleOk("password")} 
      onCancel={() => handleCancel("password")} 
      width={600}>
      請輸入房間密碼：
      <Input placeholder="Input Password" onChange={handlePassword}/>
    </Modal>

    <Modal title="建立房間" 
      visible={isModalVisible_create} 
      onOk={() => handleOk("create")} 
      onCancel={() => handleOk("create")} 
      width={600}>
      <p>
      請輸入房間名稱： <Input placeholder="Input Room Name" size="middle" style={{ width: 300 }} onChange={handleCreateRoomName}/>
      </p>
      <p> 請選擇遊戲人數：
        <Select defaultValue="5" style={{ width: 120 }} onChange={handleCreateRoomNum}>
          <Option value="5">5</Option>
          <Option value="6">6</Option>
          <Option value="7">7</Option>
          <Option value="8">8</Option>
          <Option value="9">9</Option>
          <Option value="10">10</Option>
        </Select>
      </p>
      <p> <Switch onChange={handleSwitchChange} /> 使用密碼 </p>
      <p>
      {
        usePassword ? <Input.Password placeholder="Input password" onChange={handleCreateRoomPW}/> : 
        <Input.Password placeholder="Input password" onChange={handleCreateRoomPW} disabled/>
      }
      </p>
    </Modal>
    

    </>
  )
}

export default GameLobby; 

/*
// test data
  const roomData = [
    {
      ID: 1,
      name:"我的房間",
      password:"1234",
      currentPlayerNum: 1,
      maxPlayerNum: 5,
    },
    {
      ID: 2,
      name:"嗨嗨快來玩",
      password:null,
      currentPlayerNum: 3,
      maxPlayerNum: 8,
    },
    {
      ID: 3,
      name:"阿瓦隆訓練房",
      password:null,
      currentPlayerNum: 5,
      maxPlayerNum: 5,
    },
    {
      ID: 4,
      name:"11231312",
      password:null,
      currentPlayerNum: 7,
      maxPlayerNum: 7,
    },
  ]

<Space>
          <div className="game-lobby-room">
            <p className="game-lobby-room-name">我的房間 <Tag color="#A6C2CE" icon={<UserOutlined />}> 1/5 </Tag></p>
            
            <div className="game-lobby-button">
              <Button bordered={false} block={true} size="large" onClick={showModal}> <UserAddOutlined />加入房間</Button>
            </div>
          </div>
        </Space>
        <Space>
          <div className="game-lobby-room">
            <p className="game-lobby-room-name">嗨嗨快來玩 <Tag color="#A6C2CE" icon={<UserOutlined />}> 3/5 </Tag> </p>
            <div className="game-lobby-button">
              <Button bordered={false} block={true} size="large"  onClick={showModal}> <UserAddOutlined />加入房間</Button>
            </div>
          </div>
        </Space>
        <Space>
          <div className="game-lobby-room">
            <p className="game-lobby-room-name">阿瓦隆練習房<Tag color="#A6C2CE" icon={<UserOutlined />}> 5/5 </Tag></p>
            <div className="game-lobby-button">
              <Button bordered={false} block={true} disabled={true}size="large"> <FrownOutlined /> 房間已滿</Button>
            </div>
          </div>
        </Space>
*/