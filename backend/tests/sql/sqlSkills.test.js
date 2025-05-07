const { getSkills } = require('../../sql/sqlSkills');
const {deconnect} = require("../../sql/sqlConnect");

afterAll(() => {
  deconnect();  // Fermer la connexion après les tests
});

test("should return all sectors",async ()=>{
    const task = await getSkills(40,1);
    expect(task).toStrictEqual([
      { skillId: 64, name: 'Différents types de signaux' },
      { skillId: 65, name: 'Ondes progressives' },
      { skillId: 66, name: 'Ondes stationnaires' }
    ])
})