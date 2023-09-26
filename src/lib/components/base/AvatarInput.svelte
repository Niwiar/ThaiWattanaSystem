<svelte:options accessors />

<script lang="ts">
	import { Avatar, FileButton } from '@skeletonlabs/skeleton';

	// props
	export let src: string = '';
	export let initials: string = '';

	let files: FileList;

	const onChange = () => {
		console.log(files);
		const file = files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			src = reader?.result as string;
		};
		reader.readAsDataURL(file);
	};
</script>

<FileButton bind:files name="imageFile" button="btn p-0" on:change={onChange}>
	<Avatar {initials} {src} width="w-36" rounded="rounded-lg bg-transparent" />
</FileButton>
