class ChatEntry {
  constructor(text, isPrompt, timestamp) {
    this.text = text;
    this.isPrompt = isPrompt;
    this.timestamp = timestamp;
  }
}

export default ChatEntry;
export {ChatEntry};
