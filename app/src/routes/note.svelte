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
  	let editor;

	onMount(async () => {
		const monaco = await import('monaco-editor');
		let options: monaco.editor.IStandaloneEditorConstructionOptions = {
			value: pid,
			language: "javascript",
			lineNumbers: "on",
			roundedSelection: false,
			scrollBeyondLastLine: false,
			readOnly: false,
			theme: "vs-dark",
		}
		editor = monaco.editor.create(container, options);
	});
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