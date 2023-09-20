const createPdf = (img,name , nomer , was_born ,student , uzb ,rus ,ang ,comp ,addres , opt) => {

 return `
 <!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Hr bot CV ui</title>
     <link rel="stylesheet" href="./styles.css" />
     <link
       href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
       rel="stylesheet"
     />
     <style>
     *,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Ubuntu', sans-serif;
}

.main {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  display: block;
  margin: 0 auto;
  border-radius: 5px;
  margin-top: 50px;
}

.top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  border-radius: 5px 5px 0 0;
  background-color: #F8F7F3;
}

.top-content img {
  width: 250px;
  height: 250px;
  object-fit: cover;
  margin-right: 50px;
}



.title-wrapper h1 {
  color: #5E4736;
  font-size: 32px;
  text-align: center;
}

.title-wrapper hr {
  margin: 20px 0;
  padding: 1px;
  background-color: #AE7E5E;
}

.title-wrapper p {
  color: #6B4C3A;
  font-size: 20px;
  letter-spacing: 5px;
  text-transform: uppercase;
  text-align: center;
}

.bottom-content {
  background-color: #fff;
  padding: 50px;
  border-radius: 0 0 5px 5px;
}

.bottom-content div {
  margin-bottom: 30px;
}

.bottom-content div h5{
  font-size: 24px;
}
.bottom-content div p{
  font-size: 18px;
}
     </style>
   </head>
   <body>
     <main class="main">
       <div class="top-content">
         <img
           src=${img}
           alt="av image"
         />
         <div class="title-wrapper">
           <h1>${name}</h1>
           <hr />
           <p>Оператор</p>
         </div>
       </div>
       <hr />
       <div class="bottom-content">
         <div class="contact">
           <h5>Контакты</h5>
           <p>${nomer}</p>
         </div>
         <div class="about">
           <h5>О себе</h5>
           <p>Дата рождение: <span><b>${was_born}</b></span></p> 
           <p>	Является ли студентом?: <span><b>${student == '❌НЕТ' ? 'Нет' : 'Да'}</b></span></p> 
 
           <p>Уровень узбекского языка: <span><b>${uzb}</b></span></p>
           <p>Уровень русского  языка: <span><b>${rus}</b></span></p>
           <p>Уровень английского  языка: <span><b>${ang}</b></span></p>
           <p>Уровень знания компьютера: <span><b>${comp}</b></span></p>
         </div>
         <div class="address">
           <h5>Адрес</h5>
           <p>${addres}</p>
         </div>
         <div class="address">
           <h5>Опыт работы</h5>
           <p>${opt}</p>
         </div>
       </div>
     </main>
   </body>
 </html>
 
 `
}
export default createPdf