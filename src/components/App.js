import { useEffect, useState } from "react";
import { authService } from "../firebase";
import AppRouter from "./AppRouter";

const App = () => {
  const [init, setInit] = useState(false)
  const [isLoggendIn, setIsLoggendIn] = useState(false)
  const [userObj, setUserObj] = useState(null)

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggendIn(true);
        setUserObj(user)
      } else {
        setIsLoggendIn(false);
      }
      setInit(true)
    })
  },[])

  // console.log(authService.currentUser)
  
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj(Object.assign({}, user)) // updateProfile이 한 번만 실행되고 두 번째부터 에러남. 
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
    })
  }

  return (
    <>
      {init ? <AppRouter isLoggendIn={isLoggendIn} userObj={userObj} refreshUser={refreshUser}/> : '로그인중입니다'}
      <footer>&copy; SNS {new Date().getFullYear()} Jyoung</footer>
    </>
  )
}

export default App