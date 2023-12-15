import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  VirtualColumn,
} from 'typeorm';
import { DatabaseDefaultValues, PostgresDataType } from '~/constants/database_constants';
interface IBlog {
  id: string;
  created_at: Date;
  title: string;
  short_description: string;
  author: string;
  thumbnail: string;
  content: string;
  is_active: boolean;
}

@Entity('blogs')
class Blog extends BaseEntity implements IBlog {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  created_at!: Date;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  title!: string;

  @Column({ type: PostgresDataType.text })
  short_description!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  author!: string;

  @Column({ type: PostgresDataType.text })
  thumbnail!: string;

  @Column({ type: PostgresDataType.text })
  content!: string;

  @Column({ type: PostgresDataType.boolean, default: DatabaseDefaultValues.true })
  is_active!: boolean;

  //   @OneToMany(() => UserBlogFavorite, (userBlogFavorite) => userBlogFavorite.blog)
  //   @JoinColumn({ name: 'id', referencedColumnName: 'blog_id' })
  //   user_blog_favorites!: UserBlogFavorite[];

  //   @VirtualColumn({
  //     query: (alias) => `SELECT COUNT(*) FROM user_blog_views WHERE user_blog_views.blog_id = ${alias}.id`,
  //   })
  //   num_views!: number;

  //   // @VirtualColumn({
  //   //   query: (alias) => `SELECT COUNT(*) FROM user_blog_favorites WHERE user_blog_favorites.blog_id = ${alias}.id`,
  //   // })
  //   // num_of_favorites!: number;

  //   @VirtualColumn({
  //     query: (alias) =>
  //       `SELECT CASE
  //         WHEN EXISTS (SELECT * FROM user_blog_favorites WHERE user_blog_favorites.blog_id = ${alias}.id AND user_blog_favorites.user_id = :current_user_id) THEN TRUE
  //         ELSE FALSE
  //     END`,
  //   })
  //   is_favorite!: boolean;
}
export default Blog;
