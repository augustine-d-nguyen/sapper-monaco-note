<script lang="ts">
	import md5 from 'md5';
	import { goto, stores } from '@sapper/app';

	const { session } = stores();
	let noteName;

	async function gotoNote() {
		let hashName = md5(noteName);
		$session.pid = hashName;
		console.log('goto note');
		goto('note');
	}
</script>

<style>
</style>

<svelte:head>
	<title>olO Note</title>
</svelte:head>

<input type="password" bind:value={noteName} placeholder="Enter your note name."/>
<br />
<button on:click={gotoNote}>Open</button>
