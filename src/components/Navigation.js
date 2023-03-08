import { Link } from "react-router-dom";

const Navigation = ({userObj}) => {
    return (
        <div>
            <h1>프로필영역</h1>
            <ul> 
                <li>
                    <Link to="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        {userObj?.displayName ? `${userObj.displayName}님 안녕하세요` : `닉네임을 설정해주세요`}
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Navigation