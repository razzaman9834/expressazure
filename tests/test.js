const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Import your Express app

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /tasks', () => {
  it('should return an array of tasks', (done) => {
    chai.request(app)
      .get('/tasks')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

describe('GET /testenv', () => {
  it('should return an object with Aman and ENVVAL', (done) => {
    chai.request(app)
      .get('/testenv')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('1', 'Aman');
        expect(res.body).to.have.property('2', 'your-env-value'); // Replace with your actual ENVVAL
        done();
      });
  });
});
