import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CssBaseline, AppBar, Toolbar, Grid, Button } from "@material-ui/core";
import { Auth } from "aws-amplify";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

import "./App.scss";

function App() {
	const history = useHistory();
	const [isAuthenticating, setIsAuthenticating] = useState(true);
	const [isAuthenticated, userHasAuthenticated] = useState(false);

	useEffect(() => {
		onLoad();
	}, []);

	async function onLoad() {
		try {
			await Auth.currentSession();
			userHasAuthenticated(true);
		} catch (e) {
			if (e !== "No current user") {
				onError(e);
			}
		}

		setIsAuthenticating(false);
	}

	async function handleLogout() {
		await Auth.signOut();

		userHasAuthenticated(false);

		history.push("/login");
	}

	return (
		!isAuthenticating && (
			<CssBaseline>
				<div className="App container">
					<AppBar position="static">
						<Toolbar>
							<Grid justify="space-between" container>
								<Grid item>
									<div className="title">
										<a href="/">REACT COGNITO STARTER</a>
									</div>
								</Grid>
								<Grid item>
									{isAuthenticated ? (
										<div>
											<Button
												color="primary"
												onClick={handleLogout}
											>
												Logout
											</Button>
										</div>
									) : (
										<div>
											<Button
												color="primary"
												href="/signup"
											>
												Signup
											</Button>
											<Button
												color="primary"
												href="/login"
											>
												Login
											</Button>
										</div>
									)}
								</Grid>
							</Grid>
						</Toolbar>
					</AppBar>
					<AppContext.Provider
						value={{ isAuthenticated, userHasAuthenticated }}
					>
						<Routes />
					</AppContext.Provider>
				</div>
			</CssBaseline>
		)
	);
}

export default App;
