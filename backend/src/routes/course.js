const express= require('express');

const router= express.Router();

const {generateCourse}=require('../controllers/courseController');

router.post('/generate',generateCourse);

module.exports=router;