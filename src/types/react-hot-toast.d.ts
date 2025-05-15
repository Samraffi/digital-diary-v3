declare module 'react-hot-toast' {
  export function Toaster(props: any): JSX.Element;
  export const toast: {
    (message: string | JSX.Element, options?: any): void;
    success: (message: string | JSX.Element, options?: any) => void;
    error: (message: string | JSX.Element, options?: any) => void;
    dismiss: (id: string) => void;
  };
}