class Message {
  constructor(data) {
    this.id = data.id;
    this.dni = data.dni;
    this.fullname = data.fullname;
    this.template = data.template;
    this.phone = data.phone;
    this.content = data.content;
    this.urlDocument = data.urlDocument;
  }
}

export default Message;
