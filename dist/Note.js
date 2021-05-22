export default class Note {
	name;
	content;

	constructor(name, content) {
        this.id = new Date().getTime().toString(16)
		this.name = name;
		this.content = content;
	}

}
