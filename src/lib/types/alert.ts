export type Alert = {
	name: string;
	warning: boolean;
	warnings: { field: string; message: string }[];
};
