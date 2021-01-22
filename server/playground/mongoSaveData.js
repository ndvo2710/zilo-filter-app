const connectDB = require('../config/connectDB');
const jsonData = require('../data.json');
const ZillowModel = require('../models/zillow.model.js');


connectDB();

const temp = jsonData['Manor'][0];
temp['location'] = 'Manor';
console.log(temp);

const saveHouse = async (houseDict) => {
    const newHouse = new ZillowModel(houseDict);
    try {
        await newHouse.save();
        return newHouse;
    } catch (e) {
        throw new Error(`save new book to DB failed\n${e}`);
    }
}

saveHouse(temp);