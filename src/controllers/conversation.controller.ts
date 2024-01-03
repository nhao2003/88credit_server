import ConversationService from '~/services/conversation.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import AppResponse from '~/models/typing/AppRespone';
@Service()
class ConversationController {
  private conversationService: ConversationService;
  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService;
  }
  public getOrCreateConversation = wrapRequestHandler(async (req: Request, res: Response) => {
    const { user_id, other_user_id } = req.body;
    const conversation = await this.conversationService.getOrCreateConversation(user_id, other_user_id);
    const appResponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get or create conversation successfully',
      result: conversation,
    };
    res.status(200).json(appResponse);
  });

  public getConversations = wrapRequestHandler(async (req: Request, res: Response) => {
    const { user_id } = req.body;
    const conversations = await this.conversationService.getConversations(user_id);
    const appResponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get conversations successfully',
      result: conversations,
    };
    res.status(200).json(appResponse);
  });

  public deleteConversation = wrapRequestHandler(async (req: Request, res: Response) => {
    const { conversation_id } = req.body;
    const conversation = await this.conversationService.deleteConversation(conversation_id);
    const appResponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Delete conversation successfully',
      result: conversation,
    };
    res.status(200).json(appResponse);
  });

  public getConversationById = wrapRequestHandler(async (req: Request, res: Response) => {
    const { conversation_id } = req.body;
    const conversation = await this.conversationService.getConversationById(conversation_id);
    const appResponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get conversation by id successfully',
      result: conversation,
    };
    res.status(200).json(appResponse);
  });

  public getConversationByUserIdAndConversationId = wrapRequestHandler(async (req: Request, res: Response) => {});

  public sendMessage = wrapRequestHandler(async (req: Request, res: Response) => {
    const { user_id, type, conversation_id, content } = req.body;
    const message = await this.conversationService.sendMessageToConversation(conversation_id, type, user_id, content);
    const appResponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Send message successfully',
      result: message,
    };
    res.status(200).json(appResponse);
  });

  public getOrCreateConversationByUserId = wrapRequestHandler(async (req: Request, res: Response) => {
    const { other_user_id } = req.body;
    const user_id = req.user!.id;
    const conversation = await this.conversationService.getOrCreateConversation(user_id, other_user_id);
    const appResponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get or create conversation by user id successfully',
      result: conversation.conversation,
    };
    res.status(200).json(appResponse);
  });
}
export default ConversationController;
