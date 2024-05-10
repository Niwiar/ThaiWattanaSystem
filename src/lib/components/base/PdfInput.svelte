<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Props
	export let label: string;
	export let title: string;
	export let name: string;
	export let data: string = '';

	let object: HTMLObjectElement;
	let files: FileList;

	const onChange = () => {
		const file = files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			data = reader?.result as string;
		};
		reader.readAsDataURL(file);
	};
</script>

<label class="label" for={name}>
	<span>{label}</span>
	<!-- {#if showImage}
		<div class="w-full flex justify-center">
			<img bind:this={object} data="" {alt} width="80%" />
		</div>
	{/if} -->
	<FileDropzone bind:files {name} on:change={onChange} class="!p-8 !py-4  variant-filled-surface">
		<svelte:fragment slot="lead">
			{#if !data}{title}{/if}
		</svelte:fragment>
		<svelte:fragment slot="meta">
			{#if !data}PDF allowed{/if}
		</svelte:fragment>
		<svelte:fragment slot="message">
			{#if data}
				<div class="w-full flex justify-center">
					<object bind:this={object} type="application/pdf" {title} {data} width="100%" />
				</div>
			{:else}<strong>Upload a file</strong> or drag and drop
			{/if}
		</svelte:fragment>
	</FileDropzone>
</label>
