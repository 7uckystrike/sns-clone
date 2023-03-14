import { useEffect, useState, useRef } from "react";
import { dbService, storageService } from "../firebase";
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { addDoc, collection } from "firebase/firestore";
import { FaCameraRetro, FaPencilAlt } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'
import Nweet from "../components/Nweet";
import styled from "@emotion/styled"  


const Home = ({ userObj }) => {
    const [text, setText] = useState("")
    const [uiText, setUiText] = useState([]);
    const [imgFile, setImgFile] = useState("")

    const fileInput = useRef();

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
                <div className="form__file">
                  <label htmlFor="file-input" className="file-input"><FaCameraRetro /></label>
                  <input id="file-input" ref={fileInput} type="file" accept="image/*" onChange={onFileChange} style={{display:"none"}} />
                  <button className="submit-input" type="submit" onClick={onSubmit}><FaPencilAlt/></button>
                </div>
                
                { imgFile && (
                    <div className="file_img">
                      <img src={imgFile} width="400px" height="auto" alt="upload" className="img"/>    
                      <button onClick={onFileClickClear} className="button">삭제</button>
                    </div> 
                )}
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
  margin: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

export const Wrapper__form = styled.form`
  width: 500px;
  height: 200px;
  margin-bottom: 10px;

  .input_text {
    font-size: 13px;
    width: 400px;
    height: 50px;
    border: 1px solid #999;
    padding-left: 10px;
    margin-bottom: 10px;
  }

  .form__file {
    width: 400px;
    text-align: right;
    margin-bottom: 20px;
  }

  .file-input {
    margin-right: 10px;
    cursor: pointer;
  }

  .submit-input {
    background-color: transparent;
    cursor: pointer;
  }

  .file_img {
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .img {
    margin-bottom: 10px;
  }
  
  .button {
    border: 3px solid #000;
    background-color: transparent;
  }
`