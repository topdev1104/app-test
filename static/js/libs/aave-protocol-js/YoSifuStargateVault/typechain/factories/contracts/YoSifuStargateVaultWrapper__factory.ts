/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import type { Provider, TransactionRequest } from '@ethersproject/providers';
import type { PromiseOrValue } from '../../common';
import type {
  YoSifuStargateVaultWrapper,
  YoSifuStargateVaultWrapperInterface,
} from '../../contracts/YoSifuStargateVaultWrapper';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_SGETH',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_strgtRouter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'YoSifuStargateVaultWrapper__InsufficientOut',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnerUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'SGETH',
    outputs: [
      {
        internalType: 'contract IStrgtEthVault',
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
        internalType: 'address[]',
        name: 'vaults',
        type: 'address[]',
      },
    ],
    name: 'approveToVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minOut',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'depositToVault',
    outputs: [
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minOut',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'depositUnderlyingToVault',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sharesVault',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'sharesPool',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
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
    inputs: [
      {
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
    ],
    name: 'previewDepositUnderlyingToVault',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sharesVault',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'sharesPool',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
    ],
    name: 'previewDeposit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'previewWithdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'previewWithdrawUnderlyingFromVault',
    outputs: [
      {
        internalType: 'uint256',
        name: 'assetsVault',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'assetsPool',
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
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'strgtRouter',
    outputs: [
      {
        internalType: 'contract IStrgtRouter',
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
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minOut',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'withdrawFromVault',
    outputs: [
      {
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IYoSifuStargateVault',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minOut',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'withdrawUnderlyingFromVault',
    outputs: [
      {
        internalType: 'uint256',
        name: 'assetsVault',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'assetsPool',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

const _bytecode =
  '0x60c06040523480156200001157600080fd5b50604051620025c2380380620025c28339818101604052810190620000379190620001af565b80806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a3508273ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250508173ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff16815250505050506200020b565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000177826200014a565b9050919050565b62000189816200016a565b81146200019557600080fd5b50565b600081519050620001a9816200017e565b92915050565b600080600060608486031215620001cb57620001ca62000145565b5b6000620001db8682870162000198565b9350506020620001ee8682870162000198565b9250506040620002018682870162000198565b9150509250925092565b60805160a0516123676200025b6000396000818161041101528181610698015281816109d4015261172b015260008181610591015281816105e401528181610a75015261184001526123676000f3fe6080604052600436106100a05760003560e01c80636f255c94116100645780636f255c94146101ad5780638da5cb5b146101ea5780639493477e14610215578063a243672d14610252578063b1ccafa814610290578063cf36fd24146102b9576100a7565b806313af4035146100ac57806317f227ea146100d5578063436eff0b146101005780634793240d146101315780635c5f23251461016f576100a7565b366100a757005b600080fd5b3480156100b857600080fd5b506100d360048036038101906100ce9190611aec565b6102e4565b005b3480156100e157600080fd5b506100ea61040f565b6040516100f79190611b78565b60405180910390f35b61011a60048036038101906101159190611c07565b610433565b604051610128929190611c7d565b60405180910390f35b34801561013d57600080fd5b5061015860048036038101906101539190611c07565b610867565b604051610166929190611c7d565b60405180910390f35b34801561017b57600080fd5b5061019660048036038101906101919190611ca6565b610bc5565b6040516101a4929190611c7d565b60405180910390f35b3480156101b957600080fd5b506101d460048036038101906101cf9190611c07565b610fae565b6040516101e19190611ce6565b60405180910390f35b3480156101f657600080fd5b506101ff611074565b60405161020c9190611d10565b60405180910390f35b34801561022157600080fd5b5061023c60048036038101906102379190611c07565b611098565b6040516102499190611ce6565b60405180910390f35b34801561025e57600080fd5b5061027960048036038101906102749190611ca6565b6111fc565b604051610287929190611c7d565b60405180910390f35b34801561029c57600080fd5b506102b760048036038101906102b29190611d90565b611583565b005b3480156102c557600080fd5b506102ce61183e565b6040516102db9190611dfe565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610372576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036990611e76565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a350565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008060008673ffffffffffffffffffffffffffffffffffffffff16637158da7c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610483573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104a79190611eab565b905060008773ffffffffffffffffffffffffffffffffffffffff166338d52e0f6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156104f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061051a9190611eab565b905060008873ffffffffffffffffffffffffffffffffffffffff16633e0dc34e6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610569573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058d9190611eed565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610668577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663d0e30db0886040518263ffffffff1660e01b81526004016000604051808303818588803b15801561064a57600080fd5b505af115801561065e573d6000803e3d6000fd5b5050505050610696565b6106953330898673ffffffffffffffffffffffffffffffffffffffff16611862909392919063ffffffff16565b5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166387b21efc8289306040518463ffffffff1660e01b81526004016106f393929190611f1a565b600060405180830381600087803b15801561070d57600080fd5b505af1158015610721573d6000803e3d6000fd5b505050508173ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161075e9190611d10565b602060405180830381865afa15801561077b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079f9190611eed565b93508873ffffffffffffffffffffffffffffffffffffffff16636e553f6585886040518363ffffffff1660e01b81526004016107dc929190611f51565b6020604051808303816000875af11580156107fb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061081f9190611eed565b94508785101561085b576040517f69c50b3c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505094509492505050565b60008060008673ffffffffffffffffffffffffffffffffffffffff16637158da7c6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156108b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108db9190611eab565b905060008773ffffffffffffffffffffffffffffffffffffffff16633e0dc34e6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561092a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094e9190611eed565b90508773ffffffffffffffffffffffffffffffffffffffff1663ba0876528730336040518463ffffffff1660e01b815260040161098d93929190611f7a565b6020604051808303816000875af11580156109ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109d09190611eed565b93507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663c4de93a58286306040518463ffffffff1660e01b8152600401610a2f93929190611fce565b6020604051808303816000875af1158015610a4e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a729190611eed565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610ad857479250610ad38584611901565b610b80565b8173ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610b119190611d10565b602060405180830381865afa158015610b2e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b529190611eed565b9250610b7f85848473ffffffffffffffffffffffffffffffffffffffff166119549092919063ffffffff16565b5b86831015610bba576040517f69c50b3c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505094509492505050565b60008060008473ffffffffffffffffffffffffffffffffffffffff166338d52e0f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c15573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c399190611eab565b90508473ffffffffffffffffffffffffffffffffffffffff16634cdad506856040518263ffffffff1660e01b8152600401610c749190611ce6565b602060405180830381865afa158015610c91573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cb59190611eed565b925082915060008173ffffffffffffffffffffffffffffffffffffffff1663feb56b156040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d07573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d2b9190611eed565b905060008273ffffffffffffffffffffffffffffffffffffffff16631e8e51da6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d7a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d9e9190611eed565b905060008373ffffffffffffffffffffffffffffffffffffffff166315770f926040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ded573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e119190611eed565b8473ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e5c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e809190611eed565b83610e8b9190612034565b610e9591906120a5565b905080851115610ea3578094505b828473ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610eef573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f139190611eed565b8573ffffffffffffffffffffffffffffffffffffffff166315770f926040518163ffffffff1660e01b8152600401602060405180830381865afa158015610f5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f829190611eed565b87610f8d9190612034565b610f9791906120a5565b610fa19190612034565b9450505050509250929050565b60008473ffffffffffffffffffffffffffffffffffffffff1663ba0876528430856040518463ffffffff1660e01b8152600401610fed93929190611f7a565b6020604051808303816000875af115801561100c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110309190611eed565b90508381101561106c576040517f69c50b3c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b949350505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000808573ffffffffffffffffffffffffffffffffffffffff166338d52e0f6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156110e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061110a9190611eab565b90506111393330868473ffffffffffffffffffffffffffffffffffffffff16611862909392919063ffffffff16565b8573ffffffffffffffffffffffffffffffffffffffff16636e553f6585856040518363ffffffff1660e01b8152600401611174929190611f51565b6020604051808303816000875af1158015611193573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111b79190611eed565b9150848210156111f3576040517f69c50b3c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50949350505050565b60008060008473ffffffffffffffffffffffffffffffffffffffff166338d52e0f6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561124c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112709190611eab565b905060008173ffffffffffffffffffffffffffffffffffffffff1663feb56b156040518163ffffffff1660e01b8152600401602060405180830381865afa1580156112bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112e39190611eed565b90508081866112f291906120a5565b6112fc9190612034565b92508173ffffffffffffffffffffffffffffffffffffffff1663abe685cd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611349573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061136d9190611eed565b8273ffffffffffffffffffffffffffffffffffffffff1663faa24f076040518163ffffffff1660e01b8152600401602060405180830381865afa1580156113b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113dc9190611eed565b82856113e891906120a5565b6113f29190612034565b6113fc91906120a5565b8361140791906120d6565b92508173ffffffffffffffffffffffffffffffffffffffff166315770f926040518163ffffffff1660e01b8152600401602060405180830381865afa158015611454573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114789190611eed565b8273ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156114c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114e79190611eed565b846114f29190612034565b6114fc91906120a5565b92508573ffffffffffffffffffffffffffffffffffffffff1663ef8b30f7846040518263ffffffff1660e01b81526004016115379190611ce6565b602060405180830381865afa158015611554573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115789190611eed565b935050509250929050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611611576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161160890611e76565b60405180910390fd5b60005b82829050811015611839576117268383838181106116355761163461210a565b5b905060200201602081019061164a9190611aec565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff85858581811061167e5761167d61210a565b5b90506020020160208101906116939190611aec565b73ffffffffffffffffffffffffffffffffffffffff166338d52e0f6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156116dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117019190611eab565b73ffffffffffffffffffffffffffffffffffffffff166119ec9092919063ffffffff16565b6118267f00000000000000000000000000000000000000000000000000000000000000007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff85858581811061177e5761177d61210a565b5b90506020020160208101906117939190611aec565b73ffffffffffffffffffffffffffffffffffffffff16637158da7c6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156117dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118019190611eab565b73ffffffffffffffffffffffffffffffffffffffff166119ec9092919063ffffffff16565b808061183190612139565b915050611614565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60006040517f23b872dd0000000000000000000000000000000000000000000000000000000081528460048201528360248201528260448201526020600060648360008a5af13d15601f3d11600160005114161716915050806118fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118f1906121cd565b60405180910390fd5b5050505050565b600080600080600085875af190508061194f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161194690612239565b60405180910390fd5b505050565b60006040517fa9059cbb000000000000000000000000000000000000000000000000000000008152836004820152826024820152602060006044836000895af13d15601f3d11600160005114161716915050806119e6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119dd906122a5565b60405180910390fd5b50505050565b60006040517f095ea7b3000000000000000000000000000000000000000000000000000000008152836004820152826024820152602060006044836000895af13d15601f3d1160016000511416171691505080611a7e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a7590612311565b60405180910390fd5b50505050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611ab982611a8e565b9050919050565b611ac981611aae565b8114611ad457600080fd5b50565b600081359050611ae681611ac0565b92915050565b600060208284031215611b0257611b01611a84565b5b6000611b1084828501611ad7565b91505092915050565b6000819050919050565b6000611b3e611b39611b3484611a8e565b611b19565b611a8e565b9050919050565b6000611b5082611b23565b9050919050565b6000611b6282611b45565b9050919050565b611b7281611b57565b82525050565b6000602082019050611b8d6000830184611b69565b92915050565b6000611b9e82611aae565b9050919050565b611bae81611b93565b8114611bb957600080fd5b50565b600081359050611bcb81611ba5565b92915050565b6000819050919050565b611be481611bd1565b8114611bef57600080fd5b50565b600081359050611c0181611bdb565b92915050565b60008060008060808587031215611c2157611c20611a84565b5b6000611c2f87828801611bbc565b9450506020611c4087828801611bf2565b9350506040611c5187828801611bf2565b9250506060611c6287828801611ad7565b91505092959194509250565b611c7781611bd1565b82525050565b6000604082019050611c926000830185611c6e565b611c9f6020830184611c6e565b9392505050565b60008060408385031215611cbd57611cbc611a84565b5b6000611ccb85828601611bbc565b9250506020611cdc85828601611bf2565b9150509250929050565b6000602082019050611cfb6000830184611c6e565b92915050565b611d0a81611aae565b82525050565b6000602082019050611d256000830184611d01565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f840112611d5057611d4f611d2b565b5b8235905067ffffffffffffffff811115611d6d57611d6c611d30565b5b602083019150836020820283011115611d8957611d88611d35565b5b9250929050565b60008060208385031215611da757611da6611a84565b5b600083013567ffffffffffffffff811115611dc557611dc4611a89565b5b611dd185828601611d3a565b92509250509250929050565b6000611de882611b45565b9050919050565b611df881611ddd565b82525050565b6000602082019050611e136000830184611def565b92915050565b600082825260208201905092915050565b7f554e415554484f52495a45440000000000000000000000000000000000000000600082015250565b6000611e60600c83611e19565b9150611e6b82611e2a565b602082019050919050565b60006020820190508181036000830152611e8f81611e53565b9050919050565b600081519050611ea581611ac0565b92915050565b600060208284031215611ec157611ec0611a84565b5b6000611ecf84828501611e96565b91505092915050565b600081519050611ee781611bdb565b92915050565b600060208284031215611f0357611f02611a84565b5b6000611f1184828501611ed8565b91505092915050565b6000606082019050611f2f6000830186611c6e565b611f3c6020830185611c6e565b611f496040830184611d01565b949350505050565b6000604082019050611f666000830185611c6e565b611f736020830184611d01565b9392505050565b6000606082019050611f8f6000830186611c6e565b611f9c6020830185611d01565b611fa96040830184611d01565b949350505050565b600061ffff82169050919050565b611fc881611fb1565b82525050565b6000606082019050611fe36000830186611fbf565b611ff06020830185611c6e565b611ffd6040830184611d01565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061203f82611bd1565b915061204a83611bd1565b925082820261205881611bd1565b9150828204841483151761206f5761206e612005565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006120b082611bd1565b91506120bb83611bd1565b9250826120cb576120ca612076565b5b828204905092915050565b60006120e182611bd1565b91506120ec83611bd1565b925082820390508181111561210457612103612005565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600061214482611bd1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361217657612175612005565b5b600182019050919050565b7f5452414e534645525f46524f4d5f4641494c4544000000000000000000000000600082015250565b60006121b7601483611e19565b91506121c282612181565b602082019050919050565b600060208201905081810360008301526121e6816121aa565b9050919050565b7f4554485f5452414e534645525f4641494c454400000000000000000000000000600082015250565b6000612223601383611e19565b915061222e826121ed565b602082019050919050565b6000602082019050818103600083015261225281612216565b9050919050565b7f5452414e534645525f4641494c45440000000000000000000000000000000000600082015250565b600061228f600f83611e19565b915061229a82612259565b602082019050919050565b600060208201905081810360008301526122be81612282565b9050919050565b7f415050524f56455f4641494c4544000000000000000000000000000000000000600082015250565b60006122fb600e83611e19565b9150612306826122c5565b602082019050919050565b6000602082019050818103600083015261232a816122ee565b905091905056fea26469706673582212207cc28db6aac682c690785fb1221e8317b17f19036afecb6a096001cb26a89dc864736f6c63430008110033';

type YoSifuStargateVaultWrapperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: YoSifuStargateVaultWrapperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class YoSifuStargateVaultWrapper__factory extends ContractFactory {
  constructor(...args: YoSifuStargateVaultWrapperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _SGETH: PromiseOrValue<string>,
    _strgtRouter: PromiseOrValue<string>,
    _owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<YoSifuStargateVaultWrapper> {
    return super.deploy(
      _SGETH,
      _strgtRouter,
      _owner,
      overrides || {}
    ) as Promise<YoSifuStargateVaultWrapper>;
  }
  override getDeployTransaction(
    _SGETH: PromiseOrValue<string>,
    _strgtRouter: PromiseOrValue<string>,
    _owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_SGETH, _strgtRouter, _owner, overrides || {});
  }
  override attach(address: string): YoSifuStargateVaultWrapper {
    return super.attach(address) as YoSifuStargateVaultWrapper;
  }
  override connect(signer: Signer): YoSifuStargateVaultWrapper__factory {
    return super.connect(signer) as YoSifuStargateVaultWrapper__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): YoSifuStargateVaultWrapperInterface {
    return new utils.Interface(_abi) as YoSifuStargateVaultWrapperInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): YoSifuStargateVaultWrapper {
    return new Contract(address, _abi, signerOrProvider) as YoSifuStargateVaultWrapper;
  }
}