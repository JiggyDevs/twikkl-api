import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service'; // Import the WalletService
import { WalletController } from './wallet.controller';

import { MongooseModule } from '@nestjs/mongoose';

import { DataServicesModule } from '../mongoDb/data-services.module';
import { DiscordServicesModule } from 'src/frameworks/notification-services/discord/discord-service.module';
import { FileSystemModule } from '../file-system/file-system.module';
import { NotificationFactoryService } from '../notifications/notification-factory.service';
import { FirebaseService } from '../firebase/firebase.service';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { WalletFactoryService } from './wallet-factory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    DataServicesModule,
    DiscordServicesModule,
    FileSystemModule,
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletFactoryService,
    NotificationFactoryService,
    FirebaseService,
  ],
  exports: [WalletService, WalletFactoryService],
})
export class WalletModule {}
