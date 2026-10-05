import { useCallback, useEffect, useState, useRef } from 'react';

import { RichTextProvider } from 'reactjs-tiptap-editor';

// Base Kit
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { ListItem } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  Dropcursor,
  Gapcursor,
  Placeholder,
  TrailingNode,
} from '@tiptap/extensions';

// build extensions
import {
  Attachment,
  RichTextAttachment,
} from 'reactjs-tiptap-editor/attachment';
import {
  Blockquote,
  RichTextBlockquote,
} from 'reactjs-tiptap-editor/blockquote';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import {
  BulletList,
  RichTextBulletList,
} from 'reactjs-tiptap-editor/bulletlist';
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import {
  Column,
  ColumnNode,
  MultipleColumnNode,
  RichTextColumn,
} from 'reactjs-tiptap-editor/column';
// import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer';
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';
// import {
//   Excalidraw,
//   RichTextExcalidraw,
// } from 'reactjs-tiptap-editor/excalidraw';
// import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
// import {
//   ExportWord,
//   RichTextExportWord,
// } from 'reactjs-tiptap-editor/exportword';
import {
  FontFamily,
  RichTextFontFamily,
} from 'reactjs-tiptap-editor/fontfamily';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';
import {
  History,
  RichTextRedo,
  RichTextUndo,
} from 'reactjs-tiptap-editor/history';
import {
  HorizontalRule,
  RichTextHorizontalRule,
} from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe';
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
// import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif';
// import {
//   ImportWord,
//   RichTextImportWord,
// } from 'reactjs-tiptap-editor/importword';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex';
import {
  LineHeight,
  RichTextLineHeight,
} from 'reactjs-tiptap-editor/lineheight';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { Mention } from 'reactjs-tiptap-editor/mention';
// import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';
import {
  OrderedList,
  RichTextOrderedList,
} from 'reactjs-tiptap-editor/orderedlist';
import {
  RichTextSearchAndReplace,
  SearchAndReplace,
} from 'reactjs-tiptap-editor/searchandreplace';
import { RichTextStrike, Strike } from 'reactjs-tiptap-editor/strike';
import { RichTextTable, Table } from 'reactjs-tiptap-editor/table';
import { RichTextTaskList, TaskList } from 'reactjs-tiptap-editor/tasklist';
import { RichTextAlign, TextAlign } from 'reactjs-tiptap-editor/textalign';
import {
  RichTextTextDirection,
  TextDirection,
} from 'reactjs-tiptap-editor/textdirection';
import {
  RichTextUnderline,
  TextUnderline,
} from 'reactjs-tiptap-editor/textunderline';
// import { RichTextTwitter, Twitter } from 'reactjs-tiptap-editor/twitter';
import { RichTextVideo, Video } from 'reactjs-tiptap-editor/video';
import { RichTextCallout, Callout } from 'reactjs-tiptap-editor/callout';

// Slash Command
import {
  SlashCommand,
  SlashCommandList,
} from 'reactjs-tiptap-editor/slashcommand';

// Bubble
import {
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleImage,
  RichTextBubbleImageGif,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleVideo,
  RichTextBubbleMenuDragHandle,
  RichTextBubbleCallout,
  RichTextBubbleCodeBlock,
} from 'reactjs-tiptap-editor/bubble';
import { createLowlight } from 'lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';

import '@excalidraw/excalidraw/index.css';
import 'easydrawer/styles.css';
import 'katex/dist/katex.min.css';
import 'reactjs-tiptap-editor/style.css';

import { useTheme } from 'next-themes';
import { themeActions } from 'reactjs-tiptap-editor/theme';

import { EditorContent, useEditor } from '@tiptap/react';
import { cn } from '@/lib/utils';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  Table as TableIcon,
  Link2,
  Undo2,
  Redo2,
  RemoveFormatting,
  ChevronDown,
  Check,
} from 'lucide-react';
import 'katex/contrib/mhchem';
import { CharacterCount } from '@tiptap/extensions';
import { Count } from '@/components/Editor/extension/Count';
import { EMOJI_LIST } from '@/components/Editor/emojis';

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// create a lowlight instance with all languages loaded
const lowlight = createLowlight();

