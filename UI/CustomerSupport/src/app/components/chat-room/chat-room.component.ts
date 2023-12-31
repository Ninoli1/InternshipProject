import { AfterViewChecked, Component, ElementRef, OnInit ,ViewChild,inject} from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked{

  chatService= inject(ChatService);
  router= inject(Router);
  messages: any[]=[];
  inputMessage="";
  loggedInUserName=sessionStorage.getItem("user");
  @ViewChild('scroll') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.chatService.messages$.subscribe(response=>{
      this.messages=response;
      console.log("Porukee : ",this.messages);
    })
    console.log("Trenutni ulogovani korisnik: ", this.loggedInUserName);
  }

  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop= this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage(){
    this.chatService.SendMessage(this.inputMessage)
    .then(()=>{
      this.inputMessage='';
    }).catch((error)=>{
      console.log(error);
    })

  }

  leaveChat(){
    this.chatService.LeaveRoom()
    .then(()=>{
      this.router.navigate(['login']);

      this.chatService.connection= new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7252/chat', {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  }).build();
      this.chatService.connection.start();
      
    }).catch((error)=>{
      console.log(error)
    })
  }


  
}
