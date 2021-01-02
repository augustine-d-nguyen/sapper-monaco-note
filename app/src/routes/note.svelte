<script context="module" lang="ts">
	import type { Preload } from "@sapper/common";

	export const preload: Preload = async function(this, page, session) {
		const { pid } = session;

		if (!pid) {
			return this.redirect(302, '/');
		}
		// - Load data from firebase.
		return { pid };
	}
</script>
<script lang="ts">
	import { onMount } from 'svelte';

	export let pid;

	let container;
	let monaco;
	let editor;

	onMount(async () => {
		monaco = await import('monaco-editor');
		let options: monaco.editor.IStandaloneEditorConstructionOptions = {
			value: pid,
			language: "plaintext",
			lineNumbers: "on",
			roundedSelection: false,
			scrollBeyondLastLine: false,
			readOnly: false,
			theme: "vs-dark",
			wordWrap: "on"
		}
		editor = monaco.editor.create(container, options);
		monaco.languages.getLanguages().forEach(lang => {
			editor.addAction({
				id: "select-language-" + lang.id,
				label: "Language: " + lang.id.toUpperCase(),
				run: function() {
					monaco.editor.setModelLanguage(editor.getModel(), lang.id);
				}
			});
		});
		// - Add save menu
		editor.addAction({
			id: "save-this-note",
			label: "Save",
			contextMenuGroupId: '9_cutcopypaste',
			contextMenuOrder: '0',
			run: saveNote
		});
	});

	async function saveNote() {
		console.log(editor.getValue());
	}
</script>
<style>
	.editor-container {
		height: 100%;
	}
</style>
<svelte:head>
	<title>olO Note</title>
</svelte:head>
<div class="editor-container" bind:this={container}></div>