// This is only an example, all supported languages are already loaded above
// but you can also register only specific languages to reduce bundle-size
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('bash', bash);

// custom document to support columns
const DocumentColumn = /* @__PURE__ */ Document.extend({
  content: '(block|columns)+',
});

const MOCK_USERS = [
  {
    id: '0',
    label: 'hunghg255',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/42096908?v=4',
    },
  },
  {
    id: '1',
    label: 'benjamincanac',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4',
    },
  },
  {
    id: '2',
    label: 'atinux',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/904724?v=4',
    },
  },
  {
    id: '3',
    label: 'danielroe',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/28706372?v=4',
    },
  },
  {
    id: '4',
    label: 'pi0',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/5158436?v=4',
    },
  },
];

const BaseKit = [
  DocumentColumn,
  Text,
  Dropcursor.configure({
    class: 'reactjs-tiptap-editor-theme',
    color: 'hsl(var(--primary))',
    width: 2,
  }),
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: "Write something, or press '/' for commands...",
  }),
];

const WORD_LIMIT = 5000;

export const extensions = [
  ...BaseKit,
  CharacterCount.configure(),


  History,
  SearchAndReplace,
  Clear,
  FontFamily,
  Heading,
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji.configure({
    suggestion: {
      items: async ({ query }: any) => {
        const lowerCaseQuery = query?.toLowerCase();

        return EMOJI_LIST.filter(({ name }) =>
          name.toLowerCase().includes(lowerCaseQuery),
        );
      },
    },
  }),
  Color,
  Highlight,
  BulletList,
  OrderedList,
  TextAlign,
  Indent,
  LineHeight,
  TaskList,
  Link,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 300);
      });
    },
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 300);
      });
    },
  }),
  // ImageGif.configure({
  //   provider: 'giphy',
  //   API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY as string,
  // }),
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock.configure({
    lowlight,
  }),
  Column,
  ColumnNode,
  MultipleColumnNode,
  Table,
  Iframe,
  // ExportPdf,
  // ImportWord,
  // ExportWord,
  TextDirection,
  Attachment.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Katex,
  // Excalidraw,
  // Mermaid.configure({
  //   upload: (file: any) => {
  //     // fake upload return base 64
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         const blob = convertBase64ToBlob(reader.result as string);
  //         resolve(URL.createObjectURL(blob));
  //       }, 300);
  //     });
  //   },
  // }),
  // Drawer.configure({
  //   upload: (file: any) => {
  //     // fake upload return base 64
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         const blob = convertBase64ToBlob(reader.result as string);
  //         resolve(URL.createObjectURL(blob));
  //       }, 300);
  //     });
  //   },
  // }),
  // Twitter,
  // Mention.configure({
  //   // suggestion: {
  //   //   char: '@',
  //   //   items: async ({ query }: any) => {
  //   //     return MOCK_USERS.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()));
  //   //   },
  //   // }
  //   suggestions: [
  //     {
  //       char: '@',
  //       items: async ({ query }: any) => {
  //         return MOCK_USERS.filter((item) =>
  //           item.label.toLowerCase().startsWith(query.toLowerCase()),
  //         );
  //       },
  //     },
  //     {
  //       char: '#',
  //       items: async ({ query }: any) => {
  //         return MOCK_USERS.filter((item) =>
  //           item.label.toLowerCase().startsWith(query.toLowerCase()),
  //         );
  //       },
  //     },
  //   ],
  // }),
  SlashCommand,
  CodeView,
  Callout,
];

const DEFAULT = `<h1 dir="auto" style="text-align: center;">Rich Text Editor</h1><p dir="auto" style="text-align: center;">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><div class="image" style="text-align: center;"><img dir="auto" src="https://picsum.photos/1920/1080.webp?t=1" width="303" flipx="false" flipy="false" align="center" inline="false" style=""></div></p><h2 dir="auto">Features</h2><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><h2 dir="auto">Installation</h2><pre dir="auto"><code>pnpm install reactjs-tiptap-editor@latest</code></pre><p dir="auto"></p>;`;

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

