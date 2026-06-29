import '@tiptap/core';

declare module '@tiptap/core' {
  interface Storage {
    characterCount: {
      characters: () => number;
      words: () => number;
    };
  }
}