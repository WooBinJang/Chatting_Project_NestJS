import { Schema, Prop, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  id: false, // false 안할 경우 작성한id 와  _id 유니크한 키가 동일하게 키값이 들어감
  collection: 'sockets', //컬렉션 이름 설정
  timestamps: true, // create update 시 시간 체크
};

@Schema(options)
export class Socket extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export const SocketSchema = SchemaFactory.createForClass(Socket);
