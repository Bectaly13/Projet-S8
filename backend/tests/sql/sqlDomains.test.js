const { getDomains } = require('../../sql/sqlDomains');
const {deconnect} = require("../../sql/sqlConnect");

afterAll(() => {
  deconnect();  // Fermer la connexion après les tests
});

test("should return all domains",async ()=>{
    const task = await getDomains(8,10);
    expect(task).toStrictEqual([
      { domainId: 5, name: 'Mécanique' },
      { domainId: 6, name: 'Thermodynamique' }
    ])
})