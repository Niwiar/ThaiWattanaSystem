<script lang="ts">
	import { page } from '$app/stores';
	import { FILE_LOCATION } from '$src/constant';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import ImageInputPreview from '$component/base/ImageInput.svelte';
	import AvatarInput from '$component/base/AvatarInput.svelte';
	import type { ActionData } from './$types';
	import AlertText from '$src/lib/components/AlertText.svelte';

	// Props
	export let parent: any;
	export let user = {
		id: 0,
		password: ''
	};
</script>

<ModalFormBase {parent}>
	<input bind:value={user.id} hidden />
	<label class="label gap-2 flex justify-start items-center" for="password">
		<span class="w-24">Password</span>
		<div class="flex flex-col">
			<input class="input rounded-md p-2" type="password" name="password" placeholder="Password" />
			<AlertText alerts={$page.form} field="password" />
		</div>
	</label>
</ModalFormBase>
