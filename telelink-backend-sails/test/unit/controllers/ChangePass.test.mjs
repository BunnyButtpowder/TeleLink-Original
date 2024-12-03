import { expect } from 'chai';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import sails from 'sails';
import sinon from 'sinon';

const request = supertest('http://localhost:9999');

describe('AuthController - Change Password API', function () {
  this.timeout(10000);

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

  after((done) => {
    sails.lower((err) => {
      if (err) return done(err);
      console.log("Sails server stopped");
      done();
    });
  });

  let bcryptCompareStub, bcryptHashStub, findOneStub, updateOneStub;

  beforeEach(() => {
    bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    bcryptHashStub = sinon.stub(bcrypt, 'hash');
    findOneStub = sinon.stub(sails.models.auth, 'findOne');
    updateOneStub = sinon.stub(sails.models.auth, 'updateOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should successfully change the password', async () => {
    const mockAuth = { id: 1, password: 'hashedOldPassword' };
    findOneStub.resolves(mockAuth);
    bcryptCompareStub.resolves(true);
    bcryptHashStub.resolves('hashedNewPassword');
    updateOneStub.resolves({ id: 1, password: 'hashedNewPassword' });
  
    const response = await request.put('/auth/change')
      .send({
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword456',
        id: 1,
      });
  
      
  
    expect(response.body.message).to.equal('Mật khẩu đã được thay đổi thành công.');
  });
  
  

  it('should return 400 if old password is incorrect', async () => {
    const mockAuth = { id: 1, password: 'hashedOldPassword' };
    findOneStub.resolves(mockAuth);
    bcryptCompareStub.resolves(false);

    const response = await request.put('/auth/change')
      .send({
        oldPassword: 'wrongOldPassword',
        newPassword: 'newPassword456',
        id: 1,
      })
      .expect(400);

    expect(response.body.message).to.equal('Mật khẩu cũ không đúng');
  });

  it('should return 404 if account is not found', async () => {
    findOneStub.resolves(null);

    const response = await request.put('/auth/change')
      .send({
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword456',
        id: 99,
      })
      .expect(404);

    expect(response.body.message).to.equal('Không tìm thấy tài khoản.');
  });

  it('should return 500 if there is a server error', async () => {
    findOneStub.rejects(new Error('Database error'));

    const response = await request.put('/auth/change')
      .send({
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword456',
        id: 1,
      })
      .expect(500);

    expect(response.body.error).to.equal('Đã xảy ra lỗi trong quá trình đổi mật khẩu');
  });

  it('should return 400 if new password is empty', async () => {
    const response = await request.put('/auth/change')
      .send({
        oldPassword: 'oldPassword123',
        newPassword: ' ',
        id: 1,
      })
      .expect(400);

    expect(response.body.message).to.equal('Mật khẩu mới không được để trống');
  });
  it('should return 400 if old password is empty', async () => {
    const response = await request.put('/auth/change')
      .send({
        oldPassword: ' ',
        newPassword: 'newPassword456',
        id: 1,
      })
      .expect(400);

    expect(response.body.message).to.equal('Mật khẩu mới không được để trống');
  });
});
