import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { providers, Signer, Wallet, utils, BigNumber } from 'ethers';
import { Bundler } from '@biconomy/bundler';
import { ChainId, Transaction } from '@biconomy/core-types';
import {
  Hex,
  createWalletClient,
  encodeFunctionData,
  createPublicClient,
  http,
  parseAbi,
  zeroAddress,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonMumbai } from 'viem/chains';

import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
} from '@biconomy/paymaster';
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from '@biconomy/modules';
import {
  DEFAULT_ENTRYPOINT_ADDRESS,
  BiconomySmartAccountV2,
} from '@biconomy/account';
import {
  compareHash,
  decryptPrivateKeyWithPin,
  encryptPrivateKeyWithPin,
  generateWallet,
  getWallet,
  hash,
} from 'src/lib/utils';
import { IDataServices } from 'src/core/abstracts';
import { WalletFactoryService } from './wallet-factory.service';
import { OptionalQuery } from 'src/core/types/database';
import { Wallet as WalletEntity } from 'src/modules/wallet/entities/wallet.entity';
import {
  AlreadyExistsException,
  DoesNotExistsException,
  ForbiddenRequestException,
  UnAuthorizedException,
} from 'src/lib/exceptions';
import { Polygonscan } from 'src/lib/block-explorers/polygonscan';
import { POLYSCAN_API_TOKEN } from 'src/config';
import { IGetUserWallets, IGetWallet } from './wallet.type';
import databaseHelper from 'src/frameworks/data-services/mongo/database-helper';
import { filter } from 'rxjs';

@Injectable()
export class WalletService {
  private polygonscan = new Polygonscan(POLYSCAN_API_TOKEN);
  constructor(
    private data: IDataServices,
    private walletFactory: WalletFactoryService,
  ) {}

  cleanWalletsQuery(data: IGetUserWallets) {
    let key = {};

    if (data.owner) key['owner'] = data.owner;
    if (data.networkId) key['networkId'] = data.networkId;
    if (data.address) key['address'] = data.address;
    if (data.page) key['page'] = data.page;
    if (data.perpage) key['perpage'] = data.perpage;
    if (data.sort) key['sort'] = data.sort;
    if (data.q) key['q'] = data.q;

    if (data.to || data.from) {
      const dateQuery = databaseHelper.queryDbByDateFilter(data);
      key = { ...key, ...dateQuery };
    }
    return key;
  }

  private getWalletSetup(privateKey?: string) {
    // new providers.AnkrProvider()
    const provider = new providers.JsonRpcProvider(
      'https://rpc.ankr.com/polygon_mumbai',
    );

    const publicClient = createPublicClient({
      chain: polygonMumbai,
      transport: http('https://rpc.ankr.com/polygon_mumbai'),
    });

    if (!privateKey)
      return {
        publicClient,
        provider,
      };

    const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);

    const walletClient = createWalletClient({
      account,
      chain: polygonMumbai,
      transport: http('https://rpc.ankr.com/polygon_mumbai'),
    });

    const wallet = new Wallet(privateKey || '', provider);

