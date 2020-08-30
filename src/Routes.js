import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

const Home = lazy(() => import("./containers/Home"));
const NotFound = lazy(() => import("./containers/NotFound"));
const Login = lazy(() => import("./containers/Login"));
const Signup = lazy(() => import("./containers/Signup"));
const Confirm = lazy(() => import("./containers/Confirm"));

export default function Routes() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Switch>
				<UnauthenticatedRoute exact path="/login">
					<Login />
				</UnauthenticatedRoute>
				<UnauthenticatedRoute exact path="/signup">
					<Signup />
				</UnauthenticatedRoute>
				<UnauthenticatedRoute exact path="/confirm/:email">
					<Confirm />
				</UnauthenticatedRoute>
				<AuthenticatedRoute exact path="/">
					<Home />
				</AuthenticatedRoute>
				{/* Finally, catch all unmatched routes */}
				<Route>
					<NotFound />
				</Route>
			</Switch>
		</Suspense>
	);
}
