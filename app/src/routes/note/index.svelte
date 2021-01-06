<script context="module" lang="ts">
	import type { Preload } from "@sapper/common";

	export const preload: Preload = async function(this, page, session) {
		const { pid } = session;

		if (!pid) {
			return this.redirect(302, '/');
		}
		const res = await this.fetch(`note.json`, {
			method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({ pid }),
            headers: {
                'Content-Type': 'application/json'
            }
		});
		const data = await res.json();
		if (res.status === 200) {
			return { pid, data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>
<script lang="ts">
	import { onMount } from 'svelte';

	export let pid, data;

	let container;
	let monaco;
	let editor;

	onMount(async () => {
		monaco = await import('monaco-editor');
		let options: monaco.editor.IStandaloneEditorConstructionOptions = {
			value: data.ndata,
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
		let ndata = editor.getValue()
		const res = await fetch(`note.json`, {
			method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify({ pid, ndata }),
            headers: {
                'Content-Type': 'application/json'
            }
		});
		const sdata = await res.json();
		if (res.status !== 200) {
			this.error(res.status, data.message);
		}
		console.log(sdata);
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