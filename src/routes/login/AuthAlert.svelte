<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
	export let field: string;
</script>

{#if form?.warning && form?.warnings.some((e) => e.field === field)}
	<div class="alert variant-ghost-error px-4 py-3" role="alert">
		{#each form?.warnings || [] as alert, i}
			{#if alert?.field === field}
				<div class="alert-message">{alert.message}</div>
			{/if}
		{/each}
	</div>
{/if}
