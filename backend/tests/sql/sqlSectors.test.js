const { getSectors } = require('../../sql/sqlSectors');
const {deconnect} = require("../../sql/sqlConnect");

afterAll(() => {
  deconnect();  // Fermer la connexion après les tests
});

test("should return all sectors",async ()=>{
    const task = await getSectors();
    expect(task).toStrictEqual([
      { sectorId: 1, name: 'MPSI' },
      { sectorId: 2, name: 'PTSI' },
      { sectorId: 3, name: 'TSI1' },
      { sectorId: 4, name: 'PCSI' },
      { sectorId: 5, name: 'PC' },
      { sectorId: 6, name: 'PSI' },
      { sectorId: 7, name: 'BCPST1' },
      { sectorId: 8, name: 'BCPST2' },
      { sectorId: 9, name: 'TSI2' },
      { sectorId: 10, name: 'PT' },
      { sectorId: 11, name: 'MP' },
      { sectorId: 12, name: 'TPC1' },
      { sectorId: 13, name: 'TPC2' },
      { sectorId: 16, name: 'ATS' },
      { sectorId: 17, name: 'No filter' },
      { sectorId: 18, name: 'MP2I' },
      { sectorId: 19, name: 'MPI' }
    ])
})