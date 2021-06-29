import '../../App.css';
import { Space, Button } from "antd";
import { ASSIGN_MUTATION } from "../../graphql"
import { useMutation } from '@apollo/react-hooks';

const ChoosePeople = ({number, membersChosen, roomName, leaderName}) => {

  const [assign] = useMutation(ASSIGN_MUTATION);

  return (
    <>
      <h1> 請派票 </h1>
      <div className="right-side-vote-area"> 
      <Space>
          {number > 0 && new Array(number).fill(null).map((_, index) => 
            <img style={{width: "70px"}} src="images/marker_team.jpg" alt="1"/> 
          )}
      </Space>
      {
        number === 0 ? <Button 
        className="right-side-assign-button" 
        onClick={ async () => {
          try{
            await assign({
            variables:{
                roomName: roomName,
                leaderName: leaderName,
                assignedNames: membersChosen
              }
            })  
          }
          catch(e){
            console.log(e)
          }
        }}>
        開始投票
        </Button> :
        <Button className="right-side-assign-button" disabled>開始投票</Button>
      }
      </div>
    </>
  )
}

export default ChoosePeople;


