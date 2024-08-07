import type { Request, Response } from "express";
import { sdkConnect } from "../utils/sdk.connect";
import { network, private_key, thirdweb_secretkey } from "../utils/config";

interface RequestBody {
    name: string;
    description: string;
}

export const deployContract = async (req: Request, res: Response) => {
    try {
        const data: RequestBody = req.body;
        const sdk = sdkConnect(private_key, network, thirdweb_secretkey);
        if (!sdk)
            throw { status: 400, message: "Unable to connect the sdk, please verify credentials" };
        const contractAddress = await sdk.deployer.deployNFTCollection({
            name: data.name,
            description: data.description,
        });
        console.log(`Contract with name: ${data.name} deployed on address: ${contractAddress}`);
        res
            .status(201)
            .json({
                contractAddress: contractAddress
            });
    } catch (err: any) {
        res
            .status(err.status || 500)
            .json({ message: err.message } || err);
    }
}