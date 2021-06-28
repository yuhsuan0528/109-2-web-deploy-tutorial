import '../../App.css';
import { Tabs, Space, Divider } from "antd";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const Rule = () => {

  return (
    <>
      <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab={`角色介紹`} key="1">
            <Space direction="vertical" split={<Divider />}>
              <Space>
                <p>(正義方)梅林： 擁有知道所有邪惡方陣營玩家的能力，但不知道【莫德雷德】是誰。如果最後被【刺客】刺殺，邪惡方就會獲勝。</p>
                <img className="right-side-character-card" src="images/good_people_merlin.jpg" alt="1"/> 
              </Space>
              <Space>
                <p>(正義方)派西維爾：在遊戲開始時的辨識身份階段，可以知道誰是【梅林】以及【莫甘娜】，但不知道分別是誰。</p>
                <img className="right-side-character-card" src="images/good_people_percival.jpg" alt="1"/>
              </Space>
              <Space>
                <p>(正義方)亞瑟的忠臣： 沒有能力的正義方角色。</p>
                <img className="right-side-character-card" src="images/good_people_normal_1.jpg" alt="1"/>
                <img className="right-side-character-card" src="images/good_people_normal_2.jpg" alt="1"/>
              </Space>
              <Space>
                <p>(邪惡方)刺客：當遊戲結束，邪惡方失敗時，可以刺殺【梅林】來反敗為勝。</p>
                <img className="right-side-character-card" src="images/bad_people_assassin.jpg" alt="1"/>
              </Space>
              <Space>
                <p>(邪惡方)莫甘娜：在遊戲開始時的辨識身份階段，可以假扮成【梅林】，混淆【派西維爾】。</p>
                <img className="right-side-character-card" src="images/bad_people_morgana.jpg" alt="1"/>
              </Space>
              <Space>
                <p>(邪惡方)莫德雷德：可以不被【梅林】看到。</p>
                <img className="right-side-character-card" src="images/bad_people_mordred.jpg" alt="1"/>
              </Space>
              <Space>
                <p>(邪惡方)奧伯倫：屬於邪惡方角色，但是邪惡方陣營的玩家不曉得他的身份，他也不知道其他邪惡方的角色是誰。 #加入【奧伯倫】反而會對正義方有幫助</p>
                <img className="right-side-character-card" src="images/bad_people_oberon.jpg" alt="1"/>
              </Space>
              <Space>
                <p>(邪惡方)莫德雷德的爪牙：沒有能力的邪惡方角色。</p>
                <img className="right-side-character-card" src="images/bad_people_normal_1.jpg" alt="1"/>
                <img className="right-side-character-card" src="images/bad_people_normal_2.jpg" alt="1"/>
              </Space>
            </Space>
          </TabPane>
          <TabPane tab={`遊戲流程`} key="2">
            <p>玩家會輪流當領袖，並指派成員出任務，出任務的成員會決定這局的成敗。</p>
            <Divider orientation="left" plain>遊戲階段1/4：領袖組織隊伍</Divider>
            <p>領柚玩家把隊伍指示物給要出任務的玩家。 被選上出任務的玩家可以投票決定該回合是任務成功或失敗。任務成功代表正義陣營得一分，失敗則邪惡陣營得一分。
            在決定出任務成員的過程，玩家可以討論，並觀察推理出誰是好人，誰是壞人。一共有五個回合，每個回合出任務的人數都不太ㄧ樣，要看遊戲計分板上的數字。</p>
            <Divider orientation="left" plain>遊戲階段2/4：投票通過出任務成員</Divider>
            <p>當領袖確定好出任務成員後，還必須經由全體玩家投票，才能決定是否由這些玩家出任務。每位玩家選擇贊成或反對投票指示物，
              牌面朝下放置自己的桌面上，大家同時開牌。每個人都要投票，且會知道誰投贊成或反對。</p>
              <ul>
                <li>若是平局或反對票多數：代表投票失敗，投票次數標記往右移1格，並將領袖指示物給左邊玩家，新領袖重新上一個遊戲步驟(重新選擇任務成員，並再投票決定一次)。
                連續失敗五次時，邪惡陣營直接獲得勝利。</li>
                <li>若是多數贊成：投票次數標記放回位置1，進入下一步驟。</li>
              </ul>
            <Divider orientation="left" plain>遊戲階段3/4：出任務</Divider>
            <p>要出任務的玩家拿1張任務成功牌和1張任務失敗牌後，牌面朝下拿一張給領袖(這是秘密資訊)。領袖將蒐集到所有的任務牌洗混後翻開，確認任務成敗，
            判定方式如下：</p>
            <ul>
              <li>任務成功：所有牌都是任務成功。</li>
              <li>任務失敗：有1張以上的任務失敗牌出現。(7位玩家以上的第四回合，要有2張以上的任務失敗牌出現，任務才算失敗)</li>
            </ul>
            <Divider orientation="left" plain>遊戲階段4/4：判定任務結果</Divider>
            <ul>
              <li>若任務成功，將計分標記翻到藍色那面(失敗就翻到紅色那面)，放到該回合的框框上。</li>
              <li>將回合標記移至下回合，投票次數標記放回位置1。</li>
              <li>將領袖指示物給左邊玩家，進行新回合。</li>
            </ul>
          </TabPane>
        
    
      </Tabs>
    </>
  )
}

export default Rule;