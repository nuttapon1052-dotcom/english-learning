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
  }
];
export const vocabularyCategories = categories.map(({rows,...category})=>category);
export const basicVocabulary = categories.flatMap(category=>category.rows.map(([en,th,sound,example,translation,symbol])=>({
 id:category.id+':'+en.toLowerCase().replaceAll(' ','-'),category:category.id,en,th,sound,example,translation,symbol:symbol||''
})));
export function findBasicWords({category='all',query='',unreviewed=false,reviewed=[]}={}){
 const text=query.trim().toLocaleLowerCase(),seen=new Set(reviewed);
 return basicVocabulary.filter(w=>(text||category==='all'||w.category===category)&&(!unreviewed||!seen.has(w.id))&&(!text||[w.en,w.th,w.symbol,w.symbol.replaceAll(',','')].join(' ').toLocaleLowerCase().includes(text)));
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
