const { getDefaultQuestionsData,getQuestionCount,getSkillQuestions,getValidLearnQuestions,getValidStudyQuestions } = require('../../sql/sqlQuestions');
const {deconnect} = require("../../sql/sqlConnect");

afterAll(() => {
    deconnect();  // Fermer la connexion après les tests
});

test("should return all sectors",async ()=>{
    const task = await getQuestionCount();
    expect(task).toStrictEqual([ { 'COUNT(DISTINCT questionGroupId)': 2382 } ])
});

test("should return all sectors",async ()=>{
  const task = await getValidStudyQuestions(11,8);
  expect(task).toStrictEqual({
    '24': [
      {
        questionId: 81,
        explanation: "Le four expulse de l'air de l'air chaud, et les différents courants d'air existant dans l'habitation permettent à l'odeur de se répandre par convection.",
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '25': [
      {
        questionId: 82,
        explanation: 'La tâche croît rapidement au début, puis la vitesse de croissance diminue : la croissance est en $\\sqrt{t}$, ce qui est caractéristique des phénomènes de diffusion.\r\n' +    
          '\r\n' +
          'La simulation complète est sur le très bon site http://femto-physique.fr/physique_statistique/phystat_C4.php',
        level: 1,
        mixingType: 'RANDOM'
      }
    ],
    '26': [
      {
        questionId: 83,
        explanation: 'Cette estimation peut être faite par la relation $l^2 = D \\tau$, où $D$ est le coefficient de diffusion, $l$ la longueur de diffusion et $\\tau$ la durée du phénomène.\r\n' + 
          '\r\n' +
          'Dans un gaz $D \\approx 10^{-5}$ m$^2$s$^{-1}$ (ordre de grandeur à connaitre), on obtient donc $\\tau = l^2/D = 1^2/10^{-5} = 10^5$ s ce qui correspond à quelques heures.',
        level: 3,
        mixingType: 'RANDOM'
      },
      {
        questionId: 84,
        explanation: 'Cette estimation peut être faite par la relation $l^2 = D \\tau$, où $D$ est le coefficient de diffusion, $l$ la longueur de diffusion et $\\tau$ la durée du phénomène.\r\n' + 
          '\r\n' +
          'On obtient ainsi $\\tau = l^2/D = (10^{-7})^2/10^{-15} = 10$ s.',
        level: 3,
        mixingType: 'RANDOM'
      }
    ],
    '27': [
      {
        questionId: 85,
        explanation: '$||\\vec{j}||$ est un nombre de particules passant par mètre carré et par seconde. Le vecteur indique la direction du mouvement des particules.',
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '28': [
      {
        questionId: 86,
        explanation: 'Par définition de $\\vec{j}$, on a $\\delta N = \\vec{j}\\cdot\\vec{n}\\ dS\\ dt = j\\ \\cos \\theta\\ dS\\ dt$.',
        level: 1,
        mixingType: 'RANDOM'
      }
    ],
    '29': [
      {
        questionId: 87,
        explanation: "La loi de Fick s'écrit $\\vec{j} = -D\\ \\vec{grad} (n)$, avec $\\vec{grad}(n) = \\frac{\\partial n}{\\partial r}\\ \\vec{e}_r$ car $n$ dépend seulement de $r$ et de $t$ dans ce contexte.",
        level: 2,
        mixingType: 'TWO_BY_TWO'
      }
    ],
    '30': [
      {
        questionId: 88,
        explanation: 'Pour exprimer le nombre de particules passant en $x$ entre $t$ et $t+dt$, on fait intervenir $j(x,t)$.\r\n' +
          '\r\n' +
          "Notez l'approximation réalisée : on considère que $j$ ne varie pas entre $t$ et $t+dt$, car $dt$ est très petit.",
        level: 2,
        mixingType: 'RANDOM'
      },
      {
        questionId: 90,
        explanation: 'Le nombre de particules passant en $x+dx$ entre $t$ et $t+dt$ dans le sens des $x$ croissants $+j(x+dx,t)S\\ dt$.\r\n' +
          '\r\n' +
          "Notez l'approximation réalisée : on considère que $j$ ne varie pas entre $t$ et $t+dt$, car $dt$ est très petit.",
        level: 2,
        mixingType: 'TWO_BY_TWO'
      }
    ],
    '33': [
      {
        questionId: 91,
        explanation: "Le nombre de particules à l'instant $t$ dans la tranche est $n(x,t)S\\ dx$. Notez l'approximation : on considère que la densité volumique de particules est uniforme dans la tranche, et égale à $n(x,t)$.\r\n" +
          '\r\n' +
          'La variation de ce nombre de particule entre $t$ et $t+dt$ est $(n(x,t+dt) -n(x,t))S\\ dx = \\frac{\\partial n}{\\partial t}\\ dt S \\ dx$.\r\n' +
          '\r\n',
        level: 3,
        mixingType: 'RANDOM'
      }
    ],
    '34': [
      {
        questionId: 92,
        explanation: "Par définition, $\\frac{\\partial j}{\\partial x} = \\frac{ j(x+dx,t) - j(x,t)}{dx}$, d'où la réponse.",
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '35': [
      {
        questionId: 93,
        explanation: "Pour retrouver la bonne, utiliser l'unité de $D$ (m$^2$/s) et vérifier l'homogénéité.\r\n" +
          '\r\n' +
          "Se souvenir qu'il y a une dérivée première en temps et une dérivée seconde en espace. ",
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '36': [
      {
        questionId: 94,
        explanation: ' $\\frac{1}{r^2} \\frac{\\partial}{\\partial r}\\left(r^2 \\dfrac{\\partial\\ n}{\\partial r}\\right) = 0$\r\n' +
          '$\\Rightarrow \\frac{\\partial}{\\partial r}\\left(r^2 \\dfrac{\\partial\\ n}{\\partial r}\\right)$\r\n' +
          '$\\Rightarrow r^2 \\dfrac{\\partial\\ n}{\\partial r} = A$\r\n' +
          '\r\n' +
          'Une deuxième intégration donne alors $n(r)$.',
        level: 1,
        mixingType: 'RANDOM'
      }
    ],
    '40': [
      {
        questionId: 98,
        explanation: 'url(xdx.png)\r\n' +
          '\r\n' +
          'Bilan du particules entre $x$ et $x+dx$ : la variation du nombre entre $t$ et $t+dt$ est égale à ce qui rentre et sort au niveau des parois + ce qui est créé. Le terme en A est donc du même côté que la dérivée seconde en $x$.',
        level: 4,
        mixingType: 'RANDOM'
      }
    ],
    '41': [
      {
        questionId: 99,
        explanation: "Il s'agit de conditions aux limites de type flux : un apport régulier de particules en $x=0$ se modélise par $j(0,t) = cte$ et une paroi imperméable en $x=L$ se modélise par  $j(L,t) = 0$.",
        level: 3,
        mixingType: 'RANDOM'
      }
    ]
  })
});

test("should return all sectors",async ()=>{
  const task = await getValidLearnQuestions(11,8);
  expect(task).toStrictEqual({
    '24': [
      {
        questionId: 81,
        explanation: "Le four expulse de l'air de l'air chaud, et les différents courants d'air existant dans l'habitation permettent à l'odeur de se répandre par convection.",
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '25': [
      {
        questionId: 82,
        explanation: 'La tâche croît rapidement au début, puis la vitesse de croissance diminue : la croissance est en $\\sqrt{t}$, ce qui est caractéristique des phénomènes de diffusion.\r\n' +    
          '\r\n' +
          'La simulation complète est sur le très bon site http://femto-physique.fr/physique_statistique/phystat_C4.php',
        level: 1,
        mixingType: 'RANDOM'
      }
    ],
    '26': [
      {
        questionId: 83,
        explanation: 'Cette estimation peut être faite par la relation $l^2 = D \\tau$, où $D$ est le coefficient de diffusion, $l$ la longueur de diffusion et $\\tau$ la durée du phénomène.\r\n' + 
          '\r\n' +
          'Dans un gaz $D \\approx 10^{-5}$ m$^2$s$^{-1}$ (ordre de grandeur à connaitre), on obtient donc $\\tau = l^2/D = 1^2/10^{-5} = 10^5$ s ce qui correspond à quelques heures.',
        level: 3,
        mixingType: 'RANDOM'
      },
      {
        questionId: 84,
        explanation: 'Cette estimation peut être faite par la relation $l^2 = D \\tau$, où $D$ est le coefficient de diffusion, $l$ la longueur de diffusion et $\\tau$ la durée du phénomène.\r\n' + 
          '\r\n' +
          'On obtient ainsi $\\tau = l^2/D = (10^{-7})^2/10^{-15} = 10$ s.',
        level: 3,
        mixingType: 'RANDOM'
      }
    ],
    '27': [
      {
        questionId: 85,
        explanation: '$||\\vec{j}||$ est un nombre de particules passant par mètre carré et par seconde. Le vecteur indique la direction du mouvement des particules.',
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '28': [
      {
        questionId: 86,
        explanation: 'Par définition de $\\vec{j}$, on a $\\delta N = \\vec{j}\\cdot\\vec{n}\\ dS\\ dt = j\\ \\cos \\theta\\ dS\\ dt$.',
        level: 1,
        mixingType: 'RANDOM'
      }
    ],
    '29': [
      {
        questionId: 87,
        explanation: "La loi de Fick s'écrit $\\vec{j} = -D\\ \\vec{grad} (n)$, avec $\\vec{grad}(n) = \\frac{\\partial n}{\\partial r}\\ \\vec{e}_r$ car $n$ dépend seulement de $r$ et de $t$ dans ce contexte.",
        level: 2,
        mixingType: 'TWO_BY_TWO'
      }
    ],
    '30': [
      {
        questionId: 88,
        explanation: 'Pour exprimer le nombre de particules passant en $x$ entre $t$ et $t+dt$, on fait intervenir $j(x,t)$.\r\n' +
          '\r\n' +
          "Notez l'approximation réalisée : on considère que $j$ ne varie pas entre $t$ et $t+dt$, car $dt$ est très petit.",
        level: 2,
        mixingType: 'RANDOM'
      },
      {
        questionId: 90,
        explanation: 'Le nombre de particules passant en $x+dx$ entre $t$ et $t+dt$ dans le sens des $x$ croissants $+j(x+dx,t)S\\ dt$.\r\n' +
          '\r\n' +
          "Notez l'approximation réalisée : on considère que $j$ ne varie pas entre $t$ et $t+dt$, car $dt$ est très petit.",
        level: 2,
        mixingType: 'TWO_BY_TWO'
      }
    ],
    '33': [
      {
        questionId: 91,
        explanation: "Le nombre de particules à l'instant $t$ dans la tranche est $n(x,t)S\\ dx$. Notez l'approximation : on considère que la densité volumique de particules est uniforme dans la tranche, et égale à $n(x,t)$.\r\n" +
          '\r\n' +
          'La variation de ce nombre de particule entre $t$ et $t+dt$ est $(n(x,t+dt) -n(x,t))S\\ dx = \\frac{\\partial n}{\\partial t}\\ dt S \\ dx$.\r\n' +
          '\r\n',
        level: 3,
        mixingType: 'RANDOM'
      }
    ],
    '34': [
      {
        questionId: 92,
        explanation: "Par définition, $\\frac{\\partial j}{\\partial x} = \\frac{ j(x+dx,t) - j(x,t)}{dx}$, d'où la réponse.",
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '35': [
      {
        questionId: 93,
        explanation: "Pour retrouver la bonne, utiliser l'unité de $D$ (m$^2$/s) et vérifier l'homogénéité.\r\n" +
          '\r\n' +
          "Se souvenir qu'il y a une dérivée première en temps et une dérivée seconde en espace. ",
        level: 2,
        mixingType: 'RANDOM'
      }
    ],
    '36': [
      {
        questionId: 94,
        explanation: ' $\\frac{1}{r^2} \\frac{\\partial}{\\partial r}\\left(r^2 \\dfrac{\\partial\\ n}{\\partial r}\\right) = 0$\r\n' +
          '$\\Rightarrow \\frac{\\partial}{\\partial r}\\left(r^2 \\dfrac{\\partial\\ n}{\\partial r}\\right)$\r\n' +
          '$\\Rightarrow r^2 \\dfrac{\\partial\\ n}{\\partial r} = A$\r\n' +
          '\r\n' +
          'Une deuxième intégration donne alors $n(r)$.',
        level: 1,
        mixingType: 'RANDOM'
      }
    ],
    '40': [
      {
        questionId: 98,
        explanation: 'url(xdx.png)\r\n' +
          '\r\n' +
          'Bilan du particules entre $x$ et $x+dx$ : la variation du nombre entre $t$ et $t+dt$ est égale à ce qui rentre et sort au niveau des parois + ce qui est créé. Le terme en A est donc du même côté que la dérivée seconde en $x$.',
        level: 4,
        mixingType: 'RANDOM'
      }
    ],
    '41': [
      {
        questionId: 99,
        explanation: "Il s'agit de conditions aux limites de type flux : un apport régulier de particules en $x=0$ se modélise par $j(0,t) = cte$ et une paroi imperméable en $x=L$ se modélise par  $j(L,t) = 0$.",
        level: 3,
        mixingType: 'RANDOM'
      }
    ]
  })
});

test("should return all sectors",async ()=>{
  const task = await getDefaultQuestionsData(8,10);
  console.log(task);
  console.log(task["8"]["5"]["14"])
  console.log(task["8"]["6"]["11"])
  expect(task).toStrictEqual([ { 'COUNT(DISTINCT questionGroupId)': 2382 } ])
});

test("should return all sectors",async ()=>{
  const task = await getSkillQuestions(11,8);
  expect(task).toStrictEqual({
    '11': [
      81, 82, 83, 84, 85, 86,
      87, 88, 90, 91, 92, 93,
      94, 98, 99
    ]
  })
});