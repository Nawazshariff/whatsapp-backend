class Messages {
  userName;
  message;
  timestamp;
  recieved;
  constructor(userName, message, timestamp, recieved) {
    this.userName = userName || "";
    this.message = message || "";
    this.timestamp = timestamp || "";
    this.recieved = recieved || false;
  }

  getDetails() {
    return {
      name: this.userName,
      message: this.message,
      timestamp: this.timestamp,
      recieved: this.recieved,
    };
  }
}

module.exports = Messages;
