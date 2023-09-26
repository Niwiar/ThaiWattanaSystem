import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '$src/constant';

export const imageFileSchema = z.union([
	z
		.instanceof(File)
		.refine((file) => file?.size <= MAX_IMAGE_SIZE, 'ขนาดไฟล์สูงสุดคือ 10 MB')
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'รองรับเฉพาะไฟล์ประเภท .jpg, .jpeg and .png'
		),
	z.instanceof(File).optional()
]);

export const stringToJSONSchema = z
	.string()
	.transform((str, ctx): z.infer<ReturnType<typeof json>> => {
		try {
			return JSON.parse(str);
		} catch (e) {
			ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
			return z.NEVER;
		}
	});

export const jsonToStringSchema = z
	.string()
	.transform((str, ctx): z.infer<ReturnType<typeof json>> => {
		try {
			return JSON.parse(str);
		} catch (e) {
			ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
			return z.NEVER;
		}
	});

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

type Literal = z.infer<typeof literalSchema>;

type Json = Literal | { [key: string]: Json } | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

const json = () => jsonSchema;
