// place files you want to import through the `$lib` alias in this folder.
import path from 'path';
import fs from 'fs/promises';

export const toObject = (obj: unknown) => {
	return JSON.parse(
		JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
	);
};

export const FiletoBlob = (file: File) => {
	return new Blob([file], { type: file?.type });
};

export const writeFile = async (file: unknown, type: string, folder: string) => {
	if ((file as Blob).name === 'blob' || (file as Blob).name === 'undefined') return '';
	const fileName = `${crypto.randomUUID()}_${type}.${(file as Blob).type.split('/')[1]}`;
	const filePath = path.join(process.cwd(), `static`, folder, fileName);
	await fs.writeFile(filePath, Buffer.from(await (file as Blob).arrayBuffer()));
	return fileName;
};
