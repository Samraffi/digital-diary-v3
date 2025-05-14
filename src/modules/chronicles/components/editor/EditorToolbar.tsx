'use client'

import { Editor } from '@tiptap/react'
import { MenuButton } from './MenuButton'
import { EmojiButton } from '@/shared/ui/EmojiPicker'

interface EditorToolbarProps {
  editor: Editor
  onEmojiSelect: (emoji: string) => void
}

export function EditorToolbar({ editor, onEmojiSelect }: EditorToolbarProps) {
  return (
    <div className="border-b border-white/10 p-2 flex items-center gap-2 flex-wrap">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <span className="text-lg">B</span>
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <span className="text-lg italic">I</span>
      </MenuButton>

      <div className="h-6 w-px bg-white/10" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        H2
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      >
        H3
      </MenuButton>

      <div className="h-6 w-px bg-white/10" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        •
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        1.
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        "
      </MenuButton>

      <div className="h-6 w-px bg-white/10" />

      <EmojiButton onEmojiSelect={onEmojiSelect} />
    </div>
  )
}