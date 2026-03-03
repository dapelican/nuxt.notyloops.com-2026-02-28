<script setup>
import 'katex/dist/katex.min.css';
import katex from 'katex';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});

const renderKatex = (tex, display_mode) => {
  try {
    return katex.renderToString(tex, { displayMode: display_mode, throwOnError: false });
  } catch {
    return `<span class="math-error">${tex}</span>`;
  }
};

const processed_content = computed(() => {
  let html = props.content;
  html = html.replace(/\$\$\$([\s\S]*?)\$\$\$/g, (_, tex) => renderKatex(tex, true));
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => renderKatex(tex, false));
  return html;
});
</script>

<template>
  <div
    class="tiptap-render"
    v-html="processed_content"
  />
</template>

<style>
.tiptap-render h1 { font-size: 2em; margin: 0.5em 0; }
.tiptap-render h2 { font-size: 1.6em; margin: 0.5em 0; }
.tiptap-render h3 { font-size: 1.3em; margin: 0.5em 0; }
.tiptap-render h4 { font-size: 1.1em; margin: 0.5em 0; }

.tiptap-render a {
  color: var(--color-main);
  text-decoration: underline;
}

.tiptap-render img {
  border-radius: 4px;
  height: auto;
  max-width: 100%;
}

.tiptap-render audio {
  margin: 0.5rem 0;
  width: 100%;
}

.tiptap-render pre {
  background-color: var(--color-background-contrasting);
  border: 1px solid var(--color-card-border);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
  overflow-x: auto;
  padding: 0.75rem 1rem;
}

.tiptap-render code {
  background-color: var(--color-background-contrasting);
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
  padding: 0.1em 0.3em;
}

.tiptap-render pre code {
  background: none;
  padding: 0;
}

.math-error {
  color: var(--color-feedback-negative);
  font-family: monospace;
}
</style>
