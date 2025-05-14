'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Card } from '@/shared/ui/card'
import { useState, useEffect } from 'react'
import { EditorToolbar } from './editor/EditorToolbar'

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
      <EditorToolbar editor={editor} onEmojiSelect={insertEmoji} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </Card>
  )
}