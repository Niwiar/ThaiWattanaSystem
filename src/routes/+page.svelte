<script lang="ts">
	import wallet from '$lib/assets/wallet.png';
	import ModalExample from '$lib/components/ModalExample.svelte';
	import { getModalStore, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	const handleExpense = () => {
		console.log('expense');
	};
	const handleAccordion = async () => {
		console.log('accordion');
		// const res = await handleModal();
		// console.log(res);
	};

	const handleModal = () =>
		new Promise((resolve) => {
			const modalFormComponent: ModalComponent = {
				ref: ModalExample,
				// slot: '<p>Skeleton</p>',
				props: {}
			};
			const modalForm: ModalSettings = {
				type: 'component',
				component: modalFormComponent,
				title: 'Form',
				body: 'Form for ...',
				value: '',
				response: (r) => resolve(r)
			};
			modalStore.trigger(modalForm);
		});
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
