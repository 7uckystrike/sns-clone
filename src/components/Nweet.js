import { useState } from "react";
import { dbService, storageService } from "../firebase";
import { doc, deleteDoc }from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

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
        <div>
            {edit ? 
                (
                    <form>
                        <input type="text" plasceholder="수정내용" value={newText} onChange={onChange} />
                        <input type="button" value="수정완료" onClick={onSubmit} />
                        <button type="submit" onClick={toggleEdit}>취소</button>
                    </form>
                ) : (
                    <>
                        <h3>{nweetObj.twt}</h3>
                        <p>{userName}</p>
                        <span>{getTweetDate()}</span>
                        {nweetObj.imgFileURL && <img src={nweetObj.imgFileURL} width="50px" height="50px" alt="UI URL" />}
                        {isOwner && (
                        <>
                            <button type="submit" onClick={onDelClick}>삭제하기</button>
                            <button type="submit" onClick={toggleEdit}>수정하기</button>
                        </>
                    )}   
                    </>
                )}
        </div>
    )}

export default Nweet