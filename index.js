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
            "days": jason[x].course_info[0].days
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
app.post('/api/schedules', (req, res)=>{
    //using Joi to ensure that the required body contents is filled
    const schema = Joi.object({
        schedule_name : Joi.string().required().max(16)
    })
    if(schema.validate(req.body).error != undefined)
    {
        res.status(400).send(schema.validate(req.body).error.details[0].message)
        return;
    }

    //Sanitizing body
    req.body.schedule_name = sanitize(req.body.schedule_name);

    const filteredDb = dbSchedule.filter(element => element.schedule_name === req.body.schedule_name)
    if(filteredDb.length == 0)
    {
        db.get('schedules')
          .push({"schedule_name" : req.body.schedule_name})
          .write()
        res.status(200).send("Written.")
    }
    else
    {
        res.status(400).send("A schedule with the requested name is already in place")
    }

})

//***********************************Functionality 5*
app.put('/api/schedules/schedule-contents', (req, res) => {
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
    if(filteredDb.length != 0){
        
        db.get('schedules')
          .find({schedule_name : req.body.schedule_name})
          .assign({subjects: req.body.subjects})
          .assign({course_codes: req.body.course_codes})
          .assign({components: req.body.components})
          .write()
    
        res.status(200).send('Written.')
    }
    else{
        res.status(400).send("A schedule with the requested name does not exist")
    }
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
app.delete('/api/schedule', (req, res)=> {
    
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

//************************************Functionality 8*
app.get('/api/schedules', (req, res)=> {
    let resultJson = {};
    let result = [];
    for(let x = 0; x < dbSchedule.length; x++)
    {
        let tempJ = {}
        if(dbSchedule[x].course_codes != undefined){
            tempJ = {
                "schedule_name" : dbSchedule[x].schedule_name,
                "num_of_courses": dbSchedule[x].course_codes.length
            }
        }
        else
        {
            tempJ = {
                "schedule_name" : dbSchedule[x].schedule_name,
                "num_of_courses": 0
            }
        }
        result.push(tempJ)
    }
    resultJson.result = result;
    res.send(resultJson)
})

//*************************************Functionality 9*
app.delete('/api/schedules', (req, res)=> {
    db.get('schedules')
      .remove({})
      .write()
    
    res.send("Deleted.")
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
            salt : salt})
      .write()

    res.status(200).send('Registration Successful!')
})

app.get('/api/users/:email/:password', (req, res) =>{
    req.params.email = sanitize(req.params.email);
    req.params.password = sanitize (req.params.password);

    const userInfo = dbUsers.filter(x => x.email == req.params.email);
    if(userInfo.length == 0)
    {
        res.status(400).send("The following combination is not correct. Please try again")
    }
    const salt = userInfo[0].salt;
    if(bcrypt.hashSync(req.params.password, salt) == userInfo[0].hash)
    {
        const token = jwt.sign({email: req.params.email,uberSecret: "wow this is so secret "+ req.params.email.substring(1)}, 'supersecretshhhhh')
        res.status(200).send(token)
    }
})

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
