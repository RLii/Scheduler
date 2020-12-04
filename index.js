const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const Joi = require('joi')
const lowDB = require("lowdb");
const fileSync = require("lowdb/adapters/FileSync");
const { join } = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = lowDB(new fileSync("db.json"))
app.use('/', express.static('dist/se3316-lab5'))
app.use(bodyParser.json())

//console.log(db.get('courses').find({catalog_nbr:"1021B"}).value())
const jason = db.get('courses').value();
const dbSchedule = db.get('schedules').value();
const dbUsers = db.get('users').value();

//*********************************Functionality 1*
app.get('/api/courses', (req, res) => {
    let resultJson = {};
    let result = []
    for(let x = 0; x < jason.length; x++){
        const tempJ = {
            "subject": jason[x].subject,
            "course_code":jason[x].catalog_nbr,
            "class_name": jason[x].className,
            "component": jason[x].course_info[0].ssr_component,
            "class_section" : jason[x].course_info[0].class_section,
            "start_time": jason[x].course_info[0].start_time,
            "end_time": jason[x].course_info[0].end_time,
            "days": jason[x].course_info[0].days,
            "campus" : jason[x].course_info[0].campus,
            "description": jason[x].catalog_description,
            "review": jason[x].review
        }
        result.push(tempJ)
    }
    resultJson.result = result
    res.status(200).send(resultJson);
})

//*********************************Functionality 2*
app.get('/api/courses/course-codes/:subject', (req, res) =>{
    let newJason = jason.filter(element => element.subject.toUpperCase() === req.params.subject.toUpperCase())
    if(newJason.length > 0){
        let resultJason = {};
        let result = []
        for(let x = 0; x < newJason.length; x++){
            const tempJ = {
                "course_code": newJason[x].catalog_nbr,
                "class_name" : newJason[x].className,
                "component" : newJason[x].course_info[0].ssr_component
            }
            result.push(tempJ)
        }
        resultJason.result = result
        res.status(200).send(resultJason);
    }
    else{
        res.status(404).send("The requested subject was not found")
    }
})

//*********************************Functionality 3.1*
app.get('/api/courses/:subject/:courseCode/:courseComp', (req, res)=>{
    let newJason = jason.filter(element => element.subject.toUpperCase() === req.params.subject.toUpperCase() && (element.catalog_nbr == req.params.courseCode.toUpperCase()) && element.course_info[0].ssr_component.toUpperCase() === req.params.courseComp.toUpperCase());
        if(newJason.length > 0){
        let resultJson = {};
        let result = [];
        for(let x = 0; x < newJason.length ; x++){
            const tempJ = {
                "start_time": newJason[x].course_info[0].start_time,
                "end_time": newJason[x].course_info[0].end_time,
                "days": newJason[x].course_info[0].days
            }
            result.push(tempJ)
        }
        resultJson.result = result
        res.status(200).send(resultJson)
        }
        else{
            res.status(404).send("The requested subject, course code or component was not found")
        }
})

//*********************************Functionality 3.2*
app.get('/api/courses/:subject/:courseCode', (req, res)=> {
    let newJason = jason.filter(element => element.subject.toUpperCase() === req.params.subject.toUpperCase() && element.catalog_nbr == req.params.courseCode.toUpperCase());
    if(newJason.length > 0){
        let resultJson = {};
        let result = [];
        for(let x = 0; x < newJason.length ; x++){
            const tempJ = {
                "start_time": newJason[x].course_info[0].start_time,
                "end_time": newJason[x].course_info[0].end_time,
                "days": newJason[x].course_info[0].days
            }
            result.push(tempJ)
        }
        resultJson.result = result
        res.status(200).send(resultJson)
    }
    else{
        res.status(404).send("The requested subject or course code was not found")
    }
})

