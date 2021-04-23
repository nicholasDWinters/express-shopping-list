process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let bike = { name: "bike", price: 150 };

beforeEach(function () {
    items.push(bike);
});

afterEach(function () {
    items = []
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(items)
    })
})

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${bike.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(bike)
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/fakeItem`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating an item", async () => {
        let baseball = { name: 'baseball', price: 5.00 };
        const res = await request(app).post("/items").send(baseball);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: baseball });
    })
    test("Responds with 400 if both name and price missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    })
    test("Responds with 400 if price missing", async () => {
        const res = await request(app).post("/items").send({ name: 'toy' });
        expect(res.statusCode).toBe(400);
    })
    test("Responds with 400 if name missing", async () => {
        const res = await request(app).post("/items").send({ price: 15.00 });
        expect(res.statusCode).toBe(400);
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
        const res = await request(app).patch(`/items/${bike.name}`).send({ name: "newBike" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: 'newBike', price: 150 } });
    })
    test("Responds with 404 for invalid name in request", async () => {
        const res = await request(app).patch(`/items/fakeItem`).send({ name: 'fake', price: 20 });
        expect(res.statusCode).toBe(404);
    })
})

describe('/PATCH /items/:name', () => {
    test("Updating an item's price", async () => {
        let item = { name: 'toy', price: 20 }
        const res1 = await request(app).post("/items").send(item);
        const res = await request(app).patch(`/items/toy`).send({ price: 30 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: 'toy', price: 30 } });
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${bike.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/fakeItem`);
        expect(res.statusCode).toBe(404);
    })
})