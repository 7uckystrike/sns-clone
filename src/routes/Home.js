import { useEffect, useState } from "react";
import { dbService, storageService } from "../firebase";
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'
import Nweet from "../components/Nweet";
import styled from "@emotion/styled"  

const Home = ({ userObj }) => {
    const [text, setText] = useState("")
    const [uiText, setUiText] = useState([]);
    const [imgFile, setImgFile] = useState("")

    // console.log(uiText)

    useEffect(() => {
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            setUiText(nweetArray)        
        });
    },[])

    const onSubmit = async(e) => {
        e.preventDefault();
        
        let imgFileURL = ''
        if (imgFile !== '') {
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(fileRef, imgFile, "data_url")
            imgFileURL = await getDownloadURL(response.ref)
        }

        await addDoc(collection(dbService, 'nweets'), {
            twt: text,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            creatorName: userObj.displayName,
            imgFileURL,
        })

        setText("")
        setImgFile("")
    }

    const onChange = (e) => {
        setText(e.target.value)
    }

    const onFileChange = (e) => {
        const files = e.target.files;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const result = finishedEvent.currentTarget.result
            setImgFile(result)
        }
        reader.readAsDataURL(theFile)
    }

    const onFileClickClear = () => setImgFile(null)

    return(
        <Wrapper>
            <Wrapper__form>
                <input className="input_text" type="text" placeholder="무슨 일이 있었나요?" maxLength={120} value={text} onChange={onChange}/>
                <input className="input_submit" type="submit" value="등록" onClick={onSubmit} />
                <Wrapper__img>
                  <input type="file" accept="image/*" onChange={onFileChange} />
                  { imgFile && (
                      <div>
                          <img src={imgFile} width="50px" height="50px" alt="upload img"/>    
                          <button onClick={onFileClickClear}>삭제</button>
                      </div> 
                  )}
                </Wrapper__img>
            </Wrapper__form>
            {uiText.map((uitext) => (
                    <Nweet key={uitext.id}
                           nweetObj={uitext}
                           isOwner={uitext.creatorId === userObj.uid}
                           userId={userObj.uid}
                           userName={uitext.creatorName}/>   
            ))}
        </Wrapper>
    )
}

export default Home


// 스타일링
export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #fff; 
  margin: 40px;

`

export const Wrapper__form = styled.form`
  .input_text {
    width: 500px;
    background-color: transparent;
    padding-left: 5px;
    padding-bottom: 10px;
    font-size: 11px;
    border-bottom: 3px solid #000;
  }

  .input_submit {
    width: 55px;
    height: 50px;
    border: 3px solid #000;
    margin-left: 15px;
    background-color: transparent;
  }
`

export const Wrapper__img = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`