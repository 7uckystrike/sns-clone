import { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { updateProfile } from '@firebase/auth';
import { collection, orderBy, query, where, getDocs, updateDoc, doc} from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import Nweet from "../components/Nweet";
import styled from "@emotion/styled";

const Profile = ({ userObj, refreshUser }) => {
    const [userText, setUserText] = useState([]);
    const [newUserName, setNewUserName] = useState(userObj.displayName);
    const [userName, setUserName] = useState(""); // 구글로 가입하지 않은 사용자
    
    // console.log(userText)

    //트윗 모아보기 위해서 query를 통해서 데이터를 받는다.
    //페이지와 함께 로드 되어야한다. useEffect 사용.
    useEffect(async() => {
        const twt = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        )

        const querySnapshot = await getDocs(twt);
        querySnapshot.forEach((doc) => {
            const nweetObj = {
                ...doc.data(),
                id:doc.id,
            }
            setUserText(prev => [nweetObj, ...prev])
            setUserName(nweetObj.creatorName)
        })
    },[])

    const navigator = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigator("/");
    }

    //프로필 수정
    const onSubmit = async(e) => {
        e.preventDefault();
        if(userObj.displayName !== newUserName && userName !== newUserName) {
            await updateProfile(authService.currentUser, {
                displayName: newUserName
            })
            refreshUser();

            userText.map(async usertxt => {
                await updateDoc(doc(dbService, `nweets/${usertxt.id}`),{
                    creatorName: newUserName
                })
            })
        }
    }

    const onChange = (e) => {
        setNewUserName(e.target.value)
    }

    return (
        <Wrapper>
          <Wrapper__form>
            <form onClick={onSubmit}>
              <div>
                <span>닉네임 수정 : </span>
                <input type="text" value={newUserName} onChange={onChange} />
              </div>
              <div>
                <button className="name-update" type="submit">업데이트</button>
                <button className="log-out" onClick={onLogOutClick}>로그아웃</button> 
              </div>
            </form>
          </Wrapper__form>
          <Wrapper__text>
            {userText.map((usertxt) => (
              <Nweet key={usertxt.id}
                nweetObj = {usertxt}
                userName = {usertxt.creatorName} />
            ))}
          </Wrapper__text>
        </Wrapper>
    )
}

export default Profile



export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #fff; 
  margin: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

export const Wrapper__form = styled.form`
  width: 500px;
  height: 200px;
  margin-left: 30px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  
  input {
    width: 130px;
    border-bottom: 3px solid #000;
    margin-left: 4px;
    margin-bottom: 20px;
  }

  .log-out {
    margin-left: 15px;
    background-color: transparent;
    border: 3px solid #00ed64;
  }

  .name-update {
    border: 3px solid #000;
    background-color: #00ed64;
  }
`
export const Wrapper__text = styled.div`
  width: 500px;
`



