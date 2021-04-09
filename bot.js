const telegraf = require('telegraf')
const config = require('./config')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const Scene = require('telegraf/scenes/base')
const keyboard = require('./keyboard')
const Markup = require('telegraf/markup');
const translation = require('./translation')
const stage = new Stage()
const { stringify } = require('querystring')
const { leave } = Stage
const axios = require('axios')
const { response } = require('express')
const bot = new telegraf.Telegraf(config.TOKEN)
const resumeLink = new Scene('resumeLink')
stage.register(resumeLink)
const fullName = new Scene('fullName')
stage.register(fullName)
const check = new Scene('check')
stage.register(check)
const phone = new Scene('phone')
stage.register(phone)
const address = new Scene('address')
stage.register(address)
const location = new Scene('location')
stage.register(location)
const destination = new Scene('destination')
stage.register(destination)

const email = new Scene('email')
stage.register(email)

const date_needed = new Scene('date_needed')
stage.register(date_needed)

const login_email = new Scene('login_email')
stage.register(login_email)

const file_url = new Scene('file_url')
stage.register(file_url)

const title = new Scene('title')
stage.register(title)

bot.use(session())
bot.use(stage.middleware())
console.log('Bot is running...')
bot.telegram.setMyCommands([{
    command: "/start",
    description: "Ботни ишга тушириш"
}
])
bot.use((ctx, next) => {
    next(ctx);
})

bot.command('start', (ctx) => {
    sendStartMessage(ctx)
})

bot.hears(['Бош меню','Главное меню'], (ctx) => {
    sendStartMessage(ctx)
})

function sendStartMessage(ctx) {
    return ctx.reply(`
    Ассалому алайкум / Здравствуйте, ${ctx.message.from.first_name}!\n
Тилни танланг/Выберите язык:
    `,
        Markup.inlineKeyboard([
            Markup.callbackButton('🇺🇿O\'zbekcha', 'uz'),
            Markup.callbackButton('🇷🇺Русский', 'ru')
        ]).extra()
    )
}

