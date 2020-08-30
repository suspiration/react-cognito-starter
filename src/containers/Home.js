import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
import { Auth } from "aws-amplify";

import "./Home.scss";

export default function Home() {
	const { isAuthenticated } = useAppContext();
	const [name, setName] = useState("");

	useEffect(() => {
		async function onLoad() {
			if (!isAuthenticated) {
				return;
			}

			const session = await Auth.currentSession();
			console.log(session);
			console.log("authToken", session.idToken.jwtToken);

			const user = await Auth.currentAuthenticatedUser();
			console.log(user);
			setName(user.attributes.given_name);
		}

		onLoad();
	}, [isAuthenticated]);

	return (
		<div className="home">
			<div className="lander">
				<h1>REACT COGNITO STARTER</h1>
				<p>Welcome {name}, you&apos;ve made it!</p>
			</div>
		</div>
	);
}
