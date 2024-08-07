import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import { fetchRedis } from './utils/redis.js';
import createPdf from './utils/pdfExample.js'; 

import puppeteer from 'puppeteer';


dotenv.config()
const token = process.env.BOT_TOKEN 
try {
  process.env["NTBA_FIX_350"] = 1;

const client = await fetchRedis()

const bot  = new TelegramBot(token, {
    polling: true
  })

  bot.getMyCommands([
    {command: "/start", description: "restart bot"}
  ], { scope: {type: "default"}, language_code: "es"});

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
✅ Дружелюбный коллектив;
✅ Карьерный рост;
📍 Адрес: <a href="https://yandex.uz/maps/10335/tashkent/house/YkAYdAFoTkMPQFprfX55dHxmYQ==/?ll=69.268479%2C41.284929&z=19"> г.Ташкент, Мирабадский р-он, ул.Нукус 87. Ориентир
посольства России</a>;`
    }  ,
     )


   await bot.sendMessage(chatId ,  `Здравствуйте  ${msg.from.first_name},  добро пожаловать в наш бот. Выберите язык 🇷🇺/🇺🇿`,{
    reply_markup: {
        keyboard : [[ '🇷🇺  Русский', `🇺🇿 O'zbekcha`]],
        resize_keyboard : true
    }
    } )
  })

    bot.on('message' , async msg => {
      const ChatId = msg.chat.id 
      

      if(msg.text == '🇷🇺  Русский' ) {
        const findUser =await JSON.parse( await client.get(`${ChatId}`))

        if(findUser){

          const UpdateUser  = await client.set(`${ChatId}`, JSON.stringify({
            ...findUser,
            lang: 'ru'
          }))

          if(UpdateUser){
            bot.sendMessage( ChatId , '💼 Выберите интересующую Вас вакансию' ,{
              reply_markup:{
                keyboard: [['Оператор Call-центра' ,'🇷🇺/🇺🇿 Tilni o\'zgartirish'] ],
                resize_keyboard: true,
                one_time_keyboard : true
              }
            })
    
          }
        } else {
          
         const NewUser  = await client.set(`${ChatId}`, JSON.stringify({
            id: msg.from.id,
            lang: 'ru'
          }))
          if(NewUser){
            bot.sendMessage( ChatId , '💼 Выберите интересующую Вас вакансию' ,{
              reply_markup:{
                keyboard: [['Оператор Call-центра' ,'🇷🇺/🇺🇿 Tilni o\'zgartirish']],
                resize_keyboard: true,
                one_time_keyboard : true
              }
            })
    
          }
        }
     }

    if(msg.text == `🇺🇿 O'zbekcha` ) {

      const findUser = await JSON.parse( await client.get(`${ChatId}`))

      if(findUser){

        const UpdateUser  = await client.set(`${ChatId}`, JSON.stringify({
          ...findUser,
          lang: 'uz'
        }))
      if(UpdateUser) {

        await  bot.sendMessage( ChatId , '💼 Sizni qiziqtirgan vakansiyani tanlang' ,{
          reply_markup:{
            keyboard: [[`Aloqa markazi operatori` ,'🇷🇺/🇺🇿 Tilni o\'zgartirish']],
            resize_keyboard: true
          }
        })
      }
        
      } else {

        const NewUser  = await client.set(`${ChatId}`, JSON.stringify({
          id: msg.from.id,
          lang: 'uz'
        }))
      if(NewUser) {

        await  bot.sendMessage( ChatId , '💼 Sizni qiziqtirgan vakansiyani tanlang' ,{
          reply_markup:{
            keyboard: [[`Aloqa markazi operatori` , '🇷🇺/🇺🇿 Tilni o\'zgartirish']],
            resize_keyboard: true
          }
        })
      }
      }
    } 
    if(msg.text == 'Отправить' || msg.text  ==   'Yuborish'){
        const findUser = await JSON.parse( await client.get(`${ChatId}`))
        const loadMessage = await bot.sendMessage(ChatId,findUser.lang == 'uz' ?'Rezyume tayyorlanyapti .' : 'Генерируется резюме .') 
        
        const browser = await puppeteer.launch({ headless: 'new' ,executablePath:'/usr/bin/google-chrome',args: ['--no-sandbox'] } );
        const page = await browser.newPage();
        await page.setContent(createPdf(findUser.image,findUser.name , findUser.nomer , findUser.wasborn , findUser.student , findUser.lang_uz, findUser.lang_ru, findUser.lang_en , findUser.comp ,findUser.address ,findUser.experience ));
        const pdf =  await page.pdf({  format: 'A4'  });
        await browser.close();
        await bot.editMessageText(findUser.lang == 'uz' ?'Rezyume tayyorlanyapti ..' : 'Генерируется резюме ..',{chat_id:loadMessage.chat.id,message_id: loadMessage.message_id})
        const rezsume =  await bot.sendDocument(ChatId ,pdf ,{},{filename : `${findUser.name}.pdf` ,contentType:'image/jpeg'})
        const resume =   await  bot.getFileLink( rezsume.document.file_id) 
        await bot.editMessageText(findUser.lang == 'uz' ?'Rezyume tayyorlanyapti ...' : 'Генерируется резюме ...' ,{chat_id:loadMessage.chat.id,message_id: loadMessage.message_id})
         await fetch('https://apihr.ccenter.uz/api/v1/users/create' ,{
          method :'POST',
          headers: { 'Content-Type': 'application/json' } ,
          body: JSON.stringify({
              "id": `${findUser?.id}` ,
              "name": await findUser?.name?.toUpperCase(),
              "was_born": findUser?.wasborn,
              "phone": findUser?.nomer,
              "address": findUser?.address,
              "student": findUser?.student == '❌НЕТ' ? 'false' : 'true',
              "lang_ru": findUser?.lang_ru,
              "lang_uz": findUser?.lang_uz,
              "lang_en": findUser?.lang_en,
              "comp" : findUser?.comp,
              "image" : findUser.image ,
              "experience" : findUser?.experience,
              "resume" : resume
          }),
        }).then(res => {
          if( res.status == 201) {

            bot.deleteMessage(ChatId ,loadMessage.message_id)
            bot.sendMessage(msg.chat.id ,findUser.lang == 'uz' ? `Kompaniyamizga bildirgan qiziqishingiz uchun tashakkur. Sizga shuni ma’lum qilamizki, ushbu lavozimga arizangiz muvaffaqiyatli qabul qilindi va ko‘rib chiqish jarayonida. ✅

Agar bizning talablarimizga javob bersangiz, Siz bilan suhbat yoki qo‘shimcha ma’lumot olish uchun bog‘lanamiz.` : `
Спасибо за проявленный интерес к нашей компании. Мы хотим сообщить вам, что ваша заявка на вакансию успешно получена и находится в стадии рассмотрения. ✅

Если ваш профиль соответствует нашим ожиданиям, мы свяжемся с вами для проведения собеседования или для дополнительной информации.` ,{
            reply_markup : {
              keyboard:  findUser.lang == 'uz' ? [[`Aloqa markazi operatori` ,'🇷🇺/🇺🇿 Tilni o\'zgartirish']] :[ ['Оператор Call-центра' ,'🇷🇺/🇺🇿 Tilni o\'zgartirish'] ],
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
        if(msg.text == 'Оператор Call-центра' || msg.text == `Aloqa markazi operatori`) {

          const findUser = await JSON.parse( await client.get(`${ChatId}`))

       
          const dataLang = await findUser?.lang
          const sentName = await   bot.sendMessage( ChatId ,
            dataLang == 'uz' ?`👤 Toʻliq ismingizni kiriting (masalan: Mahmudov Alisher Baxodir o'g'li)`: '👤Введите ФИО  (пример: Иванов Иван Иванович)' ,{
            reply_markup: {
              force_reply : true
            }
           } , ) 
             

              bot.onReplyToMessage(sentName.chat.id, sentName.message_id, async namee => {
                const userDate = await bot.sendMessage(sentName.chat.id,
                  dataLang == 'uz' ?`📅 Tug'ilgan kuningizni kiriting (masalan, dd.mm.yyyy)` : '📅 Укажите дату своего рождения (пример: дд.мм.гггг)', {
                  reply_markup: {
                    force_reply: true
                  }
                })

              
                    bot.onReplyToMessage(userDate.chat.id , userDate.message_id , async date => {
                        
                    const userNomer =  await bot.sendMessage(date.chat.id,
                      dataLang == 'uz' ?`📱 Telefon raqamingizni kiriting (masalan: +998XXXXXXXXX)` : '📱 Укажите Ваш контактный номер телефона (пример: +998XXXXXXXXX)', {
                        reply_markup: {
                          force_reply: true,
                        },
                      })
                    
                  bot.onReplyToMessage(userNomer.chat.id , userNomer.message_id , async nomer => {

                    const addressUser = await bot.sendMessage(nomer.chat.id ,
                      dataLang == 'uz' ?`🏠 Yashash manzili (shahar, tuman, ko'cha/blok)` : '🏠 Адрес проживания (пример: город, район, улица/квартал)' , {
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


                         await client.set(`${ChatId}`, JSON.stringify({
                          ...findUser,
                          name : namee.text,
                          wasborn : date.text,
                          nomer : nomer.text ,
                          address : address.text,
                          job : dataLang == 'uz' ? `Qo'ng'iroq markazi mutaxassisi` : 'Оператор Call-Центра'
                        }))

                      }
                      
                    })
                      
                  } )
                  })

                  

              })
      } 

      if(msg.reply_to_message?.text == `🤵/🤵‍♀️ Suratingizni yuboring (telefoningizda selfi olishingiz mumkin)` || msg.reply_to_message?.text == '🤵/🤵‍♀️ Отправьте Ваше фото (можно селфи с телефона)'){

        const findUser = await JSON.parse( await client.get(`${ChatId}`))
           if (msg.photo && msg.photo[3]) {
             const photoLink =   await  bot.getFileLink( msg.photo[3].file_id) 
              
        await client.set(`${ChatId}`, JSON.stringify({
          ...findUser,
          image : photoLink
        }))

        
    await bot.sendMessage(msg.chat.id , `
    ${findUser.lang == 'uz' ? `<b>Ma'lumotlaringizni oldindan ko'rish:</b>` : '<b> Предварительный просмотр ваших данных: </b>'}
    
${findUser.lang == 'uz' ? '<b>💼 Vakansiya nomi:</b>': '<b>💼 Название вакансии:</b>' } ${findUser.job}
${findUser.lang == 'uz' ? '<b>📄 F.I.Sh:</b>': '<b>📄 Ф.И.О:</b>' } ${findUser.name}
${findUser.lang == 'uz' ? '<b>📅 Tug\'ilgan sana:</b>': '<b> 📅 Дата рождения:</b>' } ${findUser.wasborn}
${findUser.lang == 'uz' ? '<b>📱 Aloqa:</b>': '<b> 📱Контакт:</b>' } ${findUser.nomer}
${findUser.lang == 'uz' ? '<b>📍 Manzil:</b>': '<b>📍 Адресс:</b>' } ${findUser.address}
${findUser.lang == 'uz' ? '<b>🎓 Talabamisiz?: </b>': '<b>🎓 Вы студент?:</b>' } ${findUser.student}
${findUser.lang == 'uz' ? '<b>🇺🇿 O\'zbek tili darajasi:</b>': '<b>🇺🇿 Уровень узбекского языка:</b>' } ${findUser.lang_uz}
${findUser.lang == 'uz' ? '<b>🇷🇺 Rus tilini bilish darajasi:</b>': '<b>🇷🇺 Уровень русского языка:</b>' } ${findUser.lang_ru}
${findUser.lang == 'uz' ? '<b>🇺🇸 Ingliz tilini bilish darajasi:</b>': '<b>🇺🇸 Уровень англиского языка:</b>' } ${findUser.lang_en}
${findUser.lang == 'uz' ? '<b>💻 Kompyuterni bilish darajasi:</b>': '<b>💻Уровень знания компьютера:</b>' } ${findUser.comp}
${findUser.lang == 'uz' ? '<b>💼 Ish tajribangiz: </b>': '<b>💼 Опыт работы: </b>' } ${findUser.experience}

${findUser.lang == 'uz' ? `Barcha tafsilotlarni tasdiqlash uchun <b>"Yuborish"</b> tugmasini bosing`  : `Нажмите кнопку <b>"Отправить"</b>, чтобы подтвердить все данные` }
    `,{parse_mode : 'HTML',
      reply_markup : {
        keyboard : [[findUser.lang == 'uz' ? 'Yuborish' : 'Отправить']],
        one_time_keyboard :true,
        resize_keyboard:true
      }
    }
    )
  }else {

    await bot.sendMessage(ChatId , findUser.lang == 'uz' ? 'Rasm sifati past yoki noto\'g\'ri formatda yukladingiz' : 'Вы отправили фотографию низкого качество или не правильный формат файла.')

    await bot.sendMessage(ChatId , 
      findUser.lang == 'uz' ? '🤵/🤵‍♀️ Suratingizni yuboring (telefoningizda selfi olishingiz mumkin)' : '🤵/🤵‍♀️ Отправьте Ваше фото (можно селфи с телефона)',{
        reply_markup:{
          force_reply: true
        }
      }
      )
  }

      }
    
    })
  bot.on('callback_query' , async mesage_Callback => {
      const ChatId = mesage_Callback.from.id
      const  msg_call =  mesage_Callback.data.split('::')[0]
      bot.answerCallbackQuery(mesage_Callback.id, {
        cache_time: 1.0,
      }).then( async()=> {

    if(msg_call == 'student'){

      const findUser =await JSON.parse( await client.get(`${ChatId}`))
     
      await client.set(`${ChatId}`, JSON.stringify({
        ...findUser,
       student :  mesage_Callback.data.split('::')[1]
      }))



      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `🇺🇿 O'zbek tilini darajangiz qanday? ` : '🇺🇿 Какой у вас уровень узбекского языка?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text:  "1: Начальный",
                callback_data: `lang_uz::Начальный`
              },
              {
                text: "2: Средний",
                callback_data: `lang_uz::Средний`
              },
            ],
            [
              {
                text: "3: Продвинутый",
                callback_data: `lang_uz::Продвинутый`
              },
              {
                text: "4: Свободный",
                callback_data: `lang_uz::Свободный`
              }
            ]
          ],
          one_time_keyboard: true,
          resize_keyboard: true
          
        },
      })
    }

    if(msg_call == 'lang_uz'){

      const findUser = await JSON.parse( await client.get(`${ChatId}`))
     
      await client.set(`${ChatId}`, JSON.stringify({
        ...findUser,
        lang_uz :  mesage_Callback.data.split('::')[1]
      }))

      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `🇷🇺 Rus tilini bilish darajangiz qanday?` :  '🇷🇺 Какой у вас уровень русского языка?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text: "1: Начальный",
                callback_data: `lang_ru::Начальный`
              },
              {
                text: "2: Средний",
                callback_data: `lang_ru::Средний`
              },
            ],
            [
              {
                text: "3: Продвинутый",
                callback_data: `lang_ru::Продвинутый`
              },
              {
                text: "4: Свободный",
                callback_data: `lang_ru::Свободный`
              }
            ]
          ],
          one_time_keyboard: true,
          
        },
      })


    }

    if(msg_call == 'lang_ru'){


      const findUser = await JSON.parse( await client.get(`${ChatId}`))
     
      await client.set(`${ChatId}`, JSON.stringify({
        ...findUser,
        lang_ru :  mesage_Callback.data.split('::')[1]
      }))

      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `🇺🇸 Ingliz tilini bilish darajangiz qanday?` : '🇺🇸 Какой у вас уровень англиский языка?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text: "1: Начальный",
                callback_data: `lang_en::Начальный`
              },
              {
                text: "2: Средний",
                callback_data: `lang_en::Средний`
              },
            ],
            [
              {
                text: "3: Продвинутый",
                callback_data: `lang_en::Продвинутый`
              },
              {
                text: "4: Свободный",
                callback_data: `lang_en::Свободный`
              }
            ]
          ],
          one_time_keyboard: true,
          
        },
      })

    }

    if(msg_call == 'lang_en'){


      const findUser = await JSON.parse( await client.get(`${ChatId}`))
     
      await client.set(`${ChatId}`, JSON.stringify({
        ...findUser,
        lang_en :  mesage_Callback.data.split('::')[1]
      }))

      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `💻 Kompyuterni bilish darajangiz qanday?` :  '💻 Какой у вас уровень знания компьютера?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text: "1: Начальный",
                callback_data: `comp::Начальный`
              },
              {
                text: "2: Средний",
                callback_data: `comp::Средний`
              },
            ],
            [
              {
                text: "3: Продвинутый",
                callback_data: `comp::Продвинутый`
              },
              {
                text: "4: Свободный",
                callback_data: `comp::Свободный`
              }
            ]
          ],
          one_time_keyboard: true,
          
        },
      })
    }


    if(msg_call == 'comp'){

      const findUser = await JSON.parse( await client.get(`${ChatId}`))
     
      await client.set(`${ChatId}`, JSON.stringify({
        ...findUser,
        comp :  mesage_Callback.data.split('::')[1]
      }))


      await bot.sendMessage(mesage_Callback.message.chat.id,
        findUser.lang == 'uz' ? `💼 Sizning ish tajribangiz qanday?` :  '💼 Ваш опыт работы?', {
        reply_markup:  {
          inline_keyboard: [
            [{
                text: "0-6мес",
                callback_data: `experience::0-6мес`
              },
              {
                text: "6мес-1год",
                callback_data: `experience::6мес-1год`
              },
            ],
            [
              {
                text: "1год-3год",
                callback_data: `experience::1год-3год`
              },
              {
                text: "3год+",
                callback_data: `experience::3год+`
              }
            ]
          ],
          one_time_keyboard: true,
          
        },
      })

      
    }

    if(msg_call == 'experience'){
      const findUser = await JSON.parse( await client.get(`${ChatId}`))
     
      await client.set(`${ChatId}`, JSON.stringify({
        ...findUser,
        experience : mesage_Callback.data.split('::')[1]
      }))
      
        bot.sendMessage(ChatId , 
          findUser.lang == 'uz' ? '🤵/🤵‍♀️ Suratingizni yuboring (telefoningizda selfi olishingiz mumkin)' : '🤵/🤵‍♀️ Отправьте Ваше фото (можно селфи с телефона)',{
            reply_markup:{
              force_reply: true
            }
          }
          )

    }
  })
    
  })

  
  
} catch (error) {
  console.log(error);
}