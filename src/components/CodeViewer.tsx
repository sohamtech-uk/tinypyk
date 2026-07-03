import { useEffect, useMemo, useState } from 'react';

type CommentState = 'ready' | 'thinking' | 'fallback';

type CodeViewerProps = {
  code: string;
  lessonTitle: string;
};

const placeholderCode = '# Add blocks to make Python code appear here.';

const stripCodeFence = (value: string) =>
  value
    .replace(/^```(?:python)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trimEnd();

const commentForLine = (trimmedLine: string) => {
  if (!trimmedLine || trimmedLine.startsWith('#')) {
    return '';
  }

  if (trimmedLine.startsWith('print(')) {
    return '# Show something in the output.';
  }

  if (trimmedLine.includes('input(')) {
    return '# Ask the player a question.';
  }

  if (trimmedLine.startsWith('while ')) {
    return '# Keep going while this rule is true.';
  }

  if (trimmedLine.startsWith('for ')) {
    return '# Repeat this block for each number or item.';
  }

  if (trimmedLine.startsWith('if ')) {
    return '# Choose this path when the rule is true.';
  }

  if (trimmedLine.startsWith('elif ')) {
    return '# Try another rule if the first rule was not true.';
  }

  if (trimmedLine === 'else:') {
    return '# Use this path for all other answers.';
  }

  if (trimmedLine.startsWith('def ')) {
    return '# Make a helper function.';
  }

  if (trimmedLine.startsWith('import ')) {
    return '# Load Python tools for this project.';
  }

  if (trimmedLine.includes(' = ') && !trimmedLine.includes(' == ')) {
    return '# Save a value in a variable.';
  }

  return '';
};

const addLocalFriendlyComments = (code: string) => {
  const lines = code.trimEnd().split('\n');
  const commentedLines: string[] = [];
  let lastComment = '';

  lines.forEach((line) => {
    const indent = line.match(/^\s*/)?.[0] ?? '';
    const comment = commentForLine(line.trim());

    if (comment && comment !== lastComment) {
      commentedLines.push(`${indent}${comment}`);
      lastComment = comment;
    } else if (comment === '') {
      lastComment = '';
    }

    commentedLines.push(line);
  });

  return commentedLines.join('\n').trimEnd();
};

export function CodeViewer({ code, lessonTitle }: CodeViewerProps) {
  const [commentedCode, setCommentedCode] = useState({ source: '', value: '' });
  const [commentState, setCommentState] = useState<CommentState>('ready');
  const hasCode = code.trim().length > 0;

  useEffect(() => {
    if (!hasCode) {
      return;
    }

    const fallbackCode = addLocalFriendlyComments(code);
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCommentState('thinking');
      setCommentedCode({ source: code, value: fallbackCode });

      try {
        const response = await fetch('/api/comments.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, lessonTitle }),
          signal: controller.signal,
        });

        if (!response.ok) {
          setCommentState('fallback');
          return;
        }

        const data = await response.json() as { code?: string };
        const aiCode = typeof data.code === 'string' ? stripCodeFence(data.code) : '';
        setCommentedCode({ source: code, value: aiCode || fallbackCode });
        setCommentState(aiCode ? 'ready' : 'fallback');
      } catch {
        if (!controller.signal.aborted) {
          setCommentState('fallback');
        }
      }
    }, 650);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [code, hasCode, lessonTitle]);

  const displayCode = useMemo(
    () =>
      hasCode
        ? commentedCode.source === code && commentedCode.value
          ? commentedCode.value
          : addLocalFriendlyComments(code)
        : placeholderCode,
    [code, commentedCode, hasCode],
  );

  const copyCode = async () => {
    await navigator.clipboard.writeText(displayCode);
  };
  const lineCount = hasCode ? displayCode.trim().split('\n').length : 0;
  const commentLabel = hasCode && commentState === 'thinking'
    ? 'adding comments'
    : 'with friendly comments';

  return (
    <section className="panel code-panel" aria-label="Generated Python code">
      <div className="panel-header">
        <div>
          <h2>Python</h2>
          <span className="panel-subtitle">{lineCount} lines generated · {commentLabel}</span>
        </div>
        <button type="button" className="button small" onClick={copyCode}>Copy</button>
      </div>
      <pre className="code-viewer">
        <code>{displayCode}</code>
      </pre>
    </section>
  );
}
