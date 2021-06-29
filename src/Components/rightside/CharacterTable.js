import '../../App.css';
import { Image  } from "antd";

const CharacterTable = ({playerNum, players}) => {
  const size = (playerNum === 10 ) ? 65 : 75; 
  return(
    <>
      <div> 已加入玩家: 
      {
        players !== undefined ?  players.map(({name}) => `, ${name}`) : <div></div>
      }
      </div>

      <p> 
        <Image width={size} className="right-side-character-card" src="images/good_people_merlin.jpg"/> 
        <Image width={size} className="right-side-character-card" src="images/good_people_percival.jpg"/>
        <Image width={size} className="right-side-character-card" src="images/good_people_normal_1.jpg"/>
        {
          playerNum === 6 ? <Image width={size} className="right-side-character-card" src="images/good_people_normal_2.jpg"/> :
          playerNum === 7 ? <Image width={size} className="right-side-character-card" src="images/good_people_normal_2.jpg"/> :
          playerNum === 8 ? (<> <Image width={size} className="right-side-character-card" src="images/good_people_normal_2.jpg"/>
                             <Image width={size} className="right-side-character-card" src="images/good_people_normal_3.jpg"/> </> ) :
          playerNum === 9 || playerNum === 10 ? (<> <Image width={size} className="right-side-character-card" src="images/good_people_normal_2.jpg"/>
                             <Image width={size} className="right-side-character-card" src="images/good_people_normal_3.jpg"/> 
                             <Image width={size} className="right-side-character-card" src="images/good_people_normal_4.jpg"/></> ) : <div></div>
        }
      </p>    
      <p>  
        <Image width={size} className="right-side-character-card" src="images/bad_people_assassin.jpg"/> 
        <Image width={size} className="right-side-character-card" src="images/bad_people_morgana.jpg"/>
        {
          playerNum === 7 ? <Image width={size} className="right-side-character-card" src="images/bad_people_oberon.jpg"/> :
          playerNum === 8 ? <Image width={size} className="right-side-character-card" src="images/bad_people_normal_2.jpg"/> :
          playerNum === 9 ? <Image width={size} className="right-side-character-card" src="images/bad_people_mordred.jpg"/> :
          playerNum === 10 ? <><Image width={size} className="right-side-character-card" src="images/bad_people_mordred.jpg"/>
          <Image width={size} className="right-side-character-card" src="images/bad_people_oberon.jpg"/></> : <div></div>
        }
      </p>

    </>
  )
}

export default CharacterTable;