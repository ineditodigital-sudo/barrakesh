import fs from 'fs';
const data = JSON.parse(fs.readFileSync('public/backend/firebase.json', 'utf8'));
for (const key in data.barbers) {
    if (data.barbers[key]) {
        console.log(key, data.barbers[key].image.substring(0, 50));
    }
}
