import express from 'express';
import postController from '../controller/postController.js';

const router = express.Router();

router.get('/', postController.getPosts);

router.get('/:postId',postController.getPost);

router.patch('/:postId',postController.updatePost);

router.delete('/:postId',postController.deletePost);

router.get('/:postId/reply',postController.getReplys);

router.post('/create',postController.createPost);

router.post('/:postId/reply',postController.createReply);

router.put('/:postId/reply/:replyId',postController.updateReply);

router.delete('/:postId/reply/:replyId',postController.deleteReply);

export default router;