interface ToolbarBtnProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarBtn = ({ onClick, active, disabled, title, children }: ToolbarBtnProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/70 disabled:opacity-30 disabled:cursor-not-allowed",
      active
        ? "bg-slate-900 text-white shadow-xs font-bold hover:bg-slate-800 hover:text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 dark:hover:text-slate-950 dark:shadow-xs ring-2 ring-slate-900/20 dark:ring-white/30"
        : ""
    )}
  >
    {children}
  </button>
);

const TextStyleDropdown = ({ editor }: { editor: any }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  let currentLabel = 'Text';
  let CurrentIcon = Pilcrow;
  let isHeading = false;

  if (editor.isActive('heading', { level: 1 })) {
    currentLabel = 'Heading 1';
    CurrentIcon = Heading1;
    isHeading = true;
  } else if (editor.isActive('heading', { level: 2 })) {
    currentLabel = 'Heading 2';
    CurrentIcon = Heading2;
    isHeading = true;
  } else if (editor.isActive('heading', { level: 3 })) {
    currentLabel = 'Heading 3';
    CurrentIcon = Heading3;
    isHeading = true;
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer border shadow-2xs",
          isHeading
            ? "bg-slate-900 text-white border-slate-900 shadow-xs dark:bg-white dark:text-slate-950 dark:border-white ring-2 ring-slate-900/20 dark:ring-white/30"
            : "text-slate-700 dark:text-foreground/80 hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/70 border-slate-200/90 dark:border-border/40 bg-white dark:bg-background/50"
        )}
      >
        <CurrentIcon className={cn("h-3.5 w-3.5", isHeading ? "text-white dark:text-slate-950" : "text-slate-500 dark:text-muted-foreground")} />
        <span className="hidden sm:inline-block">{currentLabel}</span>
        <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-40 w-44 p-1 rounded-xl border border-slate-200 dark:border-border/80 bg-white dark:bg-popover text-slate-800 dark:text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-accent hover:text-slate-900 dark:hover:text-accent-foreground transition-colors cursor-pointer text-left font-medium",
              currentLabel === 'Text' && "bg-slate-100 dark:bg-accent/80 font-semibold text-slate-900 dark:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Pilcrow className="h-3.5 w-3.5 opacity-70" />
              <span>Normal Text</span>
            </div>
            {currentLabel === 'Text' && <Check className="h-3.5 w-3.5 text-slate-900 dark:text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-accent hover:text-slate-900 dark:hover:text-accent-foreground transition-colors cursor-pointer text-left font-medium",
              currentLabel === 'Heading 1' && "bg-slate-100 dark:bg-accent/80 font-semibold text-slate-900 dark:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Heading1 className="h-3.5 w-3.5 opacity-70" />
              <span>Heading 1</span>
            </div>
            {currentLabel === 'Heading 1' && <Check className="h-3.5 w-3.5 text-slate-900 dark:text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-accent hover:text-slate-900 dark:hover:text-accent-foreground transition-colors cursor-pointer text-left font-medium",
              currentLabel === 'Heading 2' && "bg-slate-100 dark:bg-accent/80 font-semibold text-slate-900 dark:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Heading2 className="h-3.5 w-3.5 opacity-70" />
              <span>Heading 2</span>
            </div>
            {currentLabel === 'Heading 2' && <Check className="h-3.5 w-3.5 text-slate-900 dark:text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-accent hover:text-slate-900 dark:hover:text-accent-foreground transition-colors cursor-pointer text-left font-medium",
              currentLabel === 'Heading 3' && "bg-slate-100 dark:bg-accent/80 font-semibold text-slate-900 dark:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Heading3 className="h-3.5 w-3.5 opacity-70" />
              <span>Heading 3</span>
            </div>
            {currentLabel === 'Heading 3' && <Check className="h-3.5 w-3.5 text-slate-900 dark:text-primary" />}
          </button>
        </div>
      )}
    </div>
  );
};

