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

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(StrictAuthGuard)
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
  async getWallet(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const userId = req.user._id;
    query = { userId };
    const payload = { userId };

    const response = await this.walletService.getUserWallet(payload);
    return res.status(response.status).json(response);
  }

  @Post('/details')
  @UseGuards(StrictAuthGuard)
  async getWalletDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
    @Body() body: any,
  ) {
    const userId = req.user._id;
    query = { userId };
    const payload = { userId, pin: body?.pin };

    const response = await this.walletService.getUserWallet(payload);
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

  @Post('/check-pin')
  @UseGuards(StrictAuthGuard)
  async checkPin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() makeTransactionDto: MakeTransactionDto,
  ) {
    const userId = req.user._id;
    const account = await this.walletService.checkPin({
      ...makeTransactionDto,
      userId,
    });
    Logger.debug({ account });
    return res.status(account.status).json(account);
  }

  @Patch('/')
  @UseGuards(StrictAuthGuard)
  async updatePin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateWalletPinDto: UpdateWalletPinDto,
  ) {
    const userId = req.user._id;
    const account = await this.walletService.changePin({
      ...updateWalletPinDto,
      userId,
    });
    Logger.debug({ account });
    return res.status(account.status).json(account);
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
