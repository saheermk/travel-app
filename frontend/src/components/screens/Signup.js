import React, { useContext, useState } from "react";
import { BASE_URL } from "../../axiosConfig";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState([]); 
    const navigate = useNavigate();
    const {updateUserData} = useContext(UserContext)

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    
    const handleSubmit = (e) => {
        setMessage([]); // Clear previous messages
        e.preventDefault();
        
        axios.post(`${BASE_URL}/auth/create/`, {
            name: name,
            email: email,
            password: password
        })
        .then(response => {
            // Success Block (HTTP 2xx)
            const { status_code, data: bodyData } = response.data;

            if (status_code === 6000) {
                // Successful registration and login (status_code: 6000)
                localStorage.setItem("user_data", JSON.stringify(bodyData));
                updateUserData({type:"LOGIN", payload: bodyData});
                navigate(from, { replace: true });
            }
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

    }
    


    return (
        
        <Container>
            <Helmet>
                <title>SignUp | Moke Travel</title>
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
                    <LoginHeading>Register into Account</LoginHeading>
                    <LoginInfo>
                        Create an account to access all the features
                    </LoginInfo>
                    <Form onSubmit={handleSubmit}>
                        <InputContainer>
                            <TextInput onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder="Name" />
                        </InputContainer>
                        <InputContainer>
                            <TextInput onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Email" />
                        </InputContainer>
                        <InputContainer>
                            <TextInput onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
                        </InputContainer>
                        <LoginButton to="/auth/login/">Login Now</LoginButton>

                        <ButtonContainer>
                            
                            {message.length > 0 && (
                                <ErrorMessageContainer>
                                    {message.map((line, index) => (
                                        <ErrorMessage key={index}>{line}</ErrorMessage>
                                    ))}
                                </ErrorMessageContainer>
                            )}
                            <SubmitButton>Create an Account</SubmitButton>
                        </ButtonContainer>
                    </Form>
                </LoginContainer>
            </RightContainer>
        </Container>
    );
}

// --- NEW STYLED COMPONENT FOR FLEXIBLE ERROR DISPLAY ---
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
    /* Removed margin-bottom: 25px; from previous version to reduce spacing between lines */
    margin-bottom: 5px; 
    text-align: center;
`;

// --- (Existing Styled Components Below) ---

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
    display: block;
`;
const InputContainer = styled.div`
    margin-bottom: 15px;
    position: relative;
`;
const TextInput = styled.input`
    padding: 20px 25px 20px 30px;
    width: 100%;
    display: block;
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
    outline: 0;
    color: #fff;
    padding: 25px 40px;
    border-radius: 8px;
    font-size: 20px;
    cursor: pointer;
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column; /* Allows content to stack vertically */
    align-items: center;
`;