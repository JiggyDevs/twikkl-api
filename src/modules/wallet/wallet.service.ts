import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { providers, Signer, Wallet, utils } from 'ethers';
import { IBundler, Bundler } from '@biconomy/bundler';
import { ChainId } from '@biconomy/core-types';
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
  encryptPrivateKeyWithPin,
  generatePrivateKey,
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
} from 'src/lib/exceptions';

@Injectable()
export class WalletService {
  private readonly provider: providers.JsonRpcProvider;
  private readonly bundler: IBundler;
  private readonly paymaster: IPaymaster;
  // private readonly signer: Signer;

  constructor(
    private data: IDataServices,
    private walletFactory: WalletFactoryService,
  ) {
    this.provider = new providers.JsonRpcProvider(
      'https://rpc.ankr.com/polygon_mumbai',
    );

    this.bundler = new Bundler({
      bundlerUrl:
        'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
      chainId: ChainId.POLYGON_MUMBAI,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });

    this.paymaster = new BiconomyPaymaster({
      paymasterUrl:
        'https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a',
    });
  }

  private async createSmartAccount(
    privateKey: string,
  ): Promise<BiconomySmartAccountV2> {
    const wallet = new Wallet(privateKey || '', this.provider);

    const module = await this.createModule(wallet);

    return BiconomySmartAccountV2.create({
      chainId: ChainId.POLYGON_MUMBAI,
      bundler: this.bundler,
      paymaster: this.paymaster,
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

  async hashPin(pin: string) {
    pin = await hash(pin);
  }

  async createWallet(payload: { pin: string; userId: string }) {
    try {
      const { pin, userId } = payload;

      const walletExists = await this.data.wallets.findOne({ owner: userId });
      if (walletExists) {
        throw new AlreadyExistsException('Wallet already exists!');

        // return {
        //   message: 'Wallet already exists',
        //   data: walletExists,
        //   status: HttpStatus.CONFLICT,
        // };
      }

      const hashedPin = await hash(pin);
      const privateKey = generatePrivateKey();
      const smartAccount = await this.createSmartAccount(privateKey);
      const walletPayload: OptionalQuery<WalletEntity> = {
        pin: hashedPin,
        privateKey: encryptPrivateKeyWithPin(pin, privateKey),
        address: await smartAccount.getAccountAddress(),
        owner: userId,
      };
      console.log({ walletPayload });
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

  async getWallet(payload: { walletId: string }) {
    try {
      const { walletId } = payload;
      const wallet = await this.data.wallets.findOne({ _id: walletId });
      if (!wallet) throw new DoesNotExistsException('User not found!');

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

  async getUserWallet(payload: { userId: string }) {
    try {
      const { userId } = payload;
      const wallet = await this.data.wallets.findOne({ owner: userId });
      if (!wallet) throw new DoesNotExistsException('Wallet not found!');

      return {
        message: 'Wallet retrieved successfully',
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

  async makeTransaction(privateKey: string) {
    // Specify the address of the NFT contract
    const smartAccount = await this.createSmartAccount(privateKey);
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
    let partialUserOp = await smartAccount.buildUserOp([transaction], {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
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

  async deleteWallet(payload: any) {
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
