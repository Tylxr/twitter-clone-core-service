import EventEmitter from "events";

let eventEmitter: EventEmitter;

export default () => {
	if (eventEmitter) return;

	eventEmitter = new EventEmitter();
};

export const getEmitter = (): EventEmitter => {
	if (!eventEmitter) {
		throw new Error("No event emitter has been initialised.");
	}

	return eventEmitter;
};
