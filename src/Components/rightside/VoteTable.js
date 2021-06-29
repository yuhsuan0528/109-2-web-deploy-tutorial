import { Table, Tabs } from "antd";
import '../../App.css';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}



const VoteTable = ({ results, players }) => {
  const numberMap = {1: "一", 2: "二", 3: "三", 4: "四", 5:"五", 6: "六", 7: "七" ,8: "八", 9: "九", 10:"十"};
  const voteMap = {'T': '白', 'F': '黑'};

  var dataSource = [];
  console.log(results);
  console.log(players);

  if(results !== undefined){
    results.map((round, index) => {
         dataSource.push([]);
         results[index].vote.map((data, index_1) => {
          dataSource[index].push({
            key: index_1,
            game: `第${numberMap[index_1+1]}局`
          })
          for(var i=0; i < data.length; i++){
            dataSource[index][index_1][`result_${i+1}`] = voteMap[data[i]];
          }
          //data.map((vote, index_2) => dataSource[index][index_1][`result_${index_2+1}`] = voteMap[vote])
          return null;
        })
        return null;
      })
  }


 

  const columns = [
    {
      title: '',
      dataIndex: 'game'
    }
  ];
  if(results !== undefined){
    if(results.length !== 0){
      for(var i=1; i<=results[0].vote[0].length ; i++){
        columns.push({
          title: players[i-1].name,
          dataIndex: `result_${i}`
        })
      }
    }
  }
  

  return(
    <>
      <Tabs defaultActiveKey="1" onChange={callback}>
      { results === undefined ? <div></div> :
        dataSource.map((data, index)=>
          <TabPane tab={`第${numberMap[index+1]}回合`} key={index}>
            <Table dataSource={data} columns={columns} pagination={false} />
          </TabPane>
        )
      }
    </Tabs>
    </>
    );
}

export default VoteTable;