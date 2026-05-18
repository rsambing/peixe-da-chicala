const BASE_URL = 'http://localhost:3000';

// ========================
// HTTP CLIENT
// ========================
async function request(method, endpoint, body = null) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return { status: res.status, ok: res.ok, data };
}

// ========================
// HELPERS
// ========================
function unwrap(res) {
  return res.data?.data ?? res.data;
}

function id(res) {
  return Number(unwrap(res)?.id);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const log = {
  title: (m) => console.log(`\n===== ${m} =====`),
  ok: (m) => console.log(`✔ ${m}`),
};

const ids = {};

// ========================
// RUN WRAPPER
// ========================
async function test(name, fn) {
  try {
    await fn();
    log.ok(name);
  } catch (e) {
    console.error(`❌ ${name}`);
    console.error('   →', e.message);
    process.exit(1);
  }
}

// ========================
// 1. USERS
// ========================
async function testUsers() {
  log.title('USERS');

  await test('CREATE USER', async () => {
    const res = await request('POST', '/users', {
      name: 'User Test',
      email: `user${Date.now()}@test.com`,
      password: '123456',
      role: 'customer'
    });

    assert(res.status === 201, 'User not created');
    ids.user = id(res);
    assert(ids.user, 'User ID missing');
  });

  await test('GET USERS', async () => {
    const res = await request('GET', '/users');
    assert(res.status === 200);
    assert(Array.isArray(unwrap(res)));
  });

  await test('GET USER BY ID', async () => {
    const res = await request('GET', `/users/${ids.user}`);
    const u = unwrap(res);

    assert(res.status === 200);
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
// 2. CATEGORIES
// ========================
async function testCategories() {
  log.title('CATEGORIES');

  await test('CREATE CATEGORY', async () => {
    const res = await request('POST', '/categories', {
      name: `Category ${Date.now()}`
    });

    assert(res.status === 201);
    ids.category = id(res);
  });

  await test('GET CATEGORIES', async () => {
    const res = await request('GET', '/categories');
    assert(res.status === 200);
    assert(Array.isArray(unwrap(res)));
  });

  await test('GET CATEGORY BY ID', async () => {
    const res = await request('GET', `/categories/${ids.category}`);
    const c = unwrap(res);

    assert(Number(c.id) === ids.category);
  });

  await test('UPDATE CATEGORY', async () => {
    const res = await request('PUT', `/categories/${ids.category}`, {
      name: 'Updated Category'
    });

    assert(res.status === 200);
  });
}

// ========================
// 3. PRODUCTS
// ========================
async function testProducts() {
  log.title('PRODUCTS');

  await test('CREATE PRODUCT', async () => {
    const res = await request('POST', '/products', {
      name: 'Product Test',
      description: 'Test',
      price: 10,
      image: 'img.jpg',
      available: true,
      categoryId: ids.category
    });

    assert(res.status === 201);
    ids.product = id(res);
  });

  await test('GET PRODUCTS', async () => {
    const res = await request('GET', '/products');
    assert(Array.isArray(unwrap(res)));
  });

  await test('GET PRODUCT BY ID', async () => {
    const res = await request('GET', `/products/${ids.product}`);
    const p = unwrap(res);

    assert(Number(p.id) === ids.product);
  });

  await test('UPDATE PRODUCT', async () => {
    const res = await request('PUT', `/products/${ids.product}`, {
      price: 99.99
    });

    assert(res.status === 200);
  });
}

// ========================
// 4. ORDERS
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
    ids.order = id(res);
  });

  await test('GET ORDERS', async () => {
    const res = await request('GET', '/orders');
    assert(Array.isArray(unwrap(res)));
  });

  await test('GET ORDER BY ID', async () => {
    const res = await request('GET', `/orders/${ids.order}`);
    const o = unwrap(res);

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
// 5. ORDER ITEMS
// ========================
async function testOrderItems() {
  log.title('ORDER ITEMS');

  await test('CREATE ORDER ITEM', async () => {
    const res = await request('POST', '/order-items', {
      orderId: ids.order,
      productId: ids.product,
      quantity: 2,
      price: 200
    });

    assert(res.status === 201);
    ids.orderItem = id(res);
  });

  await test('GET ORDER ITEMS', async () => {
    const res = await request('GET', '/order-items');
    assert(Array.isArray(unwrap(res)));
  });

  await test('GET ORDER ITEM BY ID', async () => {
    const res = await request('GET', `/order-items/${ids.orderItem}`);
    const oi = unwrap(res);

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
// CLEANUP (ORDER SAFE FK)
// ========================
async function cleanup() {
  log.title('CLEANUP');

  await test('DELETE ORDER ITEM', async () => {
    const res = await request('DELETE', `/order-items/${ids.orderItem}`);
    assert(res.status === 200 || res.status === 204);
  });

  await test('DELETE ORDER', async () => {
    const res = await request('DELETE', `/orders/${ids.order}`);
    assert(res.status === 200 || res.status === 204);
  });

  await test('DELETE PRODUCT', async () => {
    const res = await request('DELETE', `/products/${ids.product}`);
    assert(res.status === 200 || res.status === 204);
  });

  await test('DELETE CATEGORY', async () => {
    const res = await request('DELETE', `/categories/${ids.category}`);
    assert(res.status === 200 || res.status === 204);
  });

  await test('DELETE USER', async () => {
    const res = await request('DELETE', `/users/${ids.user}`);
    assert(res.status === 200 || res.status === 204);
  });
}

// ========================
// RUN ALL
// ========================
async function run() {
  log.title('STARTING API TESTS');

  await testUsers();
  await testCategories();
  await testProducts();
  await testOrders();
  await testOrderItems();

  await cleanup();

  log.title('ALL TESTS PASSED ✔');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});