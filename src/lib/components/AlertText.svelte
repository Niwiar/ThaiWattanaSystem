<script lang="ts">
	import type { Alert } from '../types/alert';

	export let alerts: Alert;
	export let field: string;
</script>

{#if alerts?.warning && alerts?.warnings.some((e) => e.field === field)}
	<div class="ml-2 alert variant-soft-error !bg-transparent p-0" role="alert">
		{#each alerts?.warnings || [] as alert, i}
			{#if alert?.field === field}
				<div class="alert-message">{alert.message}</div>
			{/if}
		{/each}
	</div>
{/if}
