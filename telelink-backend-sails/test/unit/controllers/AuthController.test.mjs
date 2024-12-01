import { expect } from 'chai';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import sails from 'sails';
import sinon from 'sinon';

// Replace with your actual server URL
const request = supertest('http://localhost:9999'); // Your server URL

describe('AuthController - Change Password API', function () {
  this.timeout(10000);

  // Trước khi chạy các bài kiểm thử, khởi động server Sails
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

  // Sau khi chạy xong, dừng server Sails
  after((done) => {
    sails.lower((err) => {
      if (err) return done(err);
      console.log("Sails server stopped");
      done();
    });
  });

  // Mock bcrypt và Auth Model
  let bcryptCompareStub, bcryptHashStub, findOneStub, updateOneStub;

  beforeEach(() => {
    bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    bcryptHashStub = sinon.stub(bcrypt, 'hash');
    findOneStub = sinon.stub(sails.models.auth, 'findOne');
    updateOneStub = sinon.stub(sails.models.auth, 'updateOne');
  });

  afterEach(() => {
    bcryptCompareStub.restore();
    bcryptHashStub.restore();
    findOneStub.restore();
    updateOneStub.restore();
  });

  it('should change password successfully when old password is correct', async () => {
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
      })
      .expect(200);

    expect(response.body.message).to.equal('Mật khẩu đã được thay đổi thành công.');
    sinon.assert.calledOnce(bcryptCompareStub);
    sinon.assert.calledOnce(bcryptHashStub);
    sinon.assert.calledOnce(updateOneStub);
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
    sinon.assert.calledOnce(bcryptCompareStub);
    sinon.assert.notCalled(bcryptHashStub);
    sinon.assert.notCalled(updateOneStub);
  });

  it('should return 400 if account is not found', async () => {
    findOneStub.resolves(null);

    const response = await request.put('/auth/change')
      .send({
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword456',
        id: 99,
      })
      .expect(400);

    expect(response.body.message).to.equal('Không tìm thấy tài khoản.');
    sinon.assert.notCalled(bcryptCompareStub);
    sinon.assert.notCalled(bcryptHashStub);
    sinon.assert.notCalled(updateOneStub);
  });

  it('should return 500 if there is a server error during the process', async () => {
    findOneStub.rejects(new Error('Database error'));

    const response = await request.put('/auth/change')
      .send({
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword456',
        id: 1,
      })
      .expect(500);

    expect(response.body.error).to.equal('Đã xảy ra lỗi trong quá trình đổi mật khẩu');
    sinon.assert.notCalled(bcryptCompareStub);
    sinon.assert.notCalled(bcryptHashStub);
    sinon.assert.notCalled(updateOneStub);
  });

  it('should return 400 if new password is empty', async () => {
    const response = await request.put('/auth/change-password')
      .send({
        oldPassword: 'oldPassword123',
        newPassword: '',
        id: 1,
      })
      .expect(400);

    expect(response.body.message).to.equal('Mật khẩu mới không được để trống');
  });
});
