// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = module.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'e2e-test' } } });
    await app.close();
  });

  const testEmail = 'e2e-test@example.com';
  const testPassword = 'Test1234';

  describe('POST /api/v1/auth/register', () => {
    it('registers a new user', () =>
      request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: testPassword })
        .expect(201)
        .expect(({ body }) => {
          expect(body.access_token).toBeDefined();
        }));

    it('rejects duplicate email', () =>
      request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: testPassword })
        .expect(400));
  });

  describe('POST /api/v1/auth/login', () => {
    it('logs in with valid credentials', () =>
      request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: testPassword })
        .expect(201)
        .expect(({ body }) => {
          expect(body.access_token).toBeDefined();
        }));

    it('rejects wrong password', () =>
      request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'wrongpass' })
        .expect(401));
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('returns success regardless of email existence', () =>
      request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ identifier: testEmail })
        .expect(201)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
        }));
  });
});
