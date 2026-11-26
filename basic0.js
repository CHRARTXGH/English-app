/* Lecciones · Basic 0 (Workbook E4CC). Esquema de una lección:
   {id, level, title, icon,
    vocab:[[en,es],…]   → tarjetas + quiz automático (mín. 4 pares)
    exercises:[…]       → choice{q,options,answer} · fill{q,answer|[alternativas]} · order{q,answer} · scramble{hint,answer}
    tasks:['texto',…]}  → tareas con casilla y notas */
(function(){
const L='Basic 0',G=['Good morning','Good afternoon','Good evening','Good night'];
const ch=(q,options,answer)=>({type:'choice',q,options,answer}),fi=(q,answer)=>({type:'fill',q,answer}),od=(q,answer)=>({type:'order',q,answer}),sc=(hint,answer)=>({type:'scramble',hint,answer});
E4CC.addLesson({id:'saludos-numeros',level:L,title:'Saludos y números',icon:'hand',
 vocab:[['Good morning','Buenos días'],['Good afternoon','Buenas tardes'],['Good evening','Buenas noches'],['Good night','Buenas noches (adiós)'],['Zero','Cero'],['One','Uno'],['Two','Dos'],['Three','Tres'],['Four','Cuatro'],['Five','Cinco'],['Six','Seis'],['Seven','Siete'],['Eight','Ocho'],['Nine','Nueve'],['Ten','Diez'],['Twenty','Veinte'],['Thirty','Treinta'],['Forty','Cuarenta'],['Fifty','Cincuenta'],['Sixty','Sesenta'],['Seventy','Setenta'],['Eighty','Ochenta'],['Ninety','Noventa'],['One hundred','Cien']],
 exercises:[ch('Son las 6:00 a. m. ¿Qué saludo usas?',G,G[0]),ch('Son las 12:45 p. m. ¿Qué saludo usas?',G,G[1]),ch('Son las 6:45 p. m. y atardece. ¿Qué saludo usas?',G,G[2]),ch('Son las 11:30 p. m. y te vas a dormir. ¿Qué dices?',G,G[3]),
  fi('Escribe en inglés: 36','thirty six'),fi('Escribe en inglés: 71','seventy one'),fi('Escribe en inglés: 28','twenty eight'),fi('Escribe en inglés: 100','one hundred')]});
E4CC.addLesson({id:'colores-comida',level:L,title:'Colores, frutas y comida',icon:'apple',
 vocab:[['Blue','Azul'],['Red','Rojo'],['Yellow','Amarillo'],['Green','Verde'],['Orange','Naranja'],['Pink','Rosa'],['Purple','Morado'],['Black','Negro'],['White','Blanco'],['Apple','Manzana'],['Grapes','Uvas'],['Banana','Banana'],['Strawberry','Fresa'],['Watermelon','Sandía'],['Pineapple','Piña'],['Cherry','Cereza'],['Pizza','Pizza'],['Hamburger','Hamburguesa'],['Sushi','Sushi'],['Chicken','Pollo'],['Salad','Ensalada'],['Soup','Sopa'],['Sandwich','Emparedado'],['French fries','Papas fritas']],
 exercises:[...['apple','pineapple','umbrella','student','airport','hamburger'].map(w=>ch(`Completa con a / an: ___ ${w}`,['a','an'],/^[aeiou]/.test(w)?'an':'a')),
  sc('sandía','watermelon'),sc('fresa','strawberry'),sc('cereza','cherry'),
  ch('___ is an apple. (está cerca)',['This','That','These','Those'],'This'),ch('___ are grapes. (están lejos)',['This','That','These','Those'],'Those'),
  fi('Traduce: Estas son uvas.','These are grapes'),fi('Traduce: Esa es una manzana.','That is an apple'),
  od('Ordena la pregunta','What is your favorite color?'),od('Ordena la respuesta','My favorite food is pizza.')]});
E4CC.addLesson({id:'familia',level:L,title:'Familia, mascotas y adjetivos',icon:'users',
 vocab:[['Father','Papá'],['Mother','Mamá'],['Grandfather','Abuelo'],['Grandmother','Abuela'],['Son','Hijo'],['Daughter','Hija'],['Parents','Padres'],['Aunt','Tía'],['Uncle','Tío'],['Sister','Hermana'],['Brother','Hermano'],['Cousin','Primo/a'],['Dog','Perro'],['Cat','Gato'],['Turtle','Tortuga'],['Rabbit','Conejo'],['Fish','Pez'],['Parrot','Loro'],['Funny','Gracioso'],['Strong','Fuerte'],['Friendly','Amistoso'],['Shy','Tímido'],['Honest','Honesto'],['Hardworking','Trabajador']],
 exercises:[ch('___ name is Liz. (ella)',['His','Her'],'Her'),ch('___ name is Luis. (él)',['His','Her'],'His'),
  ch('Is he your dad? (sí)',['Yes, he is!','Yes, she is!','Yes, they are!'],'Yes, he is!'),ch('Are they friends? (no)',['No, they aren’t!','No, he isn’t!','No, she isn’t!'],'No, they aren’t!'),
  fi('Is your mom’s name Claudia? Yes, ___ is.','it'),
  od('Ordena la pregunta','Where is he from?'),od('Ordena la respuesta','He is from Brazil.'),od('Ordena la pregunta','How old is she?'),od('Ordena la respuesta','She is my sister.'),
  ch('Elige la oración correcta',['Where is you brother from?','Where is your brother from?'],'Where is your brother from?')],
 tasks:['Escribe 5 oraciones sobre un familiar: su nombre, de dónde es, cuántos años tiene, cómo es y su comida favorita.','Habla de ese familiar en voz alta con: His/Her name is…, He/She is from…, He/She is … years old.']});
E4CC.addLesson({id:'cuerpo-profesiones',level:L,title:'Cuerpo y profesiones',icon:'user',
 vocab:[['Head','Cabeza'],['Shoulder','Hombro'],['Arm','Brazo'],['Stomach','Estómago'],['Hand','Mano'],['Knee','Rodilla'],['Leg','Pierna'],['Foot','Pie'],['Hair','Cabello'],['Eyes','Ojos'],['Ears','Orejas'],['Nose','Nariz'],['Mouth','Boca'],['Neck','Cuello'],['Student','Estudiante'],['Doctor','Doctor'],['Teacher','Maestro'],['Engineer','Ingeniero/a'],['Lawyer','Abogado'],['First','Primero'],['Second','Segundo'],['Third','Tercero']],
 exercises:[fi('This is a ___ (cabeza)','head'),fi('This is an ___ (brazo)','arm'),fi('This is a ___ (estómago)','stomach'),sc('rodilla','knee'),sc('nariz','nose'),
  ch('Enseña en una escuela:',['Teacher','Lawyer','Doctor','Engineer'],'Teacher'),ch('Defiende a las personas en un juicio:',['Teacher','Lawyer','Doctor','Student'],'Lawyer'),
  fi('Escribe en inglés: 2.º','second'),fi('Escribe en inglés: 3.º','third')]});
E4CC.addLesson({id:'to-be-precios',level:L,title:'Verbo to be y precios',icon:'dollar',
 exercises:[ch('___ you 27 years old?',['Are','Is','Am'],'Are'),ch('The price of the books ___ $70.',['is','are','am'],'is'),ch('I ___ 15 years old.',['am','is','are'],'am'),
  ch('Is your name Jorge? No, ___!',['it isn’t','it am not','I isn’t'],'it isn’t'),fi('Nice to meet you ___!','too'),fi('Traduce: Tengo 20 años.',['I am 20 years old','I’m 20 years old']),
  ch('Thank you!',['You’re welcome!','Nice to meet you!','Good night!'],'You’re welcome!'),
  od('Ordena la pregunta','How much is the phone?'),od('Ordena la respuesta','It is $75.'),od('Ordena la pregunta','Where are you from?'),od('Ordena la respuesta','I am from Mexico.')],
 tasks:['Preséntate en voz alta (Tell me about yourself): saludo, nombre, edad, país, ocupación y color favorito.','Practica las 16 preguntas de entrevista del workbook. Meta: 30 segundos, 8 oraciones, 0 errores.']});
})();
