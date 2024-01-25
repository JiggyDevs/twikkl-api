import {
  Body,
  Controller,
  Get,
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
  async getPosts(
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

  @Post()
  @UseGuards(StrictAuthGuard)
  async makeTransaction(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    const userId = req.user._id;
    const account = await this.walletService.createWallet({
      ...createWalletDto,
      userId,
    });
    Logger.debug({ account });
    return account;
  }
}
