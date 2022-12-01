import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { ComplaintModule } from './complaint/complaint.module';
import { MailModule } from './mail/mail.module';

const databasePort = process.env.DATABASE_PORT || 27017;
const databaseName = process.env.DATABASE_NAME || 'client-support-platform';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://localhost:${databasePort}/${databaseName}`
    ),
    AuthModule,
    UserModule,
    ComplaintModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
