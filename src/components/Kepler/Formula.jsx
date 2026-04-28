import { useMemo } from 'react';
import katex from 'katex';

export function Formula({ tex, block = false, className = '' }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: block, throwOnError: false }),
    [tex, block],
  );
  if (block) {
    return (
      <div
        className={`my-4 overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
