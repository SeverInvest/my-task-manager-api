const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const TaskUser = require('../models/user');
const Task = require('../models/task');
const Role = require('../models/role');

describe('Пробуем, что тесты работают', () => {
  it('проверка работоспособности фреймворка', () => {
    assert.equal(1, 1);
  });
});

const testUser = {
  name: 'test-user',
  password: 'test_password',
  email: 'email@test.net',
};

const testLogin = {
  password: 'test_password',
  email: 'email@test.net',
};

let testToken;
let userId;
let testVideoId;

const testChangeUser = {
  name: 'test- -user',
  email: 'email_1@test.net',
};

const linkYoutube = { videoLink: 'https://youtu.be/7YMp_W9H7hI' };
const linkBrokenYoutube = { videoLink: 'https://youtu.be/7YMp' };

const testBrokenToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDNlZWViNjcwYTE3NWZkMDA4ODk1MzEiLCJpYXQiOjE2ODE5MDIwMTksImV4cCI6MTY4MjUwNjgxOX0.nCL-hMzDcBRFIzMEwxZVjMoSXVp3LBsghtb1i77GOBg';

describe('проверка ендпоинтов', () => {
  before(async () => { // чистим базу до тестов
    await TaskUser.deleteOne({ name: 'test-user' });
    await TaskUser.deleteOne({ name: 'test- -user' });
    await Video.deleteMany({ videoLink: 'https://youtu.be/7YMp_W9H7hI' });
    await Role.insertMany([{ value: 'USER' }, { value: 'ADMIN' }, { value: 'SUPERUSER' }, { value: 'BLOCKED' }]);
  });

  after(async () => { // чистим базу после тестов
    await TaskUser.deleteOne({ name: 'test-user' });
    await TaskUser.deleteOne({ name: 'test- -user' });
    await Video.deleteMany({ videoLink: 'https://youtu.be/7YMp_W9H7hI' });
  });

  describe('Регистрация пользователя', () => {
    it('зарегистрировать пользователя с валидными почтой и паролем', async () => {
      const res = await request(app).post('/signup').send(testUser);
      assert.equal(res.status, 201);
      assert.equal(res.body.name, 'test-user');
    });

    it('отказать пользователю в повторной регистрации', async () => {
      const res = await request(app).post('/signup').send(testUser);
      assert.equal(res.status, 409);
    });
  });

  describe('Авторизация пользователя', () => {
    it('залогинить пользователя уже зарегистрированного', async () => {
      const res = await request(app).post('/signin').send(testLogin);
      assert.equal(res.status, 200);
      testToken = `Bearer ${res.body.token}`;
    });
  });

  describe('Получение информации о текущем пользователе', () => {
    it('получить информацию о пользователе по токену', async () => {
      const res = await request(app).get('/users/me').set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'test-user');
      assert.equal(res.body.email, 'email@test.net');
      userId = res.body._id;
    });

    it('отказать в получении информации пользователю с недействующим токеном', async () => {
      const res = await request(app).get('/users/me').set({
        authorization: testBrokenToken,
      });
      assert.equal(res.status, 401);
    });
  });

  describe('Изменение имени и почты текущего пользователя', () => {
    it('изменить информацию о пользователе по токену', async () => {
      const res = await request(app).patch('/users/me').send(testChangeUser).set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'test- -user');
      assert.equal(res.body.email, 'email_1@test.net');
    });
  });

  describe('Добавление видео', () => {
    it('добавить видео с валидной ссылкой и правильным токеном', async () => {
      const res = await request(app).post('/videos').send(linkYoutube).set({
        authorization: testToken,
      });
      assert.equal(res.status, 201);
      assert.equal(res.body.videoLink, 'https://youtu.be/7YMp_W9H7hI');
      testVideoId = res.body._id;
    });

    it(
      'отказать в добавлении видео с невалидной ссылкой, но правильным токеном',
      async () => {
        const res = await request(app).post('/videos').send(linkBrokenYoutube).set({
          authorization: testToken,
        });
        assert.equal(res.status, 400);
      },
    );

    it('отказать в добавлении видео с валидной ссылкой, но неправильным токеном', async () => {
      const res = await request(app).post('/videos').send(linkYoutube).set({
        authorization: testBrokenToken,
      });
      assert.equal(res.status, 401);
    });
  });

  describe('Получить видео', () => {
    it('получить список видео (правильный токен)', async () => {
      const res = await request(app).get('/videos').set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
    });
  });

  describe('Поставить лайк', () => {
    it('добавить видео в избранное)', async () => {
      const res = await request(app).patch(`/videos/like/${testVideoId}`).set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.video.users[0], userId);
    });
  });

  describe('Поставить лайк', () => {
    it('добавить видео в избранное)', async () => {
      const res = await request(app).patch(`/videos/like/${testVideoId}`).set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.video.users[0], userId);
    });
  });

  describe('Удалить видео', () => {
    it('удалить видео', async () => {
      const res = await request(app).delete(`/videos/${testVideoId}`).set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
    });

    it('у пользователя удалено видео из списка избранного)', async () => {
      const res = await request(app).get('/users/me').set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.videos[0] === testVideoId, false);
    });
  });

  describe('Проверка отработки запроса на несуществующий роут', () => {
    it('переход на /abrakadabra для незарегистрированного пользователя - 401', async () => {
      const res = await request(app).get('/abrakadabra');
      assert.equal(res.status, 401);
    });
    it('переход на /abrakadabra для зарегистрированного пользователя - 404', async () => {
      const res = await request(app).get('/abrakadabra').set({
        authorization: testToken,
      });
      assert.equal(res.status, 404);
    });
  });
});
