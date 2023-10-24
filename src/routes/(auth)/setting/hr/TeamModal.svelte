<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import AlertText from '$src/lib/components/AlertText.svelte';

	// Props
	export let parent: any;
	export let formData: any = {};
	export let size: string = '';

	import ModalFormBase from '$src/lib/components/base/ModalFormBase.svelte';
</script>

<ModalFormBase {parent} {size}>
	<input bind:value={formData.id} name="id" hidden />
	<input bind:value={formData.teamId} name="teamId" hidden />
	<label class="label gap-2 flex justify-start items-center" for="name">
		<span class="w-20">Team</span>
		<input
			bind:value={formData.name}
			class="input rounded-md px-2 py-1 w-72"
			type="text"
			name="name"
			placeholder="Name"
		/>
		<AlertText alerts={$page.form} form="position" field="name" />
	</label>
	<div class="flex justify-start items-center">
		{#if formData.id}
			<form
				class="space-y-1"
				method="POST"
				action="?/deleteTeam"
				use:enhance
				enctype="multipart/form-data"
			>
				<input bind:value={formData.id} name="id" hidden />
				<button class="btn rounded-md variant-ghost-error" type="submit">Delete</button>
			</form>
		{/if}
	</div>
</ModalFormBase>
