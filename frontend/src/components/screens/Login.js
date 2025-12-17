import React, { useContext, useState } from "react";
import styled from "styled-components";
import { BASE_URL } from "../../axiosConfig";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState([]);
    const navigate = useNavigate();
    const { updateUserData } = useContext(UserContext);
    
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage([]); // Clear previous error lines

        axios
            .post(`${BASE_URL}/auth/token/`, {
                username: username,
                password: password,
            })
            .then((response) => {
                // LOGIN SUCCESS
                const data = response.data;
                localStorage.setItem("user_data", JSON.stringify(data));
                updateUserData({type:"LOGIN", payload: data});
                navigate(from, { replace: true });
            })
            .catch(error => {
            if (error.response && error.response.data) {
                const bodyData = error.response.data;
                const errorLines = [];

                // DRF default validation errors
                // Example: { username: ["This field may not be blank."] }
                for (const field in bodyData) {
                    if (Object.prototype.hasOwnProperty.call(bodyData, field)) {
                        const fieldErrors = bodyData[field];

                        // fieldErrors is an array → show each like signup page
                        errorLines.push(fieldErrors.join(" "));
                    }
                }

                // If ANY error lines were found → set them
                if (errorLines.length > 0) {
                    setMessage(errorLines);
                } else {
                    setMessage(["An unknown error occurred."]);
                }

            } else if (error.request) {
                setMessage(["Check network connection."]);
            } else {
                setMessage(["Error: " + error.message]);
            }
        });

    };

    return (
        <Container>
            <Helmet>
                <title>Login | Moke Travel</title>
            </Helmet>

            <LeftContainer>
                <HeaderContainer>
                    <Logo
                        src={require("../assets/images/logo.svg").default}
                        alt="Image"
                        onClick={() => navigate("/")}
                    />
                </HeaderContainer>
                <MainHeading>Travel to the best beautiful place</MainHeading>
            </LeftContainer>

            <RightContainer>
                <LoginContainer>
                    <LoginHeading>Login to your Account</LoginHeading>
                    <LoginInfo>Enter email and password to login</LoginInfo>

                    <Form onSubmit={handleSubmit}>
                        <InputContainer>
                            <TextInput
                                type="email"
                                placeholder="Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </InputContainer>

                        <InputContainer>
                            <TextInput
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputContainer>

                        <LoginButton to="/auth/create/">Signup Now</LoginButton>

                        <ButtonContainer>
                            {/* DISPLAY ALL ERROR LINES */}
                            {message.length > 0 && (
                                <ErrorMessageContainer>
                                    {message.map((line, index) => (
                                        <ErrorMessage key={index}>{line}</ErrorMessage>
                                    ))}
                                </ErrorMessageContainer>
                            )}

                            <SubmitButton type="submit">Login</SubmitButton>
                        </ButtonContainer>
                    </Form>
                </LoginContainer>
            </RightContainer>
        </Container>
    );
}

/* ERROR DISPLAY – same as Signup */
const ErrorMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 50px;
    width: 100%;
`;

const ErrorMessage = styled.p`
    font-size: 17px;
    color: red;
    margin-bottom: 5px;
    text-align: center;
`;

/* ORIGINAL STYLES BELOW */

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    padding: 15px;
`;

const LeftContainer = styled.div`
    width: 55%;
    padding: 40px 70px 70px;
`;

const HeaderContainer = styled.div``;

const Logo = styled.img``;

const MainHeading = styled.h1`
    font-size: 80px;
    color: #090e5e;
    margin-top: 300px;
    line-height: 1.4em;
`;

const RightContainer = styled.div`
    background: #efefef;
    width: 45%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border-radius: 20px;
    padding: 0 70px 70px;
`;

const LoginContainer = styled.div`
    padding-bottom: 70px;
    border-bottom: 1px solid #fff;
    width: 100%;
`;

const LoginHeading = styled.h3`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const LoginInfo = styled.p`
    font-size: 18px;
    margin-bottom: 35px;
`;

const Form = styled.form`
    width: 100%;
`;

const InputContainer = styled.div`
    margin-bottom: 15px;
`;

const TextInput = styled.input`
    padding: 20px 25px 20px 30px;
    width: 100%;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    outline: none;
`;

const LoginButton = styled(Link)`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 25px;
    color: #046bf6;
    font-size: 20px;
`;

const SubmitButton = styled.button`
    background: #046bf6;
    border: 0;
    color: #fff;
    padding: 25px 40px;
    border-radius: 8px;
    font-size: 20px;
    cursor: pointer;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;
