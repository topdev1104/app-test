import blob from "@ledgerhq/cryptoassets/data/erc20-signatures";
/**
 * Retrieve the token information by a given contract address if any
 */
export var byContractAddressAndChainId = function (contract, chainId) {
    return get().byContractAndChainId(asContractAddress(contract), chainId);
};
/**
 * list all the ERC20 tokens informations
 */
export var list = function () { return get().list(); };
var asContractAddress = function (addr) {
    var a = addr.toLowerCase();
    return a.startsWith("0x") ? a : "0x" + a;
};
// this internal get() will lazy load and cache the data from the erc20 data blob
var get = (function () {
    var cache;
    return function () {
        if (cache)
            return cache;
        var buf = Buffer.from(blob, "base64");
        var map = {};
        var entries = [];
        var i = 0;
        while (i < buf.length) {
            var length_1 = buf.readUInt32BE(i);
            i += 4;
            var item = buf.slice(i, i + length_1);
            var j = 0;
            var tickerLength = item.readUInt8(j);
            j += 1;
            var ticker = item.slice(j, j + tickerLength).toString("ascii");
            j += tickerLength;
            var contractAddress = asContractAddress(item.slice(j, j + 20).toString("hex"));
            j += 20;
            var decimals = item.readUInt32BE(j);
            j += 4;
            var chainId = item.readUInt32BE(j);
            j += 4;
            var signature = item.slice(j);
            var entry = {
                ticker: ticker,
                contractAddress: contractAddress,
                decimals: decimals,
                chainId: chainId,
                signature: signature,
                data: item
            };
            entries.push(entry);
            map[String(chainId) + ":" + contractAddress] = entry;
            i += length_1;
        }
        var api = {
            list: function () { return entries; },
            byContractAndChainId: function (contractAddress, chainId) {
                return map[String(chainId) + ":" + contractAddress];
            }
        };
        cache = api;
        return api;
    };
})();
//# sourceMappingURL=erc20.js.map