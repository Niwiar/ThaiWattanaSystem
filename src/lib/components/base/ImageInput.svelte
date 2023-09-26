<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Props
	export let label: string;
	export let title: string;
	export let name: string;
	export let src: string = '';

	let image: HTMLImageElement;
	let files: FileList;
	let alt = `preview ${title}`;

	const onChange = () => {
		const file = files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			src = reader?.result as string;
		};
		reader.readAsDataURL(file);
	};
</script>

<label class="label" for={name}>
	<span>{label}</span>
	<!-- {#if showImage}
		<div class="w-full flex justify-center">
			<img bind:this={image} src="" {alt} width="80%" />
		</div>
	{/if} -->
	<FileDropzone bind:files {name} on:change={onChange} class="!p-8 !py-4">
		<svelte:fragment slot="lead">
			{#if !src}{title}{/if}
		</svelte:fragment>
		<svelte:fragment slot="meta">
			{#if !src}PNG, JPG, JPEG allowed{/if}
		</svelte:fragment>
		<svelte:fragment slot="message">
			{#if src}
				<div class="w-full flex justify-center">
					<img bind:this={image} {src} {alt} width="80%" />
				</div>
			{:else}<strong>Upload a file</strong> or drag and drop
			{/if}
		</svelte:fragment>
	</FileDropzone>
</label>
