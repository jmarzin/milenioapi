var express = require('express');
var router = express.Router();

const basicAuth = require('basic-auth');

const auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }
    let user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }
    if (user.name === 'admin' && user.pass === '51julie2') {
        return next();
    } else {
        return unauthorized(res);
    }
};

const multer  = require('multer');

const traitements = require('../traitements');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/photoupload',
    auth,
    multer({ dest: 'public' }).single('photo'),
    traitements.photoUpload);

router.get('/accueil/carousel', traitements.getAccueilCarousel);

router.post('/accueil/carousel', auth, traitements.postAccueilCarousel);

module.exports = router;
