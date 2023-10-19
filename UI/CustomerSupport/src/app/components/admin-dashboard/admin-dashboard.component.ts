import { Component, inject,OnChanges, SimpleChanges,Input, OnInit  } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{

  public rooms$= new BehaviorSubject<string[]>([]);
  selectedCategory= sessionStorage.getItem("category");
  chatService= inject(ChatService);
  router=inject(Router);
  private listSubject = new BehaviorSubject<string[]>([]);

  list$ = this.listSubject.asObservable();
  rooms:string[]=[];
  loggedInUserName=sessionStorage.getItem("user");
  constructor(){
    console.log("Dobavljena kategorija: ", this.selectedCategory);

    const savedListJSON = localStorage.getItem('listaStringova');
        const list = savedListJSON ? JSON.parse(savedListJSON) : [];
        console.log("Sacuvana lista" , list);
        this.listSubject.next(list);

        if(this.selectedCategory!=null){
        this.rooms = list.filter((string:string|null ) => {
          return string !== null && string.includes(this.selectedCategory as string);
        });
        }
        this.listSubject.next(list);
        console.log("Sobee:", this.rooms);
        console.log("broj soba : ", this.rooms.length);
        console.log("Korisnik:", this.loggedInUserName);
        
        this.rooms$.next(this.rooms);
        console.log(this.rooms$);
  }
  ngOnInit(): void {
  
    
  
   
  }
 
  joinAdmin(room:string){
    this.chatService.joinRoom(this.loggedInUserName as string,room)
    .then(()=>{
        this.router.navigate(['chat']);
    }).catch((error)=>{
      console.log("Url greska: ", this.chatService.connection.baseUrl);
      console.log(error);
    })

  }

  showClick(){
    const savedListJSON = localStorage.getItem('listaStringova');
    const list = savedListJSON ? JSON.parse(savedListJSON) : [];
    console.log("Sacuvana lista" , list);
    this.listSubject.next(list);

    if(this.selectedCategory!=null){
    this.rooms = list.filter((string:string|null ) => {
      return string !== null && string.includes(this.selectedCategory as string);
    });
    this.rooms$.next(this.rooms);
    }
  }
  
}
