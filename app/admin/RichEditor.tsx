"use client";
import { useRef, useCallback } from "react";
import {
  Bold, Italic, Underline, AlignRight, AlignCenter, AlignLeft,
  List, ListOrdered, Heading1, Heading2, Quote, Minus, Link, Unlink,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

type CommandAction =
  | { cmd: string; value?: string }
  | { fn: () => void };

const ToolbarBtn = ({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) => (
  <button type="button" title={title} onMouseDown={e => { e.preventDefault(); onClick(); }}
    className={`p-1.5 rounded transition-colors ${active ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
    {children}
  </button>
);

export default function RichEditor({ value, onChange, placeholder = "متن را اینجا بنویسید...", minHeight = "300px" }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((action: CommandAction) => {
    if ("fn" in action) { action.fn(); return; }
    document.execCommand(action.cmd, false, action.value ?? "");
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML ?? "");
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt("آدرس لینک را وارد کنید:");
    if (url) exec({ cmd: "createLink", value: url });
  }, [exec]);

  const tools: { title: string; icon: React.ReactNode; action: CommandAction }[] = [
    { title: "Bold", icon: <Bold size={15} />, action: { cmd: "bold" } },
    { title: "Italic", icon: <Italic size={15} />, action: { cmd: "italic" } },
    { title: "Underline", icon: <Underline size={15} />, action: { cmd: "underline" } },
    { title: "H1", icon: <Heading1 size={15} />, action: { cmd: "formatBlock", value: "h2" } },
    { title: "H2", icon: <Heading2 size={15} />, action: { cmd: "formatBlock", value: "h3" } },
    { title: "نقل‌قول", icon: <Quote size={15} />, action: { cmd: "formatBlock", value: "blockquote" } },
    { title: "لیست نقطه‌ای", icon: <List size={15} />, action: { cmd: "insertUnorderedList" } },
    { title: "لیست شماره‌ای", icon: <ListOrdered size={15} />, action: { cmd: "insertOrderedList" } },
    { title: "راست‌چین", icon: <AlignRight size={15} />, action: { cmd: "justifyRight" } },
    { title: "وسط‌چین", icon: <AlignCenter size={15} />, action: { cmd: "justifyCenter" } },
    { title: "چپ‌چین", icon: <AlignLeft size={15} />, action: { cmd: "justifyLeft" } },
    { title: "خط افقی", icon: <Minus size={15} />, action: { cmd: "insertHorizontalRule" } },
    { title: "لینک", icon: <Link size={15} />, action: { fn: insertLink } },
    { title: "حذف لینک", icon: <Unlink size={15} />, action: { cmd: "unlink" } },
  ];

  return (
    <div className="border border-[#1e2d4a] rounded-xl overflow-hidden focus-within:border-[#00d4ff]/40 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-[#1e2d4a] bg-[#0a0f1e]">
        {tools.map((t, i) => (
          <ToolbarBtn key={i} title={t.title} onClick={() => exec(t.action)}>
            {t.icon}
          </ToolbarBtn>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        dir="rtl"
        onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ minHeight }}
        className={`p-4 text-sm text-gray-200 bg-[#0a0f1e] outline-none leading-relaxed
          prose prose-invert prose-sm max-w-none
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-4 [&_h2]:mb-2
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-200 [&_h3]:mt-3 [&_h3]:mb-1
          [&_blockquote]:border-r-2 [&_blockquote]:border-[#00d4ff]/40 [&_blockquote]:pr-3 [&_blockquote]:text-gray-400 [&_blockquote]:italic
          [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5
          [&_a]:text-[#00d4ff] [&_a]:underline
          [&_hr]:border-[#1e2d4a]
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600`}
        data-placeholder={placeholder}
      />
    </div>
  );
}
