import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';

export const handleModal = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	modalStore: any,
	title: string,
	action: string,
	modal: unknown,
	props: {
		formData?: unknown;
		size?: string;
	} = {
		formData: {},
		size: ''
	}
) => {
	const modalFormComponent: ModalComponent = {
		ref: modal,
		props: { ...props }
	};
	const modalForm: ModalSettings = {
		type: 'component',
		component: modalFormComponent,
		title,
		value: { action }
	};
	modalStore.trigger(modalForm);
};

export const handlePreviewModal = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	modalStore: any,
	modal: unknown,
	props: {
		formData?: unknown;
		data: string;
		title: string;
	} = {
		formData: {},
		data: '',
		title: ''
	}
) => {
	const modalPreviewComponent: ModalComponent = {
		ref: modal,
		props: { ...props }
	};
	const modalPreview: ModalSettings = {
		type: 'component',
		component: modalPreviewComponent
	};
	modalStore.trigger(modalPreview);
};
