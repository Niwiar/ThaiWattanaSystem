// See https://kit.svelte.dev/docs/types#app

export type UserPermission = {
	hr: int;
	production: int;
	warehouse: int;
	setting: int;
};

export type UserInfo = {
	id: string;
	username: string;
	permission?: UserPermission;
	iat?: Date;
	exp?: Date;
};

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserInfo | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
