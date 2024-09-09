const express = require('express');
const testUser = require('../middleware/testUser');

const { authenticateUser } = require('../middleware/authentication');
const { authenticateUsers } = require('../middleware/full-auth');

const router = express.Router();
const{ postRent,updatePost, deletePost , getAllPosts ,getPost  } = require('../controllers/postRent');

router.route('/').post(authenticateUser, postRent).get(getAllPosts );
router.route('/:id').get(getPost);
router.patch('/:id', authenticateUser,updatePost);
router.delete('/:id', authenticateUser, deletePost);



module.exports = router;
