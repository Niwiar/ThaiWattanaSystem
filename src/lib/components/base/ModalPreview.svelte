<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let data: string;
	export let title: string;

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'relative w-modal-wide shadow-xl';
	const cButton = 'absolute -top-3 -right-3 z-1 btn-icon variant-filled';
	const cObject = 'bg-black w-full aspect-video rounded-container-token overflow-hidden';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class={cBase}>
		<button class={cButton} on:click={parent.onClose}>✕</button>
		<object class={cObject} {data} {title} />
	</div>
{/if}
