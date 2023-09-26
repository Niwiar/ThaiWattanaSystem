<script lang="ts">
	import { enhance } from '$app/forms';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response('');
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card w-modal shadow-xl';
	const cHeader = 'p-4 text-2xl rounded-t-lg font-bold bg-primary-500 text-white';
	const cForm = 'border p-4 space-y-2 bg-surface-50 text-black';
	const cFooter = `modal-footer p-4 rounded-b-lg  bg-surface-200 text-black ${parent.regionFooter}`;
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<form
		method="POST"
		action="?/{$modalStore[0].value.action ?? ''}"
		use:enhance
		enctype="multipart/form-data"
	>
		<div class={cBase}>
			<header class={cHeader}>{$modalStore[0].title ?? '(empty)'}</header>
			<div class={cForm}>
				<slot />
			</div>

			<!-- prettier-ignore -->
			<footer class={cFooter}>
        <button class="btn {parent.buttonNeutral}" type='reset' on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive} variant-filled-primary" type="submit">Save</button>
    </footer>
		</div>
	</form>
{/if}
