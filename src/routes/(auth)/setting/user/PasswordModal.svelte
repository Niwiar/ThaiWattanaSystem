<script lang="ts">
	import { page } from '$app/stores';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';

	// Props
	export let parent: any;
	export let formData: any;
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<label class="label gap-2 flex justify-start items-center" for="password">
		<span class="w-24">Password</span>
		<div class="flex flex-col">
			<input class="input rounded-md p-2" type="password" name="password" placeholder="Password" />
			<AlertText alerts={$page.form} field="password" form="user" />
		</div>
	</label>
</ModalFormBase>
