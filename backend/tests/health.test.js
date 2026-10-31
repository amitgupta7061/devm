const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server');

const request = (port, path) => {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
};

test('Health Check API Endpoint Verification', async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;

  await t.test('GET / returns 200 and system information', async () => {
    const res = await request(port, '/');
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.status, 'Active');
    assert.strictEqual(body.architecture, 'Enterprise DevOps Lifecycle & Monitoring');
  });

  await t.test('GET /api/health returns health status object', async () => {
    const res = await request(port, '/api/health');
    assert.ok(res.statusCode === 200 || res.statusCode === 503);
    const body = JSON.parse(res.body);
    assert.ok(body.service.includes('Smart Campus'));
    assert.ok(body.system.nodeVersion);
    assert.ok(body.devops.cicd.includes('Jenkins'));
  });

  await t.test('GET /api/health/metrics returns Nagios formatted text', async () => {
    const res = await request(port, '/api/health/metrics');
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes('smart_campus_up'));
    assert.ok(res.body.includes('smart_campus_uptime_seconds'));
  });

  server.close();
});
