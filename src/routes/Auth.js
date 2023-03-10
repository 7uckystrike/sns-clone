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
        const {target: {id, value}} = e;
        if (id === 'email') {
          setEmail(value)
          const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

            if (!emailRegex.test(e.target.value)) {
                setEmailMessage('★ 메일 형식을 확인해주세요!')
                setIsEmail(false)
            } else {
                setEmailMessage('👍🏻')
                setIsEmail(true)
            }

        } else if (id === 'password') {
          setPassword(value)
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/

          if (!passwordRegex.test(e.target.value)) {
            setPwMessage('★ 숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!')
            setIsPw(false)
          } else {
            setPwMessage('👍🏻')
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
                <Content__signIn onSubmit={onSubmit}>
                  <Sign__Email>
                    <input id="email" type="email" placeholder="이메일을 입력하세요." required value={email} onChange={onChange}/>
                    {email.length > 0 && <span className={`message ${isEmail ? 'success' : 'error'}`}>{emailMessage}</span>}
                  </Sign__Email>
                  <Sign__Password>
                    <input id="password" type="password" placeholder="비밀번호를 입력하세요." required value={password} onChange={onChange} />
                    {password.length > 0 && <span className={`message ${isPw ? 'success' : 'error'}`}>{pwMessage}</span>}
                  </Sign__Password>
                  <Sign__Button>
                    <input type="submit" value={newAccount ? '회원가입하기' : '로그인하기'} disabled={!(isEmail && isPw)} />
                    <span className="toggleAccount"onClick={toggleAccount}>{newAccount ? '로그인' : '회원가입'}</span>
                    <div>
                      <span className="error">{error}</span>
                    </div>
                    </Sign__Button>
                    <Sign__Google>
                      <button name="google" onClick={onSocialClick}>구글 입장</button>
                    </Sign__Google>
                </Content__signIn>
            </Wrapper__content>
        </Wrapper>
    )
}

export default Auth



// 스타일링
export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #001122; 
`

export const Wrapper__content = styled.div`
  padding-top: 150px;
  padding-left: 150px;

  h1 {
    font-family: 'Fugaz One', cursive;
    font-size: 60px;
    color: #00ed64;
  }
`

export const Content__signIn = styled.form`
  padding-top: 30px;
  padding-left: 30px;
`

export const Sign__Email = styled.div`
  padding-bottom: 20px;
  
  input {
    width: 300px;
    background-color: transparent;
    color: #fff;
    outline: none;
    padding-left: 2px;
    padding-bottom: 10px;
    font-size: 11px;
    border-bottom: 3px solid #fff;
  }

  span {
    font-size: 9px;
    color: #ff0000;
    padding-left: 10px;
  }
`

export const Sign__Password = styled.div`
  padding-bottom: 20px;
  
  input {
    width: 300px;
    background-color: transparent;
    color: #fff;
    outline: none;
    padding-left: 2px;
    padding-bottom: 10px;
    font-size: 11px;
    border-bottom: 3px solid #fff;
  }

  span {
    font-size: 9px;
    color: #ff0000;
    padding-left: 10px;
  }
`

export const Sign__Button  = styled.div`
  input {
    background-color: transparent;
    border: 3px solid #00ed64;
    color: #00ed64;
    margin-right: 10px;
  }

  .toggleAccount {
    background-color: transparent;
    border: 3px solid #fff;
    color: #fff;
    padding: 0 10px;
    margin-right: 10px;
  }

  .error {
    display: block;
    font-size: 9px;
    color: #ff0000;
    margin: 10px 0;
  }
`

export const Sign__Google = styled.div`
  button {
    background-color: transparent;
    color: #fff;
    border-bottom: 3px solid #fff;
  }
`