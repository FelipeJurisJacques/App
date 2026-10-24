import ElizaKeywordEntry from '../type/ElizaKeywordEntry'

export default class PtBrData {
  public elizaPres: string[]
  public elizaPosts: string[]
  public elizaQuits: string[]
  public elizaFinals: string[]
  public elizaInitials: string[]
  public elizaKeywords: ElizaKeywordEntry[]
  public elizaSynons: Record<string, string[]>
  public elizaPostTransforms: (string | RegExp)[]

  constructor() {
    this.elizaInitials = [
      "Olá, como você está?",
      "Há algo te preocupando?",
      "Por favor, me diga o que tem te incomodado.",
      "Olá. Por favor, conte-me qual é o seu problema.",
    ]
    this.elizaQuits = [
      "sair",
      "adeus",
      "chega",
      "tchau",
      "pronto",
      "obrigado",
      "desistir",
    ];
    this.elizaFinals = [
      "Até logo.",
      "Foi bom conversar com você.",
      "Esta foi realmente uma boa conversa.",
      "Estou ansioso pela nossa próxima sessão.",
      "Esta foi uma boa sessão, não foi? Foi bom conversar com você.",
      "Talvez possamos discutir mais na nossa próxima sessão? Até logo."
    ];
    this.elizaSynons = {
      "ser": [
        "sou",
        "é",
        "são",
        "era",
        "fui",
      ],
      "acreditar": [
        "sinto",
        "penso",
        "acho",
        "creio",
        "desejo",
      ],
      "nao_poder": [
        "não consigo",
        "nao consigo",
      ],
      "desejar": [
        "quero",
        "preciso",
        "gostaria",
      ],
      "todos": [
        "todo mundo",
        "ninguém",
        "nenhum",
      ],
      "familia": [
        "vô",
        "vó",
        "vo",
        "avo",
        "avô",
        "avó",
        "mãe",
        "mae",
        "pai",
        "tio",
        "tia",
        "irmã",
        "irma",
        "filho",
        "filha",
        "irmão",
        "irmao",
        "esposa",
        "filhos",
      ],
      "feliz": [
        "alegre",
        "contente",
        "melhor",
      ],
      "triste": [
        "infeliz",
        "deprimido",
        "doente",
      ],
      "confronto": [
        "odeio",
        "brigo",
        "brigar",
        "discuto",
        "discutir",
        "confrontar",
      ],
    };
    this.elizaKeywords = [
      ["xnone", 0, [
        ["*", [
          "Por favor, continue.",
          "Entendo. Me conte mais.",
          "Conte-me mais sobre isso.",
          "O que isso sugere a você?",
          "Falar sobre isso te incomoda?",
          "Isso é interessante. Por favor, continue.",
          "Como você sente sobre discutir tais coisas?",
          "Não tenho certeza se entendi você completamente.",
        ]]
      ]],
      ["desculpe", 0, [
        ["*", [
          "Por favor, não peça desculpas.",
          "Desculpas não são necessárias.",
          "Isso não me incomodou. Por favor, continue.",
          "Já lhe disse que desculpas não são exigidas.",
        ]]
      ]],
      ["desculpar", 0, [
        ["*", [
          "goto desculpe"
        ]]
      ]],
      ["lembro", 5, [
        ["* eu lembro *", [
          "Você pensa frequentemente em (2)?",
          "Pensar em (2) traz mais alguma coisa à mente?",
          "De que mais você se recorda?",
          "Por que você se lembra de (2) justamente agora?",
          "O que na situação atual te lembra de (2)?",
          "Qual é a conexão entre mim e (2)?",
          "De que mais (2) te lembra?"
        ]],
        ["* você lembra *", [
          "Você achou que eu esqueceria (2)?",
          "Por que você acha que eu deveria recordar (2) agora?",
          "E quanto a (2)?",
          "goto o_que",
          "Você mencionou (2)?"
        ]],
        ["* tu lembras *", [
          "Como eu poderia esquecer (2)?",
          "O que sobre (2) eu deveria lembrar?",
          "goto voce"
        ]]
      ]],
      ["esqueço", 5, [
        ["* eu esqueço *", [
          "Você consegue pensar por que poderia esquecer (2)?",
          "Por que você não consegue lembrar de (2)?",
          "Com que frequência você pensa em (2)?",
          "Te incomoda esquecer isso?",
          "Poderia ser um bloqueio mental?",
          "Você é geralmente esquecido?",
          "Você acha que está reprimindo (2)?"
        ]],
        ["* você esqueceu *", [
          "Por que você pergunta?",
          "Você tem certeza de que me contou?",
          "Te incomodaria se eu esquecesse (2)?",
          "Por que eu deveria recordar (2) justamente agora?",
          "goto o_que",
          "Conte-me mais sobre (2)."
        ]]
      ]],
      ["se", 3, [
        ["* se *", [
          "Você acha provável que (2)?",
          "Você deseja que (2)?",
          "O que você sabe sobre (2)?",
          "Realmente, se (2)?",
          "O que você faria se (2)?",
          "Mas quais são as chances de (2)?",
          "Aonde essa especulação leva?"
        ]]
      ]],
      ["sonhei", 4, [
        ["* eu sonhei *", [
          "Realmente, (2)?",
          "Você já fantasiou (2) enquanto estava acordado?",
          "Você já tinha sonhado com (2) antes?",
          "goto sonho"
        ]]
      ]],
      ["sonho", 3, [
        ["*", [
          "O que esse sonho sugere a você?",
          "Você sonha frequentemente?",
          "Quais pessoas aparecem nos seus sonhos?",
          "Você acredita que os sonhos têm algo a ver com o seu problema?"
        ]]
      ]],
      ["talvez", 0, [
        ["*", [
          "Você não parece muito certo.",
          "Por que esse tom de incerteza?",
          "Você não pode ser mais positivo?",
          "Você não tem certeza?",
          "Você não sabe?",
          "Qual probabilidade você estimaria?"
        ]]
      ]],
      ["nome", 15, [
        ["*", [
          "Não estou interessado em nomes.",
          "Já lhe disse antes, não me importo com nomes -- por favor, continue."
        ]]
      ]],
      ["ingles", 0, [
        ["*", [
          "goto xestrangeiro",
          "Já lhe disse antes, não entendo inglês."
        ]]
      ]],
      ["frances", 0, [
        ["*", [
          "goto xestrangeiro",
          "Já lhe disse antes, não entendo francês."
        ]]
      ]],
      ["italiano", 0, [
        ["*", [
          "goto xestrangeiro",
          "Já lhe disse antes, não entendo italiano."
        ]]
      ]],
      ["espanhol", 0, [
        ["*", [
          "goto xestrangeiro",
          "Já lhe disse antes, não entendo espanhol."
        ]]
      ]],
      ["xestrangeiro", 0, [
        ["*", [
          "Eu falo apenas português."
        ]]
      ]],
      ["ola", 0, [
        ["*", [
          "Olá. Por favor, declare o seu problema.",
          "Oi. Qual parece ser o seu problema?"
        ]]
      ]],
      ["computador", 50, [
        ["*", [
          "Computadores te preocupam?",
          "Por que você menciona computadores?",
          "O que você acha que máquinas têm a ver com o seu problema?",
          "Você não acha que computadores podem ajudar as pessoas?",
          "O que te preocupa nas máquinas?",
          "O que você pensa sobre máquinas?",
          "Você não acha que eu sou um programa de computador, acha?"
        ]]
      ]],
      ["sou", 0, [
        ["* eu sou *", [
          "Você acredita que é (2)?",
          "Você gostaria de ser (2)?",
          "Você gostaria que eu dissesse que você é (2)?",
          "O que significaria se você fosse (2)?",
          "goto o_que"
        ]],
        ["*", [
          "Por que você diz 'sou'?",
          "Eu não entendo isso."
        ]]
      ]],
      ["e", 0, [
        ["* você é *", [
          "Por que você está interessado se eu sou (2) ou não?",
          "Você preferiria que eu não fosse (2)?",
          "Talvez eu seja (2) nas suas fantasias.",
          "Você às vezes acha que eu sou (2)?",
          "goto o_que",
          "Isso importaria para você?",
          "E se eu fosse (2)?"
        ]],
        ["* eles são *", [
          "Você achou que eles poderiam não ser (2)?",
          "Você gostaria que eles não fossem (2)?",
          "E se eles não fossem (2)?",
          "Eles são sempre (2)?",
          "Possivelmente eles são (2).",
          "Você tem certeza de que eles são (2)?"
        ]]
      ]],
      ["seu", 0, [
        ["* seu *", [
          "Por que você está preocupado com o meu (2)?",
          "E quanto ao seu próprio (2)?",
          "Você está preocupado com o (2) de outra pessoa?",
          "Realmente, o meu (2)?",
          "O que faz você pensar no meu (2)?",
          "Você quer o meu (2)?"
        ]]
      ]],
      ["era", 2, [
        ["* eu era *", [
          "E se você fosse (2)?",
          "Você acha que era (2)?",
          "Você era (2)?",
          "O que significaria se você fosse (2)?",
          "O que ' (2) ' sugere a você?",
          "goto o_que"
        ]],
        ["* você era *", [
          "Você gostaria de acreditar que eu era (2)?",
          "O que sugere que eu era (2)?",
          "O que você acha?",
          "Talvez eu fosse (2).",
          "E se eu tivesse sido (2)?"
        ]]
      ]],
      ["eu", 0, [
        ["* eu @desejar *", [
          "O que significaria para você se conseguisse (3)?",
          "Por que você quer (3)?",
          "Suponha que você conseguisse (3) em breve.",
          "E se você nunca conseguisse (3)?",
          "O que conseguir (3) significaria para você?",
          "O que desejar (3) tem a ver com esta discussão?"
        ]],
        ["* eu sou* @triste *", [
          "Sinto muito em ouvir que você está (3).",
          "Você acha que vir aqui ajudará você a não ficar (3)?",
          "Tenho certeza de que não é agradável estar (3).",
          "Você pode explicar o que te deixou (3)?"
        ]],
        ["* eu sou* @feliz *", [
          "Como eu te ajudei a ficar (3)?",
          "Seu tratamento te deixou (3)?",
          "O que te deixa (3) justamente agora?",
          "Você pode explicar por que está subitamente (3)?"
        ]],
        ["* eu era *", [
          "goto era"
        ]],
        ["* eu @acreditar eu *", [
          "Você realmente pensa assim?",
          "Mas você não tem certeza de que (3).",
          "Você realmente duvida que (3)?"
        ]],
        ["* eu* @acreditar *você *", [
          "goto voce"
        ]],
        ["* eu sou *", [
          "É porque você é (2) que veio até mim?",
          "Há quanto tempo você é (2)?",
          "Você acredita que é normal ser (2)?",
          "Você gosta de ser (2)?",
          "Você conhece mais alguém que seja (2)?"
        ]],
        ["* eu @nao_poder *", [
          "Como você sabe que não consegue (3)?",
          "Você tentou?",
          "Talvez você pudesse (3) agora.",
          "Você realmente quer ser capaz de (3)?",
          "E se você pudesse (3)?"
        ]],
        ["* eu não *", [
          "Você realmente não (2)?",
          "Por que você não (2)?",
          "Você deseja ser capaz de (2)?",
          "Isso te incomoda?"
        ]],
        ["* eu sinto *", [
          "Conte-me mais sobre esses sentimentos.",
          "Você sente (2) frequentemente?",
          "Você gosta de sentir (2)?",
          "De que sentir (2) te lembra?"
        ]],
        ["* eu * você *", [
          "Talvez nas suas fantasias nós (2) um ao outro.",
          "Você deseja me (2)?",
          "Você parece precisar me (2).",
          "Você (2) mais alguém?"
        ]],
        ["* eu @confronto *", [
          "Se sente bem com isso?",
          "Como você se sente nessa situação?",
        ]],
        ["*", [
          "Você diz (1)?",
          "Você pode elaborar isso?",
          "Você diz (1) por algum motivo especial?",
          "Isso é bastante interessante."
        ]]
      ]],
      ["voce", 0, [
        ["* você me lembra *", [
          "goto parecido"
        ]],
        ["* você é *", [
          "O que faz você pensar que eu sou (2)?",
          "Te agrada acreditar que eu sou (2)?",
          "Você às vezes deseja ser (2)?",
          "Talvez você gostaria de ser (2)."
        ]],
        ["* você* me *", [
          "Por que você acha que eu te (2)?",
          "Você gosta de pensar que eu te (2) -- não gosta?",
          "O que faz você pensar que eu te (2)?",
          "Realmente, eu te (2)?",
          "Você deseja acreditar que eu te (2)?",
          "Suponha que eu te (2) -- o que isso significaria?",
          "Alguém mais acredita que eu te (2)?"
        ]],
        ["* você *", [
          "Estávamos discutindo sobre você -- não sobre mim.",
          "Ah, eu (2)?",
          "Você não está realmente falando de mim -- está?",
          "Quais são os seus sentimentos agora?"
        ]]
      ]],
      ["sim", 0, [
        ["*", [
          "Você parece ser bastante positivo.",
          "Você tem certeza.",
          "Entendo.",
          "Compreendo."
        ]]
      ]],
      ["nao", 0, [
        ["* ninguém *", [
          "Você tem certeza de que ninguém (2)?",
          "Certamente alguém (2).",
          "Você consegue pensar em qualquer pessoa?",
          "Você está pensando em uma pessoa muito especial?",
          "Quem, posso perguntar?",
          "Você tem uma pessoa específica em mente, não tem?",
          "De quem você acha que está falando?"
        ]],
        ["*", [
          "Você está dizendo não apenas para ser negativo?",
          "Você está sendo um pouco negativo.",
          "Por que não?",
          "Por que 'não'?"
        ]]
      ]],
      ["meu", 2, [
        ["$ * meu *", [
          "Isso tem algo a ver com o fato de que o seu (2)?",
          "Vamos discutir mais sobre por que o seu (2).",
          "Anteriormente você disse que o seu (2).",
          "Mas o seu (2)."
        ]],
        ["* meu* @familia *", [
          "Conte-me mais sobre a sua família.",
          "Quem mais na sua família (4)?",
          "O seu (3)?",
          "O que mais vem à sua mente quando você pensa no seu (3)?"
        ]],
        ["* meu *", [
          "O seu (2)?",
          "Por que você diz o seu (2)?",
          "Isso sugere mais alguma coisa que pertença a você?",
          "É importante para você que o seu (2)?"
        ]]
      ]],
      ["pode", 0, [
        ["* você pode *", [
          "Você acredita que eu posso (2), não é?",
          "goto o_que",
          "Você quer que eu seja capaz de (2).",
          "Talvez você mesmo gostaria de ser capaz de (2)."
        ]],
        ["* eu posso *", [
          "Se você pode ou não (2) depende mais de você do que de mim.",
          "Você quer ser capaz de (2)?",
          "Talvez você não queira (2).",
          "goto o_que"
        ]]
      ]],
      ["o_que", 0, [
        ["*", [
          "Por que você pergunta?",
          "Essa questão te interessa?",
          "O que você realmente quer saber?",
          "Tais questões ocupam muito a sua mente?",
          "Qual resposta te agradaria mais?",
          "O que você acha?",
          "O que vem à sua mente quando você pergunta isso?",
          "Você já fez essas perguntas antes?",
          "Você já perguntou a mais alguém?"
        ]]
      ]],
      ["quem", 0, [
        ["quem *", [
          "goto o_que"
        ]]
      ]],
      ["quando", 0, [
        ["quando *", [
          "goto o_que"
        ]]
      ]],
      ["onde", 0, [
        ["onde *", [
          "goto o_que"
        ]]
      ]],
      ["como", 0, [
        ["como *", [
          "goto o_que"
        ]]
      ]],
      ["porque", 0, [
        ["*", [
          "Essa é a verdadeira razão?",
          "Nenhuma outra razão vem à mente?",
          "Essa razão parece explicar mais alguma coisa?",
          "Quais outras razões poderiam existir?"
        ]]
      ]],
      ["por_que", 0, [
        ["* por que você não *", [
          "Você acredita que eu não (2)?",
          "Talvez eu (2) no momento certo.",
          "Você deveria (2) a si mesmo?",
          "Você quer que eu (2)?",
          "goto o_que"
        ]],
        ["* por que eu não posso *", [
          "Você acha que deveria ser capaz de (2)?",
          "Você quer ser capaz de (2)?",
          "Você acredita que isso te ajudará a (2)?",
          "Você tem alguma ideia de por que não pode (2)?",
          "goto o_que"
        ]],
        ["*", [
          "goto o_que"
        ]]
      ]],
      ["todos", 2, [
        ["* @todos *", [
          "Realmente, (2)?",
          "Certamente não (2).",
          "Você consegue pensar em alguém em particular?",
          "Quem, por exemplo?",
          "Você está pensando em uma pessoa muito especial?",
          "Quem, posso perguntar?",
          "Alguém especial talvez?",
          "Você tem uma pessoa específica em mente, não tem?",
          "De quem você acha que está falando?"
        ]]
      ]],
      ["sempre", 1, [
        ["*", [
          "Você consegue pensar em um exemplo específico?",
          "Quando?",
          "De qual incidente você está pensando?",
          "Realmente, sempre?"
        ]]
      ]],
      ["parecido", 10, [
        ["*", [
          "De que maneira?",
          "Que semelhança você vê?",
          "O que essa similaridade sugere a você?",
          "Que outras conexões você vê?",
          "O que você supõe que essa semelhança signifique?",
          "Qual é a conexão, você supõe?",
          "Poderia realmente haver alguma conexão?",
          "Como?"
        ]]
      ]],
      ["como", 10, [
        ["* @ser *como *", [
          "goto parecido"
        ]]
      ]],
      ["diferente", 0, [
        ["*", [
          "Como é diferente?",
          "Que diferenças você vê?",
          "O que essa diferença sugere a você?",
          "Que outras distinções você vê?",
          "O que você supõe que essa disparidade signifique?",
          "Poderia haver alguma conexão, você supõe?",
          "Como?",
        ]]
      ]]
    ]
    this.elizaPres = [
      "era",
      "nao",
      "não",
      "sim",
      "eram",
      "tu é",
      "pode",
      "igual",
      "sonho",
      "quiça",
      "eu sou",
      "voce é",
      "você é",
      "lembro",
      "lembro",
      "sonhei",
      "sonhou",
      "sonhos",
      "talvez",
      "similar",
      "lembrar",
      "maquina",
      "recordo",
      "maquinas",
      "parecido",
      "recordar",
      "identico",
      "conseguir",
      "certamente",
      "computador",
      "equivalente",
      "computadores",
      "computadorizado",
    ];
    this.elizaPosts = [
      "é",
      "eu",
      "me",
      "te",
      "ti",
      "tu",
      "sou",
      "seu",
      "sua",
      "meu",
      "mim",
      "você",
      "voce",
      "tu é",
      "eu sou",
      "você é",
      "voce é",
    ]
    this.elizaPostTransforms = [
      / velho velho/g, " velho",
      /\beles eram( não)? eu\b/g, "foi$1 eu",
      /\beles são( não)? eu\b/g, "é$1 eu",
      /São eles( sempre)? eu\b/, "é$1 eu",
      /\bque o seu( próprio)? (\w+)( agora)? \?/, "que você tem o seu$1 $2?",
      /\beu ter (\w+)/, "eu tenho $1",
      /Anteriormente você disse o seu( próprio)? (\w+)( agora)?\./, "Anteriormente você falou sobre o seu $2.",
    ];
  }
}
