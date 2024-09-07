export default class Note {
  id: string;
  name: string;
  content: string;
  isTitleManual: boolean = false;

  constructor(name: string, content: string) {
    this.id = new Date().getTime().toString(16)
    this.name = name;
    this.content = content;
  }
}
