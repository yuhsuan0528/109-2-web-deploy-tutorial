import '../../App.css';
import { Space, Divider, Tag } from "antd";

const CupTable = ({ results, players }) => {

  const numberMap = {1: "一", 2: "二", 3: "三", 4: "四", 5:"五", 6: "六", 7: "七" ,8: "八", 9: "九", 10:"十"}; 

  return (
    
    <>

      <Space direction="vertical" split={<Divider type="horizontal" />}>
        { results === undefined ? <div></div> :
          results.map( ({good, bad, player}, index) => {
            player.sort()
            return (
              <div>
              <p>{`第${numberMap[index+1]}局`}</p>
              <Space split={<Divider type="vertical"/>}>
                <div>
                  {new Array(good).fill(null).map((_, index) => 
                    <img className="right-side-cup-card" src="images/mission_success.jpg" key={`cup_card_good_${index}`} alt="1"/>
                  )}
                  {new Array(bad).fill(null).map((_, index) => 
                    <img className="right-side-cup-card" src="images/mission_fail.jpg" key={`cup_card_bad_${index}`} alt="1"/>
                  )}
                </div>
                <div>
                {
                  player.map((number, index) =>
                    <Tag color="volcano">{String(players[number].name)}</Tag>
                  )
                }
                </div>
              </Space>
            </div>
            )
          }
            
          )
        }
        

      </Space>
    </>
  )

}


export default CupTable;

/*
<div>
          <p>第一局</p>
          <Space split={<Divider type="vertical"/>}>
            <div>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
            </div>
            <div>
              <Tag color="volcano">一號玩家</Tag>
              <Tag color="volcano">二號玩家</Tag>
              <Tag color="volcano">三號玩家</Tag>
              <Tag color="volcano">一號玩家</Tag>
              <Tag color="volcano">二號玩家</Tag>
            </div>
          </Space>
        </div>
        <div>
          <p>第二局</p>
          <Space split={<Divider type="vertical"/>}>
            <div>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
            </div>
            <div>
              <Tag color="volcano">一號玩家</Tag>
              <Tag color="volcano">二號玩家</Tag>
              <Tag color="volcano">三號玩家</Tag>
              <Tag color="volcano">一號玩家</Tag>
              <Tag color="volcano">二號玩家</Tag>
            </div>
          </Space>
        </div>
        <div>
          <p>第三局</p>
          <Space split={<Divider type="vertical"/>}>
            <div>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
              <img className="right-side-cup-card" src="images/mission_success.jpg"/>
            </div>
            <div>
              <Tag color="volcano">一號玩家</Tag>
              <Tag color="volcano">二號玩家</Tag>
              <Tag color="volcano">三號玩家</Tag>
              <Tag color="volcano">一號玩家</Tag>
              <Tag color="volcano">二號玩家</Tag>
            </div>
          </Space>
        </div>
*/