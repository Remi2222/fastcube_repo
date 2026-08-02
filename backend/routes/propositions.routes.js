const express = require('express');
const router = express.Router();
const propositionsController = require('../controllers/propositions.controller');
const { auth, adminAuth } = require('../middlewares/auth');


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
        'application/zip',
        'application/x-zip-compressed',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Type de fichier non autorisé. Seuls PDF, DOC, DOCX, ZIP et TXT sont acceptés.'), false);
      }
    }
  });
} catch (error) {
  console.log('Multer non installé, utilisation du mode temporaire');
  
  upload = {
    array: (fieldName, maxCount) => (req, res, next) => {
      
      req.files = [];
      next();
    }
  };
}


router.post('/', upload.array('files', 5), propositionsController.createProposal); 


router.get('/my', auth, propositionsController.getUserProposals); 
router.get('/tender/:tenderId', auth, propositionsController.getProposalsByTender); 


router.get('/stats', adminAuth, propositionsController.getProposalsStats); 
router.get('/all', adminAuth, propositionsController.getAllProposals); 
router.get('/:id/files/:fileIndex', adminAuth, propositionsController.downloadFile); 
router.patch('/:id/status', adminAuth, propositionsController.updateProposalStatus); 
router.get('/:id', adminAuth, propositionsController.getProposalById); 
router.delete('/:id', adminAuth, propositionsController.deleteProposal); 


router.use((error, req, res, next) => {
  console.error('Erreur dans les routes propositions:', error);
  
  if (error.message.includes('Type de fichier non autorisé')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

module.exports = router; 