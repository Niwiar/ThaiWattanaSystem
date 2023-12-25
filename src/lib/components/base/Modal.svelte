<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'relative w-modal-wide shadow-xl';
	const cHeader = 'p-4 text-2xl rounded-t-lg font-bold bg-primary-500 text-white';
	const cButton = 'absolute -top-3 -right-3 z-1 btn-icon variant-filled';
	const cBody = 'border p-4 space-y-2 bg-surface-50 text-black';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class={cBase}>
		<button class={cButton} on:click={parent.onClose}>✕</button>
		<header class={cHeader}>{$modalStore[0].title ?? '(empty)'}</header>
		<div class={cBody}>
			<slot />
		</div>
	</div>
{/if}
