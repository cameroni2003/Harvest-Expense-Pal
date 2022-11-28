import formidable from 'formidable';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getToken} from 'next-auth/jwt';
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import sizeOf from 'image-size';

export const config = {
  api: {
    bodyParser: false,
  },
};

function arrayBufferToBase64(buffer: any) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  return window.btoa(binary);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('New expense request');
    const token: any = await getToken({req});
    const accountId = token.accounts[0].id;
    const fields: any = {};

    let receiptFilename = '';

    const form = new formidable.IncomingForm();
    const fileData = new Array<ArrayBuffer>();

    form.onPart = part => {
      if (!part.originalFilename) {
        form._handlePart(part);
        return;
      }

      receiptFilename = part.originalFilename ?? 'receipt.pdf';

      part.on('data', data => {
        fileData.push(data);
      });
    };

    form.on('field', (fieldName, fieldValue) => {
      fields[fieldName] = fieldValue;
      //form.emit("data", { name: "field", key: fieldName, value: fieldValue });
    });

    form.once('end', () => {
      const bufferArray = fileData.map(ab => {
        return new Uint8Array(ab);
      });

      const buffer = Buffer.concat(bufferArray);
      const size = sizeOf(buffer);

      const doc = new PDFDocument({
        size: [size.width ?? 1000, size.height ?? 1000],
        margin: 0,
      });
      const outStream = doc.pipe(blobStream());

      //doc.pipe(res);
      doc.image(buffer, {fit: [size.width ?? 1000, size.height ?? 1000]});
      doc.end();

      outStream.on('finish', () => {
        const outBlob = outStream.toBlob('application/pdf');

        const myHeaders = new Headers();
        myHeaders.append('Harvest-Account-Id', accountId);
        myHeaders.append('Authorization', `Bearer ${token.access_token}`);

        const formData = new FormData();
        formData.append(
          'receipt',
          outBlob,
          `${fields.expenseDate}_${fields['project[name]']}_${fields['category[name]']}_${fields.vendor}_${fields.total}.pdf`
        );

        const requestOptions: RequestInit = {
          method: 'POST',
          headers: myHeaders,
          body: formData,
          redirect: 'follow',
        };

        const expenseCategoryId = fields['category[id]'];
        const projectId = fields['project[id]'];
        const spentDate = fields.harvestDate;
        const totalCost = fields.total;
        const notes = fields.notes;
        const billable = 'true';

        const url = new URL('https://api.harvestapp.com/v2/expenses');
        url.searchParams.append('project_id', projectId);
        url.searchParams.append('expense_category_id', expenseCategoryId);
        url.searchParams.append('spent_date', spentDate);
        url.searchParams.append('total_cost', totalCost);
        url.searchParams.append('notes', notes);
        url.searchParams.append('billable', billable);

        fetch(url, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
          })
          .catch(error => console.log('error', error));
      });
    });

    form.parse(req, (err, fields, files) => {
      fields = fields;
      console.log('fields', fields);
      console.log('form parse error', err);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false});
    
    return;
  }

  //res.status(200).json({success: true});
};

function buildFilename(fields: any) {
  return ``;
}
