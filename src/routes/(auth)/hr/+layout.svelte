<script>
	import { page } from '$app/stores';
	import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
</script>

<div class="flex flex-col w-full m-6 mt-0 space-y-4">
	<TabGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
		<TabAnchor href="/hr" selected={$page.url.pathname === '/hr'}>Attendance</TabAnchor>
		<TabAnchor href="/hr/billing" selected={$page.url.pathname === '/hr/billing'}>Billing</TabAnchor
		>
	</TabGroup>
	<slot />
</div>
