"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Underline,
  Unlink,
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

const ToolbarBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(event) => {
      event.preventDefault();
      onClick();
    }}
    className={`rounded p-1.5 transition-colors ${active ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
  >
    {children}
  </button>
);

async function uploadImageAndGetUrl(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    if (typeof data?.url === "string" && data.url.length > 0) {
      return data.url;
    }

    return null;
  } catch {
    return null;
  }
}

function insertHtmlAtCursor(html: string) {
  const selection = window.getSelection();
  if (!selection) return;

  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : document.createRange();
  if (selection.rangeCount === 0) {
    range.selectNodeContents(document.activeElement ?? document.body);
    range.collapse(false);
  }

  range.deleteContents();

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const fragment = document.createDocumentFragment();
  let lastNode: ChildNode | null = null;
  while (temp.firstChild) {
    const node = temp.firstChild;
    fragment.appendChild(node);
    lastNode = node;
  }

  range.insertNode(fragment);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "متن را اینجا بنویسید...",
  minHeight = "300px",
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const readEditorHtml = useCallback(() => editorRef.current?.innerHTML ?? "", []);

  const emitCurrentValue = useCallback(() => {
    const html = readEditorHtml();
    onChange(html);
  }, [onChange, readEditorHtml]);

  const exec = useCallback(
    (action: CommandAction) => {
      if (!editorRef.current) return;

      editorRef.current.focus();

      if ("fn" in action) {
        action.fn();
      } else {
        document.execCommand(action.cmd, false, action.value ?? "");
      }

      emitCurrentValue();
    },
    [emitCurrentValue],
  );

  const insertLink = useCallback(() => {
    const url = window.prompt("آدرس لینک را وارد کنید:");
    if (!url) return;

    const normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      window.alert("لطفاً یک آدرس URL معتبر وارد کنید (مثلاً https://example.com).");
      return;
    }

    exec({ cmd: "createLink", value: normalized });
  }, [exec]);

  const insertImage = useCallback(async () => {
    if (!editorRef.current) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const uploadedUrl = await uploadImageAndGetUrl(file);
      const finalUrl = uploadedUrl ?? window.prompt("آدرس تصویر را وارد کنید:", "https://")?.trim() ?? "";
      if (!finalUrl) return;
      if (!/^https?:\/\//i.test(finalUrl)) {
        window.alert("لطفاً یک آدرس معتبر با http یا https وارد کنید.");
        return;
      }

      insertHtmlAtCursor(`<img src="${finalUrl}" alt="تصویر" style="max-width:100%; height:auto;" />`);
      emitCurrentValue();
    };

    input.click();
  }, [emitCurrentValue]);

 useEffect(() => {
  const editor = editorRef.current;
  if (!editor) return;

  // فقط وقتی ادیتور فوکوس ندارد (یعنی تغییر از بیرون آمده، نه از تایپ کاربر)
  if (document.activeElement === editor) return;

  if (editor.innerHTML !== value) {
    editor.innerHTML = value;
  }
}, [value]);



  const tools: { title: string; icon: ReactNode; action: CommandAction }[] = [
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
    { title: "تصویر", icon: <ImageIcon size={15} />, action: { fn: insertImage } },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[#1e2d4a] transition-colors focus-within:border-[#00d4ff]/40">
      <div className="flex flex-wrap gap-0.5 border-b border-[#1e2d4a] bg-[#0a0f1e] p-2">
        {tools.map((tool, index) => (
          <ToolbarBtn key={index} title={tool.title} onClick={() => exec(tool.action)}>
            {tool.icon}
          </ToolbarBtn>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        dir="rtl"
        onInput={emitCurrentValue}
        onBlur={emitCurrentValue}
        onPaste={() => {
          requestAnimationFrame(emitCurrentValue);
        }}
        style={{ minHeight }}
        className={`prose prose-invert max-w-none bg-[#0a0f1e] p-4 text-sm leading-relaxed text-gray-200 outline-none
          [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white
          [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-200
          [&_blockquote]:border-r-2 [&_blockquote]:border-[#00d4ff]/40 [&_blockquote]:pr-3 [&_blockquote]:italic [&_blockquote]:text-gray-400
          [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5
          [&_a]:text-[#00d4ff] [&_a]:underline [&_hr]:border-[#1e2d4a]
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600`}
        data-placeholder={placeholder}
      />
    </div>
  );
}
