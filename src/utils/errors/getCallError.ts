import { CallExecutionError } from '../../errors/contract.js';
import { containsNodeError, getNodeError, } from './getNodeError.js';
export function getCallError(err, { docsPath, ...args }) {
    let cause = err;
    if (containsNodeError(err))
        cause = getNodeError(err, args);
    return new CallExecutionError(cause, {
        docsPath,
        ...args,
    });
}
//# sourceMappingURL=getCallError.js.map