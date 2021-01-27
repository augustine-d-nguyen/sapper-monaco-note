<script lang="ts">
	import md5 from 'md5';
	import { goto, stores } from '@sapper/app';

	const { session } = stores();
	let noteName: string;
	let notePWD: string;
	let showPWD: boolean = false;

	async function checkPrivacy() {
		if (showPWD) {
			$session.pid = md5(noteName);
			$session.pwd = md5(notePWD);
			goto('note');
			return;
		}
		let hashName = md5(noteName);
		const res = await fetch(`note/${hashName}/privacy.json`);
		const data = await res.json();
		$session.privacy = data.privacy;
		if (data.privacy === 'Private') {
			showPWD = true;
		} else {
			$session.pid = hashName;
			$session.pwd = '';
			goto('note');
		}
	}
</script>

<style>
	.box {
		border: 1px solid #3c3c3c;
		max-width: min-content;
		width: auto;
		padding: 1.5rem 3rem;
		margin: auto;
		text-align: center;
	}
	.box > * {
		box-sizing: border-box;
		box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
		line-height: 1.5rem;
		height: 1.75rem;
		background-color: #3c3c3c;
		color: rgb(214, 202, 202);
		border: none;
		margin: 0.5rem 0;
		max-width: 14rem;
		width: 14rem;
		padding: 0 1rem;
	}
	.box button {
		padding: 0;
	}
	.box button:hover {
		background-color: #2c2c2c;
	}
	.box button:disabled {
		background-color: #1e1e1e;
		color:#3c3c3c;
		border: 1px solid #3c3c3c;
	}
	.box object {
		background-color: unset;
		height: auto;
	}
</style>

<svelte:head>
	<title>olO NOTE</title>
</svelte:head>

<div class="box">
	<object data="olonote-text.svg" type="image/svg+xml" title="olonote with text"></object>
	<input bind:value={noteName}
		type="password"
		style="display: {showPWD ? 'none': 'inline-block'}"
		placeholder="Enter your note name."/>
	<input bind:value={notePWD}
		type="password"
		style="display: {showPWD ? 'inline-block': 'none'}"
		placeholder="Enter your private code."/>
	<button disabled={ showPWD && !notePWD || !showPWD && !noteName } on:click={checkPrivacy}>OPEN</button>
</div>
