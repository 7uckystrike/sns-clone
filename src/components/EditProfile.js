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
            <button onClick={onLogOutClick}>๋ก๊ทธ์์</button> 
        </div>
    )
}

export default EditProfile