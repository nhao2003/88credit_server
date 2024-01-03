import { Router } from 'express';
import ConversationController from '~/controllers/conversation.controller';

import DependencyInjection from '~/di/di';
import AuthValidation from '~/middlewares/auth.middleware';
const router = Router();
const conversationController = DependencyInjection.get<ConversationController>(ConversationController);
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
router.post('/', conversationController.getOrCreateConversation);
router.delete('/', conversationController.deleteConversation);
router.get('/', conversationController.getConversations);
router.get('/id', conversationController.getConversationById);
router.post('/message', conversationController.sendMessage);
// Get or create conversation by other user id
router.get('/user/:id', authValidation.accessTokenValidation, conversationController.getOrCreateConversationByUserId);
export default router;