const ModernToolbar = ({ editor }: { editor: any }) => {
  const [, setTick] = useState(0);

  // Subscribe to selection and transaction updates so active button states refresh in real-time
  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setTick((t) => t + 1);
    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="sticky top-14 z-20 mx-auto w-full flex items-center justify-between gap-2 p-1.5 rounded-xl border border-slate-200/90 dark:border-border/70 bg-white/95 dark:bg-background/85 backdrop-blur-md shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.04)] dark:shadow-xs transition-all">
      <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] py-0.5">
        {/* Style Selector */}
        <TextStyleDropdown editor={editor} />

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-border/60 mx-1 shrink-0" />

        {/* Inline Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Inline Code"
          >
            <CodeIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </ToolbarBtn>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-border/60 mx-1 shrink-0" />

        {/* Lists & Tasks */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive('taskList')}
            title="Task Checklist"
          >
            <CheckSquare className="h-4 w-4" />
          </ToolbarBtn>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-border/60 mx-1 shrink-0" />

        {/* Block Inserts */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Quote Block"
          >
            <Quote className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={addTable}
            active={editor.isActive('table')}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={setLink}
            active={editor.isActive('link')}
            title="Insert Link"
          >
            <Link2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus className="h-4 w-4" />
          </ToolbarBtn>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-border/60 mx-1 shrink-0" />

        {/* History & Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarBtn>
        </div>
      </div>

      <div className="hidden lg:flex items-center shrink-0 pr-1 text-[11px] font-mono text-slate-400 dark:text-muted-foreground/70">
        Type <kbd className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 dark:bg-muted dark:border-border/70 dark:text-foreground font-semibold shadow-2xs">/</kbd> for blocks
      </div>
    </div>
  );
};

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  limit?: number;
}

function Editor({ content, onChange, limit = 10000 }: EditorProps) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      themeActions.setTheme('dark');
    } else {
      themeActions.setTheme('light');
    }
  }, [resolvedTheme]);

  const editor = useEditor({
    textDirection: 'auto',
    content: content,
    extensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      if (!editor.isFocused) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  useEffect(() => {
    (window as any).editor = editor;
  }, [editor]);

  if (!editor) return null;

  const characters = editor.storage.characterCount?.characters() || 0;
  const words = editor.storage.characterCount?.words() || 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="w-full space-y-3">
      <RichTextProvider editor={editor}>
        <ModernToolbar editor={editor} />

        <div className="relative rounded-2xl border border-slate-200/90 dark:border-border/60 bg-white dark:bg-card/20 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_4px_-1px_rgba(0,0,0,0.03)] dark:shadow-xs backdrop-blur-xs transition-all focus-within:border-slate-400 dark:focus-within:border-primary/50 focus-within:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-slate-100 dark:focus-within:ring-primary/10">
          {/* Clickable writing canvas */}
          <div
            onClick={(e) => {
              // Clicking anywhere in the canvas padding focuses the editor
              if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'DIV') {
                if (!editor.isFocused) {
                  editor.commands.focus('end');
                }
              }
            }}
            className="min-h-[500px] px-6 sm:px-12 py-8 cursor-text"
          >
            <EditorContent editor={editor} className="outline-none" />
          </div>

          {/* Bubbles */}
          <RichTextBubbleColumns />  
          <RichTextBubbleDrawer />
          <RichTextBubbleExcalidraw />
          <RichTextBubbleIframe />
          <RichTextBubbleKatex />
          <RichTextBubbleLink />
          <RichTextBubbleImage />
          <RichTextBubbleVideo />
          <RichTextBubbleImageGif />
          <RichTextBubbleMermaid />
          <RichTextBubbleTable />
          <RichTextBubbleText />
          <RichTextBubbleTwitter />
          <RichTextBubbleCallout />
          <RichTextBubbleCodeBlock />

          {/* Slash Command & Drag Handle */}
          <SlashCommandList />
          <RichTextBubbleMenuDragHandle />

          {/* Bottom Bar with Stats */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-border/40 px-6 py-2.5 bg-slate-50/75 dark:bg-muted/20 text-xs text-slate-500 dark:text-muted-foreground rounded-b-2xl">
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:opacity-75">
              <span>Type</span>
              <kbd className="rounded border border-slate-200 bg-white dark:border-border/60 dark:bg-muted px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:text-foreground font-semibold shadow-2xs">
                /
              </kbd>
              <span>for commands</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-muted-foreground">
              <span>{words} words</span>
              <span className="opacity-40">•</span>
              <span>{characters} chars</span>
              <span className="opacity-40">•</span>
              <span className="text-slate-800 dark:text-foreground/80 font-medium">~{readTime} min read</span>
            </div>
          </div>
        </div>
      </RichTextProvider>
    </div>
  );
}

export default Editor;