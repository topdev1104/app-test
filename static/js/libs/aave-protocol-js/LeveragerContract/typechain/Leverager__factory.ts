/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import type { Provider, TransactionRequest } from '@ethersproject/providers';
import type { PromiseOrValue } from '../../common';
import type { Leverager, LeveragerInterface } from './Leverager';

const _abi = [
  {
    inputs: [
      {
        internalType: 'contract ILendingPool',
        name: '_lendingPool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'BORROW_RATIO_DECIMALS',
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
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getConfiguration',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'data',
            type: 'uint256',
          },
        ],
        internalType: 'struct DataTypes.ReserveConfigurationMap',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getVDebtToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lendingPool',
    outputs: [
      {
        internalType: 'contract ILendingPool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRateMode',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowRatio',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loopCount',
        type: 'uint256',
      },
    ],
    name: 'loop',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'ltv',
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
];

const _bytecode =
  '0x608060405234801561001057600080fd5b50604051610a84380380610a8483398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610082565b600060208284031215610065578081fd5b81516001600160a01b038116811461007b578182fd5b9392505050565b6109f3806100916000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063667f3745146100675780637473eea6146100905780639c978eec146100b0578063a59a9973146100b8578063b5f29360146100c0578063c44b11f7146100d5575b600080fd5b61007a610075366004610711565b6100f5565b604051610087919061089b565b60405180910390f35b6100a361009e366004610711565b610185565b6040516100879190610957565b6100a3610212565b61007a610217565b6100d36100ce36600461072d565b610226565b005b6100e86100e3366004610711565b6104a5565b604051610087919061094d565b600080546040516335ea6a7560e01b815282916001600160a01b0316906335ea6a759061012690869060040161089b565b6101806040518083038186803b15801561013f57600080fd5b505afa158015610153573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061017791906107ab565b61012001519150505b919050565b6000805460405163c44b11f760e01b815282916001600160a01b03169063c44b11f7906101b690869060040161089b565b60206040518083038186803b1580156101ce57600080fd5b505afa1580156101e2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102069190610790565b5161ffff169392505050565b600481565b6000546001600160a01b031681565b6040516323b872dd60e01b81526000906001600160a01b038716906323b872dd9061025990339030908a906004016108af565b602060405180830381600087803b15801561027357600080fd5b505af1158015610287573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102ab9190610770565b5060005460405163095ea7b360e01b81526001600160a01b038881169263095ea7b3926102e29290911690600019906004016108d3565b602060405180830381600087803b1580156102fc57600080fd5b505af1158015610310573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103349190610770565b5060005460405163e8eda9df60e01b81526001600160a01b039091169063e8eda9df9061036b9089908990339087906004016108ec565b600060405180830381600087803b15801561038557600080fd5b505af1158015610399573d6000803e3d6000fd5b5050505060005b8281101561049c576103be6127106103b88887610533565b90610593565b60005460405163a415bcad60e01b81529197506001600160a01b03169063a415bcad906103f7908a908a908a9088903390600401610919565b600060405180830381600087803b15801561041157600080fd5b505af1158015610425573d6000803e3d6000fd5b505060005460405163e8eda9df60e01b81526001600160a01b03909116925063e8eda9df915061045f908a908a90339088906004016108ec565b600060405180830381600087803b15801561047957600080fd5b505af115801561048d573d6000803e3d6000fd5b505050506001810190506103a0565b50505050505050565b6104ad610672565b60005460405163c44b11f760e01b81526001600160a01b039091169063c44b11f7906104dd90859060040161089b565b60206040518083038186803b1580156104f557600080fd5b505afa158015610509573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052d9190610790565b92915050565b6000826105425750600061052d565b8282028284828161054f57fe5b041461058c5760405162461bcd60e51b815260040180806020018281038252602181526020018061099d6021913960400191505060405180910390fd5b9392505050565b600061058c83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f0000000000008152506000818361065c5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610621578181015183820152602001610609565b50505050905090810190601f16801561064e5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50600083858161066857fe5b0495945050505050565b6040518060200160405280600081525090565b805161018081610984565b6000602082840312156106a1578081fd5b6040516020810181811067ffffffffffffffff821117156106be57fe5b6040529151825250919050565b80516fffffffffffffffffffffffffffffffff8116811461018057600080fd5b805164ffffffffff8116811461018057600080fd5b805160ff8116811461018057600080fd5b600060208284031215610722578081fd5b813561058c81610984565b600080600080600060a08688031215610744578081fd5b853561074f81610984565b97602087013597506040870135966060810135965060800135945092505050565b600060208284031215610781578081fd5b8151801515811461058c578182fd5b6000602082840312156107a1578081fd5b61058c8383610690565b60006101808083850312156107be578182fd5b6107c781610960565b90506107d38484610690565b81526107e1602084016106cb565b60208201526107f2604084016106cb565b6040820152610803606084016106cb565b6060820152610814608084016106cb565b608082015261082560a084016106cb565b60a082015261083660c084016106eb565b60c082015261084760e08401610685565b60e082015261010061085a818501610685565b9082015261012061086c848201610685565b9082015261014061087e848201610685565b90820152610160610890848201610700565b908201529392505050565b6001600160a01b0391909116815260200190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b03948516815260208101939093529216604082015261ffff909116606082015260800190565b6001600160a01b0395861681526020810194909452604084019290925261ffff166060830152909116608082015260a00190565b9051815260200190565b90815260200190565b60405181810167ffffffffffffffff8111828210171561097c57fe5b604052919050565b6001600160a01b038116811461099957600080fd5b5056fe536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a2646970667358221220c44c22c220fe6a3f6abf75e25e30e82c57df5a5a25a703158a88eca3bb70068364736f6c63430007060033';

type LeveragerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LeveragerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Leverager__factory extends ContractFactory {
  constructor(...args: LeveragerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _lendingPool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Leverager> {
    return super.deploy(_lendingPool, overrides || {}) as Promise<Leverager>;
  }
  override getDeployTransaction(
    _lendingPool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_lendingPool, overrides || {});
  }
  override attach(address: string): Leverager {
    return super.attach(address) as Leverager;
  }
  override connect(signer: Signer): Leverager__factory {
    return super.connect(signer) as Leverager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LeveragerInterface {
    return new utils.Interface(_abi) as LeveragerInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Leverager {
    return new Contract(address, _abi, signerOrProvider) as Leverager;
  }
}