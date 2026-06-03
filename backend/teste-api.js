import 'dotenv/config';
import fs from 'fs';

// ========================
// CONFIG
// ========================
const BASE_URL = 'http://localhost:3000';
let authToken = null;

// ========================
// HTTP CLIENT (JSON)
// ========================
async function request(method, endpoint, body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return {
    status: res.status,
    data
  };
}

// ========================
// HTTP CLIENT (FORM DATA)
// ========================
async function requestFormData(endpoint, formData) {
  const headers = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return {
    status: res.status,
    data
  };
}

// ========================
// HELPERS (ROBUSTOS)
// ========================
function getData(res) {
  return res.data?.data ?? res.data;
}

function getId(res) {
  const data = getData(res);
  return Number(data?.id);
}

function assert(cond, msg) {
  if (!cond) {
    throw new Error(msg);
  }
}

const log = {
  title: (t) => console.log(`\n===== ${t} =====`),
  ok: (t) => console.log(`✔ ${t}`)
};

const ids = {};

// ========================
// TEST WRAPPER
// ========================
async function test(name, fn) {
  try {
    await fn();
    log.ok(name);
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error('   →', err.message);
    process.exit(1);
  }
}

// ========================
// USERS
// ========================
async function testUsers() {
  log.title('USERS');

  await test('CREATE USER', async () => {
    const res = await request('POST', '/users', {
      name: 'User Test',
      email: `user${Date.now()}@test.com`,
      password: '123456',
      role: 'ATENDENTE'
    });

    assert(res.status === 201, `Expected 201, got ${res.status}`);

    ids.user = getId(res);
    assert(ids.user, 'User ID missing');
  });

  await test('GET USERS', async () => {
    const res = await request('GET', '/users');
    assert(Array.isArray(getData(res)));
  });

  await test('GET USER BY ID', async () => {
    const res = await request('GET', `/users/${ids.user}`);
    const u = getData(res);

    assert(Number(u.id) === ids.user);
  });

  await test('UPDATE USER', async () => {
    const res = await request('PUT', `/users/${ids.user}`, {
      name: 'Updated User'
    });

    assert(res.status === 200);
  });
}

