<script lang="ts">
	import { enhance } from '$app/forms';

	// Props
	export let parent: any;
	export let formData: any = {};

	import ModalFormBase from '$src/lib/components/base/ModalFormBase.svelte';
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<label class="label gap-2 flex justify-start items-center" for="name">
		<span class="w-20">Name</span>
		<input
			bind:value={formData.name}
			class="input rounded-md p-2"
			type="text"
			name="name"
			placeholder="Name"
		/>
	</label>
	<label class="label gap-2 flex justify-start items-center" for="name">
		<span class="w-20">Date</span>
		<input bind:value={formData.date} class="input rounded-md p-2" type="date" name="date" />
	</label>
	<div class="flex justify-start items-center">
		{#if formData.id}
			<form
				class="space-y-1"
				method="POST"
				action="?/deleteHoliday"
				use:enhance
				enctype="multipart/form-data"
			>
				<input bind:value={formData.id} name="id" hidden />
				<button class="btn rounded-md variant-ghost-error" type="submit">Delete</button>
			</form>
		{/if}
	</div>
</ModalFormBase>
