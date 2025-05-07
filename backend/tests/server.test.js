// Import de la librairie de test des endpoints
const request = require('supertest');
// Import de l'application
const { app, stopServer } = require('../server');

// Test des endpoints de base
describe('Endpoints de base', () => {
    afterAll(()=>{
        stopServer();
    })
    test("should return all chapeter for 1 domain",async ()=>{
        const res = (await request(app).post('/getChapters').send({ domainId: 1,sectorId:1,mcqSize:10 }));
        expect(res.statusCode).toEqual(200);
        expect(res.body).toStrictEqual({data:[
            { chapterId: 40, name: '2) Introduction aux ondes' },
            { chapterId: 41, name: '3) Superposition de deux ondes' },
            { chapterId: 42, name: '4) Oscillateurs amortis' }
        ]});
    })

    test("should return all chapeter for 1 domain",async ()=>{
        const res = (await request(app).post('/getChapters').send({sectorId:1,mcqSize:10 }));
        expect(res.statusCode).toEqual(400);
    })
    test("should return all chapeter for 1 domain",async ()=>{
        const res = (await request(app).post('/getChapters').send({ domainId: 1,mcqSize:10 }));
        expect(res.statusCode).toEqual(400);
    })
    test("should return all chapeter for 1 domain",async ()=>{
        const res = (await request(app).post('/getChapters').send({ domainId: 1,sectorId:1 }));
        expect(res.statusCode).toEqual(400);
    })
    test("should return all chapeter for 1 domain",async ()=>{
        const res = (await request(app).post('/getChapters').send({ domainId: -1,sectorId:1,mcqSize:10 }));
        expect(res.statusCode).toEqual(400);
    })
});