import { extraLessons } from './extra-lessons.js';
const writingExamples = {
  "1": "My name is Mali.",
  "2": "I am happy.",
  "3": "I work in an office.",
  "4": "Every day, I read a book.",
  "5": "I would like a cup of tea, please.",
  "6": "I like music.",
  "7": "I can speak English.",
  "8": "I like tea because it tastes good.",
  "9": "Where do you live?",
  "10": "Today, I am free.",
  "11": "Can I pay by card?",
  "12": "Go straight and turn left.",
  "13": "I would like a coffee, please.",
  "14": "Let's meet at three.",
  "15": "It is sunny today.",
  "16": "I have a headache.",
  "17": "Yesterday, I visited my friend.",
  "18": "I am going to travel next month.",
  "19": "This is cheaper than that.",
  "20": "I have a reservation under the name Mali.",
  "21": "Hello Ben, Thank you for your message. Our meeting is on Monday at nine. Best regards, Mali.",
  "22": "I think this is a good idea.",
  "23": "Can I leave a message?",
  "24": "I would like a return ticket."
};
const lesson = (id, icon, title, subtitle, goal, words, examples, grammar, practice) => ({
  id, icon, title, subtitle, goal, words, examples, grammar, practice, minutes: 12,
});

export const lessons = [
  lesson(1, "👋", "ทักทายและแนะนำตัว", "Hello! My name is…", "ทักทาย บอกชื่อ และถามชื่อคนอื่นได้",
    [["hello","สวัสดี","เฮล-โล"],["name","ชื่อ","เนม"],["my","ของฉัน","มาย"],["your","ของคุณ","ยัวร์"],["nice","ยินดี / ดี","ไนซ์"],["meet","พบ","มีท"]],
    [["Hello! My name is Mali.","สวัสดี ฉันชื่อมะลิ","เฮล-โล! มาย เนม อิส มา-ลี"],["What is your name?","คุณชื่ออะไร","ว็อท อิส ยัวร์ เนม"],["Nice to meet you.","ยินดีที่ได้รู้จัก","ไนซ์ ทู มีท ยู"]],
    "<b>My name</b> คือ “ชื่อของฉัน” ตามด้วย <b>is</b> เพื่อเชื่อมกับชื่อ ส่วนคำถามวาง <b>What</b> ไว้หน้า เพราะเราถามว่า “อะไร”",
    {"listen":"What is your name?","choices":["คุณชื่ออะไร","คุณอยู่ที่ไหน","คุณสบายดีไหม"],"answer":0,"arrange":["name","My","is","Mali."],"arranged":"My name is Mali.","fill":["Nice to "," you."],"blank":"meet","read":"Hello! My name is Nida. I am from Thailand. Nice to meet you.","question":"ผู้พูดชื่ออะไร?","readChoices":["Mali","Yuri","Nida"],"readAnswer":2,"write":"My name is","accepts":["my name is","i am","i’m"]}),
  lesson(2, "🧩", "ประธานและ am / is / are", "I am / He is / You are", "เลือก am / is / are ให้ตรงกับ I / You / We / They / He / She / It ได้",
    [["I","ฉัน","ไอ"],["you","คุณ / พวกคุณ","ยู"],["we","พวกเรา","วี"],["they","พวกเขา","เดย์"],["he","เขา (ผู้ชาย)","ฮี"],["she","เธอ (ผู้หญิง)","ชี"],["it","มัน / สิ่งนั้น","อิท"],["am","เป็น / อยู่ / คือ","แอม"],["is","เป็น / อยู่ / คือ","อิส"],["are","เป็น / อยู่ / คือ","อาร์"]],
    [["I am happy.","ฉันมีความสุข","ไอ แอม แฮพ-พี"],["You are kind.","คุณใจดี","ยู อาร์ ไคนด์"],["We are friends.","พวกเราเป็นเพื่อนกัน","วี อาร์ เฟรนด์ส"],["They are students.","พวกเขาเป็นนักเรียน","เดย์ อาร์ สตู-เดินท์ส"],["He is ready.","เขาพร้อมแล้ว","ฮี อิส เรด-ดี"],["She is kind.","เธอใจดี","ชี อิส ไคนด์"],["It is a bag.","มันคือกระเป๋าหนึ่งใบ","อิท อิส อะ แบก"]],
    "<b>I → am</b><br><b>He / She / It → is</b><br><b>You / We / They → are</b><br>ชื่อคนหรือสิ่งเดียวใช้ is เช่น Mali is happy. หลายคนใช้ are เช่น Mali and Tom are friends. แม้ you หมายถึงคนเดียวก็ใช้ are<br>ภาษาไทยอาจไม่พูดคำว่า “เป็น” เช่น “ฉันมีความสุข” แต่ภาษาอังกฤษต้องมี am: I am happy. ไม่ใช่ I happy.",
    {"listen":"She is kind.","choices":["คุณใจดี","เธอใจดี","พวกเขามีความสุข"],"answer":1,"arrange":["ready.","is","He"],"arranged":"He is ready.","fill":["It "," a bag."],"blank":"is","read":"I am Mali. He is Tom. She is Nida. We are students.","question":"Mali, Tom และ Nida เป็นอะไร?","readChoices":["นักเรียน","ครู","เพื่อนบ้าน"],"readAnswer":0,"write":"I am","accepts":["i am","we are","they are"]}),
  lesson(3, "💼", "อาชีพและการทำงาน", "I work in an office.", "บอกอาชีพและสถานที่ทำงานของตนเองได้",
    [["work","ทำงาน","เวิร์ก"],["teacher","ครู","ทีช-เชอร์"],["office","สำนักงาน","ออฟ-ฟิศ"],["hospital","โรงพยาบาล","ฮอส-พิ-ทัล"],["shop","ร้านค้า","ช็อป"],["at","ที่","แอท"]],
    [["I am a teacher.","ฉันเป็นครู","ไอ แอม อะ ทีช-เชอร์"],["I work in an office.","ฉันทำงานในสำนักงาน","ไอ เวิร์ก อิน แอน ออฟ-ฟิศ"],["She works at a hospital.","เธอทำงานที่โรงพยาบาล","ชี เวิร์กส์ แอท อะ ฮอส-พิ-ทัล"]],
    "เมื่อบอกอาชีพของคนเดียวใช้ <b>am / is / are + a / an + อาชีพ</b> เช่น I am a teacher. และ She is an engineer. หลายคนใช้คำนามพหูพจน์โดยไม่ใส่ a/an เช่น We are teachers.<br>เมื่อบอกที่ทำงาน <b>I / you / we / they + work</b> แต่ <b>he / she / it + works</b> ต้องเติม -s ใช้วลีสถานที่ตามบริบท เช่น <b>in an office</b> (ทำงานในสำนักงาน) และ <b>at a hospital</b> (ทำงานที่โรงพยาบาล)",
    {"listen":"I work in an office.","choices":["ฉันไปสำนักงาน","ฉันชอบสำนักงาน","ฉันทำงานในสำนักงาน"],"answer":2,"arrange":["work","I","a shop.","at"],"arranged":"I work at a shop.","fill":["I am a ","."],"blank":"teacher","read":"Som is a cook. He works at a small restaurant.","question":"Som ทำงานที่ไหน?","readChoices":["โรงพยาบาล","ร้านอาหาร","โรงเรียน"],"readAnswer":1,"write":"I work","accepts":["i work","i am a"]}),
  lesson(4, "☀️", "กิจวัตรประจำวัน", "My day, one step at a time", "เล่ากิจกรรมประจำวันที่ทำเป็นประจำได้",
    [["wake up","ตื่นนอน","เวค อัพ"],["eat","กิน","อีท"],["go","ไป","โก"],["morning","ตอนเช้า","มอร์-นิง"],["evening","ตอนเย็น","อีฟ-นิง"],["every day","ทุกวัน","เอฟ-รี เดย์"]],
    [["I wake up at seven.","ฉันตื่นเจ็ดโมง","ไอ เวค อัพ แอท เซเว่น"],["I go to work every day.","ฉันไปทำงานทุกวัน","ไอ โก ทู เวิร์ก เอฟ-รี เดย์"],["I read in the evening.","ฉันอ่านหนังสือตอนเย็น","ไอ รีด อิน ดิ อีฟ-นิง"]],
    "กิจวัตรใช้ <b>present simple</b>: I + wake up + at seven. เมื่อประธานเป็น he / she / it กริยามักเติม -s เช่น She reads every day.<br><b>at + เวลา</b> เช่น at seven, <b>in the morning / evening</b> บอกช่วงวัน และ <b>go to work</b> คือไปทำงาน โดย to ชี้ปลายทาง",
    {"listen":"I wake up at seven.","choices":["ฉันตื่นเจ็ดโมง","ฉันนอนเจ็ดโมง","ฉันทำงานเจ็ดโมง"],"answer":0,"arrange":["to work","I","every day.","go"],"arranged":"I go to work every day.","fill":["I read in the ","."],"blank":"evening","read":"I wake up at six. I eat breakfast and go to work.","question":"ผู้พูดทำอะไรหลังอาหารเช้า?","readChoices":["อ่านหนังสือ","นอน","ไปทำงาน"],"readAnswer":2,"write":"Every day, I","accepts":["every day","i wake","i go","i eat"]}),
  lesson(5, "🍜", "อาหารและการสั่งอาหาร", "I would like…", "สั่งอาหารและเครื่องดื่มอย่างสุภาพได้",
    [["food","อาหาร","ฟูด"],["water","น้ำ","วอ-เทอร์"],["rice","ข้าว","ไรซ์"],["menu","เมนู","เมน-ยู"],["please","กรุณา","พลีซ"],["would like","ต้องการ (สุภาพ)","วูด ไลก์"]],
    [["I would like rice, please.","ขอข้าวค่ะ/ครับ","ไอ วูด ไลก์ ไรซ์ พลีซ"],["Can I see the menu?","ขอดูเมนูได้ไหม","แคน ไอ ซี เดอะ เมน-ยู"],["Water, please.","ขอน้ำค่ะ/ครับ","วอ-เทอร์ พลีซ"]],
    "<b>I would like + สิ่งที่ต้องการ</b> เป็นวิธีขออย่างสุภาพ เช่น rice หรือ water ซึ่งในบริบทนี้ไม่ต้องมี a หากขอหนึ่งอย่างของคำนามนับได้ใช้ a / an เช่น a sandwich ถ้าหลายชิ้นใช้จำนวนและพหูพจน์ เช่น two sandwiches เติม <b>please</b> ท้ายประโยคได้<br>ถ้าขอทำบางอย่างใช้ <b>I would like to + กริยารูปเดิม</b> เช่น I would like to order.",
    {"listen":"Water, please.","choices":["ขออาหารค่ะ/ครับ","ขอน้ำค่ะ/ครับ","ขอเมนูค่ะ/ครับ"],"answer":1,"arrange":["like","I would","rice,","please."],"arranged":"I would like rice, please.","fill":["Can I see the ","?"],"blank":"menu","read":"Aom is at a café. She would like tea and a sandwich.","question":"Aom ต้องการอะไร?","readChoices":["ชาและแซนด์วิช","น้ำและข้าว","กาแฟและเค้ก"],"readAnswer":0,"write":"I would like","accepts":["i would like","can i have","please"]}),
  lesson(6, "💚", "สิ่งที่ชอบและไม่ชอบ", "I like music.", "บอกความชอบและถามความชอบของผู้อื่นได้",
    [["like","ชอบ","ไลก์"],["love","ชอบมาก / รัก","เลิฟ"],["do not like","ไม่ชอบ","ดู น็อท ไลก์"],["music","ดนตรี","มิว-สิก"],["movie","ภาพยนตร์","มู-วี"],["hobby","งานอดิเรก","ฮอบ-บี"]],
    [["I like music.","ฉันชอบดนตรี","ไอ ไลก์ มิว-สิก"],["I do not like coffee.","ฉันไม่ชอบกาแฟ","ไอ ดู น็อท ไลก์ คอฟ-ฟี"],["Do you like movies?","คุณชอบหนังไหม","ดู ยู ไลก์ มู-วีส์"]],
    "<b>I / you / we / they + like</b> แต่ <b>he / she / it + likes</b> เช่น Ben likes music.<br>ปฏิเสธใช้ <b>do not + like</b> หรือ <b>does not + like</b> สำหรับ he / she / it คำถามใช้ <b>Do you like…?</b> หรือ <b>Does she like…?</b> หลัง do / does กริยากลับเป็น like ไม่เติม -s",
    {"listen":"Do you like movies?","choices":["คุณดูหนังที่ไหน","หนังเริ่มเมื่อไร","คุณชอบหนังไหม"],"answer":2,"arrange":["like","I","music."],"arranged":"I like music.","fill":["I do not "," coffee."],"blank":"like","read":"Ben likes music, but he does not like movies.","question":"Ben ไม่ชอบอะไร?","readChoices":["ดนตรี","ภาพยนตร์","หนังสือ"],"readAnswer":1,"write":"I like","accepts":["i like","i love","i do not like"]}),
  lesson(7, "✨", "I want / I need / I can", "บอกความต้องการและความสามารถ", "ใช้ want, need และ can ในสถานการณ์ใกล้ตัวได้",
    [["want","อยาก / ต้องการ","วอนท์"],["need","จำเป็นต้อง / ต้องการ","นีด"],["can","สามารถ","แคน"],["help","ความช่วยเหลือ / ช่วย","เฮลป์"],["buy","ซื้อ","บาย"],["speak","พูด","สปีค"]],
    [["I want to go home.","ฉันอยากกลับบ้าน","ไอ วอนท์ ทู โก โฮม"],["I need help.","ฉันต้องการความช่วยเหลือ","ไอ นีด เฮลป์"],["I can speak English.","ฉันพูดภาษาอังกฤษได้","ไอ แคน สปีค อิง-ลิช"]],
    "<b>want to + กริยารูปเดิม</b> คืออยากทำบางอย่าง เช่น want to go ส่วน <b>need + คำนาม</b> คือจำเป็นต้องใช้สิ่งนั้น รวมทั้งคำอย่าง help และ <b>need to + กริยา</b> คือจำเป็นต้องทำ เช่น need to rest<br><b>can + กริยารูปเดิม</b> บอกความสามารถ ไม่เติม to หรือ -s เช่น He can speak English.",
    {"listen":"I need help.","choices":["ฉันต้องการความช่วยเหลือ","ฉันช่วยคุณได้","ฉันอยากกลับบ้าน"],"answer":0,"arrange":["can","English.","I","speak"],"arranged":"I can speak English.","fill":["I want "," go home."],"blank":"to","read":"Nok wants to buy food. She needs money, but she can pay by card.","question":"Nok อยากทำอะไร?","readChoices":["กลับบ้าน","พูดอังกฤษ","ซื้ออาหาร"],"readAnswer":2,"write":"I can","accepts":["i can","i want to","i need"]}),
  lesson(8, "🔗", "and / but / because", "เชื่อมความคิดให้ยาวขึ้น", "เชื่อมประโยคด้วย and, but และ because ได้",
    [["and","และ","แอนด์"],["but","แต่","บัท"],["because","เพราะว่า","บี-คอส"],["with","กับ / ด้วย","วิธ"],["to","ไปยัง / เพื่อ","ทู"],["for","สำหรับ","ฟอร์"]],
    [["I like tea and coffee.","ฉันชอบชาและกาแฟ","ไอ ไลก์ ที แอนด์ คอฟ-ฟี"],["I want to go out, but I am tired.","ฉันอยากออกไปข้างนอก แต่ฉันเหนื่อย","ไอ วอนท์ ทู โก เอาต์ บัท ไอ แอม ไทเอิร์ด"],["I study because I want to travel.","ฉันเรียนเพราะอยากเดินทาง","ไอ สตัด-ดี บี-คอส ไอ วอนท์ ทู แทรฟ-เวิล"]],
    "<b>and</b> เพิ่มข้อมูล, <b>but</b> เชื่อมข้อมูลที่ต่างกัน และ <b>because + ประธาน + กริยา</b> บอกเหตุผล เช่น I study because I want to travel. คำเหล่านี้ช่วยเชื่อมคำหรือความคิดตามหน้าที่ ไม่ใช้ because ตามด้วยคำนามอย่างเดียวในโครงสร้างนี้",
    {"listen":"I study because I want to travel.","choices":["ฉันเรียนแต่ไม่อยากเดินทาง","ฉันเรียนเพราะอยากเดินทาง","ฉันเรียนและทำงาน"],"answer":1,"arrange":["tired.","but","I am","I want to go,"],"arranged":"I want to go, but I am tired.","fill":["Tea "," coffee, please."],"blank":"and","read":"May walks to work because it is near, but she takes a bus when it rains.","question":"ทำไม May เดินไปทำงาน?","readChoices":["เพราะอยู่ใกล้","เพราะฝนตก","เพราะไม่มีรถ"],"readAnswer":0,"write":"I like","accepts":["and","but","because"]}),
  lesson(9, "❓", "คำถามพื้นฐาน", "what / where / when / how / who / why", "สร้างและตอบคำถามข้อมูลพื้นฐานได้",
    [["what","อะไร","ว็อท"],["where","ที่ไหน","แวร์"],["when","เมื่อไร","เว็น"],["how","อย่างไร","ฮาว"],["who","ใคร","ฮู"],["why","ทำไม","วาย"]],
    [["What is your name?","คุณชื่ออะไร","ว็อท อิส ยัวร์ เนม"],["Where do you work?","คุณทำงานที่ไหน","แวร์ ดู ยู เวิร์ก"],["How are you?","คุณเป็นอย่างไรบ้าง","ฮาว อาร์ ยู"],["When do you start work?","คุณเริ่มทำงานเมื่อไร","เว็น ดู ยู สตาร์ท เวิร์ก"],["Who is your teacher?","ใครเป็นครูของคุณ","ฮู อิส ยัวร์ ทีช-เชอร์"],["Why do you study English?","ทำไมคุณเรียนภาษาอังกฤษ","วาย ดู ยู สตัด-ดี อิง-ลิช"],["Who works here?","ใครทำงานที่นี่","ฮู เวิร์กส์ เฮียร์"]],
    "เลือกคำถามให้ตรงสิ่งที่อยากรู้: <b>what</b> อะไร, <b>where</b> ที่ไหน, <b>when</b> เมื่อไร, <b>how</b> อย่างไร, <b>who</b> ใคร, <b>why</b> ทำไม<br>คำถาม present simple แบบที่ระบุประธานแล้วใช้ <b>คำถาม + do / does + ประธาน + กริยารูปเดิม</b> เช่น Where do you work? ถ้าใช้ verb to be วาง am / is / are หน้าประธาน เช่น What is your name? ไม่เติม do<br>ถ้า <b>Who เป็นประธาน</b> ถามว่าใครเป็นคนทำ ใช้ Who + กริยา เช่น <b>Who works here?</b> ไม่เติม do/does ในคำถามแบบปกตินี้",
    {"listen":"Where do you work?","choices":["คุณทำงานเมื่อไร","คุณทำงานอย่างไร","คุณทำงานที่ไหน"],"answer":2,"arrange":["your","What","name?","is"],"arranged":"What is your name?","fill":[""," are you?"],"blank":"How","read":"“Where do you live?” “I live in Chiang Mai.”","question":"คำตอบบอกข้อมูลอะไร?","readChoices":["เวลา","สถานที่","ชื่อ"],"readAnswer":1,"write":"Where do you","accepts":["what","where","when","how"]}),
  lesson(10, "💬", "บทสนทนาทบทวน", "ใช้จริงในชีวิตประจำวัน", "นำคำศัพท์และโครงสร้างทั้งหมดมาคุยสั้น ๆ ได้",
    [["today","วันนี้","ทู-เดย์"],["together","ด้วยกัน","ทู-เกธ-เธอร์"],["busy","ยุ่ง","บิซ-ซี"],["free","ว่าง","ฟรี"],["later","ภายหลัง","เล-เทอร์"],["sure","ได้เลย / แน่นอน","ชัวร์"]],
    [["Are you free today?","วันนี้คุณว่างไหม","อาร์ ยู ฟรี ทู-เดย์"],["I am busy, but I am free later.","ฉันยุ่ง แต่จะว่างทีหลัง","ไอ แอม บิซ-ซี บัท ไอ แอม ฟรี เล-เทอร์"],["Can we eat together?","เราไปกินข้าวด้วยกันได้ไหม","แคน วี อีท ทู-เกธ-เธอร์"]],
    "บทสนทนาจริงนำโครงสร้างเดิมมารวมกัน: <b>คำถาม → คำตอบ → เพิ่มเหตุผลหรือทางเลือก</b> ไม่ต้องพูดยาว แค่ชัดเจนและสุภาพก็สื่อสารได้",
    {"listen":"Are you free today?","choices":["วันนี้คุณว่างไหม","วันนี้คุณทำงานไหม","วันนี้คุณไปไหน"],"answer":0,"arrange":["eat","Can we","together?"],"arranged":"Can we eat together?","fill":["I am busy, "," I am free later."],"blank":"but","read":"A: Are you free today? B: I work until five, but I am free later. A: Can we eat together? B: Sure!","question":"ทั้งคู่จะทำอะไร?","readChoices":["ไปทำงาน","ซื้อของ","กินข้าวด้วยกัน"],"readAnswer":2,"write":"Today, I","accepts":["today","i am","i can","i want"]}),
  ...extraLessons,
].map(l=>({...l,practice:{...l.practice,writingExample:writingExamples[l.id]}}));

export const roadmap = [
  [
    "บท 1–4",
    "เริ่มจากพื้นฐาน",
    "ทักทาย ประโยคแรก งาน และกิจวัตร",
    "ready"
  ],
  [
    "บท 5–8",
    "เรื่องใกล้ตัว",
    "อาหาร ความชอบ และการเชื่อมประโยค",
    "ready"
  ],
  [
    "บท 9–12",
    "เริ่มบทสนทนา",
    "คำถาม ซื้อของ และถามทาง",
    "ready"
  ],
  [
    "บท 13–16",
    "ใช้ได้ทุกวัน",
    "สั่งอาหาร นัดหมาย อากาศ และสุขภาพ",
    "ready"
  ],
  [
    "บท 17–20",
    "เล่าเรื่องและเดินทาง",
    "อดีต อนาคต เปรียบเทียบ และโรงแรม",
    "ready"
  ],
  [
    "บท 21–24",
    "สื่อสารอย่างมั่นใจ",
    "อีเมล ประชุม โทรศัพท์ และภารกิจรวม",
    "ready"
  ]
];
