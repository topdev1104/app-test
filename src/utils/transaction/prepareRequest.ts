import { parseAccount } from '../../accounts/utils/parseAccount.js';
import { estimateGas, } from '../../actions/public/estimateGas.js';
import { getBlock } from '../../actions/public/getBlock.js';
import { getGasPrice } from '../../actions/public/getGasPrice.js';
import { getTransactionCount } from '../../actions/public/getTransactionCount.js';
import { AccountNotFoundError } from '../../errors/account.js';
import { BaseError } from '../../errors/base.js';
import { assertRequest } from './assertRequest.js';
export const defaultTip = 1500000000n; // 1.5 gwei
export async function prepareRequest(client, args) {
    const { account: account_, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, } = args;
    if (!account_)
        throw new AccountNotFoundError();
    const account = parseAccount(account_);
    const block = await getBlock(client, { blockTag: 'latest' });
    const request = { ...args, from: account.address };
    if (typeof nonce === 'undefined')
        request.nonce = await getTransactionCount(client, {
            address: account.address,
            blockTag: 'pending',
        });
    if (typeof block.baseFeePerGas === 'bigint') {
        if (typeof gasPrice !== 'undefined')
            throw new BaseError('Chain does not support legacy `gasPrice`.');
        // EIP-1559 fees
        if (typeof maxFeePerGas === 'undefined') {
            // Set a buffer of 1.2x on top of the base fee to account for fluctuations.
            request.maxPriorityFeePerGas = maxPriorityFeePerGas ?? defaultTip;
            request.maxFeePerGas =
                (block.baseFeePerGas * 120n) / 100n + request.maxPriorityFeePerGas;
        }
        else {
            if (typeof maxPriorityFeePerGas === 'undefined' &&
                maxFeePerGas < defaultTip)
                throw new BaseError('`maxFeePerGas` cannot be less than the default `maxPriorityFeePerGas` (1.5 gwei).');
            request.maxFeePerGas = maxFeePerGas;
            request.maxPriorityFeePerGas = maxPriorityFeePerGas ?? defaultTip;
        }
    }
    else {
        if (typeof maxFeePerGas !== 'undefined' ||
            typeof maxPriorityFeePerGas !== 'undefined')
            throw new BaseError('Chain does not support EIP-1559 fees.');
        // Legacy fees
        if (typeof gasPrice === 'undefined')
            // Set a buffer of 1.2x on top of the base fee to account for fluctuations.
            request.gasPrice = ((await getGasPrice(client)) * 120n) / 100n;
    }
    if (typeof gas === 'undefined')
        request.gas = await estimateGas(client, {
            ...request,
            account: { address: account.address, type: 'json-rpc' },
        });
    assertRequest(request);
    return request;
}
//# sourceMappingURL=prepareRequest.js.map