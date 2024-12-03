import { expect } from 'chai';
import supertest from 'supertest';
import nock from 'nock';  // Import nock
import sails from 'sails';


const request = supertest('http://localhost:9999'); // Your server address

describe('UserController - Register API', function () {
  this.timeout(10000); // Set timeout for test cases

  // Before running tests, mock external requests with nock
  before((done) => {
    sails.lift({}, (err) => {
      if (err) {
        console.error("Error starting Sails:", err);
        return done(err);
      }
      console.log("Sails server started");
      done();
    });
  });

  // After running tests, stop Sails server
  after((done) => {
    sails.lower((err) => {  // Stop the server
      if (err) return done(err);
      console.log("Sails server stopped");
      done();
    });
  });

  it('should return 201 and create a new user when valid data is provided', async () => {
    // Mock the external request with nock
    nock('http://localhost:9999')  // Mock the Sails server
      .post('/auth/create')
      .reply(201, {
        message: 'Đăng ký thành công',
        newUser: { id: 1, email: 'testuser@example.com' },
      });

    const response = await request.post('/auth/create')
      .send({
        fullName: 'Test User',
        phoneNumber: '1234567890',
        dob: '1990-01-01',
        address: 'Test Address',
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'password123',
        role: 1,
        gender: 'male',
        name: 'Agency Name',
        agency: 1,
        avatar: 'avatar_url',
      })
      .expect(201);

    expect(response.body.message).to.equal('Đăng ký thành công');
    expect(response.body.newUser).to.have.property('id');
    expect(response.body.newUser).to.have.property('email', 'testuser@example.com');
  });

  it('should return 409 if email already exists', async () => {
    // Mock the response for duplicate email
    nock('http://localhost:9999')
      .post('/auth/create')
      .reply(409, {
        message: 'Email đã tồn tại',
      });

    const response = await request.post('/auth/create')
      .send({
        fullName: 'Test User 2',
        phoneNumber: '0987654321',
        dob: '1991-01-01',
        address: 'Another Test Address',
        email: 'existing@example.com',  // Existing email
        username: 'testuser2',
        password: 'password123',
        role: 1,
        gender: 'female',
        name: 'Another Agency',
        agency: 2,
        avatar: 'another_avatar_url',
      })
      .expect(409);

    expect(response.body.message).to.equal('Email đã tồn tại');
  });

  it('should return 409 if username already exists', async () => {
    // Mock the response for duplicate username
    nock('http://localhost:9999')
      .post('/auth/create')
      .reply(409, {
        message: 'Username đã tồn tại',
      });

    const response = await request.post('/auth/create')
      .send({
        fullName: 'Test User 3',
        phoneNumber: '1122334455',
        dob: '1985-12-12',
        address: 'Unique Address',
        email: 'unique@example.com',
        username: 'uniqueuser',  // Unique username
        password: 'password123',
        role: 1,
        gender: 'female',
        name: 'Unique Agency',
        agency: 3,
        avatar: 'unique_avatar_url',
      })
      .expect(409);

    expect(response.body.message).to.equal('Username đã tồn tại');
  });

  it('should return 400 if role is 2 but name is not provided', async () => {
    // Mock the response for missing name when role is 2
    nock('http://localhost:9999')
      .post('/auth/create')
      .reply(400, {
        message: 'Name là bắt buộc khi role là 2',
      });

    const response = await request.post('/auth/create')
      .send({
        fullName: 'Test User 5',
        phoneNumber: '1231231234',
        dob: '1993-05-25',
        address: 'Test Address 5',
        email: 'testuser5@example.com',
        username: 'testuser5',
        password: 'password123',
        role: 2, // Role 2 yêu cầu name phải có
        gender: 'male',
        agency: 5,
        avatar: 'test_avatar_url',
      })
      .expect(400);

    expect(response.body.message).to.equal('Name là bắt buộc khi role là 2');
  });

  it('should return 500 if there is a server error', async () => {
    // Mock the response for server error
    nock('http://localhost:9999')
      .post('/auth/create')
      .reply(500, {
        error: 'Có lỗi xảy ra khi tạo người dùng mới.',
      });

    const response = await request.post('/auth/create')
      .send({
        fullName: 'Test User 6',
        phoneNumber: '9876543210',
        dob: '1994-08-10',
        address: 'Test Address 6',
        email: 'testuser6@example.com',
        username: 'testuser6',
        password: 'password123',
        role: 1,
        gender: 'female',
        name: 'Some Agency',
        agency: 6,
        avatar: 'error_avatar_url',
      })
      .expect(500);

    expect(response.body.error).to.equal('Có lỗi xảy ra khi tạo người dùng mới.');
  });
});
