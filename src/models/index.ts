import fs from "fs";

// Load all models in
export default () => {
	for (const file of fs.readdirSync(__dirname)) {
		if (file !== "index.ts") {
			require("./" + file);
		}
	}
};
