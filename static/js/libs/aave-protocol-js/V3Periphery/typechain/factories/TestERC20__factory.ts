/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from 'ethers';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import { Contract, ContractFactory, Overrides } from '@ethersproject/contracts';

import type { TestERC20 } from '../TestERC20';

export class TestERC20__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(amountToMint: BigNumberish, overrides?: Overrides): Promise<TestERC20> {
    return super.deploy(amountToMint, overrides || {}) as Promise<TestERC20>;
  }
  getDeployTransaction(amountToMint: BigNumberish, overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(amountToMint, overrides || {});
  }
  attach(address: string): TestERC20 {
    return super.attach(address) as TestERC20;
  }
  connect(signer: Signer): TestERC20__factory {
    return super.connect(signer) as TestERC20__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): TestERC20 {
    return new Contract(address, _abi, signerOrProvider) as TestERC20;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountToMint',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const _bytecode =
  '0x6101406040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9610120523480156200003757600080fd5b506040516200174738038062001747833981810160405260208110156200005d57600080fd5b5051604080518082018252600a808252690546573742045524332360b41b60208381018290528451808601865260018152603160f81b818301528551808701875293845283820192835285518087019096526004865263151154d560e21b918601919091528251939485949193929091620000db916003916200035a565b508051620000f19060049060208401906200035a565b50506005805460ff1916601217905550815160208084019190912082519183019190912060c082905260e08190527f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6200014a6200017c565b60a0526200015a81848462000180565b608052610100525062000175935033925084915050620001e4565b5062000406565b4690565b60008383836200018f6200017c565b3060405160200180868152602001858152602001848152602001838152602001826001600160a01b03168152602001955050505050506040516020818303038152906040528051906020012090509392505050565b6001600160a01b03821662000240576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b6200024e60008383620002f3565b6200026a81600254620002f860201b620009b11790919060201c565b6002556001600160a01b038216600090815260208181526040909120546200029d918390620009b1620002f8821b17901c565b6001600160a01b0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b505050565b60008282018381101562000353576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282620003925760008555620003dd565b82601f10620003ad57805160ff1916838001178555620003dd565b82800160010185558215620003dd579182015b82811115620003dd578251825591602001919060010190620003c0565b50620003eb929150620003ef565b5090565b5b80821115620003eb5760008155600101620003f0565b60805160a05160c05160e05161010051610120516112f762000450600039806107d6525080610e55525080610e97525080610e76525080610dfc525080610e2c52506112f76000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c578063a457c2d711610066578063a457c2d7146102e3578063a9059cbb1461031c578063d505accf14610355578063dd62ed3e146103b5576100ea565b806370a08231146102755780637ecebe00146102a857806395d89b41146102db576100ea565b806323b872dd116100c857806323b872dd146101d3578063313ce567146102165780633644e51514610234578063395093511461023c576100ea565b806306fdde03146100ef578063095ea7b31461016c57806318160ddd146101b9575b600080fd5b6100f76103f0565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610131578181015183820152602001610119565b50505050905090810190601f16801561015e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101a56004803603604081101561018257600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356104a5565b604080519115158252519081900360200190f35b6101c16104c2565b60408051918252519081900360200190f35b6101a5600480360360608110156101e957600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135811691602081013590911690604001356104c8565b61021e610569565b6040805160ff9092168252519081900360200190f35b6101c1610572565b6101a56004803603604081101561025257600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610581565b6101c16004803603602081101561028b57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff166105dc565b6101c1600480360360208110156102be57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610604565b6100f7610638565b6101a5600480360360408110156102f957600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356106b7565b6101a56004803603604081101561033257600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813516906020013561072c565b6103b3600480360360e081101561036b57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160208101359091169060408101359060608101359060ff6080820135169060a08101359060c00135610740565b005b6101c1600480360360408110156103cb57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516610979565b60038054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61010060018816150201909516949094049384018190048102820181019092528281526060939092909183018282801561049a5780601f1061046f5761010080835404028352916020019161049a565b820191906000526020600020905b81548152906001019060200180831161047d57829003601f168201915b505050505090505b90565b60006104b96104b2610a2c565b8484610a30565b50600192915050565b60025490565b60006104d5848484610b77565b61055f846104e1610a2c565b61055a856040518060600160405280602881526020016112556028913973ffffffffffffffffffffffffffffffffffffffff8a1660009081526001602052604081209061052c610a2c565b73ffffffffffffffffffffffffffffffffffffffff1681526020810191909152604001600020549190610d47565b610a30565b5060019392505050565b60055460ff1690565b600061057c610df8565b905090565b60006104b961058e610a2c565b8461055a856001600061059f610a2c565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918c1681529252902054906109b1565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260066020526040812061063290610ec2565b92915050565b60048054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61010060018816150201909516949094049384018190048102820181019092528281526060939092909183018282801561049a5780601f1061046f5761010080835404028352916020019161049a565b60006104b96106c4610a2c565b8461055a856040518060600160405280602581526020016112c660259139600160006106ee610a2c565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918d16815292529020549190610d47565b60006104b9610739610a2c565b8484610b77565b834211156107af57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e65000000604482015290519081900360640190fd5b73ffffffffffffffffffffffffffffffffffffffff871660009081526006602052604081207f00000000000000000000000000000000000000000000000000000000000000009089908990899061080590610ec2565b89604051602001808781526020018673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018381526020018281526020019650505050505050604051602081830303815290604052805190602001209050600061088882610ec6565b9050600061089882878787610f2d565b90508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461093457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e61747572650000604482015290519081900360640190fd5b73ffffffffffffffffffffffffffffffffffffffff8a16600090815260066020526040902061096290611124565b61096d8a8a8a610a30565b50505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b600082820183811015610a2557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b3390565b73ffffffffffffffffffffffffffffffffffffffff8316610a9c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806112a26024913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8216610b08576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806111c96022913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b73ffffffffffffffffffffffffffffffffffffffff8316610be3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061127d6025913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8216610c4f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260238152602001806111a66023913960400191505060405180910390fd5b610c5a83838361112d565b610ca4816040518060600160405280602681526020016111eb6026913973ffffffffffffffffffffffffffffffffffffffff86166000908152602081905260409020549190610d47565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082209390935590841681522054610ce090826109b1565b73ffffffffffffffffffffffffffffffffffffffff8084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610df0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610db5578181015183820152602001610d9d565b50505050905090810190601f168015610de25780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b60007f0000000000000000000000000000000000000000000000000000000000000000610e23611132565b1415610e5057507f00000000000000000000000000000000000000000000000000000000000000006104a2565b610ebb7f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000000000000611136565b90506104a2565b5490565b6000610ed0610df8565b8260405160200180807f190100000000000000000000000000000000000000000000000000000000000081525060020183815260200182815260200192505050604051602081830303815290604052805190602001209050919050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0821115610fa8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806112116022913960400191505060405180910390fd5b8360ff16601b1480610fbd57508360ff16601c145b611012576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806112336022913960400191505060405180910390fd5b600060018686868660405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa15801561106e573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811661111b57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015290519081900360640190fd5b95945050505050565b80546001019055565b505050565b4690565b6000838383611143611132565b30604051602001808681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff16815260200195505050505050604051602081830303815290604052805190602001209050939250505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545434453413a20696e76616c6964207369676e6174757265202773272076616c756545434453413a20696e76616c6964207369676e6174757265202776272076616c756545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa164736f6c6343000706000a';