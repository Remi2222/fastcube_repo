const express = require('express');
const router = express.Router();
const tendersController = require('../controllers/tenders.controller');
const { auth } = require('../middlewares/auth');


let upload;
try {
  const multer = require('multer');
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Type de fichier non autorisé. Seuls PDF, DOC, DOCX et TXT sont acceptés.'), false);
      }
    }
  });
} catch (error) {
  console.log('Multer non installé, utilisation du mode temporaire');
  
  upload = {
    single: (fieldName) => (req, res, next) => {
      
      next();
    }
  };
}


router.get('/test', (req, res) => {
  res.json({ message: 'Route tenders fonctionne !' });
});


router.post('/test-formdata', upload.single('cahierCharges'), (req, res) => {
  console.log('=== TEST FORMDATA ===');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  console.log('====================');
  
  res.json({
    success: true,
    message: 'Test FormData réussi',
    body: req.body,
    file: req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : null
  });
});


router.get('/', tendersController.getAllTenders); 
router.get('/:id', tendersController.getTenderById); 


router.get('/:id/download', auth, tendersController.downloadCahierCharges); 


router.post('/', auth, upload.single('cahierCharges'), tendersController.createTender); 
router.put('/:id', auth, upload.single('cahierCharges'), tendersController.updateTender); 
router.delete('/:id', auth, tendersController.deleteTender); 


router.use((error, req, res, next) => {
  console.error('Erreur dans les routes tenders:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

module.exports = router; 