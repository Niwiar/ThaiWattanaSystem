<script lang="ts">
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/logo.png';
	import AuthAlert from './AuthAlert.svelte';

	export let form;
</script>

<section class="bg-gray-50 dark:bg-gray-900">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<div class="card p-3">
			<header>
				<img class="w-60 mx-auto" src={logo} alt="logo" />
			</header>
			<section>
				<form method="POST" action="?/login" use:enhance class="space-y-2">
					<h3 class="card-header text-center text-xl font-bold mb-4">Sign in to your account</h3>
					<label class="label" for="username">
						<span>Username</span>
						<input class="input p-2" type="text" name="username" />
					</label>
					<AuthAlert {form} field="username" />

					<label class="label" for="password">
						<span>Password</span>
						<input class="input p-2" type="password" name="password" />
					</label>
					<AuthAlert {form} field="password" />

					{#if form?.error}
						<div class="alert variant-ghost-error px-4 py-3" role="alert">
							<span class="alert-message">{form?.message}</span>
						</div>
					{/if}
					<button class="w-full btn variant-filled-primary" type="submit">Sign in</button>
				</form>
			</section>
			<!-- <footer class="card-footer"></footer> -->
		</div>
	</div>
</section>
