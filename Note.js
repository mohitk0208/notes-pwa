export default class Note {
	#name;
	#content;

	constructor(name, content) {
		this.#name = name;
		this.#content = content;
	}
	getName() {
		return this.#name;
	}
	getcontent() {
		return this.#content;
	}
	setContent(c) {
		this.#content = c;
	}
	setName(n) {
		this.#name = n;
	}
}
