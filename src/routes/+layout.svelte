<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import '../app.postcss';
	import '@fortawesome/fontawesome-free/js/all.min';
	import logo from '$lib/assets/logo.png';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import {
		AppBar,
		AppShell,
		Modal,
		Avatar,
		storePopup,
		popup,
		initializeStores,
		AppRail,
		AppRailAnchor,
		Toast
	} from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	const logout = async () => {
		await fetch('/api/auth/logout', { method: 'POST' });
		goto(`/login`);
	};

	const userClick: PopupSettings = {
		event: 'click',
		target: 'userDetail',
		placement: 'bottom',
		closeQuery: 'button',
		middleware: {
			// offset: { mainAxis: 20, crossAxis: 20 }
			// shift: { crossAxis: true }
		}
	};
</script>

<Modal />
<Toast position="t" />
<AppShell>
	<svelte:fragment slot="header">
		{#if data.user}
			<AppBar
				background="bg-none"
				gridColumns="grid-cols-[auto_1fr_auto]"
				slotLead="place-content-start"
				slotDefault="font-semibold text-2xl"
				slotTrail="place-content-end"
			>
				<svelte:fragment slot="lead">
					<img class="w-16 mx-auto" src={logo} alt="logo" />
				</svelte:fragment>
				Manage System
				<svelte:fragment slot="trail">username</svelte:fragment>
			</AppBar>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<AppRail
			class="bg-gradient-to-r from-tertiary-500 to-secondary-900 border-r border-surface-500/30 rounded-tr-lg overflow-hidden text-surface-100"
		>
			<AppRailAnchor href="/" selected={$page.url.pathname === '/'}>
				<svelte:fragment slot="lead"><i class="fa fa-home" /></svelte:fragment>
				<span>Home</span>
			</AppRailAnchor>
			<AppRailAnchor href="/hr" selected={$page.url.pathname === '/hr'}>
				<svelte:fragment slot="lead"><i class="fa fa-users" /></svelte:fragment>
				<span>HR</span>
			</AppRailAnchor>
			<!-- <AppRailAnchor href="/production" selected={$page.url.pathname === '/'}>
				<svelte:fragment slot="lead"><i class="fa fa-boxes-stacked" /></svelte:fragment>
				<span>Production</span>
			</AppRailAnchor>
			<AppRailAnchor href="/warehouse" selected={$page.url.pathname === '/'}>
				<svelte:fragment slot="lead"><i class="fa fa-warehouse" /></svelte:fragment>
				<span>Warehouse</span>
			</AppRailAnchor> -->
			<AppRailAnchor href="/setting" selected={$page.url.pathname.startsWith('/setting')}>
				<svelte:fragment slot="lead"><i class="fa fa-cogs" /></svelte:fragment>
				<span>Setting</span>
			</AppRailAnchor>
			<svelte:fragment slot="trail"
				><AppRailAnchor>
					<svelte:fragment slot="lead"><i class="fa fa-sign-out" /></svelte:fragment>
					<span>Logout</span>
				</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<slot />
</AppShell>
