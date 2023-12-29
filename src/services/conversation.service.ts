import { Service } from 'typedi';
import { Repository, DataSource } from 'typeorm';
import { AppError } from '~/models/Error';
import { bool } from 'yup';
import { MessageTypes } from '~/constants/enum';
import Conversation from '~/models/databases/Conversation';
import Participant from '~/models/databases/Participant';
import { User } from '~/models/databases/User';
import Message from '~/models/databases/Message';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';

@Service()
class ConversationService {
  private conversationRepository: Repository<Conversation>;
  private messageRepository: Repository<Message>;
  private participantRepository: Repository<Participant>;
  constructor(dataSource: DataSource) {
    this.conversationRepository = dataSource.getRepository(Conversation);
    this.messageRepository = dataSource.getRepository(Message);
    this.participantRepository = dataSource.getRepository(Participant);
  }
  public createConversation = async (user_id: string, other_user_id: string) => {
    const conversation = await this.conversationRepository.save(new Conversation());
    const participant = new Participant();
    participant.user_id = user_id;
    participant.conversation_id = conversation.id;
    const otherParticipant = new Participant();
    otherParticipant.user_id = other_user_id;
    otherParticipant.conversation_id = conversation.id;
    conversation.participants = [participant, otherParticipant];
    const res = await this.conversationRepository.save(conversation);
    return this.getConversationById(res.id);
  };

  public async getConversationByUserIdAndOtherUserId(user_id: string, other_user_id: string) {
    if (user_id === other_user_id) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.ConversationMessage.youCannotCreateConversationWithYourself,
        {
          serverCode: ServerCodes.ConversationCode.CanNotCreateWithYourSelf,
        },
      );
    }
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndMapMany('conversation.users', User, 'user', 'user.id = participant.user_id')
      .where(
        'conversation.id IN (SELECT A.conversation_id FROM participants A JOIN participants B ON A.conversation_id = B.conversation_id WHERE A.user_id = :user_id AND B.user_id = :other_user_id)',
        {
          user_id,
          other_user_id,
        },
      )
      .getOne();
    return conversation;
  }

  public async getConversationByUserIdAndConversationId(user_id: string, conversation_id: string) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndMapMany('conversation.users', User, 'user', 'user.id = participant.user_id')
      .where('participant.user_id = :user_id', { user_id })
      .andWhere('conversation.id = :conversation_id', { conversation_id })
      .getOne();
    return conversation;
  }

  public async getConversations(user_id: string) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.id IN (SELECT conversation_id FROM participants WHERE user_id = :user_id)', { user_id })
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndMapOne('conversation.last_message', Message, 'message', 'message.id = conversation.last_messsage_id')
      .leftJoinAndMapMany('conversation.users', User, 'user', 'user.id = participant.user_id')
      .getMany();
    return conversations;
  }

  public async getOrCreateConversation(user_id: string, other_user_id: string) {
    let isExist: boolean = true;
    let conversation = await this.getConversationByUserIdAndOtherUserId(user_id, other_user_id);
    if (!conversation) {
      conversation = await this.createConversation(user_id, other_user_id);
      isExist = false;
    }
    return {
      conversation,
      isExist,
    };
  }

  public async deleteConversation(conversation_id: string) {
    const conversation = await this.getConversationById(conversation_id);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    await this.messageRepository.delete({ conversation_id: conversation.id });
    await this.participantRepository.delete({ conversation_id: conversation.id });
    await this.conversationRepository.delete({ id: conversation.id });
  }

  public async getConversationById(conversation_id: string) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.id = :conversation_id', { conversation_id })
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndMapOne('conversation.last_message', Message, 'message', 'message.id = conversation.last_messsage_id')
      .leftJoinAndMapMany('conversation.users', User, 'user', 'user.id = participant.user_id')
      .getOne();
    return conversation;
  }

  private sendMessage = async (conversation_id: string, user_id: string, type: MessageTypes, content: string) => {
    const message = new Message();
    message.conversation_id = conversation_id;
    message.content_type = type;
    message.sender_id = user_id;
    // message.content = {
    //   text: content,
    // };
    if (type === MessageTypes.text) {
      message.content = {
        text: content,
      };
    } else if (type === MessageTypes.media) {
      message.content = {
        media: content,
      };
    }
    return await this.messageRepository.save(message);
  };

  public async sendMessageToConversation(
    conversation_param: string | Conversation,
    user_id: string,
    type: MessageTypes,
    content: string,
  ) {
    let conversation_id: string;
    let conversation: Conversation | null = null;
    if (typeof conversation_param === 'string') {
      conversation_id = conversation_param;
      conversation = await this.getConversationById(conversation_id);
    } else {
      conversation_id = conversation_param.id;
      conversation = conversation_param;
    }
    const message = await this.sendMessage(conversation_id, user_id, type, content);
    conversation!.last_message = message;
    conversation!.last_messsage_id = message.id;
    const tasks: Promise<any>[] = [];
    for (let i = 0; i < conversation!.participants.length; i++) {
      if (conversation!.participants[i].is_active === false) {
        conversation!.participants[i].is_active = true;
        conversation!.participants[i].joined_at = new Date();
        tasks.push(this.participantRepository.save(conversation!.participants[i]));
      }
    }
    tasks.push(this.conversationRepository.save(conversation!));
    await Promise.all(tasks);
    return {
      conversation,
      message,
    };
  }

  public async deleteConversationOneSide(user_id: string, conversation_id: string): Promise<void> {
    const conversation = await this.getConversationById(conversation_id);
    if (!conversation) {
      throw AppError.notFound('Conversation not found');
    }
    const ids = [];
    // Update is_active to false
    conversation.participants.forEach((participant) => {
      if (participant.user_id === user_id) {
        participant.is_active = false;
        ids.push(participant.user_id);
      }
    });
    // If all participants are inactive, delete conversation
    const isAllParticipantsInactive = conversation.participants.every((participant) => participant.is_active === false);
    if (isAllParticipantsInactive) {
      await this.deleteConversation(conversation_id);
      console.log('delete conversation completely');
    } else {
      await this.participantRepository.save(conversation.participants);
      console.log('Delete conversation one side');
    }
  }

  public async getMessages(conversation_id: string): Promise<Message[]> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversation_id = :conversation_id', { conversation_id })
      .orderBy('message.sent_at', 'DESC')
      .getMany();
    return messages;
  }
}

export default ConversationService;
