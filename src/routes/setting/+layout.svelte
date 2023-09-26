<script lang="ts">
	import { page } from '$app/stores';

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-200' : '');
</script>

<!-- <div class="container grid grid-cols-[auto_1fr] gap-4 my-6"> -->
<div class="grid grid-cols-[auto_1fr] gap-4 w-full m-6">
	<div class="card h-max p-4 space-y-4">
		<div class="text-xl font-bold w-40 text-surface-900">Setting Menu</div>
		<nav class="list-nav">
			<ul>
				<li><a href="/setting" class="!rounded-lg {classesActive('/setting')}">General</a></li>
				<li>
					<a href="/setting/employee" class="!rounded-lg {classesActive('/setting/employee')}"
						>Employee</a
					>
				</li>
				<li>
					<a href="/setting/user" class="!rounded-lg {classesActive('/setting/user')}">User</a>
				</li>
			</ul>
		</nav>
	</div>

	<slot class="p-4" />
</div>