//**********************************Functionality 4*
app.post('/api/schedules',verifyToken, (req, res)=>{
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
    //using Joi to ensure that the required body contents is filled
    const schema = Joi.object({
        schedule_name : Joi.string().required().max(16),
        public: Joi.bool().required(),
        email: Joi.string().email().required(),
        description: Joi.string().allow('')
    })
    if(schema.validate(req.body).error != undefined)
    {
        res.status(400).send(schema.validate(req.body).error.details[0].message)
        return;
    }

    //Sanitizing body
    req.body.schedule_name = sanitize(req.body.schedule_name);

    var username = dbUsers.filter(x=>x.email == req.body.email)[0].name

    if(dbSchedule.filter(element => element.email == req.body.email).length >20)
    {
        res.status(400).send("You already have 20 course lists made. Please delete some to create more");
        return;
    }
    const filteredDb = dbSchedule.filter(element => element.schedule_name === req.body.schedule_name)
    if(filteredDb.length == 0)
    {
        const dateTime = new Date();
        db.get('schedules')
          .push({"schedule_name" : req.body.schedule_name, 
                 "public" : req.body.public,
                 "email" : req.body.email,
                 "description":req.body.description,
                 "username" : username,
                 "subjects" : [],
                 "course_codes" : [],
                 "components": [],
                 "last_edit": dateTime})
          .write()
        res.status(200).send("Written.")
    }
    else
    {
        res.status(400).send("A schedule with the requested name is already in place")
    }
})
})

//***********************************adds and replaces courses in a schedule
app.put('/api/schedules/schedule-contents',verifyToken, (req, res) => {
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
    //using Joi to ensure that the required body contents is filled
    const schema = Joi.object({
        schedule_name: Joi.string().required().max(20),
        subjects: Joi.array().items(Joi.string()).required().single(),
        course_codes: Joi.array().items(Joi.string()).required().single(),
        components: Joi.array().items(Joi.string()).required().single()
    })
    if(schema.validate(req.body).error != undefined)
    {
        res.status(400).send(schema.validate(req.body).error.details[0].message)
        return;
    }
    if(req.body.subjects.length != req.body.course_codes.length && req.body.course_codes.length != req.body.components.length)
    {
        res.status(400).send("Subjects array and course codes and components must be the same length")
        return;
    }

    //Sanitizing body
    req.body.schedule_name = sanitize(req.body.schedule_name);
    for(var x = 0 ; x < req.body.subjects.length; x++)
    {
        req.body.subjects[x] = sanitize(req.body.subjects[x]);
        req.body.course_codes[x] = sanitize(req.body.course_codes[x]);
        req.body.components[x] = sanitize(req.body.components[x]);
    }

    const filteredDb = dbSchedule.filter(element => element.schedule_name == req.body.schedule_name)
    if(filteredDb[0].email != authData.email){
        res.status(200).send("unauthorized access");
        return

    }
    if(filteredDb.length != 0){
        const dateTime = new Date();
        db.get('schedules')
          .find({schedule_name : req.body.schedule_name})
          .assign({subjects: req.body.subjects})
          .assign({course_codes: req.body.course_codes})
          .assign({components: req.body.components})
          .assign({last_edit: dateTime})
          .write()
    
        res.status(200).send('Written.')
    }
    else{
        res.status(400).send("A schedule with the requested name does not exist")
    }
})
})

//************************************Functionality 6*
app.get('/api/schedules/:name', (req, res) => {
    //sanitize to match database inputs
    req.params.name = sanitize(req.params.name)

    let newJason = dbSchedule.filter(element => element.schedule_name === req.params.name);
    let resultJson = {};
    let result = [];
    for(let x = 0; x < newJason.length ; x++){
        const tempJ = {
            "subjects": newJason[x].subjects,
            "course_codes": newJason[x].course_codes,
            "components": newJason[x].components
        }
        result.push(tempJ)
    }
    resultJson.result = result
    res.status(200).send(resultJson)
})

//************************************Functionality 7*
app.delete('/api/schedule',verifyToken, (req, res)=> {
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
    
    const schema = Joi.object({
        schedule_name: Joi.string().required().max(20)
    })
    if(schema.validate(req.body).error != undefined)
    {
        res.status(400).send(schema.validate(req.body).error.details[0].message)
        return;
    }
    //sanitize
    req.body.schedule_name = sanitize(req.body.schedule_name)

    const filteredDb = dbSchedule.filter(element => element.schedule_name == req.body.schedule_name)
    if(filteredDb[0].email != authData.email)
    {
        res.status(200).send("unauthorized access");
        return
    }

    if(filteredDb.length != 0){
        
        db.get('schedules')
          .remove({schedule_name : req.body.schedule_name})
          .write()
    
        res.status(200).send('Deleted.')
    }
    else{
        res.status(400).send("A schedule with the requested name does not exist")
    }
})
})

