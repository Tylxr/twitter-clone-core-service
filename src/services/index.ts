import { IAPIResponse, AuthGuardResponse, AuthResponse } from "../types/response";
import { IGenericUserModel } from "../types/user";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function registerUser(username: string, password: string, userModel: IGenericUserModel): Promise<IAPIResponse> {
	// Basic validation
	if (!username || !password || username.length < 4 || password.length < 6) {
		return { error: true, errorMessage: "Username/password validation has failed." };
	}
	// Ensure user doesn't already exist - based off of username
	const existingUser = await userModel.getByUsername(username);
	if (existingUser) return { error: true, errorMessage: "User already exists." };

	// Create & save user, password should hash automatically on save
	const user = new userModel({ username, password });
	await user.save();

	// Return successful
	return { error: false };
}

export async function loginUser(username: string, password: string, userModel: IGenericUserModel): Promise<AuthResponse> {
	// Basic validation
	if (!username || !password || username.length < 4 || password.length < 6) {
		return { error: true, errorMessage: "Username/password validation has failed." };
	}

	// Ensure user doesn't already exist - based off of username
	const existingUser = await userModel.getByUsername(username);
	if (!existingUser) return { error: true, errorMessage: `Unable to find user with username '${username}'.` };

	// Check the password
	const correctPassword = existingUser.comparePassword(password);
	if (!correctPassword) {
		return { error: true, errorMessage: "Incorrect password." };
	}

	// Create tokens
	const token = jwt.sign({ username }, process.env.jwt_secret, { expiresIn: parseInt(process.env.token_expiry) });
	const refreshToken = jwt.sign({ username }, process.env.jwt_refresh_secret, { expiresIn: process.env.refresh_token_expiry });

	// Return successful and send tokens
	return { error: false, token, refreshToken };
}
export function isUserAuthenticated(token: string): AuthGuardResponse {
	try {
		// Verify token
		const response = jwt.verify(token, process.env.jwt_secret);

		// Return successful
		return { authenticated: !!response, expired: false };
	} catch (err) {
		console.error(err);
		return { authenticated: false, expired: err.name === "TokenExpiredError" };
	}
}

export function refreshAuthToken(refreshToken: string) {
	try {
		// Verify token
		const response: JwtPayload = jwt.verify(refreshToken, process.env.jwt_refresh_secret) as JwtPayload;
		if (!!response) {
			// Create jwt payload
			const payload = { ...response };
			delete payload.exp;
			delete payload.iat;

			// Create tokens
			const token = jwt.sign(payload, process.env.jwt_secret, { expiresIn: parseInt(process.env.token_expiry) });
			const refreshToken = jwt.sign(payload, process.env.jwt_refresh_secret, { expiresIn: process.env.refresh_token_expiry });

			// Return successful and send tokens
			return { error: false, token, refreshToken };
		}
	} catch (err) {
		console.error(err);
		return { error: true };
	}
}
