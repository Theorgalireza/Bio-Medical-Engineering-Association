"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('Auth (e2e)', () => {
    let app;
    let prisma;
    beforeAll(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
        await app.init();
        prisma = module.get(prisma_service_1.PrismaService);
    });
    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: { contains: 'e2e-test' } } });
        await app.close();
    });
    const testEmail = 'e2e-test@example.com';
    const testPassword = 'Test1234';
    describe('POST /api/v1/auth/register', () => {
        it('registers a new user', () => request(app.getHttpServer())
            .post('/api/v1/auth/register')
            .send({ email: testEmail, password: testPassword })
            .expect(201)
            .expect(({ body }) => {
            expect(body.access_token).toBeDefined();
        }));
        it('rejects duplicate email', () => request(app.getHttpServer())
            .post('/api/v1/auth/register')
            .send({ email: testEmail, password: testPassword })
            .expect(400));
    });
    describe('POST /api/v1/auth/login', () => {
        it('logs in with valid credentials', () => request(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({ email: testEmail, password: testPassword })
            .expect(201)
            .expect(({ body }) => {
            expect(body.access_token).toBeDefined();
        }));
        it('rejects wrong password', () => request(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({ email: testEmail, password: 'wrongpass' })
            .expect(401));
    });
    describe('POST /api/v1/auth/forgot-password', () => {
        it('returns success regardless of email existence', () => request(app.getHttpServer())
            .post('/api/v1/auth/forgot-password')
            .send({ identifier: testEmail })
            .expect(201)
            .expect(({ body }) => {
            expect(body.message).toBeDefined();
        }));
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map