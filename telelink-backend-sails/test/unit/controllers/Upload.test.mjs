import { expect } from 'chai';
import supertest from 'supertest';
import sails from 'sails';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';

const request = supertest('http://localhost:9999');

describe('File Upload API', function () {
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

  let uploadFileStub;

  beforeEach(() => {
    uploadFileStub = sinon.stub(sails.models.data, 'upload'); // Giả lập upload file
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should successfully upload a file', async () => {
    const mockFileData = { filename: 'test-image.jpg', size: 1024 };
    uploadFileStub.resolves(mockFileData);  // Mô phỏng việc upload thành công

    const filePath = path.join(__dirname, 'test-image.jpg'); // Đường dẫn tệp tin kiểm tra (bạn cần một tệp tin thực tế trong thư mục này)

    const response = await request.post('/import-data')
      .attach('file', filePath) // Dùng .attach() để đính kèm tệp
      .expect(200);

    expect(response.body.message).to.equal('Tệp tin đã được tải lên thành công.');
    expect(response.body.file.filename).to.equal('test-image.jpg');
  });

  it('should return 400 if no file is provided', async () => {
    const response = await request.post('/file/upload')
      .expect(400);

    expect(response.body.message).to.equal('Không có tệp tin nào được gửi');
  });

  it('should return 400 if the file type is not allowed', async () => {
    const filePath = path.join(__dirname, 'test.txt'); // Sử dụng một tệp không hợp lệ

    const response = await request.post('/import-data')
      .attach('file', filePath)
      .expect(400);

    expect(response.body.message).to.equal('Tệp tin không hợp lệ');
  });

  it('should return 500 if there is an error during file upload', async () => {
    uploadFileStub.rejects(new Error('Server error')); // Mô phỏng lỗi khi upload

    const filePath = path.join(__dirname, 'test-image.jpg');

    const response = await request.post('/file/upload')
      .attach('file', filePath)
      .expect(500);

    expect(response.body.error).to.equal('Đã xảy ra lỗi trong quá trình tải tệp lên');
  });
});
