import axios from "axios";

export default axios.create({
	baseURL: process.env.AUTH_BASE_URL,
});
