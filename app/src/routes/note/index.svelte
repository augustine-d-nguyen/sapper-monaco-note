<script context="module" lang="ts">
	import type { Preload } from "@sapper/common";

	export const preload: Preload = async function(this, page, session) {
		const { pid, pwd } = session;

		if (!pid) {
			return this.redirect(302, '');
		}
		const res = await this.fetch(`note.json`, {
			method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({ pid, pwd }),
            headers: {
                'Content-Type': 'application/json'
            }
		});
		const data = await res.json();
		if (res.status === 200) {
			return { data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>
<script lang="ts">
	import md5 from 'md5';
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app';
	import AlertBox from '../../components/AlertBox.svelte';
	import SaveBox from '../../components/SaveBox.svelte';

	const { session } = stores();

	export let data;

	let container;
	let monaco;
	let editor;
	let notifier;
	let saver;
	let contextPos;

	let showSaver = false;
	let oldPrivacy = 'Public';

	onMount(async () => {
		monaco = await import('monaco-editor');
		if (!data) {
			data = {
				ndata: '',
				lang: 'plaintext'
			}
		}
		let options: monaco.editor.IStandaloneEditorConstructionOptions = {
			value: data.ndata,
			language: data.lang,
			lineNumbers: "on",
			roundedSelection: false,
			scrollBeyondLastLine: false,
			readOnly: false,
			theme: "vs-dark",
			wordWrap: "on",
			automaticLayout: true
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
			run: openSaver
		});
		editor.addAction({
			id: "go-to-home",
			label: "Home",
			contextMenuGroupId: 'navigation',
			contextMenuOrder: '0',
			run: () => goto('')
		});
		// - Get position of context menu
		editor.onContextMenu((e) => {
			showSaver = false;
			contextPos = e.event.pos;
		});
		editor.onMouseDown((e) => {
			// console.log(e);
			showSaver = false;
		});
	});

	async function openSaver() {
		oldPrivacy = $session.privacy;
		showSaver = true;
	}

	async function saveNote(event) {
		let ndata = editor.getValue();
		let pid = $session.pid;
		let pwd = '';
		let privacy = event.detail.privacy;
		let lang = editor.getModel().getModeId();
		// console.log(lang);
		if (oldPrivacy !== 'Public' || privacy !== 'Public') {
			pwd = md5(event.detail.pwd);
		}
		const res = await fetch(`note.json`, {
			method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify({ pid, pwd, privacy, ndata, lang }),
            headers: {
                'Content-Type': 'application/json'
            }
		});
		const sdata = await res.json();
		if (res.status !== 200) {
			notifier.err(sdata.message);
			// error(res.status, sdata.message);
		} else {
			// console.log('save successfully');
			notifier.info('Save successfully!');
		}
		showSaver = false;
	}
</script>
<style>
	.editor-container {
		height: 100%;
	}
</style>
<svelte:head>
	<title>olO NOTE</title>
</svelte:head>
{#if showSaver}
	<SaveBox bind:this={saver} on:submit={saveNote} privacy={oldPrivacy} pos={contextPos}/>
{/if}
<div class="editor-container" bind:this={container}>
</div>
<AlertBox bind:this={notifier}/>