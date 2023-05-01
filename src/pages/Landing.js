import React, { Suspense, useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import { useAuthContext } from "../hooks/use-auth";
import { Navigation, Star } from "../components";
import axios from "axios";
import { lorenIpsum } from "../utils";

export const Landing = () => {
  const { userData } = useAuthContext();
  const [data, setData] = useState([]);
  const [starredExercises, setStarredExercise] = useState([]);

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
    setStarredExercise((prevData) => [...prevData, exerciseName]);
  };

  const saveUserExercises = async () => {
    try {
      const data = {
        userId: userData.id,
        exercises: starredExercises,
      };

      console.log("!DATA SAVING ", data);

      await axios.post("/api/exercises/save-exercises", data);
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
        setStarredExercise(exerciseData?.data?.starredExercises);
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
                        isChecked={starredExercises.includes(exercise)}
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
    </div>
  );
};
