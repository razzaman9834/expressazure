const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Import your Express app

chai.use(chaiHttp);
const expect = chai.expect;



describe('GET /testenv', () => {
  it('should return an object with Aman and ENVVAL', (done) => {
    chai.request(app)
      .get('/testenv')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('1', 'Aman');
        done();
      });
  });
});
