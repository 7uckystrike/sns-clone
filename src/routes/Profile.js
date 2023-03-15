import { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { updateProfile } from '@firebase/auth';
import { collection, orderBy, query, where, getDocs, updateDoc, doc} from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import Nweet from "../components/Nweet";

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
        <div>
          <div>
            <button onClick={onLogOutClick}>로그아웃</button> 
          </div>
          <form onClick={onSubmit}>
              <input type="text" value={newUserName} onChange={onChange} />
              <button type="submit">업데이트</button>
          </form>
          {userText.map((usertxt) => (
            <Nweet key={usertxt.id}
              nweetObj = {usertxt}
              userName = {usertxt.creatorName} />
          ))}
        </div>
    )
}

export default Profile






