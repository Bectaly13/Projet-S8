const { getChoices } = require('../../sql/sqlChoices');
const {deconnect} = require("../../sql/sqlConnect");

afterAll(() => {
  deconnect();  // Fermer la connexion après les tests
});

test("should return all choice for some question",async ()=>{
    const task = await getChoices([902,895]);
    expect(task).toStrictEqual({
        '895': [
          {
            choiceOrder: 1,
            wordingBefore: 'On considère un pendule simple :\r\n' +
              '\r\n' +
              'url(pendule.png)\r\n' +
              '\r\n' +
              'La tension du fil est',
            choiceText: 'radiale',
            wordingAfter: '',
            isCorrect: 1
          },
          {
            choiceOrder: 2,
            wordingBefore: '',
            choiceText: 'orthoradiale.',
            wordingAfter: '',
            isCorrect: 0
          }
        ],
        '902': [
          {
            choiceOrder: 1,
            wordingBefore: 'Un objet ponctuel est soumis à trois forces représentées ci-dessous par des flèches.\r\n' +
              'Quelle situation correspond à un mouvement rectiligne et uniforme ?',
            choiceText: 'url(equilibreA.png)',
            wordingAfter: '',
            isCorrect: 0
          },
          {
            choiceOrder: 2,
            wordingBefore: '',
            choiceText: 'url(equilibreC.png)',
            wordingAfter: '',
            isCorrect: 1
          },
          {
            choiceOrder: 3,
            wordingBefore: '',
            choiceText: 'url(equilibreD.png)',
            wordingAfter: '',
            isCorrect: 0
          }
        ]
      }
);
})