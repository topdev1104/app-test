/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import type { Provider, TransactionRequest } from '@ethersproject/providers';
import type { PromiseOrValue } from '../../common';
import type { UwUUiPriceGetter, UwUUiPriceGetterInterface } from './UwUUiPriceGetter';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_uwuToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_wethToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_uwuLp',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ethAggregator',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ethAggregator',
    outputs: [
      {
        internalType: 'contract AggregatorV3Interface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uwuLp',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uwuToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wethToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const _bytecode =
  '0x61010060405234801561001157600080fd5b506040516105d33803806105d38339810160408190526100309161006f565b6001600160a01b0391821660c05292811660805290811660a0521660e0526100c3565b80516001600160a01b038116811461006a57600080fd5b919050565b6000806000806080858703121561008557600080fd5b61008e85610053565b935061009c60208601610053565b92506100aa60408601610053565b91506100b860608601610053565b905092959194509250565b60805160a05160c05160e0516104b761011c6000396000818161010901526102ce01526000818160cc01528181610142015261020001526000818160a5015261022e0152600081816061015261016f01526104b76000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632b83eaac1461005c5780634b57b0be146100a05780636abadbd4146100c757806398d5fdca146100ee578063f8fc8e5914610104575b600080fd5b6100837f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6100837f000000000000000000000000000000000000000000000000000000000000000081565b6100837f000000000000000000000000000000000000000000000000000000000000000081565b6100f661012b565b604051908152602001610097565b6100837f000000000000000000000000000000000000000000000000000000000000000081565b6040516370a0823160e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116600483015260009182917f000000000000000000000000000000000000000000000000000000000000000016906370a082319060240160206040518083038186803b1580156101b157600080fd5b505afa1580156101c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101e991906103aa565b6040516370a0823160e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301529192506000917f000000000000000000000000000000000000000000000000000000000000000016906370a082319060240160206040518083038186803b15801561027057600080fd5b505afa158015610284573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102a891906103aa565b905060006102c8836102c284670de0b6b3a764000061038b565b9061039e565b905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a06040518083038186803b15801561032557600080fd5b505afa158015610339573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035d91906103e2565b505050915050610382670de0b6b3a76400006102c2848461038b90919063ffffffff16565b94505050505090565b60006103978284610432565b9392505050565b6000610397828461045f565b6000602082840312156103bc57600080fd5b5051919050565b805169ffffffffffffffffffff811681146103dd57600080fd5b919050565b600080600080600060a086880312156103fa57600080fd5b610403866103c3565b9450602086015193506040860151925060608601519150610426608087016103c3565b90509295509295909350565b600081600019048311821515161561045a57634e487b7160e01b600052601160045260246000fd5b500290565b60008261047c57634e487b7160e01b600052601260045260246000fd5b50049056fea2646970667358221220062f69e86d73bac7500ec9b8584b24d31e0d61c3897ed07752105d9fdef1e28264736f6c63430008090033';

type UwUUiPriceGetterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UwUUiPriceGetterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UwUUiPriceGetter__factory extends ContractFactory {
  constructor(...args: UwUUiPriceGetterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _uwuToken: PromiseOrValue<string>,
    _wethToken: PromiseOrValue<string>,
    _uwuLp: PromiseOrValue<string>,
    _ethAggregator: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<UwUUiPriceGetter> {
    return super.deploy(
      _uwuToken,
      _wethToken,
      _uwuLp,
      _ethAggregator,
      overrides || {}
    ) as Promise<UwUUiPriceGetter>;
  }
  override getDeployTransaction(
    _uwuToken: PromiseOrValue<string>,
    _wethToken: PromiseOrValue<string>,
    _uwuLp: PromiseOrValue<string>,
    _ethAggregator: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _uwuToken,
      _wethToken,
      _uwuLp,
      _ethAggregator,
      overrides || {}
    );
  }
  override attach(address: string): UwUUiPriceGetter {
    return super.attach(address) as UwUUiPriceGetter;
  }
  override connect(signer: Signer): UwUUiPriceGetter__factory {
    return super.connect(signer) as UwUUiPriceGetter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UwUUiPriceGetterInterface {
    return new utils.Interface(_abi) as UwUUiPriceGetterInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): UwUUiPriceGetter {
    return new Contract(address, _abi, signerOrProvider) as UwUUiPriceGetter;
  }
}
