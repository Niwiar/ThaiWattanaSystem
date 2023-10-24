<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let name: string;
	export let group: number;
</script>

<RadioGroup
	rounded="rounded-md"
	active="variant-filled-tertiary"
	hover="hover:variant-soft-tertiary"
>
	<RadioItem bind:group {name} value="0">
		<i class="fa fa-eye-slash" /> None
	</RadioItem>
	<RadioItem bind:group {name} value="1">
		<i class="fa fa-eye" /> View
	</RadioItem>
	<RadioItem bind:group {name} value="2">
		<i class="fa fa-pen-to-square" /> View & Edit
	</RadioItem>
</RadioGroup>
