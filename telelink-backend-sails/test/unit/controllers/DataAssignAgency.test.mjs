import { expect } from 'chai';
import supertest from 'supertest';
import sinon from 'sinon';
import sails from 'sails';

const request = supertest('http://localhost:9999'); // Đảm bảo đây là đúng URL của server

describe('Assign Random Data API', function () {
    this.timeout(10000);

    // Khởi tạo Sails server
    before((done) => {
        sails.lift({}, (err) => {
            if (err) {
                console.error('Error starting Sails:', err);
                return done(err);
            }
            console.log('Sails server started');
            done();
        });
    });

    after((done) => {
        sails.lower((err) => {
            if (err) return done(err);
            console.log('Sails server stopped');
            done();
        });
    });

    // Mocking các phương thức trong models
    let findOneAgencyStub, findDataStub, updateOneDataStub;

    beforeEach(() => {
        findOneAgencyStub = sinon.stub(sails.models.agency, 'findOne');
        findDataStub = sinon.stub(sails.models.data, 'find');
        updateOneDataStub = sinon.stub(sails.models.data, 'updateOne');
    });

    afterEach(() => {
        sinon.restore(); // Khôi phục tất cả các stubs
    });

    it('should assign data successfully to a valid agency', async () => {
        const mockAgency = {
            id: 'agency1',
            name: 'Branch 1',
            users: [{ id: 'user1', name: 'User 1' }]
        };
        const mockAvailableData = [
            { id: 'data1', agency: null },
            { id: 'data2', agency: null },
        ];

        // Stub findOne để trả về mockAgency
        findOneAgencyStub.resolves(mockAgency);  

        // Stub find và updateOne
        findDataStub.resolves(mockAvailableData);
        updateOneDataStub.resolves({ id: 'data1', agency: 'agency1' });

        const response = await request
            .post('/data-assign/agency')
            .send({
                agencyId: 'agency1',
                quantity: 2,
                network: 'Network A',
                category: 'Category A',
            })
            .expect(200);

        expect(response.body.message).to.equal('Đã phân bổ thành công 2 data ngẫu nhiên cho chi nhánh Branch 1.');
        sinon.assert.calledOnce(findOneAgencyStub);
        sinon.assert.calledOnce(findDataStub);
        sinon.assert.calledTwice(updateOneDataStub);
    });

    it('should return 404 if the agency does not exist', async () => {
        findOneAgencyStub.resolves(null);

        const response = await request
            .post('/data-assign/agency')
            .send({
                agencyId: 'invalidAgency',
                quantity: 2,
                network: 'Network A',
                category: 'Category A',
            })
            .expect(404);

        expect(response.body.message).to.equal('Chi nhánh không tồn tại.');
        sinon.assert.calledOnce(findOneAgencyStub);
        sinon.assert.notCalled(findDataStub);
        sinon.assert.notCalled(updateOneDataStub);
    });

    it('should return 404 if no data is available', async () => {
        const mockAgency = {
            id: 'agency1',
            name: 'Branch 1',
            users: [{ id: 'user1', name: 'User 1' }],
        };

        findOneAgencyStub.resolves(mockAgency); // Đảm bảo trả về mockAgency mà không cần populate
        findDataStub.resolves([]);

        const response = await request
            .post('/data-assign/agency')
            .send({
                agencyId: 'agency1',
                quantity: 2,
                network: 'Network A',
                category: 'Category A',
            })
            .expect(404);

        expect(response.body.message).to.equal('Không có data nào sẵn có.');
        sinon.assert.calledOnce(findOneAgencyStub);
        sinon.assert.calledOnce(findDataStub);
        sinon.assert.notCalled(updateOneDataStub);
    });

    it('should return 400 if requested quantity exceeds available data', async () => {
        const mockAgency = {
            id: 'agency1',
            name: 'Branch 1',
            users: [{ id: 'user1', name: 'User 1' }],
        };
        const mockAvailableData = [{ id: 'data1', agency: null }];

        findOneAgencyStub.resolves(mockAgency); 
        findDataStub.resolves(mockAvailableData);

        const response = await request
            .post('/data-assign/agency')
            .send({
                agencyId: 'agency1',
                quantity: 2,
                network: 'Network A',
                category: 'Category A',
            })
            .expect(400);

        expect(response.body.message).to.equal('Chỉ có 1 data sẵn có. Không đủ để phân bổ số lượng yêu cầu.');
        sinon.assert.calledOnce(findOneAgencyStub);
        sinon.assert.calledOnce(findDataStub);
        sinon.assert.notCalled(updateOneDataStub);
    });

    it('should return 500 if a server error occurs', async () => {
        findOneAgencyStub.rejects(new Error('Database error'));

        const response = await request
            .post('/data-assign/agency')
            .send({
                agencyId: 'agency1',
                quantity: 2,
                network: 'Network A',
                category: 'Category A',
            })
            .expect(500);

        expect(response.body.message).to.equal('Có lỗi xảy ra khi phân bổ data.');
        sinon.assert.calledOnce(findOneAgencyStub);
        sinon.assert.notCalled(findDataStub);
        sinon.assert.notCalled(updateOneDataStub);
    });
});
