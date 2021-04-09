const kb = require('./keyboard-button')
module.exports = {

    home: [
        [kb.home.action],


    ],

    malumot:
        [
            [kb.malumot.vakansiyalar], [kb.malumot.namuna, kb.malumot.status], [kb.malumot.kantaktlar],


        ],
    giff:
        [
            [kb.giff.videoGiff],
            [kb.back.ortga1]
        ],
    axborot:
        [
            [kb.back.ortga1]
        ],

    kantak: [[
        kb.kantakt.ism
    ], [
        kb.kantakt.kantakt
    ]]


}