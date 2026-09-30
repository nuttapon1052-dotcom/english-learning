import { extraLessons } from './extra-lessons.js';
const lesson = (id, icon, title, subtitle, goal, words, examples, grammar, practice) => ({
  id, icon, title, subtitle, goal, words, examples, grammar, practice, minutes: 12,
});

export const lessons = [
  lesson(1, '👋', 'ทักทายและแนะนำตัว', 'Hello! My name is…', 'ทักทาย บอกชื่อ และถามชื่อคนอื่นได้',
    [['hello','สวัสดี','เฮล-โล'],['name','ชื่อ','เนม'],['my','ของฉัน','มาย'],['your','ของคุณ','ยัวร์'],['nice','ยินดี / ดี','ไนซ์'],['meet','พบ','มีท']],
    [['Hello! My name is Mali.','สวัสดี ฉันชื่อมะลิ','เฮล-โล! มาย เนม อิส มา-ลี'],['What is your name?','คุณชื่ออะไร','ว็อท อิส ยัวร์ เนม'],['Nice to meet you.','ยินดีที่ได้รู้จัก','ไนซ์ ทู มีท ยู']],
    '<b>My name</b> คือ “ชื่อของฉัน” ตามด้วย <b>is</b> เพื่อเชื่อมกับชื่อ ส่วนคำถามวาง <b>What</b> ไว้หน้า เพราะเราถามว่า “อะไร”',
    {listen:'What is your name?', choices:['คุณชื่ออะไร','คุณอยู่ที่ไหน','คุณสบายดีไหม'], answer:0, arrange:['name','My','is','Mali.'], arranged:'My name is Mali.', fill:['Nice to ',' you.'], blank:'meet', read:'Hello! My name is Nida. I am from Thailand. Nice to meet you.', question:'ผู้พูดชื่ออะไร?', readChoices:['Nida','Mali','Yuri'], readAnswer:0, write:'My name is', accepts:['my name is','i am','i’m'] }),
  lesson(2, '🧩', 'I / You / We / They', 'และ am / is / are', 'เลือกใช้ประธานและ verb to be ในประโยคง่าย ๆ ได้',
    [['I','ฉัน','ไอ'],['you','คุณ / พวกคุณ','ยู'],['we','พวกเรา','วี'],['they','พวกเขา','เดย์'],['am','เป็น / อยู่ / คือ','แอม'],['are','เป็น / อยู่ / คือ','อาร์']],
    [['I am happy.','ฉันมีความสุข','ไอ แอม แฮพ-พี'],['You are kind.','คุณใจดี','ยู อาร์ ไคนด์'],['We are friends.','พวกเราเป็นเพื่อนกัน','วี อาร์ เฟรนด์ส']],
    '<b>I</b> ใช้คู่กับ <b>am</b> เสมอ ส่วน <b>you, we, they</b> ใช้คู่กับ <b>are</b> คำเหล่านี้ทำหน้าที่เชื่อมประธานกับข้อมูลของประธาน',
    {listen:'We are friends.',choices:['เราเป็นเพื่อนกัน','เราทำงานด้วยกัน','พวกเขาเป็นเพื่อนกัน'],answer:0,arrange:['are','They','happy.'],arranged:'They are happy.',fill:['I ',' ready.'],blank:'am',read:'I am Mali. You are Tom. We are students.',question:'Mali และ Tom เป็นอะไร?',readChoices:['นักเรียน','ครู','เพื่อนบ้าน'],readAnswer:0,write:'I am',accepts:['i am','we are','they are']}),
  lesson(3, '💼', 'อาชีพและการทำงาน', 'I work in an office.', 'บอกอาชีพและสถานที่ทำงานของตนเองได้',
    [['work','ทำงาน','เวิร์ก'],['teacher','ครู','ทีช-เชอร์'],['office','สำนักงาน','ออฟ-ฟิศ'],['hospital','โรงพยาบาล','ฮอส-พิ-ทัล'],['shop','ร้านค้า','ช็อป'],['at','ที่','แอท']],
    [['I am a teacher.','ฉันเป็นครู','ไอ แอม อะ ทีช-เชอร์'],['I work in an office.','ฉันทำงานในสำนักงาน','ไอ เวิร์ก อิน แอน ออฟ-ฟิศ'],['She works at a hospital.','เธอทำงานที่โรงพยาบาล','ชี เวิร์กส์ แอท อะ ฮอส-พิ-ทัล']],
    'โครงสร้าง <b>ประธาน + work + สถานที่</b> บอกว่าทำงานที่ไหน ใช้ <b>in</b> เมื่อต้องการเน้น “ข้างใน” และ <b>at</b> เมื่อพูดถึงสถานที่ทั่วไป',
    {listen:'I work in an office.',choices:['ฉันทำงานในสำนักงาน','ฉันไปสำนักงาน','ฉันชอบสำนักงาน'],answer:0,arrange:['work','I','a shop.','at'],arranged:'I work at a shop.',fill:['I am a ',' .'],blank:'teacher',read:'Som is a cook. He works at a small restaurant.',question:'Som ทำงานที่ไหน?',readChoices:['ร้านอาหาร','โรงพยาบาล','โรงเรียน'],readAnswer:0,write:'I work',accepts:['i work','i am a']}),
  lesson(4, '☀️', 'กิจวัตรประจำวัน', 'My day, one step at a time', 'เล่ากิจกรรมประจำวันที่ทำเป็นประจำได้',
    [['wake up','ตื่นนอน','เวค อัพ'],['eat','กิน','อีท'],['go','ไป','โก'],['morning','ตอนเช้า','มอร์-นิง'],['evening','ตอนเย็น','อีฟ-นิง'],['every day','ทุกวัน','เอฟ-รี เดย์']],
    [['I wake up at seven.','ฉันตื่นเจ็ดโมง','ไอ เวค อัพ แอท เซเว่น'],['I go to work every day.','ฉันไปทำงานทุกวัน','ไอ โก ทู เวิร์ก เอฟ-รี เดย์'],['I read in the evening.','ฉันอ่านหนังสือตอนเย็น','ไอ รีด อิน ดิ อีฟ-นิง']],
    'ภาษาอังกฤษเรียง <b>ใคร + ทำอะไร + เมื่อไร</b> เช่น I + wake up + at seven. คำว่า <b>to</b> ชี้ปลายทางใน go to work',
    {listen:'I wake up at seven.',choices:['ฉันตื่นเจ็ดโมง','ฉันนอนเจ็ดโมง','ฉันทำงานเจ็ดโมง'],answer:0,arrange:['to work','I','every day.','go'],arranged:'I go to work every day.',fill:['I read in the ',' .'],blank:'evening',read:'I wake up at six. I eat breakfast and go to work.',question:'ผู้พูดทำอะไรหลังอาหารเช้า?',readChoices:['ไปทำงาน','อ่านหนังสือ','นอน'],readAnswer:0,write:'Every day, I',accepts:['every day','i wake','i go','i eat']}),
  lesson(5, '🍜', 'อาหารและการสั่งอาหาร', 'I would like…', 'สั่งอาหารและเครื่องดื่มอย่างสุภาพได้',
    [['food','อาหาร','ฟูด'],['water','น้ำ','วอ-เทอร์'],['rice','ข้าว','ไรซ์'],['menu','เมนู','เมน-ยู'],['please','กรุณา','พลีซ'],['would like','ต้องการ (สุภาพ)','วูด ไลก์']],
    [['I would like rice, please.','ขอข้าวค่ะ/ครับ','ไอ วูด ไลก์ ไรซ์ พลีซ'],['Can I see the menu?','ขอดูเมนูได้ไหม','แคน ไอ ซี เดอะ เมน-ยู'],['Water, please.','ขอน้ำค่ะ/ครับ','วอ-เทอร์ พลีซ']],
    '<b>I would like + สิ่งที่ต้องการ</b> เป็นวิธีขอที่สุภาพ เติม <b>please</b> ท้ายประโยคได้ โดยไม่ต้องแปลตรงคำทุกคำ',
    {listen:'Water, please.',choices:['ขอน้ำค่ะ/ครับ','ขออาหารค่ะ/ครับ','ขอเมนูค่ะ/ครับ'],answer:0,arrange:['like','I would','rice,','please.'],arranged:'I would like rice, please.',fill:['Can I see the ','?'],blank:'menu',read:'Aom is at a café. She would like tea and a sandwich.',question:'Aom ต้องการอะไร?',readChoices:['ชาและแซนด์วิช','น้ำและข้าว','กาแฟและเค้ก'],readAnswer:0,write:'I would like',accepts:['i would like','can i have','please']}),
  lesson(6, '💚', 'สิ่งที่ชอบและไม่ชอบ', 'I like music.', 'บอกความชอบและถามความชอบของผู้อื่นได้',
    [['like','ชอบ','ไลก์'],['love','ชอบมาก / รัก','เลิฟ'],['do not like','ไม่ชอบ','ดู น็อท ไลก์'],['music','ดนตรี','มิว-สิก'],['movie','ภาพยนตร์','มู-วี'],['hobby','งานอดิเรก','ฮอบ-บี']],
    [['I like music.','ฉันชอบดนตรี','ไอ ไลก์ มิว-สิก'],['I do not like coffee.','ฉันไม่ชอบกาแฟ','ไอ ดู น็อท ไลก์ คอฟ-ฟี'],['Do you like movies?','คุณชอบหนังไหม','ดู ยู ไลก์ มู-วีส์']],
    'ประโยคบอกเล่าใช้ <b>I + like + สิ่งที่ชอบ</b> ถ้าปฏิเสธเติม <b>do not</b> หน้าคำกริยา like และคำถามย้าย <b>Do</b> มาหน้า',
    {listen:'Do you like movies?',choices:['คุณชอบหนังไหม','คุณดูหนังที่ไหน','หนังเริ่มเมื่อไร'],answer:0,arrange:['like','I','music.'],arranged:'I like music.',fill:['I do not ',' coffee.'],blank:'like',read:'Ben likes music, but he does not like movies.',question:'Ben ไม่ชอบอะไร?',readChoices:['ภาพยนตร์','ดนตรี','หนังสือ'],readAnswer:0,write:'I like',accepts:['i like','i love','i do not like']}),
  lesson(7, '✨', 'I want / I need / I can', 'บอกความต้องการและความสามารถ', 'ใช้ want, need และ can ในสถานการณ์ใกล้ตัวได้',
    [['want','อยาก / ต้องการ','วอนท์'],['need','จำเป็นต้อง / ต้องการ','นีด'],['can','สามารถ','แคน'],['help','ความช่วยเหลือ / ช่วย','เฮลป์'],['buy','ซื้อ','บาย'],['speak','พูด','สปีค']],
    [['I want to go home.','ฉันอยากกลับบ้าน','ไอ วอนท์ ทู โก โฮม'],['I need help.','ฉันต้องการความช่วยเหลือ','ไอ นีด เฮลป์'],['I can speak English.','ฉันพูดภาษาอังกฤษได้','ไอ แคน สปีค อิง-ลิช']],
    '<b>want to + กริยา</b> คืออยากทำบางอย่าง, <b>need + สิ่งของ</b> คือต้องการสิ่งนั้น และ <b>can + กริยา</b> บอกความสามารถ โดยกริยาไม่เติม to',
    {listen:'I need help.',choices:['ฉันต้องการความช่วยเหลือ','ฉันช่วยคุณได้','ฉันอยากกลับบ้าน'],answer:0,arrange:['can','English.','I','speak'],arranged:'I can speak English.',fill:['I want ',' go home.'],blank:'to',read:'Nok wants to buy food. She needs money, but she can pay by card.',question:'Nok อยากทำอะไร?',readChoices:['ซื้ออาหาร','กลับบ้าน','พูดอังกฤษ'],readAnswer:0,write:'I can',accepts:['i can','i want to','i need']}),
  lesson(8, '🔗', 'and / but / because', 'เชื่อมความคิดให้ยาวขึ้น', 'เชื่อมประโยคด้วย and, but และ because ได้',
    [['and','และ','แอนด์'],['but','แต่','บัท'],['because','เพราะว่า','บี-คอส'],['with','กับ / ด้วย','วิธ'],['to','ไปยัง / เพื่อ','ทู'],['for','สำหรับ','ฟอร์']],
    [['I like tea and coffee.','ฉันชอบชาและกาแฟ','ไอ ไลก์ ที แอนด์ คอฟ-ฟี'],['I want to go out, but I am tired.','ฉันอยากออกไปข้างนอก แต่ฉันเหนื่อย','ไอ วอนท์ ทู โก เอาต์ บัท ไอ แอม ไทเอิร์ด'],['I study because I want to travel.','ฉันเรียนเพราะอยากเดินทาง','ไอ สตัด-ดี บี-คอส ไอ วอนท์ ทู แทรฟ-เวิล']],
    '<b>and</b> เพิ่มข้อมูล, <b>but</b> เชื่อมข้อมูลที่ต่างกัน และ <b>because</b> บอกเหตุผล ทั้งสามคำช่วยรวมความคิดสั้น ๆ ให้เป็นประโยคเดียว',
    {listen:'I study because I want to travel.',choices:['ฉันเรียนเพราะอยากเดินทาง','ฉันเรียนแต่ไม่อยากเดินทาง','ฉันเรียนและทำงาน'],answer:0,arrange:['tired.','but','I am','I want to go,'],arranged:'I want to go, but I am tired.',fill:['Tea ',' coffee, please.'],blank:'and',read:'May walks to work because it is near, but she takes a bus when it rains.',question:'ทำไม May เดินไปทำงาน?',readChoices:['เพราะอยู่ใกล้','เพราะฝนตก','เพราะไม่มีรถ'],readAnswer:0,write:'I like',accepts:['and','but','because']}),
  lesson(9, '❓', 'คำถามพื้นฐาน', 'what / where / when / how', 'สร้างและตอบคำถามข้อมูลพื้นฐานได้',
    [['what','อะไร','ว็อท'],['where','ที่ไหน','แวร์'],['when','เมื่อไร','เว็น'],['how','อย่างไร','ฮาว'],['who','ใคร','ฮู'],['why','ทำไม','วาย']],
    [['What is your name?','คุณชื่ออะไร','ว็อท อิส ยัวร์ เนม'],['Where do you work?','คุณทำงานที่ไหน','แวร์ ดู ยู เวิร์ก'],['How are you?','คุณเป็นอย่างไรบ้าง','ฮาว อาร์ ยู']],
    'คำถามข้อมูลเริ่มด้วย <b>คำแสดงสิ่งที่อยากรู้</b> เช่น where (สถานที่) แล้วจึงตามด้วย do + ประธาน + กริยา หรือ verb to be + ประธาน',
    {listen:'Where do you work?',choices:['คุณทำงานที่ไหน','คุณทำงานเมื่อไร','คุณทำงานอย่างไร'],answer:0,arrange:['your','What','name?','is'],arranged:'What is your name?',fill:['',' are you?'],blank:'How',read:'“Where do you live?” “I live in Chiang Mai.”',question:'คำตอบบอกข้อมูลอะไร?',readChoices:['สถานที่','เวลา','ชื่อ'],readAnswer:0,write:'Where do you',accepts:['what','where','when','how']}),
  lesson(10, '💬', 'บทสนทนาทบทวน', 'ใช้จริงในชีวิตประจำวัน', 'นำคำศัพท์และโครงสร้างทั้งหมดมาคุยสั้น ๆ ได้',
    [['today','วันนี้','ทู-เดย์'],['together','ด้วยกัน','ทู-เกธ-เธอร์'],['busy','ยุ่ง','บิซ-ซี'],['free','ว่าง','ฟรี'],['later','ภายหลัง','เล-เทอร์'],['sure','ได้เลย / แน่นอน','ชัวร์']],
    [['Are you free today?','วันนี้คุณว่างไหม','อาร์ ยู ฟรี ทู-เดย์'],['I am busy, but I am free later.','ฉันยุ่ง แต่จะว่างทีหลัง','ไอ แอม บิซ-ซี บัท ไอ แอม ฟรี เล-เทอร์'],['Can we eat together?','เราไปกินข้าวด้วยกันได้ไหม','แคน วี อีท ทู-เกธ-เธอร์']],
    'บทสนทนาจริงนำโครงสร้างเดิมมารวมกัน: <b>คำถาม → คำตอบ → เพิ่มเหตุผลหรือทางเลือก</b> ไม่ต้องพูดยาว แค่ชัดเจนและสุภาพก็สื่อสารได้',
    {listen:'Are you free today?',choices:['วันนี้คุณว่างไหม','วันนี้คุณทำงานไหม','วันนี้คุณไปไหน'],answer:0,arrange:['eat','Can we','together?'],arranged:'Can we eat together?',fill:['I am busy, ',' I am free later.'],blank:'but',read:'A: Are you free today? B: I work until five, but I am free later. A: Can we eat together? B: Sure!',question:'ทั้งคู่จะทำอะไร?',readChoices:['กินข้าวด้วยกัน','ไปทำงาน','ซื้อของ'],readAnswer:0,write:'Today, I',accepts:['today','i am','i can','i want']}), 
  ...extraLessons,
];

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
