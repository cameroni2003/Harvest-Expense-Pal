import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

function arrayBufferToBase64(buffer: any) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  return window.btoa(binary);
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("New expense request");
  const token: any = await getToken({ req });
  const accountId = token.accounts[0].id;
  let fields: any = {};

  let receiptFilename = "";

  const form = new formidable.IncomingForm();
  const fileData = new Array<ArrayBuffer>();

  form.onPart = (part) => {
    if (!part.originalFilename) {
      form._handlePart(part);
      return;
    }

    receiptFilename = part.originalFilename ?? "receipt.pdf";

    part.on("data", (data) => {
      fileData.push(data);
    });
  };

  form.on("field", (fieldName, fieldValue) => {
    fields[fieldName] = fieldValue
    //form.emit("data", { name: "field", key: fieldName, value: fieldValue });
  });

  form.once("end", () => {
    const doc = new PDFDocument({ size: [1000, 1000], margin: 0 });
    const outStream = doc.pipe(blobStream());

    const bufferArray = fileData.map((ab) => {
      return new Uint8Array(ab);
    });

    const buffer = Buffer.concat(bufferArray);
    //doc.pipe(res);
    doc.image(buffer, { fit: [1000, 1000] });
    doc.end();

    outStream.on("finish", () => {
      const outBlob = outStream.toBlob("application/pdf");

      res.end();
      const myHeaders = new Headers();
      myHeaders.append("Harvest-Account-Id", accountId);
      myHeaders.append("Authorization", `Bearer ${token.access_token}`);

      const formData = new FormData();
      formData.append(
        "receipt",
        outBlob,
        receiptFilename.toLocaleLowerCase().replace(".jpg", ".pdf")
      );

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };

      const expenseCategoryId = fields["category[id]"];
      const projectId = fields["project[id]"];
      const spentDate = "2019-01-31";
      const totalCost = "1";
      const notes = "This is a note about the expense.";
      const billable = "true";

      const url = new URL("https://api.harvestapp.com/v2/expenses");
      url.searchParams.append("project_id", projectId);
      url.searchParams.append("expense_category_id", expenseCategoryId);
      url.searchParams.append("spent_date", spentDate);
      url.searchParams.append("total_cost", totalCost);
      url.searchParams.append("notes", notes);
      url.searchParams.append("billable", billable);

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    });
  });

  form.parse(req, (err, fields, files) => {
    fields = fields;
    console.log("fields", fields);
    console.log("form parse error", err);
  });

  res.status(200).json({ success: true });
};
