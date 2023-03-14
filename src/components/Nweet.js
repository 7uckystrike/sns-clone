import { useState } from "react";
import { dbService, storageService } from "../firebase";
import { doc, deleteDoc }from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import styled from "@emotion/styled"

const Nweet = ({ nweetObj, isOwner, userName }) => {
    const [edit, setEdit] = useState(false); //수정할건지 말건지에 관한 토글
    const [newText, setNewText] = useState(nweetObj.twt)

    const newTextRef = doc(dbService, 'nweets', `${nweetObj.id}`)
    const imgFileRef = ref(storageService, nweetObj.imgFileURL);

    //삭제
    const onDelClick = async() => {
        const ok = window.confirm("삭제하시겠습니까?")
        if(ok) {
            await deleteDoc(newTextRef)
        }
        if(ok && nweetObj.imgFileURL) {
            await deleteObject(imgFileRef)
        }
    }

    // 수정완료
    const onSubmit = async(e) => {
        e.preventDefault();

        await dbService.doc(`nweets/${nweetObj.id}`).update({
            twt: newText,
        })
        setEdit(false)
    }

    //인풋 
    const onChange = (e) => {
        const {
            target: {value}
        } = e
        setNewText(value)
    }

    //날짜
    const getTweetDate = () => {
        const createdDate = new Date(nweetObj.createdAt);
        const year = createdDate.getFullYear();
        const month = createdDate.getMonth() + 1;
        const date = createdDate.getDate();
        const hours = String(createdDate.getHours()).padStart(2, '0');
        const minutes = String(createdDate.getMinutes()).padStart(2, '0');
    
        return `${year}.${month}.${date} ${hours}:${minutes}`;
      };

    //수정토글
    const toggleEdit = () => {setEdit((prev) => !prev)};

    return(
        <Wrapper>
            {edit ? 
                (
                    <Wrapper__edit>
                        <input className="edit" type="text" plasceholder="수정내용" value={newText} onChange={onChange} />
                        <div className="edit-info">
                          <button type="submit" onClick={onSubmit}>완료</button>
                          <button type="submit" onClick={toggleEdit}>취소</button>
                        </div>
                    </Wrapper__edit>
                ) : (
                    <Wrapper__twt>
                        <p className="twt">{nweetObj.twt}</p>   
                        <div>
                        {nweetObj.imgFileURL && <img src={nweetObj.imgFileURL} width="400px" height="auto" alt="UI URL" />}    
                        </div>                     
                        <div className="twt-info">
                          <div className="btn">
                            {isOwner && (
                            <>
                                <button type="submit" onClick={onDelClick}>삭제</button>
                                <button type="submit" onClick={toggleEdit}>수정</button>
                            </>
                            )}  
                          </div>
                          <div className="info">
                            <span className="user">{userName}</span>
                            <span className="date">{getTweetDate()}</span>
                          </div>
                        </div>
                    </Wrapper__twt>
                )}
        </Wrapper>
    )}

export default Nweet


export const Wrapper = styled.div `
  width: 580px;
  border-bottom: 1px solid #999;
  padding-bottom: 10px;
  margin-bottom: 10px;
`

export const Wrapper__edit = styled.form `
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .edit-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .edit {
    border: 1px dotted #999;
    width: 500px;
    height: 50px;
    padding-left: 10px;
  }

  button {
    width: 40px;
    font-size: 12px;
    margin-right: 5px;
  };
`

export const Wrapper__twt = styled.div `
  display: flex;
  flex-direction: column;

  button {
    width: 40px;
    font-size: 12px;
    margin-right: 5px;
  }

  .twt {
    text-align:justify;
    padding-bottom: 5px;
  }

  .twt-info {
    display: flex;
    justify-content: space-between;
  }

  .user {
    display: inline-block;
    text-align: center;
    font-size: 11px;
    margin-right: 5px;
    background-color: #001122;;
    color: #00ed64;
  }

  .date {
    font-size: 11px;
    color: #999999;
  }
`