//************************************Functionality 8*//show all schedules
app.get('/api/schedules', (req, res)=> {
    let resultJson = {};
    let result = [];
    for(let x = 0; x < dbSchedule.length; x++)
    {
        let tempJ = {}
        if(dbSchedule[x].course_codes != undefined){
            tempJ = {
                "schedule_name" : dbSchedule[x].schedule_name,
                "email" : dbSchedule[x].email,
                "public": dbSchedule[x].public,
                "subjects" : dbSchedule[x].subjects,
                "components" : dbSchedule[x].components,
                "username" : dbSchedule[x].username,
                "course_codes": dbSchedule[x].course_codes,
                "last_edit": dbSchedule[x].last_edit,
                "description" : dbSchedule[x].description,
                "num_of_courses": dbSchedule[x].course_codes.length
            }
        }
        else
        {
            tempJ = {
                "schedule_name" : dbSchedule[x].schedule_name,
                "last_edit": dbSchedule[x].last_edit,
                "public": dbSchedule[x].public,
                "email" : dbSchedule[x].email,
                "username" : dbSchedule[x].username,
                "description" : dbSchedule[x].description,
                "num_of_courses": 0
            }
        }
        result.push(tempJ)
    }
    resultJson.result = result;
    res.send(resultJson)
})


//Add new user to the database
app.post('/api/users', (req, res) => {
     //using Joi to ensure that the required body contents is filled
     const schema = Joi.object({
        name: Joi.string().required().max(30),
        email: Joi.string().email().required().max(30),
        password: Joi.string().required().max(30)
    })
    if(schema.validate(req.body).error != undefined)
    {
        res.status(400).send(schema.validate(req.body).error.details[0].message)
        return;
    }

    //Sanitizing body
    req.body.name = sanitize(req.body.name);
    req.body.email = sanitize(req.body.email);
    req.body.password = sanitize(req.body.password);

    if(dbUsers.filter(x => x.email == req.body.email).length != 0)
    {
        res.status(400).send("There is already an account with that email.");
        return;
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt)
    db.get('users')
      .push({name : req.body.name,
            email : req.body.email,
            hash : hash,
            salt : salt,
            active: true,
            siteManager: false})
      .write()

    res.status(200).send('Registration Successful!')
})

//Login!
app.get('/api/users/:email/:password', (req, res) =>{
    req.params.email = sanitize(req.params.email);
    req.params.password = sanitize (req.params.password);

    const userInfo = dbUsers.filter(x => x.email == req.params.email);
    if(userInfo.length == 0)
    {
        res.status(400).send("The following combination is not correct. Please try again")
        return;
    }
    if(userInfo[0].active == false)
    {
        res.status(400).send("The account has been deactivated. Please contact the site admin.")
        return;
    }
    const salt = userInfo[0].salt;
    if(bcrypt.hashSync(req.params.password, salt) == userInfo[0].hash)
    {
        const token = jwt.sign({email: req.params.email, admin: userInfo[0].siteManager}, 'supersecretshhhhh')
        res.status(200).send(token)
    }
})
//verifies user and returns the payload
app.get('/api/verify', verifyToken, (req, res)=>{
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send({});
            return
        }
        else{
            res.status(200).send(authData);
        }
    })
})

//edits schedule content with a provided token
app.put('/api/schedules/edit', verifyToken, (req, res) => {
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        console.log(req.body);
        const email = authData.email;
        const schema = Joi.object({
            schedule_name: Joi.string().required().max(30),
            new_name: Joi.string().required().max(30),
            public: Joi.boolean().required(),
            description: Joi.string().allow(''),
            subjects: Joi.array().items(Joi.string()).required().single(),
            course_codes: Joi.array().items(Joi.string()).required().single(),
            components: Joi.array().items(Joi.string()).required().single()
        })
        if(schema.validate(req.body).error != undefined)
        {
            res.status(400).send(schema.validate(req.body).error.details[0].message)
            return;
        }
    
        //Sanitizing body
        req.body.new_name = sanitize(req.body.new_name);
        req.body.schedule_name = sanitize(req.body.schedule_name);
        req.body.description = sanitize(req.body.description);
        for(var x = 0 ; x < req.body.subjects.length; x++)
        {
            req.body.subjects[x] = sanitize(req.body.subjects[x]);
            req.body.course_codes[x] = sanitize(req.body.course_codes[x]);
            req.body.components[x] = sanitize(req.body.components[x]);
        }
    
        const filteredDb = dbSchedule.filter(element => element.schedule_name == req.body.schedule_name)
        if(filteredDb[0].email != authData.email)
        {
            res.status(200).send("unauthorized access");
            return
        }
        if(filteredDb.length != 0){
            const dateTime = new Date();
            db.get('schedules')
            .find({schedule_name : req.body.schedule_name})
            .assign({schedule_name : req.body.new_name})
            .assign({public: req.body.public})
            .assign({description: req.body.description})
            .assign({subjects: req.body.subjects})
            .assign({course_codes: req.body.course_codes})
            .assign({components: req.body.components})
            .assign({last_edit: dateTime})
            .write()
        
            res.status(200).send('Written.')
        }
        else{
            res.status(400).send("A schedule with the requested name does not exist")
        }

    })
})

