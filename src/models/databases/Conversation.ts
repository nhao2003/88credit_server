import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Participant from './Participant';
import Message from './Message';
import { User } from './User';
import { PostgresDataType } from '~/constants/database_constants';
interface IConversation {
  id: string;
  created_at: Date;
  last_messsage_id: string;
  is_active: boolean;
}
@Entity('conversations')
class Conversation extends BaseEntity implements IConversation {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @CreateDateColumn({ type: PostgresDataType.date })
  created_at!: Date;

  @Column({ type: PostgresDataType.uuid, nullable: true })
  last_messsage_id!: string;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;

  @OneToMany(() => Participant, (participant) => participant.conversation, { cascade: true })
  @JoinColumn({ name: 'id' })
  participants!: Participant[];

  @OneToMany(() => Message, (message) => message.conversation, { cascade: true })
  @JoinColumn({ name: 'id' })
  messages!: Message[];

  users: User[] | null = null;

  last_message: Message | null = null;
}

export default Conversation;
