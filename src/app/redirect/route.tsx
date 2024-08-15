/* eslint-disable react/jsx-key */
import { Button, button } from "frames.js/core";
import { getTokenUrl } from "frames.js";
import { frames } from "../frames/frames";

function generateRandomIndex(): number {
  const minIndex = 0;
  const maxIndex = 155;

  return Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
}

const randomIndex = generateRandomIndex();

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <span>
        {ctx.pressedButton
          ? `I clicked ${ctx.searchParams.value}`
          : `Click some button`}
      </span>
    ),
    buttons: [
      <Button
        action="mint"
        target={getTokenUrl({
          address: "0x67D7e7BCc964De5BEf0951EB818E3A9A136312B5",
          chain: zora,
          tokenId: BigInt(randomIndex + 1).toString(),
        })}
      >
        Mint
      </Button>,
      button({
        action: "mint",
        target: getTokenUrl({
          address: "0x67D7e7BCc964De5BEf0951EB818E3A9A136312B5",
          chain: zora,
          tokenId: BigInt(randomIndex + 1).toString(),
        }),
        label: "Mint",
      }),
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
