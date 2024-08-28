const ChatLog = () => {
  return (
    <div className="game-log-container">
      <div className="game-log-header">Game Log</div>
      <div className="game-log-messages">
        <div className="game-log-line">{">"} Chat and other info here!</div>
      </div>
      <div className="game-log-chat">
        <input
          className="chat-input"
          type="text"
          placeholder="Chat with your opponents!"
        />
        <button className="chat-send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatLog;
