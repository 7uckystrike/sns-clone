import { useState } from "react";
import { authService, firebaseinstance } from "../firebase";
import styled from "@emotion/styled"


const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("") 

    // 오류저장
    const [emailMessage, setEmailMessage] = useState("")
    const [pwMessage, setPwMessage] = useState("")

    //유효성 검사
    const [isEmail, setIsEmail] = useState(false)
    const [isPw, setIsPw] = useState(false)

    const onChange = (e) => {
        const {target: {name, value}} = e;
        if (name === 'email') {
          setEmail(value)
          const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

            if (!emailRegex.test(e.target.value)) {
                setEmailMessage('메일 형식을 확인해주세요!')
                setIsEmail(false)
            } else {
                setEmailMessage('올바른 이메일 형식입니다!')
                setIsEmail(true)
            }

        } else if (name === 'password') {
          setPassword(value)
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/

          if (!passwordRegex.test(e.target.value)) {
            setPwMessage('숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!')
            setIsPw(false)
          } else {
            setPwMessage('안전한 비밀번호에요 : )')
            setIsPw(true)
          }
        }
      }

    const onSubmit = async(e) => {
        e.preventDefault(); //새로고침 막는거
        let data 
        try {
            if(newAccount) {
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data)
        } catch(error) {
            setError(error.message)
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onSocialClick = async() => {
        let provider = new firebaseinstance.auth.GoogleAuthProvider()
        const data = await authService.signInWithPopup(provider)
        console.log(data)
    } 

    return(
        <Wrapper>
            <Wrapper__content>
                <h1>hello, sns</h1>
                <form onSubmit={onSubmit}>
                    <input name="email" type="email" placeholder="이메일을 입력하세요." required value={email} onChange={onChange}/>
                    {email.length > 0 && <span className={`message ${isEmail ? 'success' : 'error'}`}>{emailMessage}</span>}

                    <input name="password" type="password" placeholder="비밀번호를 입력하세요." required value={password} onChange={onChange} />
                    {password.length > 0 && <span className={`message ${isPw ? 'success' : 'error'}`}>{pwMessage}</span>}

                    <input type="submit" value={newAccount ? '회원가입' : '로그인'} disabled={!(isEmail && isPw)} />
                    {error}
                </form>
                <span onClick={toggleAccount}>{newAccount ? '로그인' : '회원가입'}</span>
                <div>
                    <button name="google" onClick={onSocialClick}>구글</button>
                </div>
            </Wrapper__content>
        </Wrapper>
    )
}

export default Auth



// 스타일링

export const Wrapper = styled.div`
    width: 500px;
    height: 400px;
    margin: auto;
    margin-top: 100px;
`

export const Wrapper__content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-family: 'Fugaz One', cursive;
        font-size: 50px;
        margin-bottom: 30px;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        
        input {
            border-bottom: 3px solid #000;
        }

        span {
            color: red;
            font-size: 9px;
        }
    }
`