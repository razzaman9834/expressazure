const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Import your Express app

chai.use(chaiHttp);
const expect = chai.expect;



describe('GET /testenv', () => {
  it('should return an object with Aman and ENVVAL', (done) => {
   done();
  });
});
