// Curated foundation library. IDs are stable and independent from lesson IDs.
const categories = [
  {
    "id": "days",
    "title": "วันในสัปดาห์",
    "en": "Days",
    "icon": "calendar",
    "color": "sage",
    "tip": "ชื่อวันขึ้นต้นด้วยตัวพิมพ์ใหญ่ ใช้ on กับวัน เช่น on Monday และ on Friday. ถ้าหมายถึงทุกวันจันทร์ใช้ on Mondays.",
    "rows": [
      [
        "Monday",
        "วันจันทร์",
        "มัน-เดย์",
        "I study English on Monday.",
        "ฉันเรียนภาษาอังกฤษวันจันทร์",
        "MON"
      ],
      [
        "Tuesday",
        "วันอังคาร",
        "ทิวซ-เดย์",
        "We meet on Tuesday.",
        "เราเจอกันวันอังคาร",
        "TUE"
      ],
      [
        "Wednesday",
        "วันพุธ",
        "เวนซ-เดย์",
        "The shop is closed on Wednesday.",
        "ร้านปิดวันพุธ",
        "WED"
      ],
      [
        "Thursday",
        "วันพฤหัสบดี",
        "เธิร์ซ-เดย์",
        "I work on Thursday.",
        "ฉันทำงานวันพฤหัสบดี",
        "THU"
      ],
      [
        "Friday",
        "วันศุกร์",
        "ฟราย-เดย์",
        "See you on Friday.",
        "เจอกันวันศุกร์",
        "FRI"
      ],
      [
        "Saturday",
        "วันเสาร์",
        "แซท-เทอร์-เดย์",
        "We play football on Saturday.",
        "เราเล่นฟุตบอลวันเสาร์",
        "SAT"
      ],
      [
        "Sunday",
        "วันอาทิตย์",
        "ซัน-เดย์",
        "I rest on Sunday.",
        "ฉันพักผ่อนวันอาทิตย์",
        "SUN"
      ]
    ]
  },
  {
    "id": "months",
    "title": "เดือนทั้ง 12",
    "en": "Months",
    "icon": "calendar",
    "color": "sand",
    "tip": "ชื่อเดือนขึ้นต้นด้วยตัวพิมพ์ใหญ่ ใช้ in กับเดือน เช่น in January. ถ้าระบุวันที่ใช้ on เช่น on January 5. รูปวันที่แบบอังกฤษอาจเขียน 5 January.",
    "rows": [
      [
        "January",
        "มกราคม",
        "แจน-ยู-แอรี",
        "The year starts in January.",
        "ปีเริ่มต้นในเดือนมกราคม",
        "01"
      ],
      [
        "February",
        "กุมภาพันธ์",
        "เฟบ-รู-แอรี",
        "My birthday is in February.",
        "วันเกิดของฉันอยู่ในเดือนกุมภาพันธ์",
        "02"
      ],
      [
        "March",
        "มีนาคม",
        "มาร์ช",
        "We travel in March.",
        "เราเดินทางในเดือนมีนาคม",
        "03"
      ],
      [
        "April",
        "เมษายน",
        "เอ-พริล",
        "Songkran is in April.",
        "สงกรานต์อยู่ในเดือนเมษายน",
        "04"
      ],
      [
        "May",
        "พฤษภาคม",
        "เมย์",
        "The course starts in May.",
        "หลักสูตรเริ่มในเดือนพฤษภาคม",
        "05"
      ],
      [
        "June",
        "มิถุนายน",
        "จูน",
        "Our holiday is in June.",
        "วันหยุดพักผ่อนของเราอยู่ในเดือนมิถุนายน",
        "06"
      ],
      [
        "July",
        "กรกฎาคม",
        "จู-ไล",
        "I visit my family in July.",
        "ฉันไปเยี่ยมครอบครัวในเดือนกรกฎาคม",
        "07"
      ],
      [
        "August",
        "สิงหาคม",
        "ออ-กัสท์",
        "Her birthday is in August.",
        "วันเกิดของเธออยู่ในเดือนสิงหาคม",
        "08"
      ],
      [
        "September",
        "กันยายน",
        "เซพ-เทม-เบอร์",
        "The meeting is in September.",
        "การประชุมอยู่ในเดือนกันยายน",
        "09"
      ],
      [
        "October",
        "ตุลาคม",
        "ออค-โท-เบอร์",
        "We move in October.",
        "เราย้ายบ้านในเดือนตุลาคม",
        "10"
      ],
      [
        "November",
        "พฤศจิกายน",
        "โน-เวม-เบอร์",
        "The festival is in November.",
        "เทศกาลจัดในเดือนพฤศจิกายน",
        "11"
      ],
      [
        "December",
        "ธันวาคม",
        "ดิ-เซม-เบอร์",
        "The year ends in December.",
        "ปีสิ้นสุดในเดือนธันวาคม",
        "12"
      ]
    ]
  },
  {
    "id": "numbers",
    "title": "ตัวเลขและลำดับ",
    "en": "Numbers",
    "icon": "numbers",
    "color": "blue",
    "tip": "จำนวนนับใช้บอกจำนวน (two apples) ส่วนลำดับใช้บอกอันดับหรือวันที่ (the second floor). 21–99 ที่ไม่ลงท้ายด้วยศูนย์เขียนมีขีด เช่น twenty-one. ระวัง thirteen / thirty และการสะกด forty ไม่มี u.",
    "rows": [
      [
        "zero",
        "ศูนย์",
        "ซี-โร",
        "The temperature is zero degrees.",
        "อุณหภูมิศูนย์องศา",
        "0"
      ],
      [
        "one",
        "หนึ่ง",
        "วัน",
        "I have one bag.",
        "ฉันมีกระเป๋าหนึ่งใบ",
        "1"
      ],
      [
        "two",
        "สอง",
        "ทู",
        "I have two apples.",
        "ฉันมีแอปเปิลสองลูก",
        "2"
      ],
      [
        "three",
        "สาม",
        "ธรี",
        "We need three chairs.",
        "เราต้องการเก้าอี้สามตัว",
        "3"
      ],
      [
        "four",
        "สี่",
        "ฟอร์",
        "There are four books.",
        "มีหนังสือสี่เล่ม",
        "4"
      ],
      [
        "five",
        "ห้า",
        "ไฟฟ์",
        "I have five pens.",
        "ฉันมีปากกาห้าด้าม",
        "5"
      ],
      [
        "six",
        "หก",
        "ซิคซ์",
        "There are six eggs.",
        "มีไข่หกฟอง",
        "6"
      ],
      [
        "seven",
        "เจ็ด",
        "เซฟ-เวิน",
        "A week has seven days.",
        "หนึ่งสัปดาห์มีเจ็ดวัน",
        "7"
      ],
      [
        "eight",
        "แปด",
        "เอท",
        "There are eight students.",
        "มีนักเรียนแปดคน",
        "8"
      ],
      [
        "nine",
        "เก้า",
        "ไนน์",
        "I start work at nine.",
        "ฉันเริ่มงานเก้าโมง",
        "9"
      ],
      [
        "ten",
        "สิบ",
        "เทน",
        "I have ten fingers.",
        "ฉันมีนิ้วมือสิบนิ้ว",
        "10"
      ],
      [
        "eleven",
        "สิบเอ็ด",
        "อิ-เลฟ-เวิน",
        "There are eleven players.",
        "มีผู้เล่นสิบเอ็ดคน",
        "11"
      ],
      [
        "twelve",
        "สิบสอง",
        "ทเวลฟ์",
        "A year has twelve months.",
        "หนึ่งปีมีสิบสองเดือน",
        "12"
      ],
      [
        "thirteen",
        "สิบสาม",
        "เธอร์-ทีน",
        "My sister is thirteen.",
        "น้องสาวของฉันอายุสิบสามปี",
        "13"
      ],
      [
        "fourteen",
        "สิบสี่",
        "ฟอร์-ทีน",
        "We have fourteen tickets.",
        "เรามีตั๋วสิบสี่ใบ",
        "14"
      ],
      [
        "fifteen",
        "สิบห้า",
        "ฟิฟ-ทีน",
        "I study for fifteen minutes.",
        "ฉันเรียนเป็นเวลาสิบห้านาที",
        "15"
      ],
      [
        "sixteen",
        "สิบหก",
        "ซิคซ์-ทีน",
        "There are sixteen chairs.",
        "มีเก้าอี้สิบหกตัว",
        "16"
      ],
      [
        "seventeen",
        "สิบเจ็ด",
        "เซฟ-เวิน-ทีน",
        "He is seventeen years old.",
        "เขาอายุสิบเจ็ดปี",
        "17"
      ],
      [
        "eighteen",
        "สิบแปด",
        "เอ-ทีน",
        "She is eighteen years old.",
        "เธออายุสิบแปดปี",
        "18"
      ],
      [
        "nineteen",
        "สิบเก้า",
        "ไนน์-ทีน",
        "I have nineteen coins.",
        "ฉันมีเหรียญสิบเก้าเหรียญ",
        "19"
      ],
      [
        "twenty",
        "ยี่สิบ",
        "ทเวน-ที",
        "The bag costs twenty dollars.",
        "กระเป๋าราคายี่สิบดอลลาร์",
        "20"
      ],
      [
        "thirty",
        "สามสิบ",
        "เธอร์-ที",
        "The trip takes thirty minutes.",
        "การเดินทางใช้เวลาสามสิบนาที",
        "30"
      ],
      [
        "forty",
        "สี่สิบ",
        "ฟอร์-ที",
        "There are forty people.",
        "มีคนสี่สิบคน",
        "40"
      ],
      [
        "fifty",
        "ห้าสิบ",
        "ฟิฟ-ที",
        "This book costs fifty baht.",
        "หนังสือเล่มนี้ราคาห้าสิบบาท",
        "50"
      ],
      [
        "sixty",
        "หกสิบ",
        "ซิคซ์-ที",
        "An hour has sixty minutes.",
        "หนึ่งชั่วโมงมีหกสิบนาที",
        "60"
      ],
      [
        "seventy",
        "เจ็ดสิบ",
        "เซฟ-เวิน-ที",
        "My grandfather is seventy.",
        "คุณปู่ของฉันอายุเจ็ดสิบปี",
        "70"
      ],
      [
        "eighty",
        "แปดสิบ",
        "เอ-ที",
        "The ticket costs eighty baht.",
        "ตั๋วราคาแปดสิบบาท",
        "80"
      ],
      [
        "ninety",
        "เก้าสิบ",
        "ไนน์-ที",
        "The film is ninety minutes long.",
        "ภาพยนตร์ยาวเก้าสิบนาที",
        "90"
      ],
      [
        "one hundred",
        "หนึ่งร้อย",
        "วัน ฮัน-เดร็ด",
        "I have one hundred baht.",
        "ฉันมีเงินหนึ่งร้อยบาท",
        "100"
      ],
      [
        "one thousand",
        "หนึ่งพัน",
        "วัน เธา-เซินด์",
        "The room costs one thousand baht.",
        "ห้องราคาหนึ่งพันบาท",
        "1,000"
      ],
      [
        "one million",
        "หนึ่งล้าน",
        "วัน มิล-เลียน",
        "One million is a large number.",
        "หนึ่งล้านเป็นจำนวนที่มาก",
        "1,000,000"
      ],
      [
        "first",
        "ที่หนึ่ง / ลำดับแรก",
        "เฟิร์สท์",
        "This is my first lesson.",
        "นี่คือบทเรียนแรกของฉัน",
        "1st"
      ],
      [
        "second",
        "ที่สอง",
        "เซค-เคินด์",
        "My room is on the second floor.",
        "ห้องของฉันอยู่ชั้นสอง",
        "2nd"
      ],
      [
        "third",
        "ที่สาม",
        "เธิร์ด",
        "Take the third bus.",
        "ขึ้นรถบัสคันที่สาม",
        "3rd"
      ],
      [
        "fourth",
        "ที่สี่",
        "ฟอร์ธ",
        "She is fourth in line.",
        "เธออยู่ลำดับที่สี่ในแถว",
        "4th"
      ],
      [
        "fifth",
        "ที่ห้า",
        "ฟิฟธ์",
        "Today is the fifth of May.",
        "วันนี้เป็นวันที่ห้าพฤษภาคม",
        "5th"
      ],
      [
        "sixth",
        "ที่หก",
        "ซิคซ์ธ",
        "This is the sixth question.",
        "นี่คือคำถามข้อที่หก",
        "6th"
      ],
      [
        "seventh",
        "ที่เจ็ด",
        "เซฟ-เวินธ",
        "He is seventh in line.",
        "เขาอยู่ลำดับที่เจ็ดในแถว",
        "7th"
      ],
      [
        "eighth",
        "ที่แปด",
        "เอทธ์",
        "August is the eighth month.",
        "สิงหาคมเป็นเดือนที่แปด",
        "8th"
      ],
      [
        "ninth",
        "ที่เก้า",
        "ไนน์ธ",
        "September is the ninth month.",
        "กันยายนเป็นเดือนที่เก้า",
        "9th"
      ],
      [
        "tenth",
        "ที่สิบ",
        "เทนธ",
        "October is the tenth month.",
        "ตุลาคมเป็นเดือนที่สิบ",
        "10th"
      ]
    ]
  },
  {
    "id": "fruit",
    "title": "ผลไม้",
    "en": "Fruit",
    "icon": "fruit",
    "color": "peach",
    "tip": "ผลไม้เป็นลูกมักนับได้ เช่น an apple / two apples. ใช้ an ก่อนเสียงสระ เช่น an orange และใช้ a banana. คำว่า fruit เมื่อพูดรวม ๆ มักไม่เติม s: I like fruit.",
    "rows": [
      [
        "apple",
        "แอปเปิล",
        "แอพ-เพิล",
        "I eat an apple every day.",
        "ฉันกินแอปเปิลวันละหนึ่งลูก"
      ],
      [
        "banana",
        "กล้วย",
        "บะ-นา-นะ",
        "This banana is ripe.",
        "กล้วยลูกนี้สุกแล้ว"
      ],
      [
        "orange",
        "ส้ม",
        "ออ-รินจ์",
        "Would you like an orange?",
        "คุณอยากได้ส้มสักลูกไหม"
      ],
      [
        "mango",
        "มะม่วง",
        "แมง-โก",
        "I like ripe mangoes.",
        "ฉันชอบมะม่วงสุก"
      ],
      [
        "pineapple",
        "สับปะรด",
        "ไพน์-แอพ-เพิล",
        "The pineapple is sweet.",
        "สับปะรดหวาน"
      ],
      [
        "watermelon",
        "แตงโม",
        "วอ-เทอร์-เมล-เลิน",
        "We share a watermelon.",
        "เราแบ่งแตงโมกันกิน"
      ],
      [
        "grape",
        "องุ่นหนึ่งลูก",
        "เกรพ",
        "These grapes are sweet.",
        "องุ่นเหล่านี้หวาน"
      ],
      [
        "strawberry",
        "สตรอว์เบอร์รี",
        "สตรอ-เบอรี",
        "I put strawberries in my yogurt.",
        "ฉันใส่สตรอว์เบอร์รีในโยเกิร์ต"
      ],
      [
        "papaya",
        "มะละกอ",
        "พะ-พาย-ยะ",
        "This papaya is ripe.",
        "มะละกอลูกนี้สุกแล้ว"
      ],
      [
        "coconut",
        "มะพร้าว",
        "โค-คะ-นัท",
        "I drink coconut water.",
        "ฉันดื่มน้ำมะพร้าว"
      ],
      [
        "durian",
        "ทุเรียน",
        "ดู-เรียน",
        "Durian has a strong smell.",
        "ทุเรียนมีกลิ่นแรง"
      ],
      [
        "guava",
        "ฝรั่ง (ผลไม้)",
        "กวา-วะ",
        "I bought two guavas.",
        "ฉันซื้อฝรั่งสองลูก"
      ],
      [
        "lemon",
        "เลมอน",
        "เลม-เมิน",
        "Add a slice of lemon.",
        "เติมเลมอนหนึ่งแว่น"
      ],
      [
        "lime",
        "มะนาว",
        "ไลม์",
        "I add lime juice to the soup.",
        "ฉันเติมน้ำมะนาวลงในซุป"
      ],
      [
        "peach",
        "ลูกพีช",
        "พีช",
        "The peach is soft.",
        "ลูกพีชนิ่ม"
      ],
      [
        "pear",
        "ลูกแพร์",
        "แพร์",
        "I have a pear for a snack.",
        "ฉันกินลูกแพร์เป็นของว่าง"
      ]
    ]
  },
  {
    "id": "animals",
    "title": "สัตว์รอบตัว",
    "en": "Animals",
    "icon": "paw",
    "color": "lavender",
    "tip": "สัตว์หนึ่งตัวใช้ a/an ตามเสียง เช่น a cat / an elephant. พหูพจน์ส่วนมากเติม s แต่ sheep ใช้รูปเดิมทั้งหนึ่งและหลายตัว; fish โดยทั่วไปใช้ fish เมื่อพูดถึงปลาหลายตัว.",
    "rows": [
      [
        "cat",
        "แมว",
        "แคท",
        "The cat is sleeping.",
        "แมวกำลังนอนหลับ"
      ],
      [
        "dog",
        "สุนัข",
        "ด็อก",
        "My dog likes to run.",
        "สุนัขของฉันชอบวิ่ง"
      ],
      [
        "bird",
        "นก",
        "เบิร์ด",
        "A bird is in the tree.",
        "มีนกอยู่บนต้นไม้"
      ],
      [
        "fish",
        "ปลา",
        "ฟิช",
        "There are three fish in the tank.",
        "มีปลาสามตัวในตู้"
      ],
      [
        "rabbit",
        "กระต่าย",
        "แรบ-บิท",
        "The rabbit eats a carrot.",
        "กระต่ายกินแครอต"
      ],
      [
        "duck",
        "เป็ด",
        "ดัค",
        "The duck is swimming.",
        "เป็ดกำลังว่ายน้ำ"
      ],
      [
        "chicken",
        "ไก่",
        "ชิค-เคิน",
        "The chickens are on the farm.",
        "ไก่อยู่ที่ฟาร์ม"
      ],
      [
        "cow",
        "วัว",
        "คาว",
        "The cow eats grass.",
        "วัวกินหญ้า"
      ],
      [
        "pig",
        "หมู",
        "พิก",
        "The pig is on the farm.",
        "หมูอยู่ที่ฟาร์ม"
      ],
      [
        "horse",
        "ม้า",
        "ฮอร์ส",
        "She can ride a horse.",
        "เธอขี่ม้าได้"
      ],
      [
        "sheep",
        "แกะ",
        "ชีพ",
        "There are two sheep.",
        "มีแกะสองตัว"
      ],
      [
        "goat",
        "แพะ",
        "โกท",
        "The goat is white.",
        "แพะสีขาว"
      ],
      [
        "elephant",
        "ช้าง",
        "เอล-ละ-เฟินท์",
        "An elephant is a large animal.",
        "ช้างเป็นสัตว์ขนาดใหญ่"
      ],
      [
        "tiger",
        "เสือโคร่ง",
        "ไท-เกอร์",
        "The tiger has stripes.",
        "เสือโคร่งมีลาย"
      ],
      [
        "lion",
        "สิงโต",
        "ไล-เอิน",
        "The lion is resting.",
        "สิงโตกำลังพักผ่อน"
      ],
      [
        "monkey",
        "ลิง",
        "มัง-คี",
        "The monkey climbs a tree.",
        "ลิงปีนต้นไม้"
      ],
      [
        "bear",
        "หมี",
        "แบร์",
        "The bear is big.",
        "หมีตัวใหญ่"
      ],
      [
        "snake",
        "งู",
        "สเนค",
        "There is a snake in the grass.",
        "มีงูอยู่ในพงหญ้า"
      ],
      [
        "turtle",
        "เต่า",
        "เทอร์-เทิล",
        "The turtle moves slowly.",
        "เต่าเคลื่อนที่ช้า"
      ],
      [
        "butterfly",
        "ผีเสื้อ",
        "บัท-เทอร์-ฟลาย",
        "A butterfly is on the flower.",
        "มีผีเสื้ออยู่บนดอกไม้"
      ]
    ]
  },
  {
    "id": "objects",
    "title": "สิ่งของใกล้ตัว",
    "en": "Everyday things",
    "icon": "objects",
    "color": "rose",
    "tip": "ลองชี้ของรอบตัวแล้วพูด This is a… หรือ It is my… คำนามนับได้เอกพจน์ต้องมีคำกำหนด เช่น a book / my phone. ระวัง glasses (แว่นตา) ใช้รูปพหูพจน์: My glasses are on the table.",
    "rows": [
      [
        "book",
        "หนังสือ",
        "บุค",
        "This is my book.",
        "นี่คือหนังสือของฉัน"
      ],
      [
        "pen",
        "ปากกา",
        "เพน",
        "May I borrow your pen?",
        "ฉันขอยืมปากกาของคุณได้ไหม"
      ],
      [
        "pencil",
        "ดินสอ",
        "เพน-ซิล",
        "I write with a pencil.",
        "ฉันเขียนด้วยดินสอ"
      ],
      [
        "notebook",
        "สมุด",
        "โนท-บุค",
        "My notebook is in my bag.",
        "สมุดของฉันอยู่ในกระเป๋า"
      ],
      [
        "bag",
        "กระเป๋า",
        "แบก",
        "My bag is blue.",
        "กระเป๋าของฉันสีฟ้า"
      ],
      [
        "phone",
        "โทรศัพท์",
        "โฟน",
        "Where is my phone?",
        "โทรศัพท์ของฉันอยู่ไหน"
      ],
      [
        "key",
        "กุญแจ",
        "คี",
        "I cannot find my key.",
        "ฉันหากุญแจไม่เจอ"
      ],
      [
        "wallet",
        "กระเป๋าสตางค์",
        "วอล-ลิท",
        "My wallet is in my pocket.",
        "กระเป๋าสตางค์อยู่ในกระเป๋าเสื้อหรือกางเกงของฉัน"
      ],
      [
        "watch",
        "นาฬิกาข้อมือ",
        "วอทช์",
        "I wear a watch.",
        "ฉันสวมนาฬิกาข้อมือ"
      ],
      [
        "clock",
        "นาฬิกาแขวนหรือตั้งโต๊ะ",
        "คลอค",
        "The clock is on the wall.",
        "นาฬิกาอยู่บนผนัง"
      ],
      [
        "table",
        "โต๊ะ",
        "เท-เบิล",
        "The cup is on the table.",
        "ถ้วยอยู่บนโต๊ะ"
      ],
      [
        "chair",
        "เก้าอี้",
        "แชร์",
        "Please sit on this chair.",
        "กรุณานั่งเก้าอี้ตัวนี้"
      ],
      [
        "door",
        "ประตู",
        "ดอร์",
        "Please close the door.",
        "กรุณาปิดประตู"
      ],
      [
        "window",
        "หน้าต่าง",
        "วิน-โด",
        "Open the window, please.",
        "กรุณาเปิดหน้าต่าง"
      ],
      [
        "bed",
        "เตียง",
        "เบด",
        "The bed is comfortable.",
        "เตียงนอนสบาย"
      ],
      [
        "pillow",
        "หมอน",
        "พิล-โล",
        "I need another pillow.",
        "ฉันต้องการหมอนอีกใบ"
      ],
      [
        "cup",
        "ถ้วย",
        "คัพ",
        "I would like a cup of tea.",
        "ฉันขอชาหนึ่งถ้วย"
      ],
      [
        "bottle",
        "ขวด",
        "บอท-เทิล",
        "This bottle is empty.",
        "ขวดนี้ว่างเปล่า"
      ],
      [
        "plate",
        "จาน",
        "เพลท",
        "Put the rice on the plate.",
        "ตักข้าวใส่จาน"
      ],
      [
        "spoon",
        "ช้อน",
        "สปูน",
        "I need a spoon.",
        "ฉันต้องการช้อน"
      ],
      [
        "fork",
        "ส้อม",
        "ฟอร์ค",
        "Can I have a fork?",
        "ฉันขอส้อมได้ไหม"
      ],
      [
        "umbrella",
        "ร่ม",
        "อัม-เบรล-ละ",
        "Take an umbrella.",
        "เอาร่มไปด้วย"
      ],
      [
        "shoes",
        "รองเท้า (หลายข้าง / เป็นคู่)",
        "ชูซ",
        "My shoes are by the door.",
        "รองเท้าของฉันอยู่ข้างประตู"
      ],
      [
        "glasses",
        "แว่นตา",
        "กลาส-ซิซ",
        "I wear glasses.",
        "ฉันสวมแว่นตา"
      ]
    ]
  },
  {
    "id": "vegetables",
    "title": "ผักและวัตถุดิบ",
    "en": "Vegetables",
    "icon": "sprout",
    "color": "sage",
    "tip": "ฝึกใช้ชื่อผักกับการซื้อของและทำอาหาร เช่น a carrot, two tomatoes และ some spinach. มะเขือเทศอยู่ในหมวดนี้ตามการใช้ทำอาหาร แม้ทางพฤกษศาสตร์เป็นผลไม้.",
    "rows": [
      [
        "carrot",
        "แครอต",
        "แค-เริท",
        "I need a carrot for the soup.",
        "ฉันต้องการแครอตหนึ่งหัวสำหรับซุป"
      ],
      [
        "tomato",
        "มะเขือเทศ",
        "ทะ-เม-โท",
        "These tomatoes are ripe.",
        "มะเขือเทศเหล่านี้สุกแล้ว"
      ],
      [
        "potato",
        "มันฝรั่ง",
        "พะ-เท-โท",
        "I cook a potato for lunch.",
        "ฉันทำมันฝรั่งหนึ่งหัวเป็นอาหารกลางวัน"
      ],
      [
        "onion",
        "หัวหอม",
        "อัน-เยิน",
        "Cut one onion, please.",
        "กรุณาหั่นหัวหอมหนึ่งหัว"
      ],
      [
        "cucumber",
        "แตงกวา",
        "คิว-คัม-เบอร์",
        "The cucumber is fresh.",
        "แตงกวาสด"
      ],
      [
        "cabbage",
        "กะหล่ำปลี",
        "แคบ-บิจ",
        "We bought a cabbage.",
        "เราซื้อกะหล่ำปลีหนึ่งหัว"
      ],
      [
        "lettuce",
        "ผักกาดหอม",
        "เลท-ทิส",
        "I put lettuce in the sandwich.",
        "ฉันใส่ผักกาดหอมในแซนด์วิช"
      ],
      [
        "broccoli",
        "บรอกโคลี",
        "บรอค-คะ-ลี",
        "She likes broccoli.",
        "เธอชอบบรอกโคลี"
      ],
      [
        "cauliflower",
        "กะหล่ำดอก",
        "คอ-ลิ-ฟลาว-เออร์",
        "We eat cauliflower with rice.",
        "เรากินกะหล่ำดอกกับข้าว"
      ],
      [
        "corn",
        "ข้าวโพด",
        "คอร์น",
        "I bought some corn.",
        "ฉันซื้อข้าวโพดมาบ้าง"
      ],
      [
        "pumpkin",
        "ฟักทอง",
        "พัมพ์-คิน",
        "This pumpkin is big.",
        "ฟักทองลูกนี้ใหญ่"
      ],
      [
        "mushroom",
        "เห็ด",
        "มัช-รูม",
        "There are mushrooms in the soup.",
        "มีเห็ดอยู่ในซุป"
      ],
      [
        "spinach",
        "ผักโขม",
        "สพิน-นิช",
        "I add spinach to my meal.",
        "ฉันเติมผักโขมในอาหาร"
      ],
      [
        "eggplant",
        "มะเขือม่วง",
        "เอก-แพลนท์",
        "The eggplant is purple.",
        "มะเขือม่วงมีสีม่วง"
      ],
      [
        "garlic",
        "กระเทียม",
        "การ์-ลิค",
        "Add some garlic to the pan.",
        "ใส่กระเทียมลงในกระทะ"
      ],
      [
        "chili pepper",
        "พริก",
        "ชิล-ลี เพพ-เพอร์",
        "This chili pepper is hot.",
        "พริกเม็ดนี้เผ็ด"
      ]
    ]
  },
  {
    "id": "colors",
    "title": "สีที่ใช้บ่อย",
    "en": "Colors",
    "icon": "spark",
    "color": "sand",
    "tip": "คำบอกสีวางหน้าคำนามได้ เช่น a red bag หรือวางหลัง is/are ได้ เช่น The bag is red. orange เป็นได้ทั้งสีส้มและผลส้ม ดูจากบริบท.",
    "rows": [
      [
        "red",
        "สีแดง",
        "เรด",
        "This apple is red.",
        "แอปเปิลลูกนี้สีแดง"
      ],
      [
        "blue",
        "สีน้ำเงิน / สีฟ้า",
        "บลู",
        "The bag is blue.",
        "กระเป๋าสีน้ำเงิน"
      ],
      [
        "yellow",
        "สีเหลือง",
        "เยล-โล",
        "The banana is yellow.",
        "กล้วยสีเหลือง"
      ],
      [
        "green",
        "สีเขียว",
        "กรีน",
        "The leaf is green.",
        "ใบไม้สีเขียว"
      ],
      [
        "orange",
        "สีส้ม",
        "ออ-รินจ์",
        "Her shirt is orange.",
        "เสื้อของเธอสีส้ม"
      ],
      [
        "purple",
        "สีม่วง",
        "เพอร์-เพิล",
        "These grapes are purple.",
        "องุ่นเหล่านี้สีม่วง"
      ],
      [
        "pink",
        "สีชมพู",
        "พิงค์",
        "The flower is pink.",
        "ดอกไม้สีชมพู"
      ],
      [
        "brown",
        "สีน้ำตาล",
        "บราวน์",
        "My dog is brown.",
        "สุนัขของฉันสีน้ำตาล"
      ],
      [
        "black",
        "สีดำ",
        "แบล็ค",
        "The cat is black.",
        "แมวสีดำ"
      ],
      [
        "white",
        "สีขาว",
        "ไวท์",
        "My shirt is white.",
        "เสื้อของฉันสีขาว"
      ],
      [
        "gray",
        "สีเทา",
        "เกรย์",
        "The sky is gray today.",
        "วันนี้ท้องฟ้าสีเทา"
      ],
      [
        "gold",
        "สีทอง",
        "โกลด์",
        "The ring is gold.",
        "แหวนมีสีทอง"
      ]
    ]
  },
  {
    "id": "clothing",
    "title": "เสื้อผ้าและของสวมใส่",
    "en": "Clothing",
    "icon": "bag",
    "color": "lavender",
    "tip": "ใช้ wear กับการสวมใส่ เช่น I wear a hat. คำว่า pants, jeans, shorts, socks, gloves และ boots มักใช้รูปพหูพจน์: My jeans are blue.",
    "rows": [
      [
        "T-shirt",
        "เสื้อยืด",
        "ที-เชิร์ต",
        "I wear a T-shirt.",
        "ฉันใส่เสื้อยืด"
      ],
      [
        "shirt",
        "เสื้อเชิ้ต",
        "เชิร์ต",
        "My shirt is white.",
        "เสื้อเชิ้ตของฉันสีขาว"
      ],
      [
        "pants",
        "กางเกงขายาว",
        "แพนท์ส",
        "These pants are black.",
        "กางเกงตัวนี้สีดำ"
      ],
      [
        "jeans",
        "กางเกงยีนส์",
        "จีนส์",
        "My jeans are blue.",
        "กางเกงยีนส์ของฉันสีน้ำเงิน"
      ],
      [
        "shorts",
        "กางเกงขาสั้น",
        "ชอร์ทส์",
        "He wears shorts.",
        "เขาใส่กางเกงขาสั้น"
      ],
      [
        "skirt",
        "กระโปรง",
        "สเกิร์ต",
        "Her skirt is red.",
        "กระโปรงของเธอสีแดง"
      ],
      [
        "dress",
        "ชุดเดรส",
        "เดรส",
        "She wears a blue dress.",
        "เธอใส่ชุดเดรสสีน้ำเงิน"
      ],
      [
        "jacket",
        "เสื้อแจ็กเก็ต",
        "แจค-คิท",
        "Take a jacket with you.",
        "เอาเสื้อแจ็กเก็ตไปด้วย"
      ],
      [
        "coat",
        "เสื้อโค้ต",
        "โคท",
        "My coat is warm.",
        "เสื้อโค้ตของฉันอุ่น"
      ],
      [
        "sweater",
        "เสื้อกันหนาวแบบถัก",
        "สเวท-เทอร์",
        "This sweater is soft.",
        "เสื้อกันหนาวตัวนี้นุ่ม"
      ],
      [
        "socks",
        "ถุงเท้า",
        "ซอคส์",
        "My socks are clean.",
        "ถุงเท้าของฉันสะอาด"
      ],
      [
        "hat",
        "หมวกมีปีกโดยรอบ",
        "แฮท",
        "Wear a hat in the sun.",
        "สวมหมวกเมื่ออยู่กลางแดด"
      ],
      [
        "cap",
        "หมวกแก๊ป",
        "แคพ",
        "His cap is red.",
        "หมวกแก๊ปของเขาสีแดง"
      ],
      [
        "scarf",
        "ผ้าพันคอ",
        "สคาร์ฟ",
        "I need a scarf.",
        "ฉันต้องการผ้าพันคอ"
      ],
      [
        "gloves",
        "ถุงมือ",
        "กลัฟส์",
        "These gloves are warm.",
        "ถุงมือคู่นี้อุ่น"
      ],
      [
        "boots",
        "รองเท้าบูต",
        "บูทส์",
        "My boots are wet.",
        "รองเท้าบูตของฉันเปียก"
      ]
    ]
  },
  {
    "id": "transport",
    "title": "ยานพาหนะ",
    "en": "Transport",
    "icon": "route",
    "color": "blue",
    "tip": "พูดการเดินทางด้วย by + พาหนะ เช่น by bus, by train, by car โดยทั่วไปไม่ใส่ a หลัง by. ถ้าพูดว่าขึ้นรถ ใช้ take a bus หรือ take a taxi.",
    "rows": [
      [
        "car",
        "รถยนต์",
        "คาร์",
        "I go to work by car.",
        "ฉันไปทำงานโดยรถยนต์"
      ],
      [
        "bus",
        "รถบัส",
        "บัส",
        "We take a bus to town.",
        "เรานั่งรถบัสเข้าเมือง"
      ],
      [
        "train",
        "รถไฟ",
        "เทรน",
        "The train leaves at nine.",
        "รถไฟออกเก้าโมง"
      ],
      [
        "bicycle",
        "จักรยาน",
        "ไบ-ซิ-เคิล",
        "She rides a bicycle to school.",
        "เธอขี่จักรยานไปโรงเรียน"
      ],
      [
        "motorcycle",
        "รถจักรยานยนต์",
        "โม-เทอร์-ไซ-เคิล",
        "He rides a motorcycle.",
        "เขาขี่รถจักรยานยนต์"
      ],
      [
        "airplane",
        "เครื่องบิน",
        "แอร์-เพลน",
        "The airplane is in the sky.",
        "เครื่องบินอยู่บนท้องฟ้า"
      ],
      [
        "boat",
        "เรือเล็ก",
        "โบท",
        "We cross the river by boat.",
        "เราข้ามแม่น้ำด้วยเรือ"
      ],
      [
        "ship",
        "เรือใหญ่",
        "ชิพ",
        "The ship is at the port.",
        "เรือใหญ่อยู่ที่ท่าเรือ"
      ],
      [
        "taxi",
        "แท็กซี่",
        "แทค-ซี",
        "I take a taxi to the hotel.",
        "ฉันนั่งแท็กซี่ไปโรงแรม"
      ],
      [
        "truck",
        "รถบรรทุก",
        "ทรัค",
        "The truck carries food.",
        "รถบรรทุกขนอาหาร"
      ],
      [
        "subway",
        "รถไฟใต้ดิน",
        "ซับ-เวย์",
        "We travel by subway.",
        "เราเดินทางด้วยรถไฟใต้ดิน"
      ],
      [
        "scooter",
        "สกู๊ตเตอร์",
        "สคู-เทอร์",
        "The child rides a scooter.",
        "เด็กขี่สกู๊ตเตอร์"
      ]
    ]
  },
  {
    "id": "places",
    "title": "สถานที่ในชีวิตประจำวัน",
    "en": "Places",
    "icon": "home",
    "color": "peach",
    "tip": "ใช้ at เพื่อบอกว่าอยู่ที่สถานที่ เช่น at the bank และใช้ to เมื่อเดินทางไป เช่น go to the bank. ในภาษาอังกฤษมักมี the หน้าโรงพยาบาล ร้านค้า และสถานีที่กล่าวถึง.",
    "rows": [
      [
        "school",
        "โรงเรียน",
        "สคูล",
        "The children are at school.",
        "เด็ก ๆ อยู่ที่โรงเรียน"
      ],
      [
        "hospital",
        "โรงพยาบาล",
        "ฮอส-พิ-ทัล",
        "She works at a hospital.",
        "เธอทำงานที่โรงพยาบาล"
      ],
      [
        "bank",
        "ธนาคาร",
        "แบงค์",
        "The bank is near the station.",
        "ธนาคารอยู่ใกล้สถานี"
      ],
      [
        "supermarket",
        "ซูเปอร์มาร์เก็ต",
        "ซู-เปอร์-มาร์-คิท",
        "We buy fruit at the supermarket.",
        "เราซื้อผลไม้ที่ซูเปอร์มาร์เก็ต"
      ],
      [
        "restaurant",
        "ร้านอาหาร",
        "เรส-เทอ-รองท์",
        "This restaurant is open.",
        "ร้านอาหารนี้เปิดอยู่"
      ],
      [
        "café",
        "คาเฟ่",
        "คา-เฟ",
        "Let us meet at the café.",
        "มาเจอกันที่คาเฟ่"
      ],
      [
        "library",
        "ห้องสมุด",
        "ไล-บรา-รี",
        "I read at the library.",
        "ฉันอ่านหนังสือที่ห้องสมุด"
      ],
      [
        "park",
        "สวนสาธารณะ",
        "พาร์ค",
        "We walk in the park.",
        "เราเดินเล่นในสวนสาธารณะ"
      ],
      [
        "airport",
        "สนามบิน",
        "แอร์-พอร์ท",
        "I am at the airport.",
        "ฉันอยู่ที่สนามบิน"
      ],
      [
        "train station",
        "สถานีรถไฟ",
        "เทรน สเท-เชิน",
        "The train station is busy.",
        "สถานีรถไฟคนพลุกพล่าน"
      ],
      [
        "hotel",
        "โรงแรม",
        "โฮ-เทล",
        "Our hotel is near the beach.",
        "โรงแรมของเราอยู่ใกล้ชายหาด"
      ],
      [
        "pharmacy",
        "ร้านขายยา",
        "ฟาร์-มะ-ซี",
        "The pharmacy is open.",
        "ร้านขายยาเปิดอยู่"
      ]
    ]
  },
  {
    "id": "body",
    "title": "ส่วนต่าง ๆ ของร่างกาย",
    "en": "Body",
    "icon": "user",
    "color": "rose",
    "tip": "ชื่อส่วนของร่างกายมักมี my/your/his/her นำหน้า เช่น my head. foot มีรูปพหูพจน์ feet ส่วน hair เมื่อหมายถึงผมโดยรวมมักใช้คำนามนับไม่ได้.",
    "rows": [
      [
        "head",
        "ศีรษะ",
        "เฮด",
        "My head hurts.",
        "ฉันปวดหัว"
      ],
      [
        "hair",
        "ผม",
        "แฮร์",
        "Her hair is long.",
        "ผมของเธอยาว"
      ],
      [
        "face",
        "ใบหน้า",
        "เฟซ",
        "Wash your face.",
        "ล้างหน้าของคุณ"
      ],
      [
        "eye",
        "ตา",
        "อาย",
        "My eye hurts.",
        "ฉันปวดตา"
      ],
      [
        "ear",
        "หู",
        "เอียร์",
        "My ear hurts.",
        "ฉันปวดหู"
      ],
      [
        "nose",
        "จมูก",
        "โนซ",
        "My nose is cold.",
        "จมูกของฉันเย็น"
      ],
      [
        "mouth",
        "ปาก",
        "เมาธ์",
        "Open your mouth, please.",
        "กรุณาอ้าปาก"
      ],
      [
        "hand",
        "มือ",
        "แฮนด์",
        "Raise your hand.",
        "ยกมือของคุณ"
      ],
      [
        "arm",
        "แขน",
        "อาร์ม",
        "My arm is tired.",
        "แขนของฉันเมื่อย"
      ],
      [
        "leg",
        "ขา",
        "เลก",
        "My leg hurts.",
        "ฉันปวดขา"
      ],
      [
        "foot",
        "เท้า",
        "ฟุท",
        "My foot is wet.",
        "เท้าของฉันเปียก"
      ],
      [
        "finger",
        "นิ้วมือ",
        "ฟิง-เกอร์",
        "I cut my finger.",
        "ฉันบาดนิ้วมือ"
      ]
    ]
  }
];
export const vocabularyCategories = categories.map(({rows,...category})=>category);
export const basicVocabulary = categories.flatMap(category=>category.rows.map(([en,th,sound,example,translation,symbol])=>({
 id:category.id+':'+en.toLowerCase().replaceAll(' ','-'),category:category.id,en,th,sound,example,translation,symbol:symbol||''
})));
export function findBasicWords({category='all',query='',unreviewed=false,reviewed=[]}={}){
 const fold=value=>value.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu,'');
 const text=fold(query.trim()),seen=new Set(reviewed);
 return basicVocabulary.filter(w=>(text||category==='all'||w.category===category)&&(!unreviewed||!seen.has(w.id))&&(!text||fold([w.en,w.th,w.symbol,w.symbol.replaceAll(',','')].join(' ')).includes(text)));
}
export function shuffle(items,random=Math.random){
 const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;
}
export function makeVocabularyQuiz(words,{limit=10,random=Math.random}={}){
 return shuffle(words,random).slice(0,limit).map(word=>{
  const others=basicVocabulary.filter(w=>w.category===word.category&&w.id!==word.id&&w.th!==word.th);
  return {word,choices:shuffle([word,...shuffle(others,random).slice(0,3)],random)};
 });
}
