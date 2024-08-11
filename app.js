const express = require('express');
const usersDb = require('./db/users.db.js');



const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World from app.js using GET');
});
app.post('/login', async(req, res) => {
    let data = req.body;
    if (!data.phone) {
        res.send("Phone number is required");
        return;
    }
    if (!data.password) {
        res.send("Password is required");
        return;
    }
    if (data.phone.length != 10) {
        return res.send('Phone number should be 10 digits');
    }
    if (data.password.length < 8) {
        return res.send('Password should be atleast 8 characters');
    }
    

    let userDetails = await usersDb.findOne({ phone: data.phone, password: data.password }).select({ _id: 1 });

    if (!userDetails) {
        return res.send('Invalid phone number or password');
    }

    let updateResult = await usersDb.updateOne({ phone: data.phone, password: data.password }, { lastLogin: new Date() });

    if (updateResult.modifiedCount == 0) {
        return res.send('Last login update failed');
    }

    res.send('Login successful');
    return;
});
app.post('/signup', async (req, res) => {
    try {
        let data = req.body;
        if (!data.phone) {
            res.send("Phone number is required");
            return;
        }
        if (!data.password) {
            res.send("Password is required");
            return;
        }
        if (data.phone.length != 10) {
            return res.send('Phone number should be 10 digits');
        }
        if (data.password.length < 8) {
            return res.send('Password should be atleast 8 characters');
        }
        if (data.password != data.confirmPassword) {
            return res.send('Password and Confirm Password should match');
        }
        if (data.name.split(' ').length < 2) {
            return res.send('Name should have atleast 2 words');
        }


        let checkPhone = await usersDb.findOne({ phone: data.phone }).select({ _id: 1 });

        if(checkPhone){
            return res.send('Phone number already registered');
        }


        let newUser = new usersDb({
            phone: data.phone,
            password: data.password,
            name: data.name
        });
        let result = await newUser.save();
        if (!result) {
            return res.send('Signup Failed due to some error');
        }
        res.send('Signup Successful');
    } catch (error) {
        console.log(error.message);
        res.send('Signup Failed');
    }

});

app.get('/users', async (req, res) => {
    let name = req.query.name;
    let phone = req.query.phone;
    let filter = {};
    if(name){
        filter.name = name;
    }
    if(phone){
        filter.phone = phone;
    }
    if(name && phone){
        return res.send('Please provide either name or phone number to search');
    }
    console.log(filter);
    let users = await usersDb.find(filter).select({name:1,phone:1,_id:1});
    if(users.length == 0){
        return res.send('No users found');
    }
    res.send(users);
});



app.listen(3005);