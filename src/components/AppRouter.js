import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ isLoggendIn, userObj, refreshUser }) => {
  return (
    <Router>
        <>
          {isLoggendIn && <Navigation userObj={userObj} />}
        </>
        {isLoggendIn ? (
          <Routes>
            <Route path="/" element={<Home userObj={userObj} refreshUser={refreshUser}/>} />        
            <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
          </Routes>
        ) : (
            <Auth />
        )}
    </Router>
  )
}

export default AppRouter;