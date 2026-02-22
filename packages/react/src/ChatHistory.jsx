import React, { useEffect, useRef } from 'react';
import { ChatEntry } from './ChatEntry';

export const ChatHistory = ({ chat }) => {
  const scrollerRef = useRef(null);
  const [entries, setEntries] = React.useState(
    (chat?.entries$?.value || [])
  );

  useEffect(() => {
    if (!chat?.entries$) return;

    const subscription = chat.entries$.subscribe((newEntries) => {
      setEntries([...newEntries]);
    });

    return () => {
      try { subscription.unsubscribe(); } catch (e) {}
    };
  }, [chat]);

  useEffect(() => {
    // Scroll to bottom after render
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="chat-history" ref={scrollerRef} role="log">
      {entries.map((entry, index) => (
        <ChatEntry key={index} entry={entry} />
      ))}
    </div>
  );
};

ChatHistory.displayName = 'ChatHistory';
