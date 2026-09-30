# เปิดเข้าสู่ระบบด้วย Google / Gmail

โค้ดเว็บไซต์พร้อมใช้ Google ผ่าน Supabase Auth เมื่อเปิด provider แล้ว ผู้เรียนกดปุ่ม เลือกบัญชี Google และกลับมาเรียนต่อ ไม่ต้องตั้งรหัสผ่านของเว็บหรือรออีเมลยืนยันจากเว็บอีกครั้ง

## 1. สร้าง Google OAuth Client

1. เข้า https://console.cloud.google.com/ แล้วเลือกโปรเจกต์ที่ต้องการ หรือสร้างโปรเจกต์ใหม่
2. ไป Google Auth Platform (บางหน้าจออยู่ใน APIs & Services → OAuth consent screen)
3. ใน Branding ใส่ชื่อแอป English with Yuri อีเมลติดต่อ และข้อมูลที่ Google ขอ
4. ใน Audience เลือก External เพื่อให้บัญชี Gmail ทั่วไปเข้าได้ หากสถานะเป็น Testing เพิ่มอีเมลที่จะทดลองใน Test users
5. ไป Clients → Create client → เลือก **Web application** ชื่อ English Learning
6. Authorized JavaScript origins ใส่:
   `https://nuttapon1052-dotcom.github.io`
7. Authorized redirect URIs ใส่ **URL นี้แบบตรงตัว**:
   `https://jurihnhvhcagtdghlget.supabase.co/auth/v1/callback`
8. สร้างแล้วเก็บ Client ID และ Client secret ไว้ใช้ใน Supabase

Google ส่งกลับมาที่ Supabase callback ก่อน ส่วน Supabase จะส่งกลับไปเว็บเรียนอีกครั้ง อย่าใช้ URL ของ GitHub Pages แทน callback ในข้อ 7

## 2. เปิด Google ใน Supabase

1. เปิดโปรเจกต์ `jurihnhvhcagtdghlget`
2. ไป Authentication → Sign In / Providers (หรือ Providers) → Google
3. เปิด Enable sign in with Google
4. ใส่ Client ID และ Client secret จาก Google Cloud แล้ว Save
5. Authentication → URL Configuration:
   - Site URL: `https://nuttapon1052-dotcom.github.io/english-learning/`
   - Redirect URLs: เพิ่ม URL เดียวกันข้างบน

**Client secret ใส่เฉพาะใน Supabase Dashboard ห้ามส่งในแชต ใส่ในโค้ดเว็บ หรือ commit เข้า GitHub** เว็บใช้ publishable key เดิม ไม่ต้องสร้าง API key ใหม่หรือรัน SQL ใหม่

## 3. ทดสอบ

1. เปิด https://nuttapon1052-dotcom.github.io/english-learning/#account
2. กด “เข้าสู่ระบบด้วย Google” เลือกบัญชีที่เป็น Test user ถ้ายังอยู่ใน Testing
3. หลังกลับมา ต้องเห็นชื่อบัญชีและสถานะซิงก์ในหน้าบัญชี
4. เรียนหนึ่งบท ออกจากระบบ แล้วใช้บัญชีเดิมในอีกเบราว์เซอร์เพื่อตรวจความก้าวหน้า

ผู้เรียนที่สมัครด้วยอีเมลเดิมอาจใช้บัญชีเดียวกันได้ผ่าน automatic identity linking ของ Supabase สำหรับอีเมลที่ยืนยันแล้ว ตรวจว่าเป็นบัญชีเดิมและข้อมูลยังอยู่ก่อนใช้งานจริง

ก่อนเปิดให้ผู้เรียนทุกคนใช้ เปลี่ยน Audience จาก Testing เป็น Production ตามขั้นตอน Google และทำการยืนยันแอปหาก Google ขอ เว็บใช้ข้อมูลชื่อ/อีเมล/โปรไฟล์พื้นฐาน ไม่ได้ขอสิทธิ์อ่าน Gmail

## หากยังเข้าไม่ได้

- ข้อความ Google ยังไม่เปิดใช้งาน: กลับไปเปิด Google provider และกด Save ใน Supabase
- redirect_uri_mismatch: ตรวจ Authorized redirect URIs ใน Google Cloud ว่าตรงกับ Supabase callback ทุกตัวอักษร
- access_denied หรือผู้ใช้ไม่ได้รับอนุญาต: เพิ่มบัญชีเป็น Test user หรือจัดการสถานะ Audience ของแอป Google
- กลับเว็บแล้วไม่เห็นบัญชี: ตรวจ Site URL / Redirect URLs ใน Supabase และเปิดลิงก์เดิมในเบราว์เซอร์หลักของเครื่อง

ระบบรองรับ OAuth callback พร้อมตรวจ token ผ่าน Supabase ก่อนแสดงบัญชี จากนั้นลบ token ออกจาก URL และซิงก์ข้อมูลภายใต้ RLS เดิม การทดสอบอัตโนมัติใช้ provider/callback จำลอง ไม่มีการสร้างบัญชี Google หรือส่งอีเมลจริง
