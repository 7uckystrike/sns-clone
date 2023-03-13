import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const Navigation = ({userObj}) => {
    return (
        <Wrapper>
            <ul> 
                <li>
                    <Link to="/">
                        메인
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        프로필
                    </Link>
                </li>
                <li>
                  <span>
                    {userObj?.displayName ? `로그인 : ${userObj.displayName}` : `닉네임수정`}
                  </span>
                </li>
            </ul>
        </Wrapper>
    )
}

export default Navigation

//스타일링

export const Wrapper = styled.div`
  width: 100vw;
  height: 100px;
  background-color: #001122;
  color: #000;

  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  li {
    padding-left: 30px;
    padding-top: 40px;
    margin-left: 50px;
    border-bottom: 4px solid #00ed64;
  }

  span {
    color: #fff
  }
`
