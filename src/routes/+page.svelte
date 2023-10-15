<script lang="ts">
	import wallet from '$lib/assets/wallet.png';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	const handleAccordion = async () => {
		console.log('accordion');
		// const res = await handleModal();
		// console.log(res);
	};
</script>

<div class="container m-12">
	<div class="flex flex-col gap-y-6">
		<Accordion class="card p-2">
			<AccordionItem regionCaret="hidden" on:click={handleAccordion}>
				<svelte:fragment slot="lead">
					<img class="w-14" src={wallet} alt="Wallet Icon" />
				</svelte:fragment>
				<svelte:fragment slot="summary">
					<h2 class="text-primary-500">Balance</h2>
				</svelte:fragment>
				<svelte:fragment slot="content" />
			</AccordionItem>
		</Accordion>
	</div>
</div>