// ========================
// CATEGORIES
// ========================
async function testCategories() {
  log.title('CATEGORIES');

  await test('CREATE CATEGORY', async () => {
    const res = await request('POST', '/categories', {
      name: `Category ${Date.now()}`
    });

    assert(res.status === 201, `Expected 201, got ${res.status}`);

    ids.category = getId(res);
    assert(ids.category, 'Category ID missing');
  });

  await test('GET CATEGORIES', async () => {
    const res = await request('GET', '/categories');
    assert(Array.isArray(getData(res)));
  });

  await test('GET CATEGORY BY ID', async () => {
    const res = await request('GET', `/categories/${ids.category}`);
    const c = getData(res);

    assert(Number(c.id) === ids.category);
  });

  await test('UPDATE CATEGORY', async () => {
    const res = await request('PUT', `/categories/${ids.category}`, {
      name: `Updated Category ${Date.now()}`
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });
}

// ========================
// PRODUCTS (IMGBB READY)
// ========================
async function testProducts() {
  log.title('PRODUCTS');

  await test('CREATE PRODUCT (WITH IMAGE)', async () => {
    const formData = new FormData();

    formData.append('name', 'Product Test');
    formData.append('description', 'Product description test');
    formData.append('price', '10');
    formData.append('categoryId', String(ids.category));

    const imageBuffer = fs.existsSync('./test-image.jpg')
      ? fs.readFileSync('./test-image.jpg')
      : Buffer.from(
          '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDAREAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFBv/EABcBAQADAAAAAAAAAAAAAAAAAAEAAhH/2gAIAQEAAD8AvwD/2Q==',
          'base64'
        );

    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('image', imageBlob, 'test.jpg');

    const res = await requestFormData('/products', formData);

    assert(res.status === 201, `Expected 201, got ${res.status}`);

    ids.product = getId(res);
    assert(ids.product, 'Product ID missing');
  });

  await test('GET PRODUCTS', async () => {
    const res = await request('GET', '/products');
    assert(Array.isArray(getData(res)));
  });

  await test('GET PRODUCT BY ID', async () => {
    const res = await request('GET', `/products/${ids.product}`);
    const p = getData(res);

    assert(Number(p.id) === ids.product);
  });

  await test('UPDATE PRODUCT', async () => {
    const res = await request('PUT', `/products/${ids.product}`, {
      name: 'Updated Product',
      price: 99.99
    });

    assert(res.status === 200);
  });
}

// ========================
// ORDERS
// ========================
async function testOrders() {
  log.title('ORDERS');

  await test('CREATE ORDER', async () => {
    const res = await request('POST', '/orders', {
      trackingCode: `TRACK-${Date.now()}`,
      customerName: 'Client Test',
      phone: '900000000',
      address: 'Street X',
      status: 'pending',
      total: 100
    });

    assert(res.status === 201);

    ids.order = getId(res);
    assert(ids.order, 'Order ID missing');
  });

  await test('GET ORDERS', async () => {
    const res = await request('GET', '/orders');
    assert(Array.isArray(getData(res)));
  });

  await test('GET ORDER BY ID', async () => {
    const res = await request('GET', `/orders/${ids.order}`);
    const o = getData(res);

    assert(Number(o.id) === ids.order);
  });

  await test('UPDATE ORDER', async () => {
    const res = await request('PUT', `/orders/${ids.order}`, {
      status: 'shipped'
    });

    assert(res.status === 200);
  });
}

// ========================
// ORDER ITEMS
// ========================
async function testOrderItems() {
  log.title('ORDER ITEMS');

  await test('CREATE ORDER ITEM', async () => {
    const res = await request('POST', '/order-items', {
      orderId: ids.order,
      productId: ids.product,
      quantity: 2,
      price: 10
    });

    assert(res.status === 201);

    ids.orderItem = getId(res);
    assert(ids.orderItem, 'OrderItem ID missing');
  });

  await test('GET ORDER ITEMS', async () => {
    const res = await request('GET', '/order-items');
    assert(Array.isArray(getData(res)));
  });

  await test('GET ORDER ITEM BY ID', async () => {
    const res = await request('GET', `/order-items/${ids.orderItem}`);
    const oi = getData(res);

    assert(Number(oi.id) === ids.orderItem);
  });

  await test('UPDATE ORDER ITEM', async () => {
    const res = await request('PUT', `/order-items/${ids.orderItem}`, {
      quantity: 5
    });

    assert(res.status === 200);
  });
}

// ========================
// CLEANUP
// ========================
async function cleanup() {
  log.title('CLEANUP');

  await test('DELETE ORDER ITEM', async () => {
    const res = await request('DELETE', `/order-items/${ids.orderItem}`);
    assert([200, 204].includes(res.status));
  });

  await test('DELETE ORDER', async () => {
    const res = await request('DELETE', `/orders/${ids.order}`);
    assert([200, 204].includes(res.status));
  });

  await test('DELETE PRODUCT', async () => {
    const res = await request('DELETE', `/products/${ids.product}`);
    assert([200, 204].includes(res.status));
  });

  await test('DELETE CATEGORY', async () => {
    const res = await request('DELETE', `/categories/${ids.category}`);
    assert([200, 204].includes(res.status));
  });

  await test('DELETE USER', async () => {
    const res = await request('DELETE', `/users/${ids.user}`);
    assert([200, 204].includes(res.status));
  });
}

// ========================
// RUN
// ========================
async function authenticateAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const res = await request('POST', '/auth/login', {
    email: adminEmail,
    password: adminPassword
  });

  assert(res.status === 200, `Expected 200 for admin login, got ${res.status}`);
  authToken = res.data?.token;
  assert(authToken, 'Admin token missing');
}

async function run() {
  console.log('🚀 STARTING API TESTS...\n');

  await authenticateAdmin();
  await testUsers();
  await testCategories();
  await testProducts();
  await testOrders();
  await testOrderItems();

  await cleanup();

  console.log('\n✅ ALL TESTS PASSED');
}

run().catch(err => {
  console.error('\n❌ TEST FAILED');
  console.error(err.message);
  process.exit(1);
});