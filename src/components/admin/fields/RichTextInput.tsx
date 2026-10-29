"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { htmlToMarkup, markupToHtml, richCommands } from "@/lib/admin/rich-markup";

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
}

/**
 * The formatted-text field.
 *
 * Writers see bold as bold and the accent italic in the brand colour,
 * rather than a plain box full of asterisks. What is stored is still
 * the site's inline markup — the editor converts on the way in and on
 * the way out — so a document never contains HTML and the renderer
 * never has to trust one.
 *
 * The surface is only re-seeded from props when the value changes
 * elsewhere; writing into it must not move the caret.
 */
export function RichTextInput({ value, onChange, placeholder, rows = 3, id }: RichTextInputProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef(value);
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || showSource) return;

    // Only rewrite the DOM when the change came from outside, or the
    // caret jumps to the start on every keystroke.
    if (value === lastEmitted.current) return;

    element.innerHTML = markupToHtml(value);
    lastEmitted.current = value;
  }, [value, showSource]);

  const emit = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const markup = htmlToMarkup(element);
    lastEmitted.current = markup;
    onChange(markup);
  }, [onChange]);

  /** Wraps the selection, or unwraps it when it is already wrapped. */
  const apply = useCallback(
    (commandId: string) => {
      const element = ref.current;
      const selection = window.getSelection();
      if (!element || !selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (!element.contains(range.commonAncestorContainer)) return;

      const text = range.toString();
      if (!text.trim()) return;

      const command = richCommands.find((entry) => entry.id === commandId);
      if (!command) return;

      let href = "";

      if (command.tag === "a") {
        href = window.prompt("Link address (a path like /books, or https://…)", "/") ?? "";
        if (!href.trim()) return;
      }

      const wrapper = document.createElement(command.tag);
      if (command.className) wrapper.className = command.className;
      if (command.tag === "a") wrapper.setAttribute("href", href.trim());
      wrapper.textContent = text;

      range.deleteContents();
      range.insertNode(wrapper);

      // Leave the caret after the new element rather than inside it.
      range.setStartAfter(wrapper);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      emit();
    },
    [emit],
  );

  const clearFormatting = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const markup = htmlToMarkup(element).replace(
      /\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|~([^~]+)~|\/([^/]+)\/|\[([^\]]+)\]\([^)]+\)/g,
      (_, ...groups: (string | undefined)[]) => groups.find((group) => group !== undefined) ?? "",
    );

    element.innerHTML = markupToHtml(markup);
    lastEmitted.current = markup;
    onChange(markup);
  }, [onChange]);

  return (
    <div className="adm-panel overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5"
        style={{ borderColor: "var(--a-line)", background: "var(--a-sunken)" }}
      >
        {richCommands.map((command) => (
          <button
            key={command.id}
            type="button"
            title={command.title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => apply(command.id)}
            className="adm-btn adm-btn-quiet min-w-8"
            style={{
              fontStyle: command.tag === "em" ? "italic" : undefined,
              fontWeight: command.tag === "strong" ? 800 : 600,
              color: command.className === "adm-accent" ? "var(--a-accent)" : undefined,
            }}
          >
            {command.label}
          </button>
        ))}

        <span className="mx-1 h-4 w-px" style={{ background: "var(--a-line-strong)" }} />

        <button
          type="button"
          title="Remove all formatting"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearFormatting}
          className="adm-btn adm-btn-quiet"
        >
          Clear
        </button>

        <button
          type="button"
          title="Edit the underlying markup"
          onClick={() => setShowSource((open) => !open)}
          className="adm-btn adm-btn-quiet ml-auto"
        >
          {showSource ? "Formatted" : "Markup"}
        </button>
      </div>

      {showSource ? (
        <textarea
          id={id}
          value={value}
          rows={rows + 1}
          spellCheck={false}
          onChange={(event) => {
            lastEmitted.current = event.target.value;
            onChange(event.target.value);
          }}
          className="adm-input rounded-none border-0 font-mono text-xs focus:shadow-none"
        />
      ) : (
        <div
          id={id}
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder}
          onInput={emit}
          onBlur={emit}
          onPaste={(event) => {
            // Paste as text; formatting is applied with the toolbar, so
            // a pasted document cannot smuggle in markup or styles.
            event.preventDefault();
            const text = event.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
          }}
          className="adm-rich px-3 py-2.5 outline-none"
          style={{ minHeight: `${rows * 1.6 + 1}rem` }}
        />
      )}
    </div>
  );
}
