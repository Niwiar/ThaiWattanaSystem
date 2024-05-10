<script lang="ts">
	import { page } from '$app/stores';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
</script>

<!-- <div class="container grid grid-cols-[auto_1fr] gap-4 my-6"> -->
<div class="space-y-2">
	<h2 class="text-lg font-bold">Human Resource Setting</h2>
	<TabGroup>
		<TabAnchor href="/setting/hr" selected={$page.url.pathname === '/setting/hr'}>
			Payment
		</TabAnchor>
		<TabAnchor href="/setting/hr/employee" selected={$page.url.pathname === '/setting/hr/employee'}>
			Employee
		</TabAnchor>
	</TabGroup>

	<slot />
</div>
