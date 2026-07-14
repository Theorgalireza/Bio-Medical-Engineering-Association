"use client";

import { useRef, useCallback, useEffect, type ReactNode } from "react"; // useEffect هم اضافه شد

import {
  Bold, Italic, Underline, AlignRight, AlignCenter, AlignLeft,
  List, ListOrdered, Heading1, Heading2, Quote, Minus, Link, Unlink,
} from "lucide-react";
import { Image as ImageIcon } from "lucide-react"; // NEW

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
  onClick: () => void; active?: boolean; title: string; children: ReactNode;
}) => (
  <button type="button" title={title} onMouseDown={e => { e.preventDefault(); onClick(); }}
    className={`p-1.5 rounded transition-colors ${active ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
    {children}
  </button>
);

// --- کمک: آپلود فایل و گرفتن URL ---
// !!! توجه: این تابع فقط برای تست است. وقتی API آپلود را ساختی، آن را جایگزین کن. !!!
async function uploadImageAndGetUrl(file: File): Promise<string | null> {
  // --- نسخه تست (بدون سرور): فقط URL لوکال برمی‌گردانیم
  // return URL.createObjectURL(file);

  // --- نسخه واقعی: وقتی API نوشتی، اینجا را جایگزین کن:
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", { // مطمئن شو این API وجود دارد یا آدرس درست را بده
      method: "POST",
      body: formData,
      // headers: { 'Content-Type': 'multipart/form-data' } // fetch معمولا خودش ست می‌کند
    });

    if (!res.ok) {
      console.error("Upload response not OK:", res.status, res.statusText);
      throw new Error("Upload failed");
    }

    const data = await res.json();
    // فرض: API برمی‌گرداند { url: "https://..." }
    if (data.url) {
      return data.url;
    } else {
      console.error("Upload response missing URL:", data);
      return null;
    }
  } catch (err) {
    console.error("Error during image upload fetch:", err);
    throw err; // خطا را دوباره throw می‌کنیم تا در catch اصلی مدیریت شود
  }
}

// --- کمک: درج HTML در محل cursor ---
// --- کمک: درج HTML در محل cursor ---
// --- کمک: درج HTML در محل cursor ---
function insertHtmlAtCursor(html: string) {
  const sel = window.getSelection();
  // doc.activeElement می تواند body یا هر element دیگری باشد،
  // پس باید چک کنیم که focusable باشد و متد focus را داشته باشد
  const editor = document.activeElement;

  if (editor && !(editor instanceof HTMLElement) && !(editor instanceof SVGElement)) {
    // اگر editor یک عنصر قابل فوکوس نیست (مثلا text node)
    console.warn("Active element is not focusable.");
    // در این حالت، ما کاری نمی توانیم انجام دهیم تا فوکوس را به ویرایشگر برگردانیم
    // پس از درج صرف نظر می کنیم یا یک راه حل جایگزین پیدا می کنیم
    return;
  }

  let range: Range | null = null;

  if (sel && sel.rangeCount > 0) {
    range = sel.getRangeAt(0);
  } else {
    // اگر selection نداریم، یک range جدید بسازیم و به انتهای contentEditable اضافه کنیم
    range = document.createRange();
    if (editor && editor.contains(document.activeElement)) { // چک می‌کنیم که editor واقعا همان activeElement باشد
      if (editor.lastChild) {
        range.setStartAfter(editor.lastChild);
      } else {
        range.setStart(editor, 0); // اگر هیچ childی نداشت
      }
    } else if (editor) {
       // اگر activeElement ویرایشگر نیست، ولی editor مقدار دارد
       // سعی میکنیم به انتهای آن برویم (ممکن است اتفاق نیفتد)
       if(editor.lastChild) range.setStartAfter(editor.lastChild);
       else range.setStart(editor, 0);
       // اگر editor فوکوس ندارد، آن را فوکوس می‌کنیم
       if (typeof editor.focus === 'function') {
          editor.focus();
       }
    }
    range.collapse(true); // محدوده را به یک نقطه تبدیل کن
  }

  // اگر هنوز range نداریم
  if (!range) {
    console.error("Could not create a valid range to insert HTML.");
    return;
  }

  // حذف محتوای فعلی selection (اگر وجود دارد)
  range.deleteContents();

  // ساخت یک div موقت برای نگهداری HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // ساخت یک document fragment برای درج بهینه
  const frag = document.createDocumentFragment();
  let lastNode: ChildNode | null = null;
  while (temp.firstChild) {
    const node = temp.firstChild;
    frag.appendChild(node);
    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
      lastNode = node; // آخرین نود اضافه شده را نگه دار
    }
  }

  // درج fragment در محل range
  range.insertNode(frag);

  // cursor را بعد از محتوای درج شده قرار بده
  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
  } else {
     // اگر هیچ نودی درج نشد (مثلا html خالی بود)، cursor را همانجا نگه دار
     sel?.removeAllRanges();
     sel?.addRange(range);
  }
}




export default function RichEditor({ value, onChange, placeholder = "متن را اینجا بنویسید...", minHeight = "300px" }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isContentChangedRef = useRef(false); // برای جلوگیری از فراخوانی onChange در mount اولیه

  const exec = useCallback((action: CommandAction) => {
    if (!editorRef.current) return;

    if ("fn" in action) {
      action.fn(); // توابع سفارشی مثل insertLink, insertImage
    } else {
      // دستورات execCommand استاندارد
      document.execCommand(action.cmd, false, action.value ?? "");
    }

    // اطمینان از فوکوس و ثبت تغییرات
    editorRef.current.focus();
    isContentChangedRef.current = true; // علامت گذاری برای ثبت تغییر
    onChange(editorRef.current.innerHTML); // ثبت تغییرات
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt("آدرس لینک را وارد کنید:");
    if (url) {
      // بررسی می‌کنیم که URL معتبر باشد (حداقل با http یا https شروع شود)
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        alert("لطفاً یک آدرس URL معتبر وارد کنید (مثلاً https://example.com).");
        return;
      }
      exec({ cmd: "createLink", value: url });
    }
  }, [exec]);

  const insertImage = useCallback(async () => {
    if (!editorRef.current) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // تعریف متغیر در اسکوپ بالاتر
      let tempImageUrl: string | null = null;

      try {
        tempImageUrl = URL.createObjectURL(file);
        insertHtmlAtCursor(`<img src="${tempImageUrl}" alt="در حال آپلود..." style="max-width:100%; height:auto; opacity: 0.6;" />`);
        onChange(editorRef.current?.innerHTML ?? "");

        const url = await uploadImageAndGetUrl(file);

        if (!url) {
           console.error("Image upload returned null URL.");
           alert("آپلود تصویر ناموفق بود.");
           
           if (editorRef.current) {
             editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
               `<img src="${tempImageUrl}" alt="در حال آپلود..." style="max-width:100%; height:auto; opacity: 0.6;" />`,
               ""
             );
             onChange(editorRef.current.innerHTML);
           }
           return;
        }

        if (editorRef.current) {
          const imgHtml = `<img src="${url}" alt="تصویر گالری" style="max-width:100%; height:auto;" />`;
          const tempImgs = editorRef.current.querySelectorAll('img[alt="در حال آپلود..."]');
          tempImgs.forEach(img => img.remove());

          insertHtmlAtCursor(imgHtml);
          onChange(editorRef.current.innerHTML);
        }

      } catch (err) {
        console.error("Image upload process failed:", err);
        alert("آپلود تصویر با خطا مواجه شد.");
         if (editorRef.current) {
           const tempImgs = editorRef.current.querySelectorAll('img[alt="در حال آپلود..."]');
           tempImgs.forEach(img => img.remove());
           onChange(editorRef.current.innerHTML);
         }
      } finally {
         // حالا tempImageUrl اینجا در دسترس است
         if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl);
         }
      }
    };

    input.click();
  }, [onChange]);

  // مدیریت فوکوس و از دست دادن فوکوس
  const handleFocus = useCallback(() => {
    // console.log("Editor focused");
    if (editorRef.current) {
      // ممکن است بخواهیم وقتی فوکوس می‌گیرد، placeholder را پاک کنیم (اگر هنوز هست)
      // اما چون از CSS :empty::before استفاده می‌کنیم، نیازی نیست
    }
  }, []);

  const handleBlur = useCallback(() => {
    // console.log("Editor blurred");
    // اگر محتوا تغییر کرده، onChange را صدا بزن
    if (isContentChangedRef.current && editorRef.current) {
      onChange(editorRef.current.innerHTML);
      isContentChangedRef.current = false; // ریست کردن فلگ
    }
  }, [onChange]);

  // useEffect برای مقداردهی اولیه یا مدیریت تغییرات value از بیرون
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // اگر مقدار value از بیرون تغییر کرد، محتوای editor را آپدیت کن
      // اما مراقب باش که این باعث حلقه نشود
      // یک راه اینه که فقط اگر محتوای فعلی editor با value فرق داشت، آپدیت کنیم
       editorRef.current.innerHTML = value;
       isContentChangedRef.current = false; // چون این تغییر از بیرون بوده، فلگ را ریست می‌کنیم
    }
  }, [value]);

  const tools: {
    title: string;
    icon: ReactNode;
    action: CommandAction;
  }[] = [
    { title: "Bold", icon: <Bold size={15} />, action: { cmd: "bold" } },
    { title: "Italic", icon: <Italic size={15} />, action: { cmd: "italic" } },
    { title: "Underline", icon: <Underline size={15} />, action: { cmd: "underline" } },
    { title: "H1", icon: <Heading1 size={15} />, action: { cmd: "formatBlock", value: "h2" } }, // معمولا h1 برای صفحه اصلی است
    { title: "H2", icon: <Heading2 size={15} />, action: { cmd: "formatBlock", value: "h3" } }, // h2 برای تیترهای مهمتر
    { title: "نقل‌قول", icon: <Quote size={15} />, action: { cmd: "formatBlock", value: "blockquote" } },
    { title: "لیست نقطه‌ای", icon: <List size={15} />, action: { cmd: "insertUnorderedList" } },
    { title: "لیست شماره‌ای", icon: <ListOrdered size={15} />, action: { cmd: "insertOrderedList" } },
    { title: "راست‌چین", icon: <AlignRight size={15} />, action: { cmd: "justifyRight" } },
    { title: "وسط‌چین", icon: <AlignCenter size={15} />, action: { cmd: "justifyCenter" } },
    { title: "چپ‌چین", icon: <AlignLeft size={15} />, action: { cmd: "justifyLeft" } },
    { title: "خط افقی", icon: <Minus size={15} />, action: { cmd: "insertHorizontalRule" } },
    { title: "لینک", icon: <Link size={15} />, action: { fn: insertLink } },
    { title: "حذف لینک", icon: <Unlink size={15} />, action: { cmd: "unlink" } },

    // --- NEW: تصویر ---
    { title: "تصویر", icon: <ImageIcon size={15} />, action: { fn: insertImage } },
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
        onInput={() => {
           // در اینجا فقط فلگ را فعال می‌کنیم، onChange در handleBlur صدا زده می‌شود
           isContentChangedRef.current = true;
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
