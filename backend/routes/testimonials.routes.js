const express = require('express');
const router = express.Router();
const {
  createTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  getTestimonialById,
  getMyTestimonial,
  updateMyTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
  getTestimonialsStats,
  searchTestimonials
} = require('../controllers/testimonials.controller');


const { auth, adminAuth } = require('../middlewares/auth');
const { optionalAuth } = require('../middlewares/optionalAuth');


router.post('/', optionalAuth, createTestimonial); 
router.get('/approved', getApprovedTestimonials); 


router.get('/my', auth, getMyTestimonial); 
router.put('/my', auth, updateMyTestimonial); 


router.get('/stats', adminAuth, getTestimonialsStats); 
router.get('/search', adminAuth, searchTestimonials); 
router.get('/:id', adminAuth, getTestimonialById); 
router.patch('/:id/status', adminAuth, updateTestimonialStatus); 
router.delete('/:id', adminAuth, deleteTestimonial); 


router.get('/', adminAuth, getAllTestimonials); 

module.exports = router; 