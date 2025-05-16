import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'emoji-picker': {
        class?: string;
        onEmojiClick?: (event: CustomEvent<{ unicode: string }>) => void;
      };
    }
  }
}