import React, { useState, useEffect, useRef } from "react";
import { backend_url } from "./services.js";

export default function WidgetChat() {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  const apiUrl = backend_url.replace(/\/$/, "");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    loadHistory();
    // Load the logged-in user's conversation when the widget opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const loadHistory = async () => {
    if (!token) {
      setHistoryLoading(false);
      setMessages([
        {
          sender: "ai",
          text: "Please log in to use VaartaAI.",
          createdAt: new Date(),
        },
      ]);
      return;
    }

    setHistoryLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/widget/history`, {
        method: "GET",
        headers: authHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to load chat history");
      }

      setConversationId(data.conversationId || "");
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputText.trim() || isTyping || historyLoading) return;

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Your login session is not available. Please log in again.",
          createdAt: new Date(),
        },
      ]);
      return;
    }

    const userMessageText = inputText.trim();
    setInputText("");

    const localUserMessage = {
      sender: "user",
      text: userMessageText,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, localUserMessage]);
    setIsTyping(true);

    try {
      const res = await fetch(`${apiUrl}/api/widget/chat`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          conversationId,
          text: userMessageText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Chat request failed");
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "I couldn't generate a response. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Chat endpoint error:", err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: err.message || "Connection lost. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Render basic Markdown safely.
  const formatMarkdown = (text) => {
    if (!text) return "";

    let escapedText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    escapedText = escapedText.replace(
      /```([\s\S]*?)```/g,
      (match, code) =>
        `<pre class="my-2"><code class="text-light">${code.trim()}</code></pre>`
    );

    escapedText = escapedText.replace(
      /`([^`\n]+)`/g,
      "<code>$1</code>"
    );

    escapedText = escapedText.replace(
      /\*\*([^*]+)\*\*/g,
      "<strong>$1</strong>"
    );

    escapedText = escapedText.replace(
      /^\s*[-*]\s+(.+)/gm,
      "• $1"
    );

    escapedText = escapedText.replace(/\n/g, "<br />");

    return (
      <span dangerouslySetInnerHTML={{ __html: escapedText }} />
    );
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageIndex(index);

      setTimeout(() => {
        setCopiedMessageIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const closeChatWidget = () => {
    window.parent.postMessage("varta-close-chat", "*");
  };

  // Start a fresh conversation for the currently logged-in account.
  // The backend creates the new conversation when the next message is sent.
  const startNewChat = () => {
    if (window.confirm("Start a new conversation?")) {
      setConversationId("");
      setMessages([]);
      setInputText("");
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom shadow-sm bg-white">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4">💬</span>

          <div>
            <h6 className="mb-0 fw-bold text-dark">
              VaartaAI Chat bot
            </h6>

            <span
              className="badge bg-success-subtle text-success border border-success-subtle py-1"
              style={{ fontSize: "0.7rem" }}
            >
              Logged-in user
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-1">
          <button
            className="btn btn-sm btn-link text-decoration-none text-muted p-1"
            onClick={startNewChat}
            title="Start New Chat"
          >
            <i className="bi bi-plus-circle fs-6"></i>
          </button>

          <button
            className="btn btn-sm btn-link text-decoration-none text-muted p-1"
            onClick={closeChatWidget}
            title="Close Chat"
          >
            <i className="bi bi-x-lg fs-6"></i>
          </button>
        </div>
      </div>

      {/* Message Log */}
      <div className="chat-messages custom-scrollbar d-flex flex-column bg-light-subtle">
        {historyLoading ? (
          <div className="my-auto text-center">
            <div
              className="spinner-border spinner-border-sm text-secondary"
              role="status"
            ></div>

            <p className="small text-muted mt-2">
              Loading conversation history...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="my-auto text-center px-3">
            <span className="fs-2">💬</span>

            <p className="text-muted small mt-2">
              Hello! I'm VaartaAI. How can I help you today?
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg._id || index}
                className={`message-bubble ${
                  isUser ? "visitor" : "ai align-self-start"
                }`}
              >
                {formatMarkdown(msg.text)}

                {msg.sender === "ai" && (
                  <div className="copy-btn-wrapper">
                    <button
                      onClick={() => copyToClipboard(msg.text, index)}
                      className="btn btn-sm btn-light border p-1 rounded shadow-sm bg-white"
                      style={{
                        fontSize: "0.75rem",
                        padding: "1px 5px",
                      }}
                      title="Copy response"
                    >
                      {copiedMessageIndex === index ? (
                        <i className="bi bi-check text-success"></i>
                      ) : (
                        <i className="bi bi-clipboard text-secondary"></i>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="typing-indicator my-1">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-top bg-white"
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control border-end-0 py-2 custom-scrollbar"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping || historyLoading || !token}
            required
          />

          <button
            type="submit"
            className="btn btn-dark border-start-0 px-3"
            disabled={
              isTyping ||
              historyLoading ||
              !inputText.trim() ||
              !token
            }
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </form>
    </div>
  );
}