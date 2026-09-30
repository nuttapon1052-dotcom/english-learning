import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./browser',use:{baseURL:'http://127.0.0.1:5173',headless:true,viewport:{width:1440,height:1000},screenshot:'only-on-failure'},
 webServer:{command:'npm run dev -- --host 127.0.0.1',url:'http://127.0.0.1:5173/english-learning/',reuseExistingServer:!process.env.CI},
 reporter:'list',retries:process.env.CI?1:0
});
