import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { zoraCreator1155ImplABI } from "@zoralabs/protocol-deployments";
import { Address, encodeAbiParameters, parseAbiParameters } from "viem";

const contractAddress = process.env.CONTRACT_ADDRESS as `0x`;

const account = privateKeyToAccount((process.env.PRIVATE_KEY as `0x`) || "");

export const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.ALCHEMY_URL),
});

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(process.env.ALCHEMY_URL),
});

// function to select from cards
export function generateRandomIndex(): number {
  const minIndex = 0;
  const maxIndex = 155;

  return Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
}

const randomIndex = generateRandomIndex();

export async function mintNft(toAddress: string) {
  try {
    console.log("Generated random index:", randomIndex);
    const minter = contractAddress;
    const tokenId = BigInt(randomIndex + 1);
    console.log(`mint: ${tokenId}`); // test that value matches

    const quantity = BigInt(1);
    const minterArguments = encodeAbiParameters(
      parseAbiParameters("address x, string y"),
      [toAddress as Address, "received a tarot reading onchain"]
    );
    const mintReferral =
      "0xD246C16EC3b555234630Ab83883aAAcdfd946ceF" as Address;

    const args = [minter, tokenId, quantity, minterArguments, mintReferral];

    console.log(args);
    const { request }: any = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: zoraCreator1155ImplABI,
      functionName: "mint",
      args: args as any,
    });
    const transaction = await walletClient.writeContract(request);
    return { transaction, tokenId };
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function balanceOf(address: string) {
  try {
    const tokenId = BigInt(randomIndex + 1); 
    console.log(`balanceOf: ${tokenId}`); // test that value matches

    const balanceData = await publicClient.readContract({
      address: contractAddress,
      abi: zoraCreator1155ImplABI,
      functionName: "balanceOf",
      args: [address as `0x`, tokenId],
    });
    const balance: number = Number(balanceData);
    return balance;
  } catch (error) {
    console.log(error);
    return error;
  }
}
