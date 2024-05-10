import type { ToastSettings } from '@skeletonlabs/skeleton';
// ❌ ✔️ ⛔ ❗ 🔥 ❓ 🔎 💡 📌 📣 💼

/* eslint-disable @typescript-eslint/no-explicit-any */
export const toastSuccess = (toastStore: any, message: string, options?: ToastSettings) =>
	toastStore.trigger({
		message: `✔️ ${message}`,
		timeout: 10000,
		background: 'variant-filled-success text-surface-100',
		...options
	});

export const toastWarning = (toastStore: any, message: string, options?: ToastSettings) =>
	toastStore.trigger({
		message: `⛔ ${message}`,
		timeout: 10000,
		background: 'variant-filled-warning text-surface-100',
		...options
	});

export const toastError = (toastStore: any, message: string, options?: ToastSettings) =>
	toastStore.trigger({
		message: `⚠️ ${message}`,
		autohide: false,
		background: 'variant-filled-error text-surface-100',
		...options
	});
