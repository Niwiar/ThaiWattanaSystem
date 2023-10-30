<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.png';
	import AuthAlert from '$component/AuthAlert.svelte';

	export let form;
</script>

<section class="bg-gray-50 dark:bg-gray-900 w-full h-full">
	<div class="flex flex-col items-center justify-center mx-auto h-screen">
		<div class="card border-2 border-secondary-300 shadow-lg p-8 space-y-2">
			<header>
				<img class="w-24 mx-auto" src={logo} alt="logo" />
			</header>
			<form method="POST" action="?/login" use:enhance class="space-y-2">
				<h3 class="card-header text-center text-xl">Sign in</h3>
				<p class="text-center text-sm !mb-6">Use your Account</p>
				<label class="label" for="username">
					<span>Username</span>
					<input class="input rounded-md !variant-ringed-primary p-2" type="text" name="username" />
				</label>
				<AuthAlert alerts={$page.form} form="auth" field="username" />

				<label class="label" for="password">
					<span>Password</span>
					<input
						class="input rounded-md !variant-ringed-primary p-2"
						type="password"
						name="password"
					/>
				</label>
				<AuthAlert alerts={$page.form} form="auth" field="password" />

				{#if form?.error && form?.name === 'auth'}
					<div class="alert variant-ghost-error px-4 py-3" role="alert">
						<span class="alert-message">{form?.message}</span>
					</div>
				{/if}
				<button class="w-full btn rounded-md variant-filled-primary !mt-8" type="submit"
					>Sign in</button
				>
			</form>
		</div>
	</div>
</section>
