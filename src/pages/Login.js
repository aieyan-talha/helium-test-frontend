import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

import {
  Row,
  Col,
  Form,
  Card,
  Button,
  Collapse,
  Container,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { lorenIpsum, setAuthToken } from "../utils";
import { TextField } from "../components";
import { useAuthContext } from "../hooks/use-auth";

export const Login = () => {
  const [isRegisterState, setIsRegisterState] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, setError, control, setValue } = useForm();
  const { setUserData } = useAuthContext();

  const handleFormErrors = (err) => {
    console.log("!ERR : ", err);
    if (err?.response?.status === 400) {
      const errData = err.response.data;

      for (const key in errData) {
        setError(key, { message: errData[key] });
      }
    }
  };
  const handleFormSubmission = async (formData) => {
    if (isRegisterState) {
      //Handle user registration
      const registerData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
      };

      try {
        await axios.post("/users/register", registerData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        setValue("fullName", null);
        setValue("bio", null);
        setIsRegisterState(false);
      } catch (err) {
        handleFormErrors(err);
      }
    } else {
      //Login user
      const userData = {
        email: formData.email,
        password: formData.password,
      };

      try {
        const response = await axios.post("/users/login", userData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const { token } = response.data;

        //Setting token to local storage
        localStorage.setItem("jwtToken", token);

        //Decode JWT Data to store into context
        const decodedData = jwt_decode(token);
        setUserData(decodedData);

        //Set Auth Token to Request headers
        setAuthToken(token);
        navigate("/");
      } catch (err) {
        handleFormErrors(err);
      }
    }
  };

  return (
    <div className="body-background">
      <div className="vertical-center">
        <Container>
          <Row>
            <Col>
              <div className="title-pretext">WELCOME TO</div>
              <div className="title-heading">Helium Code Test</div>
              <div className="subtitle-heading three-four-container">
                {lorenIpsum}
              </div>
            </Col>
            <Col md>
              <Card className="card-background">
                <Form className="basic-padding">
                  <div className="title-secondary">
                    {isRegisterState ? "Sign Up" : "Sign In"}
                  </div>
                  <div className="subtitle-heading padding-bottom">
                    {isRegisterState
                      ? "Oh you are new here? Please enter your details to register"
                      : "Please enter your login credentials"}
                  </div>
                  <TextField
                    name="email"
                    type={"email"}
                    label={"Email Address"}
                    placeholder={"Enter email address"}
                    control={control}
                  />
                  <TextField
                    name="password"
                    type={"password"}
                    label={"Password"}
                    placeholder={"Enter your password"}
                    control={control}
                  />
                  <Collapse in={isRegisterState} timeout={4000}>
                    <div>
                      <TextField
                        name="fullName"
                        label={"Full Name"}
                        placeholder={"Enter your name"}
                        control={control}
                      />
                      <TextField
                        name="bio"
                        label={"Bio"}
                        placeholder={"Tell us about yourself"}
                        control={control}
                        as="textarea"
                      />
                    </div>
                  </Collapse>
                  <Button
                    className="login-button"
                    onClick={handleSubmit(handleFormSubmission)}
                  >
                    {isRegisterState ? "Register" : "Login"}
                  </Button>
                  {!isRegisterState && (
                    <>
                      <hr />
                      <Button
                        className="register-button"
                        variant="secondary"
                        onClick={() => {
                          setIsRegisterState(true);
                        }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
