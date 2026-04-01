import View from '../../../engine/utils/view'
import Route from '../../../engine/utils/route'
import DateTime from '../utils/datetime/DateTime'
import Builder from '../../../engine/utils/builder'

export default class Calendar extends View {
    public constructor(paths: string | string[]) {
        super(paths, document => {
            console.log(DateTime.getWeeks())
            const day = new Date()
            const start = new Date(day.getFullYear(), day.getMonth(), 1)
            const end = new Date(day.getFullYear(), day.getMonth() + 1, 0)
            return new Builder({
                tag: 'table', children: [
                    new Builder({
                        tag: 'thead',
                        children: [
                            new Builder({
                                tag: 'th',
                                child: 'Domingo',
                            }),
                            new Builder({
                                tag: 'th',
                                child: 'Segunda-feira',
                            }),
                            new Builder({
                                tag: 'th',
                                child: 'Terça-feira',
                            }),
                            new Builder({
                                tag: 'th',
                                child: 'Quarta-feira',
                            }),
                            new Builder({
                                tag: 'th',
                                child: 'Quinta-feira',
                            }),
                            new Builder({
                                tag: 'th',
                                child: 'Sexta-feira',
                            }),
                            new Builder({
                                tag: 'th',
                                child: 'Sábado',
                            }),
                        ],
                    }),
                    new Builder({
                        tag: 'tbody',
                        children: [
                            new Builder({
                                tag: 'tr',
                                children: [
                                    new Builder({
                                        tag: 'td',
                                        child: '1',
                                    }),
                                    new Builder({
                                        tag: 'td',
                                        child: '2',
                                    }),
                                    new Builder({
                                        tag: 'td',
                                        child: '3',
                                    }),
                                    new Builder({
                                        tag: 'td',
                                        child: '4',
                                    }),
                                    new Builder({
                                        tag: 'td',
                                        child: '5',
                                    }),
                                    new Builder({
                                        tag: 'td',
                                        child: '6',
                                    }),
                                    new Builder({
                                        tag: 'td',
                                        child: '7',
                                    }),
                                ],
                            })
                        ],
                    })
                ]
            })
        })
    }
}