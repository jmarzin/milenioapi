const fs = require('fs');
const REPERTOIRE_CAROUSEL = 'public/contenu/accueil/carousel';

function photoUpload(req, res, next) {
    if (req.body.destination === "carousel_accueil") {
        fs.copyFile(req.file.path,
            req.file.destination + '/contenu/accueil/carousel/' + req.file.originalname,
            (err) => {
            if(err) {
                return next(err)
            } else {
                fs.unlinkSync(req.file.path);
                res.status(200)
                    .json({name: '/contenu/accueil/carousel/' + req.file.originalname})
            }
            })
    }
}
function dans(data, image) {
    for(var i = 0 ; i < data.length ; i ++) {
        if(data[i].photo.endsWith(image)) return true;
    }
    return false
}

function getAccueilCarousel(req, res, next) {
    var data = [];
    const fileName = `${REPERTOIRE_CAROUSEL}/affiche.json`;
    if(fs.existsSync(fileName)) {
        let chaine = fs.readFileSync(fileName, 'utf8');
        data = JSON.parse(chaine);
    }
    let images = fs.readdirSync(REPERTOIRE_CAROUSEL).filter(n => n.toLowerCase().endsWith('.jpg'))
    for(var i = 0 ; i < images.length ; i++) {
        if(!dans(data, images[i])) {
            data.push({caption: "", photo: `${REPERTOIRE_CAROUSEL.replace('public/', '')}/${images[i]}`, affiche: false})
        }
    }
    res.status(200)
        .json(data)
}

function postAccueilCarousel(req, res, next) {
    let liste = req.body.liste;
    if(req.body.menage) {
        liste = liste.filter(f => f.affiche);
        let fichiers = fs.readdirSync(REPERTOIRE_CAROUSEL);
        for(var i = 0 ; i < fichiers.length ; i++) {
            let fichier = fichiers[i];
            if(!fichier.endsWith('affiche.json') && !fichier.endsWith('.DS_Store')) {
                if(!dans(liste, fichier)) {
                    fs.unlinkSync(`${REPERTOIRE_CAROUSEL}/${fichier}`)
                }
            }
        }
    }
    fs.writeFileSync('public/contenu/accueil/carousel/affiche.json', JSON.stringify(liste), 'utf8');
    res.status(200)
        .json('affiche.json sauvegardé')
}

module.exports = {
    photoUpload: photoUpload,
    getAccueilCarousel: getAccueilCarousel,
    postAccueilCarousel: postAccueilCarousel
};
