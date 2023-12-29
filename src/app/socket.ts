import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import DependencyInjection from '~/di/di';
import ConversationService from '~/services/conversation.service';
import { instrument } from '@socket.io/admin-ui';
import AuthServices from '~/services/auth.service';
import Conversation from '~/models/databases/Conversation';

enum SocketEvent {
  Init = 'init',
  New = 'new',
  Update = 'update',
  Delete = 'delete',
}

export async function createSocketServer(server: HttpServer | HttpsServer) {
  const conversationService = DependencyInjection.get<ConversationService>(ConversationService);
  const authService = DependencyInjection.get<AuthServices>(AuthServices);
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000/',
        'https://admin.socket.io/',
        'https://socket.io/',
        'http://localhost:3000',
        'https://admin.socket.io',
      ],
      credentials: true,
    },
  });

  // Set up admin UI
  instrument(io, {
    auth: false,
    mode: 'development',
  });

  // Conversations namespace
  const chatNamespace = io.of('/conversations');
  chatNamespace.on('connection', async (socket: Socket) => {
    let conversations: Conversation[] = [];
    const token = getTokenFromSocket(socket);
    if (!token) {
      handleInvalidUserId(socket);
      return;
    }
    let user_id: string;
    try {
      const user = await authService.verifyUserByAccessToken(token);
      if (!user) {
        handleInvalidUserId(socket);
        return;
      }
      user_id = user.id;
    } catch (error: any) {
      handleSocketError(socket, error);
      return;
    }

    console.log('User connected: ', user_id);
    console.log(socket.handshake.query);
    socket.join(user_id);
    try {
      conversations = await conversationService.getConversations(user_id);
      console.log(conversations);
      chatNamespace.to(user_id).emit('conversations', {
        type: SocketEvent.Init,
        data: conversations,
      });
    } catch (error: any) {
      handleSocketError(socket, error);
    }
    socket.on('get_or_create_conversation', async (arg) => {
      console.log('Get_or_create_conversation: ', arg);
      try {
        const other_user_id = arg.other_user_id;
        const { conversation, isExist } = await conversationService.getOrCreateConversation(user_id, other_user_id);
        if (!isExist) {
          conversations.push(conversation!);
          chatNamespace.to(other_user_id).emit('conversations', {
            type: SocketEvent.New,
            data: conversation,
          });
        }
        chatNamespace.to(user_id).emit('conversations', {
          type: SocketEvent.New,
          data: conversation,
        });
      } catch (error: any) {
        handleSocketError(socket, error);
      }
    });

    socket.on('init_chat', async (arg) => {
      const { conversation_id } = arg ?? null;
      console.log('Init chat: ', conversation_id);
      try {
        const conversation = await conversationService.getConversationByUserIdAndConversationId(
          user_id,
          conversation_id,
        );
        if (!conversation) {
          handleInvalidConversation(socket);
          return;
        }
        socket.join(conversation_id);
        console.log('Join conversation: ', conversation_id);

        const messages = await conversationService.getMessages(conversation_id);
        chatNamespace.to(conversation_id).emit('messages', {
          type: SocketEvent.Init,
          conversation_id,
          data: messages,
        });
      } catch (error: any) {
        console.log(error);
        handleSocketError(socket, error);
      }
    });
    socket.on('send_message', async (arg) => {
      try {
        console.log('Send message: ', arg);
        const content = arg.content;
        const conversation_id = arg.conversation_id;
        const type = arg.type;
        let conversation_param: string | Conversation = conversation_id as string;
        for (let i = 0; i < conversations.length; i++) {
          if (conversations[i].id === conversation_id) {
            conversation_param = conversations[i];
            break;
          }
        }
        const { conversation, message } = await conversationService.sendMessageToConversation(
          conversation_param,
          user_id,
          type,
          content,
        );

        for (let i = 0; i < conversations.length; i++) {
          if (conversations[i].id === conversation_id) {
            conversations[i] = conversation!;
            break;
          }
        }

        chatNamespace.to(conversation_id).emit('messages', {
          type: SocketEvent.New,
          conversation_id,
          data: message,
        });

        conversation!.participants.forEach((participant) => {
          chatNamespace.to(participant.user_id).emit('conversations', {
            type: SocketEvent.Update,
            data: conversation,
          });
        });
      } catch (error: any) {
        handleSocketError(socket, error);
      }
    });
    socket.on('delete_conversation', async (arg) => {
      try {
        const conversation_id = arg.conversation_id;
        await conversationService.deleteConversationOneSide(user_id, conversation_id);
        chatNamespace.to(user_id).emit('conversations', {
          type: SocketEvent.Delete,
          data: {
            id: conversation_id,
          },
        });
      } catch (error: any) {
        handleSocketError(socket, error);
      }
    });
  });
  return io;
}

function getTokenFromSocket(socket: Socket): string | null {
  return socket.handshake.auth.token || socket.handshake.headers.authorization || null;
}

function getConversationIdFromSocket(socket: Socket): string | null {
  return (socket.handshake.query.conversation_id as string) || null;
}

function handleInvalidConversationId(socket: Socket): void {
  socket.disconnect();
}

function handleInvalidUserId(socket: Socket): void {
  socket.emit('conversations', []); // Send an empty conversations array
  socket.disconnect();
}

function handleInvalidConversation(socket: Socket): void {
  socket.disconnect();
}

function handleSocketError(socket: Socket, error: Error): void {
  console.error(`Socket error: ${error.message}`);
  console.error(error.stack);
  socket.disconnect();
}
