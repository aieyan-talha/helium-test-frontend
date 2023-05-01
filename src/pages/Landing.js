import React, { Suspense, useEffect, useState } from "react";
import {
  Container,
  Button,
  Table,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useAuthContext } from "../hooks/use-auth";
import { Navigation, Star } from "../components";
import axios from "axios";

export const Landing = () => {
  const { userData } = useAuthContext();
  const [data, setData] = useState([]);
  const [starredExercises, setStarredExercise] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const getExerciseData = async () => {
    const options = {
      method: "GET",
      url: "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
      headers: {
        "X-RapidAPI-Key": "64540054d3mshd0d575529a3ee04p1dcd48jsn4a88be98b18e",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    };

    try {
      return axios.request(options);
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  const handleStarClick = (exerciseName) => {
    const alreadyExists = starredExercises?.includes(exerciseName);

    setStarredExercise((prevData) => {
      if (alreadyExists) {
        return prevData.filter((item) => item !== exerciseName);
      } else {
        return [...prevData, exerciseName];
      }
    });
  };

  const saveUserExercises = async () => {
    try {
      const data = {
        userId: userData.id,
        exercises: starredExercises,
      };

      await axios.post("/api/exercises/save-exercises", data);
      setShowSuccessToast(true);
    } catch (err) {
      throw new Error(err);
    }
  };

  const getUserExercises = async (userId) => {
    try {
      return await axios.get(`/api/exercises/get-exercises/${userId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    getExerciseData().then((res) => {
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    if (userData?.id) {
      getUserExercises(userData.id).then((exerciseData) => {
        setStarredExercise(exerciseData?.data?.starredExercises ?? []);
      });
    }
  }, [userData?.id]);

  return (
    <div className="body-background">
      <Navigation />
      <Suspense fallback={<div>Loading</div>}>
        <Container className="center-page basic-padding">
          <div className="title-heading">Helium Code Test</div>
          {/* <div className="subtitle-heading">{lorenIpsum}</div> */}
          <div className="subtitle-heading small-margin-bottom">
            Please select your desired exercises from the list below
          </div>
          <Table
            striped
            bordered
            hover
            variant="dark"
            // className="basic-margins"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Exercise Name</th>
                <th>Starred</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((exercise, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{exercise}</td>
                    <td>
                      <Star
                        name={exercise}
                        onClick={handleStarClick}
                        isChecked={starredExercises?.includes(exercise)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <Spinner animation="border" variant="warning" />
              )}
            </tbody>
          </Table>
          <Button className="save-button" onClick={saveUserExercises}>
            Save
          </Button>
        </Container>
      </Suspense>
      {/**This should be moved to a separate component */}
      <ToastContainer position="top-start" className="basic-padding">
        <Toast
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          bg="success"
          delay={2000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
            <small>{Date.now}</small>
          </Toast.Header>
          <Toast.Body>Exercise data saved successfully</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};
