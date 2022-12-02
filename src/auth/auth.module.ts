import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from '../strategies/local.strategy';

const secret = process.env.SECRET_KEY_JWT || 'n2r5u8x/A?D(G+KbPeShVmYq3s6v9y$B';
const expiresIn = process.env.EXPIRES_IN_JWT || '1h';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret,
        signOptions: { expiresIn },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
