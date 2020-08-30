import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import {
	FormGroup,
	FormControl,
	InputLabel,
	Input,
	FormHelperText,
} from "@material-ui/core";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";

import "./Login.scss";

export default function Login() {
	const history = useHistory();
	const { userHasAuthenticated } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);
	const [fields, handleFieldChange] = useFormFields({
		email: "",
		password: "",
	});

	function validateForm() {
		return fields.email.length > 0 && fields.password.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await Auth.signIn(fields.email, fields.password);
			userHasAuthenticated(true);
		} catch (e) {
			let error = "An error has occurred, please try again.";
			if (e.code === "UserNotConfirmedException") {
				try {
					await Auth.resendSignUp(fields.email);
					history.push("/confirm/" + fields.email);
					return;
				} catch (e) {
					// e.code === "LimitExceededException"
					//console.log(e);
				}
			} else if (e.code === "NotAuthorizedException") {
				// The error happens when the incorrect password is provided
				error = "Login failed, please try again.";
			} else if (e.code === "UserNotFoundException") {
				// The error happens when the supplied username/email does not exist in the Cognito user pool
				error = "Login failed, please try again.";
			}
			onError(error);
			setIsLoading(false);
		}
	}

	return (
		<div className="Login">
			<form onSubmit={handleSubmit}>
				<FormGroup>
					<FormControl>
						<InputLabel htmlFor="email">Email address</InputLabel>
						<Input
							id="email"
							aria-describedby="email-helper-text"
							autoFocus
							type="email"
							value={fields.email}
							onChange={handleFieldChange}
						/>
						<FormHelperText id="email-helper-text"></FormHelperText>
					</FormControl>
				</FormGroup>
				<FormGroup>
					<FormControl>
						<InputLabel htmlFor="password">Password</InputLabel>
						<Input
							id="password"
							aria-describedby="password-helper-text"
							autoFocus
							type="password"
							value={fields.password}
							onChange={handleFieldChange}
						/>
						<FormHelperText id="password-helper-text"></FormHelperText>
					</FormControl>
				</FormGroup>
				<LoaderButton
					type="submit"
					isLoading={isLoading}
					disabled={!validateForm()}
					color="primary"
				>
					Login
				</LoaderButton>
			</form>
		</div>
	);
}