    return {
      wallet,
      provider,
      publicClient,
      walletClient,
    };
  }

  private async createSmartAccount(
    wallet: Wallet,
  ): Promise<BiconomySmartAccountV2> {
    const module = await this.createModule(wallet);

    const bundler = new Bundler({
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
      chainId: ChainId.POLYGON_MUMBAI,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });

    const paymaster = new BiconomyPaymaster({
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a',
    });
    return BiconomySmartAccountV2.create({
      chainId: ChainId.POLYGON_MUMBAI,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: module,
      activeValidationModule: module,
    });
  }

  private async createModule(wallet: Wallet) {
    return ECDSAOwnershipValidationModule.create({
      signer: wallet,
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });
  }

  async getTransactions(address: string) {
    try {
      const transactions = await this.polygonscan.getTransactionHistory(
        address,
      );

      console.log('Transaction History:', transactions);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  }

  async createWallet(payload: { pin: string; userId: string }) {
    try {
      const { userId } = payload;

      const walletExists = await this.data.wallets.findOne({ owner: userId });
      if (walletExists) {
        throw new AlreadyExistsException('User already has wallet');
      }

      const { walletId, networkId, recoveryPhrase, address } =
        await generateWallet();

      const walletPayload: OptionalQuery<WalletEntity> = {
        // privateKey,
        walletId,
        networkId,
        address,
        owner: userId,
        recoveryPhrase,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const walletFactory = this.walletFactory.create(walletPayload);
      const wallet = await this.data.wallets.create(walletFactory);

      return {
        message: 'Wallet created successfully',
        data: wallet,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async verifySecretPassPhrase(user: string, secrets: string[]) {
    const response = await this.data.wallets.findOne({ _id: user });

    return {
      message: 'User retrieved successfully',
      status: HttpStatus.OK,
      data: response?.recoveryPhrases.join(',') === secrets.join(','),
    };
  }

  async getWallet(payload: IGetWallet) {
    try {
      const { id } = payload;
      const wallet: WalletEntity = await this.data.wallets.findOne({ _id: id });
      if (!wallet) throw new DoesNotExistsException('User not found!');

      await getWallet(wallet.walletId);

      return {
        message: 'User retrieved successfully',
        status: HttpStatus.OK,
        data: wallet,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async getUserWallets(payload: IGetUserWallets) {
    try {
      const filterQuery: any = this.cleanWalletsQuery(payload);

      if (filterQuery.q) {
        const searchRegex = new RegExp(filterQuery.q, 'i');
        const data = await this.data.wallets.find({
          networkId: { $regex: searchRegex },
        });
        return {
          message: 'Wallets retrieved successfully',
          status: HttpStatus.OK,
          data,
        };
      }

      const { data, pagination } =
        await this.data.wallets.findAllWithPagination(filterQuery);

      return {
        message: 'Wallets retrieved successfully',
        status: HttpStatus.OK,
        data,
        pagination,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }

  async makeNFTTransaction({ userId, pin }: { userId: string; pin: string }) {
    const wallet = await this.data.wallets.findOne({ owner: userId });
    if (!wallet) throw new DoesNotExistsException('Wallet not found!');

    if (!(await compareHash(pin, wallet.pin)))
      throw new UnAuthorizedException('Incorrect wallet pin!');

    // Specify the address of the NFT contract
    const smartAccount = await this.createSmartAccount(wallet.privateKey);
    // Retrieve the address of the initialized smart account
    const address = await smartAccount.getAccountAddress();

    // Define the interface for interacting with the NFT contract
    const nftInterface = new utils.Interface([
      'function safeMint(address _to)',
    ]);
    // Encode the data for the 'safeMint' function call with the smart account address
    const data = nftInterface.encodeFunctionData('safeMint', [address]);

    // Specify the address of the NFT contract
    const nftAddress = '0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e';

    // Define the transaction to be sent to the NFT contract
    const transaction = {
      to: nftAddress,
      data: data,
    };

    // Build a partial User Operation (UserOp) with the transaction and set it to be sponsored
    const partialUserOp = await smartAccount.buildUserOp([transaction], {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
      },
      overrides: {
        maxFeePerGas: 1000,
        maxPriorityFeePerGas: 1000,
      },
    });

    // Try to execute the UserOp and handle any errors
    try {
      // Send the UserOp through the smart account
      const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
      // Wait for the transaction to complete and retrieve details
      const transactionDetails = await userOpResponse.wait();
      // Log the transaction details URL and the URL to view minted NFTs
      console.log(
        `Transaction Details: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`,
      );
      console.log(`View Minted NFTs: https://testnets.opensea.io/${address}`);
    } catch (e) {
      // Log any errors encountered during the transaction
      console.log('Error encountered: ', e);
    }
  }

  async makeTransaction({
    userId,
    pin,
    toAddress,
    amount,
  }: {
    userId: string;
    pin: string;
    toAddress: string;
    amount: bigint;
  }) {
    const wallet = await this.data.wallets.findOne({ owner: userId });
    if (!wallet) throw new DoesNotExistsException('Wallet not found!');

    if (!(await compareHash(pin, wallet.pin)))
      throw new UnAuthorizedException('Incorrect wallet pin!');

    // Specify the address of the NFT contract
    const { wallet: baseWallet } = this.getWalletSetup(
      decryptPrivateKeyWithPin(pin, wallet.privateKey),
    );
    const smartAccount = await this.createSmartAccount(baseWallet);
    // Retrieve the address of the initialized smart account
    const address = await smartAccount.getAccountAddress();

    // Specify the amount to send
    const value = amount;
    const erc20Interface = new utils.Interface([
      'function transfer(address _to,uint256 _value)',
    ]);
    const data = erc20Interface.encodeFunctionData('transfer', [
      toAddress,
      utils.parseEther(value.toString()),
    ]);

    // Define the transaction to be sent to the NFT contract
    const transaction: Transaction = {
      // to: address,
      to: toAddress,
      data: '0x',
      value: utils.parseEther(value.toString()),
    };
    await smartAccount.init();
    // Build a partial User Operation (UserOp) with the transaction and set it to be sponsored
    const partialUserOp = await smartAccount.buildUserOp([transaction], {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
        // calculateGasLimits: true,
      },
      // overrides: {
      //   maxFeePerGas: 10000,
      //   maxPriorityFeePerGas: 10000,
      // },
      skipBundlerGasEstimation: true,
    });

    // Send the UserOp through the smart account
    const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
    // Wait for the transaction to complete and retrieve details
    const transactionDetails = await userOpResponse.wait();
    // // Log the transaction details URL and the URL to view minted NFTs
    console.log(
      `Transaction Details: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`,
    );

    return {
      message: 'Wallet Transaction completed!',
      data: {
        receipt: transactionDetails.receipt,
        receiptLink: `https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`,
      },
      status: HttpStatus.CREATED,
    };
  }

  async deleteWallet(payload: { userId: string }) {
    try {
      const { userId } = payload;

      const wallet = await this.data.wallets.findOne({ owner: userId });
      if (!wallet) throw new DoesNotExistsException('Wallet not found');

      await this.data.wallets.delete({ _id: wallet._id });

      return {
        message: 'Wallet deleted',
        status: HttpStatus.OK,
      };
    } catch (error) {
      Logger.error(error);
      if (error.name === 'TypeError')
        throw new HttpException(error.message, 500);
      throw error;
    }
  }
}
