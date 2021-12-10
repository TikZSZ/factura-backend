import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthMiddleware } from './UserAuthMiddleware';
const isProd = process.env.NODE_ENV === 'production';
const secret = process.env.SECRET || 'asdf';
import session from 'cookie-session';

// const devConfig: TypeOrmModuleOptions = {
//   type: 'sqlite',
//   database: 'db.sqlite',
//   entities: [Post, Content, User],
//   synchronize: true,
// };

// const prodConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: process.env.PG_HOST,
//   port: 5432,
//   password: process.env.PG_PASSWORD,
//   username: process.env.PG_USERNAME,
//   database: process.env.PG_DATABASE,
//   entities: [Post, Content, User],
//   url: process.env.PG_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   synchronize: true,
// };

const CookieProdConfig = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
  signed: false,
  maxAge: 10000000,
  overwrite: false,
};

const CookieDevConfig = {
  secure: false,
  httpOnly: false,
  signed: false,
};

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: secret,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(session(isProd ? CookieProdConfig : CookieDevConfig))
      .forRoutes('*')
      .apply(UserAuthMiddleware)
      .forRoutes('*');
  }
}
