import { redirect, fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './login/$types';

import { z } from 'zod';
import { setRefreshToken, setToken } from '$server/jwt';

const schema = z.object({
	username: z.string().nonempty({ message: 'Username is required' }),
	password: z.string().nonempty({ message: 'Password is required' })
});

export const actions: Actions = {
	login: async (event: RequestEvent) => {
		const { request, fetch, url } = event;
		const formData = Object.fromEntries(await request.formData());
		const user = schema.safeParse(formData);
		if (!user.success) {
			const warnings = user.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			return fail(400, { name: 'auth', warning: true, warnings });
		}
		const res = await fetch('/api/auth', {
			method: 'post',
			body: JSON.stringify(user.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { name: 'auth', error: true, message: data.message });
		setToken(event, data.token);
		setRefreshToken(event, data.refreshToken);

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) throw redirect(302, `/${redirectTo.slice(1)}`);
		throw redirect(302, '/dashboard');
	}
};
