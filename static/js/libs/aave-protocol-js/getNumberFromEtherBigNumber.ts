import { BigNumber as EthersBigNumber } from 'ethers';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';

const getNumberFromEtherBigNumbers = (amount: EthersBigNumber, decimals: number = 18) => {
  let div = valueToBigNumber(1);
  for (let i = 0; i < decimals; i += 1) {
    div = div.multipliedBy(10);
  }

  return valueToBigNumber(amount.toString()).precision(8, BigNumber.ROUND_DOWN).div(div).toNumber();
};

export default getNumberFromEtherBigNumbers;
