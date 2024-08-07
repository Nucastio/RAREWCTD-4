import axios from "axios";
import { type Request, Response } from "express";

interface RequestBody {
    fileFromBase64: string,
    mimetype: string
};

const UploadToIPFS = async (req: Request, res: Response) => {
    try {
        const { fileFromBase64, mimetype }: RequestBody = req.body;
        if (!fileFromBase64 || !mimetype) {
            throw { status: 400, message: "Invalid Request , No Url or mimetype found " };
        }

        const { data } = await axios.post(`https://studio-api.nmkr.io/v2/UploadToIpfs/${process.env.NMKR_CUSTOMER_ID}`, {
            mimetype: mimetype,
            fileFromBase64: fileFromBase64
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.NMKR_API_KEY}`,
            }
        })

        res.json({ hash: data });

    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message } || error);
    }
}

export default UploadToIPFS;