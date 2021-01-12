<script lang="ts">
	import { goto } from '@sapper/app';

	export let status: number;
	export let error: Error;

	function goHome() {
		goto('');
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
	.box p {
		background: none;
		font-size: medium;
		font-weight: bold;
		margin: 0;
	}
</style>

<svelte:head>
	<title>{status}</title>
</svelte:head>
<div on:click="{goHome}" class="box">
	<p>{status}</p>
	<div>{error.message}</div>
</div>