bot.action(['uz', 'ru'], (ctx) => {
    ctx.deleteMessage();
    if (ctx.match === 'uz' || ctx.match === 'ru') {
        ctx.session.language = ctx.match === 'uz' ? 'uz' : 'ru';
        ctx.answerCbQuery(translation[ctx.session.language].you_choose_language);
        axios.post(`https://api.telegram.org/bot1718724778:AAGk89eSNejWOaWasfyC2I1HuGtCJXDBVBs/getChatMember?chat_id=@bb2academy&user_id=${ctx.chat.id}`)
                        .then((response) => {
                            if(response.data.result.status==='left'){
                                reg(ctx)
                            }else{
                                after_reg(ctx)
                            }
                        }, (error) => {
                            //ctx.reply("User topilmadi")
                            reg(ctx)
                        });
    returnMain(ctx);
    }
});
function after_reg(ctx){
    ctx.reply(translation[ctx.session.language].end_bot,
    {
        parse_mode: 'Markdown'
    })
}
function reg(ctx){
    ctx.reply(
        translation[ctx.session.language].hello,
        { reply_markup: { keyboard: [[{ text: translation[ctx.session.language].phone_number, request_contact: true }]], resize_keyboard: true, one_time_keyboard: true } }
        )
        ctx.scene.enter('phone')
        phone.on('text', async (ctx) => {
            var regex2 = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            ctx.session.input = ctx.message.text

            ctx.session.phoneArray = ctx.session.input.split("+")
            ctx.session.phone = " "

            if (ctx.session.phoneArray.length == 1) {
                ctx.session.phone = ctx.session.phoneArray.join(" ")
            } else {
                ctx.session.phoneArray.shift()
                ctx.session.phone = ctx.session.phoneArray.join(" ")
            }
            if (regex2.test(ctx.session.phone === false)) {
                ctx.reply(
                    translation[ctx.session.language].send_phone_number_correctly,
                    {
                        reply_markup: { keyboard: [[{ text: translation[ctx.session.language].phone_number, request_contact: true }]], resize_keyboard: true, one_time_keyboard: true }
                    }
                )
                ctx.scene.enter('phone')
            } else if (ctx.session.phone.length < 9 || ctx.session.phone.length > 13) {
                ctx.reply(
                    translation[ctx.session.language].send_phone_number_correctly,
                    {
                        reply_markup: { keyboard: [[{ text: translation[ctx.session.language].phone_number, request_contact: true }]], resize_keyboard: true, one_time_keyboard: true }
                    }
                )
                ctx.scene.enter('phone')
            } else {

                ctx.reply(
                    translation[ctx.session.language].check_user,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: translation[ctx.session.language].text_bb2ga_azo_bolish,
                                    url: "https://t.me/bb2academy"
                                }],
                                [{
                                    text: translation[ctx.session.language].button_azo_boldim,
                                    callback_data: "bolish"
                                }]]
                        }
                    }
                )
                    await ctx.scene.leave('phone')
                    
                    bot.action('bolish', ctx=>{
                        axios.post(`https://api.telegram.org/bot1718724778:AAGk89eSNejWOaWasfyC2I1HuGtCJXDBVBs/getChatMember?chat_id=@bb2academy&user_id=${ctx.chat.id}`)
                        .then((response) => {
                            if(response.data.result.status==='member'|| response.data.result.status==='administrator'){
                                ctx.deleteMessage()
                                bot.telegram.sendSticker(ctx.chat.id,'CAACAgIAAxkBAAECJoRgbdJwk6IgL55Pk9JLJeOCFUSHDgACUgADO2AkFEndYaMOmpblHgQ')
                                ctx.reply(translation[ctx.session.language].text_success,{
                                    reply_markup: {
                                        inline_keyboard: [[{text: translation[ctx.session.language].enter_name, callback_data: 'enter_ism'}]]
                                    }
                                })
                                bot.action('enter_ism', ctx=>{
                                    ctx.reply(
                                        translation[ctx.session.language].type_your_name,
                                        { reply_markup: { remove_keyboard: true } }
                                        )
                                    ctx.scene.enter('fullName')
                                    fullName.on('text', async (ctx) => {
                                        ctx.session.fullname = ctx.message.text
                                        ctx.session.username=ctx.session.fullname
                                        var regex = /^[a-zA-Zа-яА-ЯЁё\s]+$/;
                                        if (regex.test(ctx.session.fullname) === false) {
                                            ctx.reply(
                                                translation[lang].enter_your_name_correctly,
                                                {
                                                    reply_markup: { remove_keyboard: true }
                                                })
                                            ctx.scene.enter('fullName')
                                        } else if (ctx.message.text.length < 4) {
                                            ctx.reply(
                                                translation[lang].enter_your_name_correctly,
                                                {
                                                    reply_markup: { remove_keyboard: true }
                                                })
                                            ctx.scene.enter('fullName')
                                        }else {
  
                                            let mes=`User-id: ${ctx.chat.id}\n`+`${ctx.session.fullname}\n` +`${ctx.session.phone}`
                                            bot.telegram.sendMessage(-531697977, mes)
                                            ctx.reply(translation[ctx.session.language].end_bot,
                                            {
                                                parse_mode: 'Markdown'
                                            })
                                            await ctx.scene.leave('fullName')
                                        }
                                    })
                                })
                            }else if(response.data.result.status==='left'){
                                ctx.deleteMessage()
                                ctx.reply(translation[ctx.session.language].rejoin_to_channel,{
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{
                                                text: translation[ctx.session.language].text_bb2ga_azo_bolish,
                                                url: "https://t.me/bb2academy"
                                            }],
                                            [{
                                                text: translation[ctx.session.language].button_azo_boldim,
                                                callback_data: "bolish"
                                            }]]
                                    }
                                })
                            }else{
                                ctx.reply("Nimadir nimadir")
                            }
                        }, (error) => {
                            ctx.reply("User topilmadi")
                        });
                    })
            }
        })

        phone.on('contact', async (ctx) => {
            ctx.session.input = ctx.message.contact.phone_number
            ctx.session.phoneArray = ctx.session.input.split("+")
            ctx.session.phone = " "

            if (ctx.session.phoneArray.length == 1) {
                ctx.session.phone = ctx.session.phoneArray.join(" ")
            } else {
                ctx.session.phoneArray.shift()
                ctx.session.phone = ctx.session.phoneArray.join(" ")
            }

            ctx.reply(
                translation[ctx.session.language].check_user,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: translation[ctx.session.language].text_bb2ga_azo_bolish,
                                url: "https://t.me/bb2academy"
                            }],
                            [{
                                text: translation[ctx.session.language].button_azo_boldim,
                                callback_data: "bolish"
                            }]]
                    }
                }
            )
                await ctx.scene.leave('phone')
                    bot.action('bolish', ctx=>{
                        axios.post(`https://api.telegram.org/bot1718724778:AAGk89eSNejWOaWasfyC2I1HuGtCJXDBVBs/getChatMember?chat_id=@bb2academy&user_id=${ctx.chat.id}`)
                        .then((response) => {
                            if(response.data.result.status==='member'){
                                ctx.deleteMessage()
                                bot.telegram.sendSticker(ctx.chat.id,'CAACAgIAAxkBAAECJoRgbdJwk6IgL55Pk9JLJeOCFUSHDgACUgADO2AkFEndYaMOmpblHgQ')
                                ctx.reply(translation[ctx.session.language].text_success,{
                                    reply_markup: {
                                        inline_keyboard: [[{text: translation[ctx.session.language].enter_name, callback_data: 'enter_ism1'}]]
                                    }
                                })
                                bot.action('enter_ism1', ctx=>{
                                    ctx.reply(
                                        translation[ctx.session.language].type_your_name,
                                        { reply_markup: { remove_keyboard: true } }
                                        )
                                    ctx.scene.enter('fullName')
                                    fullName.on('text', async (ctx) => {
                                        ctx.session.fullname = ctx.message.text
                                        ctx.session.username=ctx.session.fullname
                                        var regex = /^[a-zA-Zа-яА-ЯЁё\s]+$/;
                                        if (regex.test(ctx.session.fullname) === false) {
                                            ctx.reply(
                                                translation[lang].enter_your_name_correctly,
                                                {
                                                    reply_markup: { remove_keyboard: true }
                                                })
                                            ctx.scene.enter('fullName')
                                        } else if (ctx.message.text.length < 4) {
                                            ctx.reply(
                                                translation[lang].enter_your_name_correctly,
                                                {
                                                    reply_markup: { remove_keyboard: true }
                                                })
                                            ctx.scene.enter('fullName')
                                        }else {
                                            let mes=`User-id: ${ctx.chat.id}\n`+`Ism: ${ctx.session.fullname}\n` +`Raqam: ${ctx.session.phone}`
                                            bot.telegram.sendMessage(-531697977, mes)
                                            ctx.reply(translation[ctx.session.language].end_bot,
                                            {
                                                parse_mode: 'Markdown'
                                            })
                                            await ctx.scene.leave('fullName')
                                        }
                                    })
                                })
                            }else if(response.data.result.status==='left'){
                                ctx.deleteMessage()
                                ctx.reply(translation[ctx.session.language].rejoin_to_channel,{
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{
                                                text: translation[ctx.session.language].text_bb2ga_azo_bolish,
                                                url: "https://t.me/bb2academy"
                                            }],
                                            [{
                                                text: translation[ctx.session.language].button_azo_boldim,
                                                callback_data: "bolish"
                                            }]]
                                    }
                                })
                            }else{
                                ctx.reply("Nimadir nimadir")
                            }
                        }, (error) => {
                            ctx.reply("User topilmadi")
                        });
                    })           
        })
}


function returnMain(ctx) {
    const lang = ctx.session.language;
    return lang
}

bot.hears(['🇺🇿 Сменить язык', 'Tilni o\'zgartiring 🇷🇺'], async (ctx) => {
    ctx.session.language = ctx.session.language === 'uz' ? 'ru' : 'uz';
    returnMain(ctx);
})

bot.startPolling();