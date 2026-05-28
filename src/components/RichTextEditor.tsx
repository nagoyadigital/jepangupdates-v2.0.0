"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
  Pilcrow,
  X,
  Pencil,
  Unlink,
} from "lucide-react";

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
};

const DEFAULT_CONTENT = '<p><a href="https://jepangupdates.com" target="_blank" rel="noopener noreferrer">JEPANGUPDATES.COM</a> - </p>';

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1B5DAF] underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-md max-w-full" } }),
      Placeholder.configure({ placeholder: "Mulai menulis artikel..." }),
    ],
    content: content || DEFAULT_CONTENT,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none px-5 py-4 min-h-[400px] focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  function openLinkModal() {
    const existingHref = editor!.getAttributes("link").href || "";
    setLinkUrl(existingHref);
    setShowLinkModal(true);
  }

  function applyLink() {
    if (linkUrl) {
      editor!.chain().focus().extendMarkRange("link").setLink({ href: linkUrl, target: "_blank" }).run();
    } else {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  }

  function openImageModal() {
    setImageUrl("");
    setShowImageModal(true);
  }

  function applyImage() {
    if (imageUrl) {
      editor!.chain().focus().setImage({ src: imageUrl }).run();
    }
    setShowImageModal(false);
    setImageUrl("");
  }

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} icon={<Bold size={16} />} title="Bold" />
        <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} icon={<Italic size={16} />} title="Italic" />
        <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} icon={<UnderlineIcon size={16} />} title="Underline" />
        <Divider />
        <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} icon={<Heading2 size={16} />} title="Heading 2" />
        <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} icon={<Heading3 size={16} />} title="Heading 3" />
        <ToolBtn active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} icon={<Pilcrow size={16} />} title="Paragraph" />
        <Divider />
        <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={<List size={16} />} title="Bullet List" />
        <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={<ListOrdered size={16} />} title="Numbered List" />
        <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} icon={<Quote size={16} />} title="Quote" />
        <Divider />
        <ToolBtn active={editor.isActive("link")} onClick={openLinkModal} icon={<LinkIcon size={16} />} title="Link" />
        <ToolBtn active={false} onClick={openImageModal} icon={<ImageIcon size={16} />} title="Image" />
        <ToolBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={<Minus size={16} />} title="Horizontal Line" />
        <Divider />
        <ToolBtn active={false} onClick={() => editor.chain().focus().undo().run()} icon={<Undo size={16} />} title="Undo" />
        <ToolBtn active={false} onClick={() => editor.chain().focus().redo().run()} icon={<Redo size={16} />} title="Redo" />
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />

      {/* Link info bar - shows when cursor is on a link */}
      {editor.isActive("link") && (
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2">
          <LinkIcon size={13} className="text-slate-400" />
          <a
            href={editor.getAttributes("link").href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate text-xs text-[#1B5DAF] hover:underline"
          >
            {editor.getAttributes("link").href}
          </a>
          <button
            onClick={openLinkModal}
            className="rounded px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200"
            title="Edit link"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="rounded px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50"
            title="Hapus link"
          >
            <Unlink size={12} />
          </button>
        </div>
      )}

      {/* Link Modal - centered */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h3 className="text-sm font-black text-[#111827]">Tambah Link</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5">
              <label className="mb-1 block text-sm font-bold text-slate-700">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-md border px-3 py-2.5 text-sm focus:border-[#1B5DAF] focus:outline-none focus:ring-1 focus:ring-[#1B5DAF]"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink(); } }}
              />
              <p className="mt-2 text-[11px] text-slate-400">Link otomatis terbuka di tab baru</p>
              <div className="mt-4 flex gap-2">
                <button onClick={applyLink} className="rounded-md bg-[#1B5DAF] px-4 py-2 text-sm font-bold text-white hover:bg-[#154A8F]">Terapkan</button>
                {editor.isActive("link") && (
                  <button onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkModal(false); }} className="rounded-md border px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Hapus</button>
                )}
                <button onClick={() => setShowLinkModal(false)} className="rounded-md border px-4 py-2 text-sm font-bold text-slate-600">Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal - centered */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h3 className="text-sm font-black text-[#111827]">Tambah Gambar</h3>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5">
              <label className="mb-1 block text-sm font-bold text-slate-700">URL Gambar</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/uploads/2026/05/gambar.webp"
                className="w-full rounded-md border px-3 py-2.5 text-sm focus:border-[#1B5DAF] focus:outline-none focus:ring-1 focus:ring-[#1B5DAF]"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyImage(); } }}
              />
              <p className="mt-2 text-[11px] text-slate-400">Upload dulu di Media Library, lalu paste URL</p>
              <div className="mt-4 flex gap-2">
                <button onClick={applyImage} className="rounded-md bg-[#1B5DAF] px-4 py-2 text-sm font-bold text-white hover:bg-[#154A8F]">Sisipkan</button>
                <button onClick={() => setShowImageModal(false)} className="rounded-md border px-4 py-2 text-sm font-bold text-slate-600">Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolBtn({ active, onClick, icon, title }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded transition ${
        active ? "bg-[#1B5DAF] text-white" : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-slate-300" />;
}
