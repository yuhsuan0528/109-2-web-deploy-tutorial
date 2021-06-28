import '../../App.css';
import { Spin } from "antd";
import { CUP_MUTATION } from "../../graphql"
import { useMutation } from '@apollo/react-hooks';

const ChooseCup = ({name, roomName, cupped, setCupped}) => {

  

  const [cup] = useMutation(CUP_MUTATION);

  return (
    <>
    {
      cupped ? (<h1> <Spin /> 投完了！請等待其他玩家喔 </h1>):
      (<>
      <h1> 請出任務 </h1>
      <div className="right-side-vote-area"> 
          <img className="right-side-vote-card" src="images/mission_success.jpg" alt="1"/> 
          <img className="right-side-vote-card" src="images/mission_fail.jpg" alt="1"/>
      </div>
      <div className="right-side-vote-button-area"> 
        <button 
        className="right-side-vote-button" 
        onClick={ async () => {
          try{
            await cup({
            variables:{
                roomName: roomName,
                playerName: name,
                agree: true,
              }
            })
            setCupped(true);  
          }
          catch(e){
            console.log(e)
          }
        }}>任務成功</button>
        <button 
        className="right-side-vote-button" 
        onClick={ async () => {
          try{
            await cup({
            variables:{
                roomName: roomName,
                playerName: name,
                agree: false,
              }
            }) 
            setCupped(true);
          }
          catch(e){
            console.log(e)
          }
        }}>任務失敗</button>
      </div>
      </>
      )
    }
    </>
  )
}

export default ChooseCup;