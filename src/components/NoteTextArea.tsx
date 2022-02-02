import React, { useCallback, useState } from 'react';
import { Button } from '@aircall/tractor';

import './NoteTextArea.css';

type TextAreaProps = {
  callId: string;
  onSubmit: (content: string, callId: string) => void;
}

function TextArea({ onSubmit, callId }: TextAreaProps) {
  const [content, setTextValue] = useState<string>('');

  const handleChange = useCallback(
    (event) => {
      setTextValue(event.target.value);
    },
    [],
  );

  const addNote = useCallback(
    (_event) => {
      onSubmit(content, callId);
      setTextValue('');
    },
    [content, callId, onSubmit]
  );

  return (
    <div className="textarea-container">
      <textarea
        className="textarea"
        placeholder="Write a new note..."
        value={content}
        onChange={handleChange} />
      <Button onClick={addNote}>
        Add Note
      </Button>
    </div>
  );
}

export default TextArea;
