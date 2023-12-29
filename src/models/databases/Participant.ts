import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import Conversation from './Conversation';
import Message from './Message';
import { PostgresDataType, DatabaseDefaultValues } from '~/constants/database_constants';
interface IParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: Date;
  read_last_message_at: Date | null;
  is_active: boolean;
}
@Entity('participants')
class Participant implements IParticipant {
  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the Conversation ID.' })
  conversation_id!: string;

  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the User ID.' })
  user_id!: string;

  @CreateDateColumn({
    type: PostgresDataType.timestamp_without_timezone,
    default: DatabaseDefaultValues.now,
    comment: 'This is the timestamp of the participant.',
  })
  joined_at!: Date;

  @Column({
    type: PostgresDataType.timestamp_without_timezone,
    default: DatabaseDefaultValues.now,
    nullable: true,
    comment: 'This is the timestamp of the last message read by the participant.',
  })
  read_last_message_at!: Date;

  @Column({
    type: PostgresDataType.boolean,
    default: 'true',
    comment: 'This is the flag that indicates if the participant is active.',
  })
  is_active!: boolean;

  @ManyToOne(() => Conversation, (conversation) => conversation.participants)
  @JoinColumn({ name: 'conversation_id' })
  conversation!: Conversation;

  @OneToMany(() => Message, (message) => message.sender)
  @JoinColumn({ name: 'user_id' })
  messages!: Message[];
}
export default Participant;
