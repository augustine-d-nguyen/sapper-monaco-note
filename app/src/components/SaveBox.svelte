<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    let privacies = [
        { id: 'Public', name: 'Public' },
        { id: 'ReadOnly', name: 'Read-Only' },
        { id: 'Private', name: 'Private' }
    ];
    export let pos;
    export let privacy;
    let selected;
    let pwd;

    onMount(() => {
        selected = privacy;
    });

    const submit = () => dispatch('submit', { privacy: selected, pwd: pwd });
</script>

<style>
    .box {
        position: fixed;
        top: 25%;
        left: 50%;
        z-index: 2500;
        padding: 0.5rem;
        background-color: rgb(60, 60, 60);
    }
    .box > * {
        background-color: #3c3c3c;
        /* line-height: 1.5rem; */
        height: 1.75rem;
        color: rgb(214, 202, 202);
        border: none;
        margin: 0;
        border: 1px solid rgb(214, 202, 202);
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
    .box input {
        max-width: 12rem;
    }
    .box select {
        padding: 1px 2px;
    }
    .box button {
        max-width: 3rem;
    }
</style>

<div class="monaco-editor context-view monaco-menu-container box" style="{!pos? '': `top:${pos.y}px; left:${pos.x}px;`}">
    <select bind:value={selected}>
		{#each privacies as priv}
			<option value={priv.id}>
				{priv.name}
			</option>
		{/each}
    </select>
    <input bind:value={pwd}
		type="password"
		style="display: {(selected === 'Public' && privacy === 'Public') ? 'none' : 'inline-block'};"
        placeholder="Enter your private code."/>
    <button on:click={submit} 
        disabled={(selected !== 'Public' || privacy !== 'Public') && !pwd}>Save</button>
</div>