<script setup>
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { Node, mergeAttributes } from '@tiptap/core';
import { all, createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

const lowlight = createLowlight(all);

const AudioNode = Node.create({
  name: 'audio',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: 'audio[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes, { controls: true }), 0];
  },
});

const LANGUAGES = [
  'bash', 'c', 'cpp', 'css', 'diff', 'go', 'html', 'java', 'javascript',
  'json', 'kotlin', 'lua', 'markdown', 'php', 'python', 'ruby', 'rust',
  'scss', 'shell', 'sql', 'swift', 'typescript', 'xml', 'yaml',
];

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  modelValue: {
    type: String,
    default: '',
  },
});

const show_html = ref(false);
const raw_html = ref('');

const editor = useEditor({
  content: props.modelValue,
  immediatelyRender: false,
  extensions: [
    StarterKit.configure({ codeBlock: false }),
    Underline,
    Link.configure({ openOnClick: false }),
    Image,
    CodeBlockLowlight.configure({ lowlight }),
    AudioNode,
  ],
  onUpdate: ({ editor: e }) => {
    emit('update:modelValue', e.getHTML());
  },
});

watch(
  () => props.modelValue,
  (value) => {
    const is_same = editor.value?.getHTML() === value;
    if (is_same) {
      return;
    }
    editor.value?.commands.setContent(value, false);
  }
);

const toggleView = () => {
  if (!show_html.value) {
    raw_html.value = editor.value?.getHTML() ?? '';
  } else {
    editor.value?.commands.setContent(raw_html.value, false);
    emit('update:modelValue', raw_html.value);
  }
  show_html.value = !show_html.value;
};

const setHeading = (level) => {
  editor.value?.chain().focus().toggleHeading({ level }).run();
};

const insertLink = () => {
  const url = prompt('Enter link URL:');
  if (url === null) {
    return;
  }
  if (url === '') {
    editor.value?.chain().focus().extendMarkToLink().unsetLink().run();
  } else {
    editor.value?.chain().focus().extendMarkToLink().setLink({ href: url }).run();
  }
};

const insertImage = () => {
  const url = prompt('Enter image URL:');
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run();
  }
};

const insertAudio = () => {
  const url = prompt('Enter audio URL:');
  if (url) {
    editor.value?.chain().focus().insertContent({ type: 'audio', attrs: { src: url } }).run();
  }
};

const insertMath = () => {
  const latex = prompt('Enter formula (LaTeX):');
  if (!latex) {
    return;
  }
  editor.value?.chain().focus().insertContent(`$$${latex}$$`).run();
};

const setCodeBlockLanguage = (event) => {
  const lang = event.target.value;
  editor.value?.chain().focus().updateAttributes('codeBlock', { language: lang }).run();
};

const active_code_language = computed(() => {
  if (!editor.value?.isActive('codeBlock')) {
    return '';
  }
  return editor.value.getAttributes('codeBlock').language ?? '';
});
</script>

<template>
  <div class="tiptap-wrapper">
    <div
      v-if="editor"
      class="tiptap-toolbar"
    >
      <div class="toolbar-row">
        <button
          type="button"
          class="toolbar-btn view-toggle"
          :class="{
            'is-active': show_html,
          }"
          :title="show_html ? 'Switch to rich editor' : 'Switch to HTML view'"
          @click="toggleView"
        >
          <Icon :name="show_html ? 'uil:toggle-on' : 'uil:toggle-off'" />
        </button>

        <span class="toolbar-separator" />

        <button
          type="button"
          class="toolbar-btn"
          :class="{
            'is-active': editor.isActive('bold'),
          }"
          :disabled="show_html"
          title="Bold"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <Icon name="uil:bold" />
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :class="{
            'is-active': editor.isActive('italic'),
          }"
          :disabled="show_html"
          title="Italic"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <Icon name="uil:italic" />
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :class="{
            'is-active': editor.isActive('underline'),
          }"
          :disabled="show_html"
          title="Underline"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <Icon name="uil:underline" />
        </button>

        <span class="toolbar-separator" />

        <button
          v-for="level in [1, 2, 3, 4]"
          :key="level"
          type="button"
          class="toolbar-btn heading-btn"
          :class="{
            'is-active': editor.isActive('heading', {
              level,
            }),
          }"
          :disabled="show_html"
          :title="`Heading ${level}`"
          @click="setHeading(level)"
        >
          H{{ level }}
        </button>
      </div>

      <div class="toolbar-row">
        <button
          type="button"
          class="toolbar-btn"
          :class="{
            'is-active': editor.isActive('codeBlock'),
          }"
          :disabled="show_html"
          title="Code block"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <Icon name="uil:brackets-curly" />
        </button>

        <select
          v-if="editor.isActive('codeBlock')"
          class="lang-select"
          :value="active_code_language"
          @change="setCodeBlockLanguage"
        >
          <option value="">
            auto
          </option>
          <option
            v-for="lang in LANGUAGES"
            :key="lang"
            :value="lang"
          >
            {{ lang }}
          </option>
        </select>

        <span class="toolbar-separator" />

        <button
          type="button"
          class="toolbar-btn"
          :class="{
            'is-active': editor.isActive('link'),
          }"
          :disabled="show_html"
          title="Link"
          @click="insertLink"
        >
          <Icon name="uil:link" />
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :disabled="show_html"
          title="Image"
          @click="insertImage"
        >
          <Icon name="uil:image" />
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :disabled="show_html"
          title="Audio"
          @click="insertAudio"
        >
          <Icon name="uil:music" />
        </button>

        <span class="toolbar-separator" />

        <button
          type="button"
          class="toolbar-btn"
          :disabled="show_html"
          title="Math formula (LaTeX)"
          @click="insertMath"
        >
          <Icon name="uil:sigma" />
        </button>
      </div>
    </div>

    <EditorContent
      v-show="!show_html"
      :editor="editor"
    />

    <textarea
      v-if="show_html"
      v-model="raw_html"
      class="html-textarea"
      spellcheck="false"
    />
  </div>
