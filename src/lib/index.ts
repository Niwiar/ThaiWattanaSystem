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

export const writeFile = async (file: Blob, name: string, folder: string) => {
	if (file.name === 'blob' || file.name === 'undefined') return '';
	const fileName = `${name}.${file.type.split('/')[1]}`;
	const filePath = path.join(process.cwd(), `static`, folder, fileName);
	await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
	return fileName;
};

export const writeFileBuffer = async (buffer: Buffer, type: string, folder: string) => {
	const fileName = `${crypto.randomUUID()}_${type}.jpg`;
	const filePath = path.join(process.cwd(), `static`, folder, fileName);
	await fs.writeFile(filePath, Buffer.from(buffer));
	return fileName;
};
