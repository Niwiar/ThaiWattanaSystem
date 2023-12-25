/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable, type Writable } from 'svelte/store';

export const fetchGet = (
	init: { data: any; loading: boolean; error: boolean | unknown } = {
		data: {},
		loading: false,
		error: false
	}
) => {
	const store = writable(init);

	async function get(url: string) {
		store.update((old) => ({ ...old, loading: true }));
		try {
			const response = await fetch(url);
			const data = await response.json();
			store.update((old) => ({ ...old, data, loading: false }));
		} catch (error) {
			store.update((old) => ({ ...old, error, loading: false }));
		}
	}

	return { ...store, get };
};

export const fetchPost = () => {
	const loading = writable(false);
	const error: Writable<boolean | unknown> = writable(false);
	const data = writable({});

	async function post(url: string, body: JSON) {
		loading.set(true);
		error.set(false);
		try {
			const response = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
			data.set(await response.json());
		} catch (e) {
			error.set(e);
		}
		loading.set(false);
	}

	return { data, loading, error, post };
};
