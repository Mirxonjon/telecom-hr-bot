import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch'
import { read, write } from './utils/FS.js';
import * as dotenv from 'dotenv'

dotenv.config()
const token = process.env.BOT_TOKEN 

const bot  = new TelegramBot(token, {
    polling: true
  })

  bot.on("error", (e) => console.log(e ))
const url = 'https://marketing.uz/brend-goda-2021/uploads/works/covers/3367084b181cb4ff62d8c85bebe1958b.jpg'

  bot.onText(/\/start/,async msg => {

    const chatId = msg.chat.id
   await bot.sendPhoto(chatId, url  , {parse_mode: 'HTML',
      caption : `
          <b>  Объявляется вакансия на должность
«Оператор Call-Центра» в Службе по
предоставлению услуг аутсорсинга! </b>

<b>Особые требование:</b>
✅ Навыки работы на ПК:  Windows, MS Office, оргтехникой;
✅ Быстрая печать на клавиатуре;
✅ Свободное владение русским и узбекским языком;
(грамматика и устная речь);
✅ Возраст: от 18 до 35 лет;
🕗 График работы 5/2; 
💸 Заработная плата: ~3 600 000;

<b>Удобства:</b>
✅ Официальная работа в офисе;
✅ Надбавки;
✅ Дружественный коллектив;
📍 Адрес: г.Ташкент, Мирабадский р-он, ул.Нукус 87. Ориентир
посольства России;
      `
    }  ,
     )


   await bot.sendMessage(chatId ,  `Assalomu aleykum ${msg.from.first_name} bizning botga hush kelisbsiz , Til Tanlang`,{
    reply_markup: {
        keyboard : [[ '🇷🇺  Русский', `🇺🇿 O'zbekcha`]],
        resize_keyboard : true
    }
    } )
  })

    bot.on('message' , async msg => {
      const ChatId = msg.chat.id 

      if(msg.text == '🇷🇺  Русский' ) {

        const users = await read('users.json')

        const findUser = await users.find(e => e.id == msg.from.id)


        if(findUser){
          findUser.lang = 'ru' || findUser.lang
          const NewUser = await write('users.json' , users)
          if(NewUser){
            bot.sendMessage( ChatId , '💼 Выберите интересующую Вас вакансию' ,{
              reply_markup:{
                keyboard: [['Call-Центр' ,'🇷🇺/🇺🇿 Tilni o\'zgartirish'] ],
                resize_keyboard: true,
                one_time_keyboard : true
              }
            })
    
          }
        } else {  
          users.push({
            id: msg.from.id,
            lang: 'ru'
          })
          const NewUser = await write('users.json' , users)
          if(NewUser){
            bot.sendMessage( ChatId , '💼 Выберите интересующую Вас вакансию' ,{
              reply_markup:{
                keyboard: [['Call-Centr' ,'🇷🇺/🇺🇿 Tilni o\'zgartirish']],
                resize_keyboard: true,
                one_time_keyboard : true
              }
            })
    
          }
        }
     }

    if(msg.text == `🇺🇿 O'zbekcha` ) {
      const users = await read('users.json')
      const findUser = users.find(e => e.id == msg.from.id)
      if(findUser){
        findUser.lang = 'uz' || findUser.lang
        const NewUser = await write('users.json' , users)
      if(NewUser) {

        await  bot.sendMessage( ChatId , '💼 Sizni qiziqtirgan vakansiyani tanlang' ,{
          reply_markup:{
            keyboard: [[`Qo'ng'iroq markazi mutaxassisi` ,'🇷🇺/🇺🇿 Tilni o\'zgartirish']],
            resize_keyboard: true
          }
        })
      }
        
      } else {
        users.push({
          id: msg.from.id,
          lang: 'uz'
        })
        const NewUser = await write('users.json' , users)
      if(NewUser) {

        await  bot.sendMessage( ChatId , '💼 Sizni qiziqtirgan vakansiyani tanlang' ,{
          reply_markup:{
            keyboard: [[`Qo'ng'iroq markazi mutaxassisi`]],
            resize_keyboard: true
          }
        })
      }
      }
    } 
    
    if(msg.text == 'Нажмите кнопку "Отправить", чтобы подтвердить все данные' || msg.text  ==   'Barcha tafsilotlarni tasdiqlash uchun "Yuborish" tugmasini bosing'){
        const findUser = await read('users.json').find(e=> e.id == msg.from.id)
      console.log(findUser.name.toUpperCase());
        const sentData = await fetch('http://192.168.0.167:3445/api/v1/users/create' ,{
          method :'POST',
          headers: { 'Content-Type': 'application/json' } ,
          body: JSON.stringify({
              "id": `${findUser.id}` ,
              "name": await findUser.name.toUpperCase(),
              "was_born": findUser.wasborn,
              "phone": findUser.nomer,
              "address": findUser.address,
              "student": findUser.student == '❌НЕТ' ? 'false' : 'true',
              "lang_ru": findUser.lang_ru,
              "lang_uz": findUser.lang_uz,
              "lang_en": findUser.lang_en,
          }),
        }).then(res => {
          if( res.status == 201) {
            bot.sendMessage(msg.chat.id ,findUser.lang == 'uz' ? `Kompaniyamizga bo'lgan qiziqishingiz uchun tashakkur, siz anketangizni muvaffaqiyatli to'ldirdingiz` : `Благодарим за проявленный интерес нашей компании, Вы успешно заполнили свою анкету` ,{
            reply_markup : {
              keyboard:  findUser.lang == 'uz' ? [[`Qo'ng'iroq markazi mutaxassisi` ,'🇷🇺/🇺🇿 Tilni o\'zgartirish']] :[ ['Call-Центр' ,'🇷🇺/🇺🇿 Tilni o\'zgartirish'] ],
              resize_keyboard: true ,
              one_time_keyboard :true
            }
            })  
          }
        })
        .catch(e => console.log(e))

      
       }
       if(msg.text == `🇷🇺/🇺🇿 Tilni o'zgartirish`) {

        await bot.sendMessage(msg.chat.id ,  `🇷🇺/🇺🇿 Tilni o'zgartirish`,{
          reply_markup: {
              keyboard : [[ '🇷🇺  Русский', `🇺🇿 O'zbekcha`]],
              resize_keyboard : true
          }
          } )
      }
    })
    
    
      bot.on('message' , async msg =>  {
        const ChatId = msg.chat.id 
        if(msg.text == 'Call-Центр' || msg.text == `Qo'ng'iroq markazi mutaxassisi`) {
          const users = await read('users.json')
          const findUser = users.find(e => e.id == msg.from.id)
       
          const dataLang = findUser?.lang
          const sentName = await   bot.sendMessage( ChatId ,
            dataLang == 'uz' ?`👤 Toʻliq ismingizni kiriting (masalan: Ivanov Ivan Ivanovich)`: '👤Введите ФИО  (пример: Иванов Иван Иванович)' ,{
            reply_markup: {
              force_reply : true
            }
           } , ) 
             

              bot.onReplyToMessage(sentName.chat.id, sentName.message_id, async namee => {
                const userDate = await bot.sendMessage(sentName.chat.id,
                  dataLang == 'uz' ?`📅 Tug'ilgan kuningizni kiriting (masalan, dd.MM.yyyy):` : '📅 Укажите дату своего рождения (пример, дд.мм.гггг):', {
                  reply_markup: {
                    force_reply: true
                  }
                })

                bot.onReplyToMessage(userDate.chat.id , userDate.message_id , async date => {
     
                  const userNomer =  await bot.sendMessage(namee.chat.id,
                    dataLang == 'uz' ?`📱 Telefon raqamingizni kiriting (masalan: +998XXXXXXXXX):` : 'Укажите Ваш контактный номер телефона 📱  пример: +998XXXXXXXXX', {
                        reply_markup: {
                          force_reply: true,
                        },
                      })
                    
                  bot.onReplyToMessage(userNomer.chat.id , userNomer.message_id , async nomer => {
                    const addressUser = await bot.sendMessage(nomer.chat.id ,
                      dataLang == 'uz' ?`🏠 Yashash manzili (shahar, tuman, ko'cha/blok)` : '🏠 Адрес проживания (город, район, улица/квартал)' , {
                        reply_markup :{
                          force_reply :true
                        }
                    })
                    bot.onReplyToMessage(addressUser.chat.id , addressUser.message_id , async address => {
                      
                    const userStudent =  await bot.sendMessage(address.chat.id,
                      dataLang == 'uz' ? `Siz talabamisiz?` : '👨‍🎓Вы являетесь студентом?', {
                        reply_markup:  {
                          
                          inline_keyboard: [
                            [{
                                text:   "✅ДА",
                                callback_data: `student::✅ДА`
                              },
                              {
                                text: "❌НЕТ",
                                callback_data: `student::❌НЕТ::`
                              }
                            ],
                          ],
                          one_time_keyboard: true,
                        },
                      })
                      if(userStudent) {
                        findUser.name = namee.text
                        findUser.wasborn = date.text
                        findUser.nomer = nomer.text
                        findUser.address = address.text
                        findUser.job = dataLang == 'uz' ? `Qo'ng'iroq markazi mutaxassisi` : 'CALL-CENTR'
  
                
                        await write('users.json' , users)
                      }
                      
                    })
                      

                  } )


                  
                })

              })
      } 
    
    })

  bot.on('callback_query' , async mesage_Callback => {

    if(mesage_Callback.data.split('::')[0] == 'student'){
      const users = await read('users.json')
      const findUser = users.find(e => e.id ==mesage_Callback.from.id)
      findUser.student =  mesage_Callback.data.split('::')[1]
    
      await write('users.json' , users)


      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `🇺🇿 O'zbek tilini darajangiz qanday? ` : '🇺🇿 Какой у вас уровень узбекского языка?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text:  "Начальный",
                callback_data: `lang_uz::Начальный`
              },
              {
                text: "Средний",
                callback_data: `lang_uz::Средний`
              },
            ],
            [
              {
                text: "Продвинутый",
                callback_data: `lang_uz::Продвинутый`
              },
              {
                text: "Свободный",
                callback_data: `lang_uz::Свободный`
              }
            ]
          ],
          one_time_keyboard: true,
          resize_keyboard: true
          
        },
      })
    }

    if(mesage_Callback.data.split('::')[0] == 'lang_uz'){
      const users = await read('users.json')
      const findUser = users.find(e => e.id ==mesage_Callback.from.id)
      findUser.lang_uz =  mesage_Callback?.data?.split('::')[1]

      await write('users.json' , users)

      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `🇷🇺 Rus tilini bilish darajangiz qanday?` :  '🇷🇺 Какой у вас уровень русского языка?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text: "Начальный",
                callback_data: `lang_ru::Начальный`
              },
              {
                text: "Средний",
                callback_data: `lang_ru::Средний`
              },
            ],
            [
              {
                text: "Продвинутый",
                callback_data: `lang_ru::Продвинутый`
              },
              {
                text: "Свободный",
                callback_data: `lang_ru::Свободный`
              }
            ]
          ],
          one_time_keyboard: true,
          
        },
      })


    }

    if(mesage_Callback.data.split('::')[0] == 'lang_ru'){
      const users = await read('users.json')
      const findUser = users.find(e => e.id == mesage_Callback.from.id)
      findUser.lang_ru =   mesage_Callback?.data?.split('::')[1]

      await write('users.json' , users)

      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `🇺🇸 Ingliz tilini bilish darajangiz qanday?` : '🇺🇸 Какой у вас уровень англиский языка?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text: "Начальный",
                callback_data: `lang_en::Начальный`
              },
              {
                text: "Средний",
                callback_data: `lang_en::Средний`
              },
            ],
            [
              {
                text: "Продвинутый",
                callback_data: `lang_en::Продвинутый`
              },
              {
                text: "Свободный",
                callback_data: `lang_en::Свободный`
              }
            ]
          ],
          one_time_keyboard: true,
          
        },
      })


    }

    if(mesage_Callback.data.split('::')[0] == 'lang_en'){
      const users = await read('users.json')
      const findUser = users.find(e => e.id ==mesage_Callback.from.id)
      findUser.lang_en =  mesage_Callback?.data?.split('::')[1]

      await write('users.json' , users)

      bot.sendMessage(mesage_Callback.message.chat.id , `
      ${findUser.lang == 'uz' ? '<b> 💼 Sizni qiziqtirgan vakansiyani tanlang?:</b>': '<b> 💼 На какую вакансию вы претендуете?:</b>' } ${findUser.job}
      ${findUser.lang == 'uz' ? '<b> To\'liq ismi sharif:</b>': '<b> ФИО:</b>' } ${findUser.name}
      ${findUser.lang == 'uz' ? '<b>📅 Tug\'ilgan sana:</b>': '<b> 📅 Дата рождения:</b>' } ${findUser.wasborn}
      ${findUser.lang == 'uz' ? '<b> 📱Aloqa:</b>': '<b> 📱Контакт:</b>' } ${findUser.nomer}
      ${findUser.lang == 'uz' ? '<b> Manzil:</b>': '<b>  Аддресс:</b>' } ${findUser.address}
      ${findUser.lang == 'uz' ? '<b> Talaba yoki yo\'q: </b>': '<b> Студент или нет:</b>' } ${findUser.student}
      ${findUser.lang == 'uz' ? '<b> 🗣 Rus tilini bilish darajasi?:</b>': '<b> 🗣 Уровень русского языка?:</b>' } ${findUser.lang_ru}
      ${findUser.lang == 'uz' ? '<b> 🗣O\'zbek tili darajasi:</b>': '<b> 🗣Уровень узбекского языка:</b>' } ${findUser.lang_uz}
      ${findUser.lang == 'uz' ? '<b> 🗣 Ingliz tilini bilish darajasi?:</b>': '<b> 🗣Уровень англиского языка:</b>' } ${mesage_Callback.data.split('::')[1]}
      `,{parse_mode : 'HTML',
        reply_markup : {
          keyboard : [[findUser.lang == 'uz' ? 'Barcha tafsilotlarni tasdiqlash uchun "Yuborish" tugmasini bosing' : 'Нажмите кнопку "Отправить", чтобы подтвердить все данные']],
          one_time_keyboard :true,
          resize_keyboard:true
        }
      }
      )
    }
    
    
  })
  
  