//Add review to course
app.put('/api/courses/review', verifyToken, (req, res)=>{
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        const email = authData.email;
        const dateTime = new Date();

        const schema = Joi.object({
            subject: Joi.string().required(),
            course_code: Joi.string().required(),
            component: Joi.string().required(),
            review : Joi.string().required()
        })
        if(schema.validate(req.body).error != undefined)
        {
            res.status(400).send(schema.validate(req.body).error.details[0].message)
            return;
        }

        req.body.subject = sanitize(req.body.subject);
        req.body.course_code = sanitize(req.body.course_code);
        req.body.component = sanitize(req.body.component);
        req.body.review = sanitize(req.body.review);

        let username = dbUsers.filter(x => x.email == email)[0].name;

        const filteredDb = jason.filter(element => element.subject == req.body.subject && element.catalog_nbr == req.body.course_code && element.course_info[0].ssr_component == req.body.component)
        if(filteredDb.length != 0){
            const dateTime = new Date();
            if(filteredDb[0].review == undefined)
            {
                db.get('courses')
                .find({subject : req.body.subject, catalog_nbr : req.body.course_code, course_info:[{ssr_component:req.body.component}]})
                .assign({review:[{
                    content: req.body.review,
                    user: username,
                    date: dateTime,
                    hidden: false
                }]})
                .write()
            }
            else
            { 
                db.get('courses')
                .find({subject : req.body.subject, catalog_nbr : req.body.course_code, course_info:[{ssr_component:req.body.component}]})
                .get('review')
                .push({
                    content: req.body.review,
                    user: username,
                    date: dateTime,
                    hidden: false
                })
                .write()
            }
            res.status(200).send('Written.')
        }
        else{
            res.status(400).send("A course with the requested info is non existant")
        }

    
})
})

//get all users for admin stuff
app.get('/api/allusers',verifyToken, (req, res)=>{
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        if(authData.admin == false){
            console.log("?")
            res.status(200).send("unauthorized access");
            return
        }
    let resultJson = {};
    let result = []
    let filteredDb = dbUsers.filter(x => x.email != "admin@admin.ca")
    for(let x = 0; x < filteredDb.length; x++){
        const tempJ = {
            "user": filteredDb[x].name,
            "email":filteredDb[x].email,
            "active": filteredDb[x].active,
            "siteManager": filteredDb[x].siteManager
        }
        result.push(tempJ)
    }
    resultJson.result = result
    res.status(200).send(resultJson);
})
})
//admin sets user stats
app.put('/api/updateuser',verifyToken, (req, res) =>{
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        const email = authData.email;
        const dateTime = new Date();

        const schema = Joi.object({
            account_email: Joi.string().required(),
            reason: Joi.string().required()
        })
        if(schema.validate(req.body).error != undefined)
        {
            res.status(400).send(schema.validate(req.body).error.details[0].message)
            return;
        }
        req.body.account_email = sanitize(req.body.account_email)
        req.body.reason = sanitize(req.body.reason);


        if(req.body.reason == "editmanager")
        {
            if(email != "admin@admin.ca")
            {
                res.status(400).send("You are incapable of editing this...")
            }
            if(dbUsers.filter(x=>x.email == req.body.account_email)[0].siteManager == true)
            {
                db.get('users')
                .find({email: req.body.account_email})
                .assign({siteManager: false})
                .write()
            }
            else
            {
                db.get('users')
                .find({email: req.body.account_email})
                .assign({siteManager: true})
                .write()
            }
        }
        else if(req.body.reason =="editactive")
        {
            if(dbUsers.filter(x=>x.email == req.body.account_email)[0].active == true)
            {
                db.get('users')
                .find({email: req.body.account_email})
                .assign({active: false})
                .write()
            }
            else
            {
                db.get('users')
                .find({email: req.body.account_email})
                .assign({active: true})
                .write()
            }
        }
        else
        {
            res.status(400).send("No purpose here...");
        }
        res.status(200).send("success")


    
})

})

