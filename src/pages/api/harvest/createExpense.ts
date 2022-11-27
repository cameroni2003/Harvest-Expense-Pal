import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function (req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();
  const streamData = new Array<ArrayBuffer>

  form.onPart = (part) => {
    if (!part.originalFilename) {
      form._handlePart(part);
      return;
    }

    part.on("data", (data) => {
      streamData.push(data)
    });
  }

  form.on("end", () => {
    const myHeaders = new Headers();
    myHeaders.append("Harvest-Account-Id", "1665149");
    myHeaders.append(
      "Authorization",
      "Bearer 3242693.at.axW23CXFCrOO7iPHXSRCvUEEyBpQNjzdxzzRgR3N64eKo5lmgnAJIZPl1BnUl7rNa8LhDaKNFrwGdLWptn__aw"
    );
    //myHeaders.append("Content-Type", "multipart/form-data");

    const formData = new FormData();
    formData.append(
      "receipt",
      new Blob(streamData),
      "receipt.pdf"
    );

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch(
      "https://api.harvestapp.com/v2/expenses?project_id=34886727&expense_category_id=9228495&spent_date=2019-01-31&total_cost=1&notes=This is a note about the expense.&billable=true",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  });

  form.parse(req, (err, fields, files) => {
    console.log("form parse error", err);
  });

  res.status(200).json({ name: "Example" });
}
