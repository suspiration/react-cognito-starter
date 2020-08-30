import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
	Button,
	FormGroup,
	FormControl,
	InputLabel,
	Input,
	FormHelperText,
} from "@material-ui/core";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { Auth } from "aws-amplify";
import { onError } from "../libs/errorLib";

import "./Confirm.scss";

export default function Confirm() {
	const { email } = useParams();
	const [fields, handleFieldChange] = useFormFields({
		confirmationCode: "",
	});
	const history = useHistory();
	const [hasConfirmed, setHasConfirmed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	function validateConfirmationForm() {
		return fields.confirmationCode.length > 0;
	}

	function goToLogin() {
		history.push("/login");
	}

	async function handleConfirmationSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await Auth.confirmSignUp(email, fields.confirmationCode);
			setHasConfirmed(true);
		} catch (e) {
			let error = "Invalid confirmation code, please try again.";
			if (e.code === "UserNotConfirmedException") {
				await Auth.resendSignUp(fields.email);
				history.push("/confirm/{$fields.email}}");
				return;
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
				<div>
					Your account has now been verified, please proceed to login.
				</div>
				<br />
				<br />
				<Button type="submit" click={goToLogin}>
					Login
				</Button>
			</div>
		);
	}

	return (
		<div className="Confirm">
			{hasConfirmed === true ? renderForm() : renderConfirmationForm()}
		</div>
	);
}