</template>

<style>
.tiptap-wrapper .ProseMirror {
  border: 1px solid var(--color-main);
  border-radius: 0 0 5px 5px;
  min-height: 15rem;
  padding: 0.5rem;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  color: var(--color-input-text);
  background-color: inherit;
  width: 100%;
  resize: vertical;
  overflow: auto;
}

.tiptap-wrapper .ProseMirror h1 { font-size: 2em; margin: 0.5em 0; }
.tiptap-wrapper .ProseMirror h2 { font-size: 1.6em; margin: 0.5em 0; }
.tiptap-wrapper .ProseMirror h3 { font-size: 1.3em; margin: 0.5em 0; }
.tiptap-wrapper .ProseMirror h4 { font-size: 1.1em; margin: 0.5em 0; }

.tiptap-wrapper .ProseMirror a {
  color: var(--color-main);
  text-decoration: underline;
  cursor: pointer;
}

.tiptap-wrapper .ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.tiptap-wrapper .ProseMirror audio {
  width: 100%;
  margin: 0.5rem 0;
}

.tiptap-wrapper .ProseMirror pre {
  background-color: var(--color-background-contrasting);
  border: 1px solid var(--color-card-border);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9em;
}

.tiptap-wrapper .ProseMirror code {
  background-color: var(--color-background-contrasting);
  border-radius: 3px;
  padding: 0.1em 0.3em;
  font-family: monospace;
  font-size: 0.9em;
}

.tiptap-wrapper .ProseMirror pre code {
  background: none;
  padding: 0;
}

.tiptap-wrapper .tiptap-toolbar {
  border: 1px solid var(--color-main);
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.toolbar-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.1rem;
  padding: 0.25rem 0.4rem;
}

.toolbar-row + .toolbar-row {
  border-top: 1px solid var(--color-card-border);
}

.toolbar-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0.2rem 0.35rem;
  transition: background-color 0.15s, border-color 0.15s;
}

.toolbar-btn:hover:not(:disabled):not(.is-active) {
  background-color: var(--color-background-contrasting);
  border-color: var(--color-card-border);
}

.toolbar-btn.is-active {
  background-color: var(--color-main);
  border-color: var(--color-main);
  color: var(--color-text-on-button);
}

.toolbar-btn.is-active:hover:not(:disabled) {
  filter: brightness(1.15);
}

.toolbar-btn:disabled {
  color: var(--color-disabled);
  cursor: not-allowed;
}

.heading-btn {
  font-family: var(--font-headline, serif);
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 1.8rem;
}

.toolbar-separator {
  background-color: var(--color-card-border);
  display: inline-block;
  height: 1.2rem;
  margin: 0 0.2rem;
  width: 1px;
}

.lang-select {
  background-color: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: 4px;
  color: var(--color-input-text);
  font-family: inherit;
  font-size: 0.8rem;
  padding: 0.1rem 0.3rem;
}

.html-textarea {
  background-color: inherit;
  border: 1px solid var(--color-main);
  border-radius: 0 0 5px 5px;
  color: var(--color-input-text);
  font-family: monospace;
  font-size: 0.85rem;
  min-height: 15rem;
  outline: none;
  padding: 0.5rem;
  resize: vertical;
  width: 100%;
}

/* Syntax highlighting theme */
.hljs-comment,
.hljs-quote { color: #8b949e; }

.hljs-doctag,
.hljs-formula,
.hljs-keyword { color: #f97583; }

.hljs-deletion,
.hljs-name,
.hljs-section,
.hljs-selector-tag,
.hljs-subst { color: #e06c75; }

.hljs-literal { color: #56b6c2; }

.hljs-addition,
.hljs-attribute,
.hljs-meta-string,
.hljs-regexp,
.hljs-string { color: #98c379; }

.hljs-attr,
.hljs-built_in,
.hljs-number,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-pseudo,
.hljs-template-variable,
.hljs-type,
.hljs-variable { color: #d19a66; }

.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-symbol,
.hljs-title { color: #61afef; }

.hljs-bullet { color: #61afef; }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: bold; }
.hljs-link { text-decoration: underline; }
</style>
