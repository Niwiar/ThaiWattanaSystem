/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import fs from 'fs';
import pdfmake from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
	Roboto: {
		normal: 'src/lib/assets/fonts/roboto/Roboto-Regular.ttf',
		bold: 'src/lib/assets/fonts/roboto/Roboto-Medium.ttf',
		italics: 'src/lib/assets/fonts/roboto/Roboto-Italic.ttf',
		bolditalics: 'src/lib/assets/fonts/roboto/Roboto-MediumItalic.ttf'
	},
	THSarabunNew: {
		normal: 'src/lib/assets/fonts/THSarabunNew/THSarabunNew.ttf',
		bold: 'src/lib/assets/fonts/THSarabunNew/THSarabunNew-Bold.ttf',
		italics: 'src/lib/assets/fonts/THSarabunNew/THSarabunNew-Italic.ttf',
		bolditalics: 'src/lib/assets/fonts/THSarabunNew/THSarabunNew-BoldItalic.ttf'
	},
	Tahoma: {
		normal: 'src/lib/assets/fonts/tahoma/tahoma.ttf',
		bold: 'src/lib/assets/fonts/tahoma/tahoma-bd.ttf',
		italics: 'src/lib/assets/fonts/tahoma/tahoma-it.ttf',
		bolditalics: 'src/lib/assets/fonts/tahoma/tahoma-bfi.ttf'
	}
};

const customLayouts = {
	priceLayout: {
		hLineWidth: function (i: number, node: any) {
			if (i < node.table.body.length - 2) {
				return 0;
			}
			return i === node.table.body.length ? 2 : 1;
		},
		vLineWidth: function () {
			return 0;
		},
		hLineColor: function () {
			return '#808080';
		},
		paddingLeft: function () {
			return 0;
		},
		paddingRight: function () {
			return 0;
		},
		paddingTop: function () {
			return 1;
		},
		paddingBottom: function () {
			return 1;
		}
	},
	itemLayout: {
		hLineWidth: function (i: number, node: any) {
			if (i <= node.table.headerRows || i >= node.table.body.length - 1) {
				return 1;
			}
			return 0;
		},
		vLineWidth: function () {
			return 1;
		},
		hLineColor: function () {
			return '#000';
		},
		paddingLeft: function () {
			return 1;
		},
		paddingTop: function () {
			return 1;
		},
		paddingBottom: function () {
			return 1;
		}
	}
};

export const createPDF = async (name: string, doc: TDocumentDefinitions) =>
	new Promise<string>((resolve, reject) => {
		try {
			const pdfCreator = new pdfmake(fonts);
			console.log('creating PDF');
			const pdfDoc = pdfCreator.createPdfKitDocument(doc, {
				tableLayouts: customLayouts
			});
			const quotationPath = path.join(process.cwd(), `/static/slip/${name}.pdf`);
			const creating = pdfDoc.pipe(fs.createWriteStream(quotationPath));
			pdfDoc.end();
			creating.on('finish', () => {
				console.log('create file success');
				resolve(`${name}.pdf`);
			});
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
