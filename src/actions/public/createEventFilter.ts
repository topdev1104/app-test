import { encodeEventTopics, } from '../../utils/abi/encodeEventTopics.js';
import { numberToHex } from '../../utils/encoding/toHex.js';
import { createFilterRequestScope } from '../../utils/filters/createFilterRequestScope.js';
/**
 * Creates a [`Filter`](https://viem.sh/docs/glossary/types.html#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges.html).
 *
 * - Docs: https://viem.sh/docs/actions/public/createEventFilter.html
 * - JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)
 *
 * @param client - Client to use
 * @param parameters - {@link CreateEventFilterParameters}
 * @returns [`Filter`](https://viem.sh/docs/glossary/types.html#filter). {@link CreateEventFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEventFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createEventFilter(client, {
 *   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 * })
 */
export async function createEventFilter(client, { address, args, event, fromBlock, strict, toBlock, } = {}) {
    const getRequest = createFilterRequestScope(client, {
        method: 'eth_newFilter',
    });
    let topics = [];
    if (event)
        topics = encodeEventTopics({
            abi: [event],
            eventName: event.name,
            args,
        });
    const id = await client.request({
        method: 'eth_newFilter',
        params: [
            {
                address,
                fromBlock: typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
                toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
                ...(topics.length ? { topics } : {}),
            },
        ],
    });
    return {
        abi: event ? [event] : undefined,
        args,
        eventName: event ? event.name : undefined,
        id,
        request: getRequest(id),
        strict,
        type: 'event',
    };
}
//# sourceMappingURL=createEventFilter.js.map