import { useState } from 'react';

type CoachPanelProps = {
  code: string;
  lessonTitle: string;
};

export function CoachPanel({ code, lessonTitle }: CoachPanelProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const askCoach = async () => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || isAsking) {
      return;
    }

    setIsAsking(true);
    setAnswer('Tiny Coach is thinking...');

    try {
      const response = await fetch('/api/coach.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: cleanQuestion,
          code,
          lessonTitle,
        }),
      });
      const data = await response.json() as { answer?: string; error?: string };

      setAnswer(data.answer || data.error || 'Tiny Coach is not ready yet.');
    } catch {
      setAnswer('Tiny Coach needs an adult to turn on the safe teaching key in Admin.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="coach-card" aria-label="Tiny Coach">
      <div className="coach-heading">
        <div>
          <span className="drawing-label">Tiny Coach</span>
          <strong>Ask for a small hint</strong>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void askCoach();
        }}
      >
        <label htmlFor="coach-question">Do not share private information.</label>
        <textarea
          id="coach-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={500}
          placeholder="Why is my block not working?"
          disabled={isAsking}
        />
        <button type="submit" className="button small" disabled={isAsking || !question.trim()}>
          Ask Coach
        </button>
      </form>
      {answer ? <p className="coach-answer">{answer}</p> : null}
    </div>
  );
}
