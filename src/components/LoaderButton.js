import React from "react";
import { Button } from "@material-ui/core";
import { BsArrowRepeat } from "react-icons/bs";
import PropTypes from "prop-types";
import "./LoaderButton.scss";

export default function LoaderButton({
	isLoading,
	className = "",
	disabled = false,
	color = "primary",
	...props
}) {
	return (
		<Button
			variant="contained"
			className={`LoaderButton ${className}`}
			disabled={disabled || isLoading}
			color={color}
			{...props}
		>
			{isLoading && <BsArrowRepeat className="spinning" />}
			{props.children}
		</Button>
	);
}

LoaderButton.propTypes = {
	className: PropTypes.string,
	isLoading: PropTypes.bool,
	disabled: PropTypes.bool,
	color: PropTypes.string,
};
