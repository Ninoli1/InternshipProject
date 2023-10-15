import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService  {

  public connection: signalR.HubConnection;
  

  public messages: any[]=[];
  public users: string[]=[];
  public messages$= new BehaviorSubject<any>([]);
  public users$= new BehaviorSubject<string[]>([]);


  constructor(){
    this.connection= new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7252/chat', {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  }).build();
    this.start();
    this.connection.on("RecieveMessage", (user:string, message:string, sentTime:string)=>{
      this.messages= [...this.messages,{user,message,sentTime}]
      this.messages$.next(this.messages);

    });
    const room= "chatRoom";
    this.connection.on("ConnectedUser", (room)=>{
      console.log("Ulogovani : ", room);
      this.users$.next(room);
    })

  }

  //connection start
  public async start(){
    try{
      console.log("Url : ",this.connection.baseUrl)
      await this.connection.start();
    }catch(error){
    console.log(error)
    console.log("Url : ", this.connection.baseUrl)
    }
  }
  
  //join room
  public async joinRoom(user:string,room:string){
    return this.connection.invoke("JoinRoom", {user,room});
  }

  //send message
  public async SendMessage(message:string){
    return this.connection.invoke("SendMessage",message );
  }

  //leave
  public async LeaveRoom(){
    this.connection.stop();
  }

}
