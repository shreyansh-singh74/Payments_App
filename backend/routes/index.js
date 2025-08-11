const express = require('express');
const userRoute = require('./user');

// Single Router
const router = express.Router();

router.use('/user',userRoute);


// export 
module.exports = router;