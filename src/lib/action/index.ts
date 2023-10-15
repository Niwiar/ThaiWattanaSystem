import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';

export const handleModal = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	modalStore: any,
	title: string,
	action: string,
	modal: unknown,
	formData: unknown = {}
) => {
	const modalFormComponent: ModalComponent = {
		ref: modal,
		props: { formData }
	};
	const modalForm: ModalSettings = {
		type: 'component',
		component: modalFormComponent,
		title,
		value: { action }
	};
	modalStore.trigger(modalForm);
};
