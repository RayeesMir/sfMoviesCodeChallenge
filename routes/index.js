const express = require('express');
const router = express.Router();
const MovieCtrl=require('../controllers')
const movies=require('../movies')


router.get('/movie',MovieCtrl.searchMovies)
router.get('/movie/:id',MovieCtrl.getLocations)
router.get('/movies',function (req,res) {
	res.json(movies)
})
module.exports = router;