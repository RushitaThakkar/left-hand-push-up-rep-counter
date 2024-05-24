import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";

var count = 0;
var stage = "";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      // Get Landmarks from Web Camera

      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      // calculate angle between shoulder, elbow and wrist

      const angle = pushupCalculateAngle(pose["keypoints"]);
      
      // If the angle is > 160 then consider a down state

      if (angle > 160){
          stage = "down"
          
      }

      // If angle is < 30 and stage is down then one push up is completed
      if (angle < 30 && stage == 'down') {
        stage="up"
        
        count +=1
      }
      console.log("************ This is the count *******************")
      console.log(count);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);


    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    return angle;
  }

  function pushupCalculateAngle(keypoints) {
    const leftShoulder = keypoints.find(point => point.part === 'leftShoulder').position;
    const leftElbow = keypoints.find(point => point.part === 'leftElbow').position;
    const leftWrist = keypoints.find(point => point.part === 'leftWrist').position;
  
    const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    console.log('Left Elbow Angle:', angle);
    return angle;
  }

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}


export default App;