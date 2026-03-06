import React from 'react';

/**
 * Returns props to spread on a contentEditable div that:
 * - Uses innerHTML (not textContent) to preserve <a> tags
 * - Uses a callback ref to safely set innerHTML without fighting React's reconciler
 * - Saves innerHTML on blur
 */
export function richTextProps(
  value: string,
  editable: boolean,
  onSave: (html: string) => void,
): React.HTMLAttributes<HTMLDivElement> & { ref: (el: HTMLElement | null) => void } {
  // Convert plain \n to <br> so legacy data with newlines renders correctly
  const toHtml = (s: string) => (s ?? '').includes('<') ? s : s.replace(/\n/g, '<br>');

  return {
    contentEditable: editable || undefined,
    suppressContentEditableWarning: editable || undefined,
    ref: (el: HTMLElement | null) => {
      if (el && el !== document.activeElement) el.innerHTML = toHtml(value);
    },
    onKeyDown: editable
      ? (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const sel = window.getSelection();
            if (!sel || !sel.rangeCount) return;
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const br = document.createElement('br');
            range.insertNode(br);
            // Browsers need a trailing node after <br> to position the cursor on the new line
            if (!br.nextSibling) {
              br.parentNode!.appendChild(document.createElement('br'));
            }
            range.setStartAfter(br);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      : undefined,
    onBlur: editable
      ? (e: React.FocusEvent<HTMLElement>) => onSave(e.currentTarget.innerHTML)
      : undefined,
  };
}
