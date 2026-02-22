import React, { useEffect, useRef } from 'react';

/** Allows the user to send a prompt to the model.
 *
 * The message is sent to the model when the user presses Enter or clicks the Send button.
 * Shift-Enter can be used to insert a line break instead.
 */
export const PromptForm = ({ chat }) => {
  const textareaRef = useRef(null);
  const [promptValue, setPromptValue] = React.useState(
    chat?.prompt$?.value || ''
  );

  useEffect(() => {
    if (!chat?.prompt$) return;

    const subscription = chat.prompt$.subscribe((newPrompt) => {
      setPromptValue(newPrompt || '');
    });

    return () => {
      try { subscription.unsubscribe(); } catch (e) {}
    };
  }, [chat]);

  const handleInput = (e) => {
    const value = e.target.value;
    setPromptValue(value);
    if (chat?.prompt$) {
      chat.prompt$.next(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    
    const text = (promptValue || '').trim();
    if (!text) return;

    if (chat?.onPrompt) {
      chat.onPrompt(text);
    }

    // Clear prompt
    setPromptValue('');
    if (chat?.prompt$) {
      chat.prompt$.next('');
    }

    // Keep focus on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <form className="input-row" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="message-input"
        value={promptValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Shift+Enter for newline)"
        aria-label="Type a message"
        rows="2"
      />
      <button type="submit">Send</button>
    </form>
  );
};

PromptForm.displayName = 'PromptForm';
