import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit,AfterViewChecked{

  selectedCategory= sessionStorage.getItem("category");
  chatService= inject(ChatService);
  router= inject(Router);
  messages: any[]=[];
  users: any[]=[];
  rooms:string[]=[];
  inputMessage="";
  loggedInUserName=sessionStorage.getItem("user");
  @ViewChild('scroll') private scrollContainer!: ElementRef;

  ngOnInit(): void {
   this.manageMessagesAndUsers();
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
/*
  leaveChat(){
    this.chatService.LeaveRoom()
    .then(()=>{
      this.removeRoom();
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

  removeRoom(){
    const savedListJSON = localStorage.getItem('listaStringova');
        const list = savedListJSON ? JSON.parse(savedListJSON) : [];
        
        
       const stringToRemove= this.selectedCategory+"-"+this.loggedInUserName;
        if(stringToRemove!=null){
        this.rooms = list.filter((item: string) => item !== stringToRemove);
        }
        localStorage.setItem('listaStringova', JSON.stringify(this.rooms));
        console.log("Azurirana lista nakon izbacivanja", this.rooms);
   }
  */

   manageMessagesAndUsers(){
    this.chatService.messages$.subscribe(response=>{
      this.messages=response;
      console.log("Porukee : ",this.messages);
    })
    this.chatService.users$.subscribe(response=>{
      this.users=response;
      console.log("Ulogovani ::", this.users);
    })
   }
}