//get all reviews
app.get('/api/reviews',verifyToken, (req, res)=> {
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        if(authData.admin == false){
            console.log("?")
            res.status(200).send("unauthorized access");
            return
        }
    let resultJson = {};
    let result = []
    let filteredDb = db.get('courses').value().filter(x => x.review !== undefined)
    for(let x = 0; x < filteredDb.length; x++){
        for(let y = 0; y < filteredDb[x].review.length;y++)
        {
            const tempJ = {
                "content": filteredDb[x].review[y].content,
                "user":filteredDb[x].review[y].user,
                "date": filteredDb[x].review[y].date,
                "hidden" : filteredDb[x].review[y].hidden
            }
            result.push(tempJ)
        }
    }
    resultJson.result = result
    res.status(200).send(resultJson);
})
})
//admin sets review hidden or not
app.put('/api/updatereview',verifyToken, (req, res) =>{
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        const email = authData.email;
        const dateTime = new Date();

        const schema = Joi.object({
            content: Joi.string().required(),
            user: Joi.string().required(),
            date: Joi.string().required()
        })
        if(schema.validate(req.body).error != undefined)
        {
            res.status(400).send(schema.validate(req.body).error.details[0].message)
            return;
        }
        req.body.content = sanitize(req.body.content);
        req.body.user = sanitize(req.body.user);
        req.body.date = sanitize(req.body.date)


        if(authData.admin)
        {
            const hiddenValue = db.get('courses')
            .find({review:[{content:req.body.content,
                            user: req.body.user,
                            date : req.body.date}]})
            .get('review')
            .find({date:req.body.date})
            .get('hidden')
            .value()
            
            if(hiddenValue == false)
            {
                db.get('courses')
                .find({review:[{content:req.body.content,
                                user: req.body.user,
                                date : req.body.date}]})
                .get('review')
                .find({date:req.body.date})
                .assign({hidden:true})
                .write()
            }
            else
            {
                db.get('courses')
                .find({review:[{content:req.body.content,
                                user: req.body.user,
                                date : req.body.date}]})
                .get('review')
                .find({date:req.body.date})
                .assign({hidden:false})
                .write()
            }
        }
        else
        {
            res.status(400).send("unauthorized access")
        }
        
        res.status(200).send("success")


    
})

})

//get all policies
app.get('/api/policies',verifyToken, (req, res)=> {
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        if(authData.admin == false){
            res.status(200).send("unauthorized access");
            return
        }
        
        let tempJ = {
            "snp": db.get('snp').value().content,
            "aup": db.get('aup').value().content,
            "dmca": db.get('dmca').value().content
        }
        
    
    res.status(200).send(tempJ);
})
})

//admin changes a policy
app.put('/api/updatepolicy',verifyToken, (req, res) =>{
    jwt.verify(req.token, 'supersecretshhhhh',(err, authData) =>{
        if(err){
            res.status(200).send("unauthorized access");
            return
        }
        const email = authData.email;
        const dateTime = new Date();

        const schema = Joi.object({
            content: Joi.string().required(),
            policy: Joi.string().required()
        })
        if(schema.validate(req.body).error != undefined)
        {
            res.status(400).send(schema.validate(req.body).error.details[0].message)
            return;
        }
        req.body.content = sanitize(req.body.content)
        req.body.policy = sanitize(req.body.policy);


        if(req.body.reason == "snp")
        {
            db.get('snp')
            .assign({content : content})
            .write()
        }
        else if(req.body.reason =="aup")
        {
            db.get('aup')
            .assign({content : content})
            .write()
        }
        else if(req.body.reason == "dmca")
        {
            db.get('dmca')
            .assign({content : content})
            .write()
        }
        else
        {
            res.status(400).send("No purpose here...");
        }
        res.status(200).send("success")


    
})

})



function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    console.log(req.headers)
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.status("403").send("Please Log in before accessing this functionality");
    }

}

function sanitize (string){
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})
