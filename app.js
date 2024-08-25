const express = require('express');
const usersDb = require('./db/users.db.js');



const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World from app.js using GET');
});
app.post('/login', async (req, res) => {
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

        if (checkPhone) {
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
    if (name) {
        filter.name = name;
    }
    if (phone) {
        filter.phone = phone;
    }
    if (name && phone) {
        return res.send('Please provide either name or phone number to search');
    }
    console.log(filter);
    let users = await usersDb.find(filter).select({ password:0, __v:0 });
    if (users.length == 0) {
        return res.send('No users found');
    }
    res.send(users);
});

app.post('/update/dob', async (req, res) => {
    let dob = req.body.dob;
    let userId = req.body.userId;
    if (!userId) {
        return res.send('User id is required');
    }
    if (!dob) {
        return res.send('Date of Birth is required');
    }

    let updateResult = await usersDb.updateOne({ _id: userId }, { dob: dob });

    if (updateResult.modifiedCount == 0) {
        return res.send('Date of birth update failed');
    }
    res.send('Update successful');
    return;
});

app.post('/update/name', async(req,res) => {
    let userId=req.body.userId;
    let newName=req.body.newName;
    if(!userId){
        return res.send('User id is required');
    }
    if(!newName){
        return res.send('New Name is required');
    }
    let updateResult=await usersDb.updateOne({_id:userId},{name:newName});
    if(updateResult.modifiedCount==0){
        return res.send('Name update failed');
    }

    res.send('Name updated successfully');
    return;
});

app.post('/update/institute', async(req,res) => {
    let userId=req.body.userId;
    let institute=req.body.institute;
    if(!userId){
        return res.send('User id is required');
    }
    if(!institute){
        return res.send('Institute is required');
    }
    let updateResult=await usersDb.updateOne({_id:userId},{institute:institute});
    if(updateResult.modifiedCount==0){
        return res.send('Institute name update failed');
    }

    res.send('Institute name updated successfully');
    return;
});

app.post('/update/standard', async(req,res) => {
    let userId=req.body.userId;
    let standard=req.body.standard;
    if(!userId){
        return res.send('User id is required');
    }
    if(!standard){
        return res.send('Standard is required');
    }
    let updateResult=await usersDb.updateOne({_id:userId},{standard:standard});
    if(updateResult.modifiedCount==0){
        return res.send('Standard update failed');
    }

    res.send('Standard updated successfully');
    return;
});

app.post('/update/name/dob', async(req,res) => {
    let dob=req.body.dob;
    let userId=req.body.userId;
    let newName=req.body.newName;
    if(!userId){
        return res.send('User id is required');
    }
    if(!newName){
        return res.send('New Name is required');
    }
    if(!dob){
        return res.send('Date of birth is required');
    }
    let updateResult=await usersDb.updateMany({_id:userId},{dob:dob,name:newName});
    if(updateResult.modifiedCount==0){
        return res.send('Name and Date of birth update failed');
    }

    res.send('Name and Date of birth updated successfully');
    return; 
})
    




app.listen(3005);