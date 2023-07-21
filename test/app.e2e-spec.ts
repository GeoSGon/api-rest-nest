import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('AuthController', () => {
    describe('/auth/login (POST)', () => {
      it('should return access and refresh tokens on successful login', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: 'John Doe',
            password: '123@abcd',
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
          });
      });
    });

    describe('/auth/register (POST)', () => {
      it('should create a new user', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123@abcd',
          })
          .expect(201)
          .then((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toEqual('John Doe');
            expect(res.body.email).toEqual('johndoe@example.com');
          });
      });
    });

    describe('/auth/refresh (POST)', () => {
      it('should return a new access token on successful token refresh', () => {
        return request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', 'Bearer <refresh_token>')
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('accessToken');
          });
      });
    });
  });

  describe('UsersController', () => {
    describe('/users/create (POST)', () => {
      it('should create a new user', () => {
        return request(app.getHttpServer())
          .post('/users/create')
          .send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123@abcd',
          })
          .expect(201)
          .then((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toEqual('John Doe');
            expect(res.body.email).toEqual('johndoe@example.com');
          });
      });
    });

    describe('/users (GET)', () => {
      it('should return an array of users', () => {
        return request(app.getHttpServer())
          .get('/users')
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body)).toBe(true);
          });
      });
    });

    describe('/users/:id (GET)', () => {
      it('should return the specified user', () => {
        return request(app.getHttpServer())
          .get('/users/1')
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.id).toEqual(1);
          });
      });

      it('should return 404 if user not found', () => {
        return request(app.getHttpServer()).get('/users/999').expect(404);
      });
    });

    describe('/users/edit/:id (PATCH)', () => {
      it('should update the specified user', () => {
        return request(app.getHttpServer())
          .patch('/users/edit/1')
          .send({
            name: 'Updated Name',
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('affected');
            expect(res.body.affected).toBe(1);
          });
      });

      it('should return 404 if user not found', () => {
        return request(app.getHttpServer())
          .patch('/users/edit/999')
          .send({
            name: 'Updated Name',
          })
          .expect(404);
      });
    });

    describe('/users/delete/:id (DELETE)', () => {
      it('should delete the specified user', () => {
        return request(app.getHttpServer())
          .delete('/users/delete/1')
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('affected');
            expect(res.body.affected).toBe(1);
          });
      });

      it('should return 404 if user not found', () => {
        return request(app.getHttpServer()
          .delete('/users/delete/999')
          .expect(404));
      });
    });
  });
});
