const { getImages } = require('../../sql/sqlImages');
const {deconnect} = require("../../sql/sqlConnect");

afterAll(() => {
  deconnect();  // Fermer la connexion après les tests
});

test("should return all choice for some question",async ()=>{
    const task = await getImages([902,895]);
    expect(task).toStrictEqual({
      '895': [
        {
          path: '/data/chapter_51/question_895/f6aca099a998c7cd8358f7c23704843d.png',
          originalFileName: 'pendule.png'
        },
        {
          path: '/data/chapter_51/question_895/fc1c872e5be6ceca0ffb0189bbcdd7fc.png',
          originalFileName: 'penduleT.png'
        }
      ],
      '902': [
        {
          path: '/data/chapter_51/question_902/83b8d62783206cca4c19ff7d87754e52.png',
          originalFileName: 'equilibreA.png'
        },
        {
          path: '/data/chapter_51/question_902/583e548a16b4cf4de3e8f27e9d1af2cc.png',
          originalFileName: 'equilibreC.png'
        },
        {
          path: '/data/chapter_51/question_902/7c51d091568e2cbfe18dede601d0dfda.png',
          originalFileName: 'equilibreD.png'
        }
      ]
    });
})