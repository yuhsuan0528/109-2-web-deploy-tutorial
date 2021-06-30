import "../App.css";
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useMutation } from '@apollo/react-hooks';
import { SIGN_IN_MUTATION } from "../graphql"

const SignIn = ({ me, setMe, setSignedIn, displayStatus }) => {

  const [signIn] = useMutation(SIGN_IN_MUTATION);

  return (
  <>
    <div className="sign-in">
      <div className="App-title"><h1>阿瓦隆線上版啦</h1></div>
      <Input.Search
        prefix={<UserOutlined />} // 產生人頭的圖案
        value={me}
        onChange={(e) => setMe(e.target.value)}
        placeholder="請輸入名字"
        enterButton="登入"
        size="large"
        style={{width: 300, margin: 50}}
        onSearch={ async (name) => { 
          if(!name){
            displayStatus({
              type:"error",
              msg: "Missing user name",
            });
          }
          else {
            setSignedIn(true);
            await signIn({
              variables:{
                name: me
              }
            })
          } }}
      ></Input.Search>
    </div>
  </>
  );
}

export default SignIn;