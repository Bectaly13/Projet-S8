const { getChapters } = require('../../sql/sqlChapters');
const {deconnect} = require("../../sql/sqlConnect");

afterAll(() => {
  deconnect();  // Fermer la connexion après les tests
});

test("should return all chapeter for 1 domain",async ()=>{
    const task = await getChapters(1,1,10);
    expect(task).toStrictEqual([
        { chapterId: 40, name: '2) Introduction aux ondes' },
        { chapterId: 41, name: '3) Superposition de deux ondes' },
        { chapterId: 42, name: '4) Oscillateurs amortis' }
    ])
})