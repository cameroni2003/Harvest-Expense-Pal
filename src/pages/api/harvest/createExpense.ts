import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
};
export default function (req: NextApiRequest, res: NextApiResponse) {

    const form = formidable()
    form.parse(req, (err, fields, files) => {
        console.log('fields', fields)
        console.log('files', files)
    })
  
    res.status(200).json({ name: 'Example' })
}