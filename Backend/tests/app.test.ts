const application = require('../src/app.ts');
const request = require('supertest');

// console.log('App type:', typeof app);
// console.log('App:', app);
// console.log('Has address method:', typeof app.address);

describe("GET Initial Test", () => {
    describe("request money", () => {
        test("respond with 200", async () => {
            const response = await request(application)
            .get("/money")
            .expect(200);
        });
    });
});

describe("POST SIGNIN", () => {
    describe("passed correct info" , () => {
        test("responds with 200 + token", async () => {
            const response = await request(application)
            .post("/signin")
            .set("Content-Type", "application/json")
            .send({
                email: "cheese@gmail.com",
                password: "cheese"
            })

            await expect(response.statusCode).toBe(200);
            await expect(response.body).toHaveProperty("token");
        })
    })
    describe("passed wrong info", () => {
        test("responds with 400", async () => {
            const response = await request(application)
            .post("/signin")
            .set("Content-Type", "application/json")
            .send({
                email: "cheese@gmail.com",
                password: "chigga"
            })

            await expect(response.statusCode).toBe(400);
            // await expect(response.body).toHaveProperty("token");
        })
    })

})