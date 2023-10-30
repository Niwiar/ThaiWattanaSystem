<script lang="ts">
	import type { Alert } from '../types/alert';

	export let alerts: Alert;
	export let field: string;
	export let form: string;
</script>

{#if alerts?.name === form && alerts?.warning && alerts?.warnings.some((e) => e.field === field)}
	<div class="alert variant-ghost-error px-3 py-2" role="alert">
		{#each alerts?.warnings || [] as alert, i}
			{#if alert?.field === field}
				<div class="alert-message">{alert.message}</div>
			{/if}
		{/each}
	</div>
{/if}
