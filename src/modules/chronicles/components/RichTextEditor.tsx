'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Card } from '@/shared/ui/Card'
import { EmojiButton } from '@/shared/ui/EmojiPicker'
import { useState, useEffect } from 'react'

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children 
}: { 
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={`
      p-2 rounded-lg text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-white/20 text-white' 
        : 'text-white/60 hover:bg-white/10 hover:text-white'
      }
    `}
  >
    {children}
  </button>
)

interface RichTextEditorProps {
  content?: string | Record<string, unknown>
  onChange?: (content: Record<string, unknown>) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: mounted ? (typeof content === 'string' ? content : {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: content ? [{ type: 'text', text: '' }] : []
        }
      ]
    }) : '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert min-h-[200px] px-4 py-3 focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
    autofocus: false,
    immediatelyRender: false
  })

  if (!mounted || !editor) {
    return null
  }

  const insertEmoji = (emoji: string) => {
    editor.commands.insertContent(emoji)
  }

  return (
    <Card gradient="from-primary-500/10 to-primary-400/10">
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

        <EmojiButton onEmojiSelect={insertEmoji} />
      </div>

      <EditorContent editor={editor} placeholder={placeholder} />
    </Card>
  )
}
