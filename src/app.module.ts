import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { ComplaintModule } from './complaint/complaint.module';
import { RolesGuard } from './guards/roles.guard';
import { MailerModule } from '@nestjs-modules/mailer';

const databaseName = process.env.DATABASE_NAME || 'client-support-platform';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          secure: false,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forRoot(`mongodb://localhost:27017/${databaseName}`),
    AuthModule,
    UserModule,
    ComplaintModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
