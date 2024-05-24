# React Web App for Left Hand Push-up Rep Counting

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install Dependencies

### npm install @tensorflow-models/posenet  
### npm install @tensorflow/tfjs 
### npm install react-webapp
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The web camera will open up in the we browser

Tensorflow JS PoseNet module is used for calculating the landmarks 
Then use the angle between left shoulder, elbow and wrist to count the number of push ups

Currently facing some errors for writing the number of counts on the camera web app as well as drawing the landmark points on the camera app , the count is icremented after every push up and the value can be seen in console.log shown in the demo in the document. Currently working on showing the count on the web screen.



