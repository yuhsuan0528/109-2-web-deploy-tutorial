import '../../App.css';
import { Image  } from "antd";

const CharacterTable = ({playerNum}) => {

  return(
    <>
    
      <p> 
        <Image width={75} className="right-side-character-card" src="images/good_people_merlin.jpg"/> 
        <Image width={75} className="right-side-character-card" src="images/good_people_percival.jpg"/>
        <Image width={75} className="right-side-character-card" src="images/good_people_normal_1.jpg"/>
      </p>
        
      <p>  
        <Image width={75} className="right-side-character-card" src="images/bad_people_assassin.jpg"/> 
        <Image width={75} className="right-side-character-card" src="images/bad_people_morgana.jpg"/>
      </p>

    </>
  )
}

export default CharacterTable;