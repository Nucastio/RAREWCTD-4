import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export const sdkConnect = (
  PRIVATE_KEY: string,
  network: string,
  thridWebSecretKey: string
): ThirdwebSDK | undefined => {
  try {
    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, network, {
      secretKey: thridWebSecretKey,
    });
    if (!sdk) return undefined;
    return sdk;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
