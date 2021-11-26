import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';
@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name) private readonly chttingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor');
  }
  afterInit() {
    //생성자(constructor) 다음으로 실행
    this.logger.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    //클라이언트가 연결되자마자 실행
    this.logger.log(`connected : ${socket.id}  ${socket.nsp.name}`);
  }
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    //클라이언트가 연결이 끈기자마자 실행
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete();
    }
    this.logger.log(`disconnected : ${socket.id}  ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user') // 해당하는 이벤트(new_user) 찾기
  async handleUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }

    socket.emit('hello_user', 'hello' + username); // 서버에서 클라이언트로 보내기

    socket.broadcast.emit('user_connected', username); // broadcasting 연결된 모든 네트워크에 데이터를 전송(모든 소켓한테 데이터 전송)
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });

    await this.chttingModel.create({
      user: socketObj,
      chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObj.username,
    });
  }
}
