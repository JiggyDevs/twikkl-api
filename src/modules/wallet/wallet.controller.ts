import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { StrictAuthGuard } from 'src/middleware-guards/auth-guard.middleware';
import { Request, Response } from 'express';
import { MakeTransactionDto } from './dto/make-transaction.dto';
import { UpdateWalletPinDto } from './dto/update-wallet-pin.dto';
import { TransactionPinCheck } from 'src/decorators';
import { FindByIdDto, IGetUserWallets, IGetWallet } from './wallet.type';
import { Types } from 'mongoose';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(StrictAuthGuard)
  @TransactionPinCheck(true)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    const userId = req.user._id;
    const response = await this.walletService.createWallet({
      ...createWalletDto,
      userId,
    });
    Logger.debug({ response });
    return res.status(response.status).json(response);
  }

  @Get('/')
  @UseGuards(StrictAuthGuard)
  async getUserWallets(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userId = req.user._id;

    query = { owner: new Types.ObjectId(userId) };

    const payload: IGetUserWallets = { ...query };

    const response = await this.walletService.getUserWallets(payload);

    return res.status(response.status).json(response);
  }

  @Get('/balance')
  @UseGuards(StrictAuthGuard)
  async getWalletBalances(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userId = req.user._id;

    query = { owner: new Types.ObjectId(userId) };

    const payload: IGetUserWallets = { ...query };

    const { data, ...responseData } = await this.walletService.getUserWallets(
      payload,
    );

    const ethUserWallet = data.find((wallet) => wallet.type === 'EVM');

    const solUserWallet = data.find((wallet) => wallet.type === 'SOLANA');

    const ethBalance = await this.walletService.getEthBalance(ethUserWallet);

    const solBalance = await this.walletService.getSolBalance(solUserWallet);

    // const claimWallets = await Promise.all(
    //   data.map((wallet) => this.walletService.claimWallets(wallet)),
    // );

    // await this.walletService.claimWallets(userId);

    // console.log('claimWallets: ', claimWallets);

    return res.status(responseData.status).json({
      message: responseData.message,
      status: responseData.status,
      data: {
        // claimWallets,
        ethBalance,
        solBalance,
      },
    });
  }

  @Get('/:id')
  @UseGuards(StrictAuthGuard)
  async getWallet(@Res() res: Response, @Param() params: FindByIdDto) {
    const { id } = params;
    const payload: IGetWallet = { id };

    const response = await this.walletService.getWallet(payload);
    return res.status(response.status).json(response);
  }

  @Get('/:id/balance')
  @UseGuards(StrictAuthGuard)
  async getWalletBalance(@Res() res: Response, @Param() params: FindByIdDto) {
    const { id } = params;
    const payload: IGetWallet = { id };

    const response = await this.walletService.getWalletBalance(payload);

    return res.status(response.status).json(response);
  }

  @Delete('/')
  @UseGuards(StrictAuthGuard)
  async deleteWallet(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userId = req.user._id;
    query = { userId };
    const payload = { userId };

    const response = await this.walletService.deleteWallet(payload);
    return res.status(response.status).json(response);
  }

  @Post('/send')
  @UseGuards(StrictAuthGuard)
  async makeTransaction(
    @Req() req: Request,
    @Res() res: Response,
    @Body() makeTransactionDto: MakeTransactionDto,
  ) {
    try {
      const userId = req.user._id;
      const account = await this.walletService.makeTransaction({
        ...makeTransactionDto,
        userId,
      });
      Logger.debug({ account });
      return res.status(account.status).json(account);
    } catch (error) {
      console.log({ error });
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Post('/verify-phrase')
  @UseGuards(StrictAuthGuard)
  async verifyPhrase(
    @Req() req: Request,
    @Res() res: Response,
    @Body() makeTransactionDto: MakeTransactionDto,
  ) {
    const userId = req.user._id;
    const account = await this.walletService.verifySecretPassPhrase(userId, [
      '',
    ]);
    Logger.debug({ account });
    return res.status(account.status).json(account);
  }
}
