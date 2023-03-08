import { useNavigate } from "react-router-dom";
import { authService } from "../firebase";

const EditProfile = () => {
    const navigator = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigator("/");
    }

    return (
        <div>
            <button onClick={onLogOutClick}>로그아웃</button> 
        </div>
    )
}

export default EditProfile