import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token: any = await getToken({ req });
  const accountId = token.accounts[0].id;

  let receiptFilename = "";
  const expenseCategoryId = "9228495";
  const projectId = "34886727";
  const spentDate = "2019-01-31";
  const totalCost = "1";
  const notes = "This is a note about the expense.";
  const billable = "true";

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

  form.on("end", () => {
    const myHeaders = new Headers();
    myHeaders.append("Harvest-Account-Id", accountId);
    myHeaders.append("Authorization", `Bearer ${token.access_token}`);

    const formData = new FormData();
    formData.append("receipt", new Blob(fileData), receiptFilename);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

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

  form.parse(req, (err, fields, files) => {
    console.log("form parse error", err);
  });

  res.status(200).json({ success: true });
};
