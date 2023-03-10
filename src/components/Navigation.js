import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const Navigation = ({userObj}) => {
    return (
        <Wrapper>
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
        </Wrapper>
    )
}

export default Navigation

//스타일링

export const Wrapper = styled.div`
  width: 100vw;
  background-color: #001122;
  color: #fff; 
`