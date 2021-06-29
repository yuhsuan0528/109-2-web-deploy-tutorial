import '../../App.css';
import { Spin } from "antd";
import { VOTE_MUTATION } from "../../graphql"
import { useMutation } from '@apollo/react-hooks';

const ChooseVote = ({name, roomName, voted, setVoted}) => {



  const [vote] = useMutation(VOTE_MUTATION);

  return (
    <>
    {
      voted ? (<h1> <Spin /> 投完了！請等待其他玩家喔 </h1>):
      (<>
      <h1> 請投票 </h1>
      <div className="right-side-vote-area"> 
          <img className="right-side-vote-card" src="images/symbol_vote_yay.jpg" alt="1"/> 
          <img className="right-side-vote-card" src="images/symbol_vote_nay.jpg" alt="1"/>
      </div>
      <div className="right-side-vote-button-area"> 
        <button 
        className="right-side-vote-button" 
        onClick={ async () => {
          // console.log('click');
          try{
            await vote({
            variables:{
                roomName: roomName,
                playerName: name,
                agree: true,
              }
            })
            setVoted(true);  
          }
          catch(e){
            console.log(e)
          }
        }}>同意</button>
        <button 
        className="right-side-vote-button" 
        onClick={ async () => {
          try{
            await vote({
            variables:{
                roomName: roomName,
                playerName: name,
                agree: false,
              }
            }) 
            setVoted(true);
          }
          catch(e){
            console.log(e)
          }
        }}>反對</button>
      </div>
      </>
      )
    }
      
    </>
  )
}

export default ChooseVote;