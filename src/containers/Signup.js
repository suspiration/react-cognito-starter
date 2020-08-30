import React, { useState } from "react";
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
import { Auth } from "aws-amplify";
import { onError } from "../libs/errorLib";

import "./Signup.scss";

export default function Signup() {
	const [fields, handleFieldChange] = useFormFields({
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		confirmationCode: "",
	});
	const history = useHistory();
	const [newUser, setNewUser] = useState(null);
	const { userHasAuthenticated } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);

	function validateForm() {
		return (
			fields.firstName.length > 0 &&
			fields.lastName.length > 0 &&
			fields.email.length > 0 &&
			fields.password.length > 0 &&
			fields.password === fields.confirmPassword &&
			fields.password !== fields.firstName &&
			fields.password !== fields.lastName
		);
	}

	function validateConfirmationForm() {
		return fields.confirmationCode.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			const newUser = await Auth.signUp({
				username: fields.email,
				password: fields.password,
				attributes: {
					given_name: fields.firstName,
					family_name: fields.lastName,
					middle_name: fields.middleName,
				},
			});
			setIsLoading(false);
			setNewUser(newUser);
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	async function handleConfirmationSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await Auth.confirmSignUp(fields.email, fields.confirmationCode);
			await Auth.signIn(fields.email, fields.password);

			userHasAuthenticated(true);
			history.push("/");
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	function renderConfirmationForm() {
		return (
			<form onSubmit={handleConfirmationSubmit}>
				<FormGroup>
					<FormControl>
						<InputLabel htmlFor="confirmationCode">
							Confirmation Code
						</InputLabel>
						<Input
							id="confirmationCode"
							aria-describedby="confirmationCode-helper-text"
							autoFocus
							type="text"
							value={fields.confirmationCode}
							onChange={handleFieldChange}
						/>
						<FormHelperText id="confirmationCode-helper-text">
							Please check your email for the code.
						</FormHelperText>
					</FormControl>
				</FormGroup>
				<LoaderButton
					type="submit"
					isLoading={isLoading}
					disabled={!validateConfirmationForm()}
				>
					Verify
				</LoaderButton>
			</form>
		);
	}

	function renderForm() {
		return (
			<div>
				<div
					style={{
						textAlign: "center",
						fontSize: "2em",
						margin: "0px",
					}}
				>
					Let&apos;s create an account for you
				</div>
				<div
					style={{
						textAlign: "center",
						fontSize: "1.4em",
						margin: "15px 0px",
					}}
				>
					We will never sell your personal information
				</div>
				<form onSubmit={handleSubmit}>
					<FormGroup>
						<FormControl>
							<InputLabel htmlFor="email">
								Email address
							</InputLabel>
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
							<InputLabel htmlFor="firstName">
								First Name
							</InputLabel>
							<Input
								id="firstName"
								aria-describedby="firstName-helper-text"
								autoFocus
								type="text"
								value={fields.firstName}
								onChange={handleFieldChange}
							/>
							<FormHelperText id="firstName-helper-text"></FormHelperText>
						</FormControl>
					</FormGroup>
					<FormGroup>
						<FormControl>
							<InputLabel htmlFor="middleName">
								Middle Name
							</InputLabel>
							<Input
								id="middleName"
								aria-describedby="middleName-helper-text"
								autoFocus
								type="text"
								value={fields.middleName}
								onChange={handleFieldChange}
							/>
							<FormHelperText id="middleName-helper-text"></FormHelperText>
						</FormControl>
					</FormGroup>
					<FormGroup>
						<FormControl>
							<InputLabel htmlFor="lastName">
								Last Name
							</InputLabel>
							<Input
								id="lastName"
								aria-describedby="lastName-helper-text"
								autoFocus
								type="text"
								value={fields.lastName}
								onChange={handleFieldChange}
							/>
							<FormHelperText id="lastName-helper-text"></FormHelperText>
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
					<FormGroup>
						<FormControl>
							<InputLabel htmlFor="confirmPassword">
								Confirm Password
							</InputLabel>
							<Input
								id="confirmPassword"
								aria-describedby="confirmPassword-helper-text"
								autoFocus
								type="password"
								value={fields.confirmPassword}
								onChange={handleFieldChange}
							/>
							<FormHelperText id="confirmPassword-helper-text"></FormHelperText>
						</FormControl>
					</FormGroup>
					<LoaderButton
						type="submit"
						isLoading={isLoading}
						disabled={!validateForm()}
					>
						Signup
					</LoaderButton>
				</form>
			</div>
		);
	}

	return (
		<div className="Signup">
			{newUser === null ? renderForm() : renderConfirmationForm()}
		</div>
	);
}
