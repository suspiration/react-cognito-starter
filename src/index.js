import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Amplify } from "aws-amplify";

import "./index.scss";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

console.log(process.env);
console.log({
	mandatorySignIn: true,
	region: process.env.REACT_APP_COGNITO_REGION,
	userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
	userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
});
Amplify.configure({
	Auth: {
		mandatorySignIn: true,
		region: process.env.REACT_APP_COGNITO_REGION,
		userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
		userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
	},
});

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
