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
		max-width: 21rem;
		padding: 1rem;
		margin: auto;
		text-align: center;
	}
	.box > * {

		background-color: #3c3c3c;
		line-height: 1.5rem;
		color: rgb(214, 202, 202);
		border: none;
		margin: 0.5rem 0;
	}
	.box input {
		max-width: 12rem;
	}
	.box p {
		background: none;
		font-size: medium;
		font-weight: bold;
		margin: 0;
	}
	.box button {
		max-width: 3rem;
	}
</style>

<svelte:head>
	<title>olO Note</title>
</svelte:head>

<div class="box">
	<p>olO Note</p>
	<input bind:value={noteName}
		type="password"
		style="display: {showPWD ? 'none': 'inline-block'}"
		placeholder="Enter your note name."/>
	<input bind:value={notePWD}
		type="password"
		style="display: {showPWD ? 'inline-block': 'none'}"
		placeholder="Enter your private code."/>
	<button disabled={ showPWD && !notePWD || !showPWD && !noteName } on:click={checkPrivacy}>Open</button>
</div>
