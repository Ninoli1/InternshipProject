import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  selectedValue : string ="";
  options: string[]=[];
  type: string = "password";
  isText : boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm! : FormGroup;
  chatService= inject(ChatService)
  formBuilder= inject(FormBuilder)
  authService= inject(AuthenticationService)
  categoriesService = inject(CategoriesService);
  router=inject(Router)
  user: User={
    id:'',
    username:'',
    password:'',
    email:'',
    firstName:'',
    lastName:'',
    role:'',
    token:''
  }

  constructor() {
    
    this.categoriesService.getAllCategories().subscribe({
      next: (response)=>{
        this.options = ["Problem category", ...response];

        console.log("opcije: ", this.options);
        
        this.selectedValue=this.options[0];
      }
    })
     
  }

  ngOnInit(): void {
    this.buildLoginForm();


  }

  buildLoginForm(){
    this.loginForm=this.formBuilder.group({
      username: ['', Validators.required],
      password: ['',Validators.required]
    })
  }

  hideOrShowPassword(){
    this.isText= ! this.isText;

    this.isText ? this.eyeIcon="fa-eye" : this.eyeIcon= "fa-eye-slash";
    this.isText ? this.type="text" : this.type="password";
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.logUser();
     
    }else{
      console.log("All fields required");
      this.validateAllFields(this.loginForm);
      alert("Invalid user!");
    }
  }

  private validateAllFields(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field =>{
      const control= formGroup.get(field);

      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true})
      }else if(control instanceof FormGroup){
        this.validateAllFields(control);
      }
    })

  }

  private logUser(){

    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

      if(usernameControl && passwordControl){
        const username=usernameControl.value;
        const password = passwordControl.value;
        //populate fields
        this.user.username=username;
        this.user.password= password;
        this.user.id= "00000000-0000-0000-0000-000000000000";

        console.log(this.user);

        this.callAuthService();
      }
  }

  private callAuthService(){
    this.authService.logInUser(this.user).subscribe({
      next: (response)=>{
        console.log(response.message);
        this.user.role=response.role;
        console.log("Role: ",this.user.role);
        alert(response.message);
        this.authService.storeToken(response.token);
       this.connectToChatRoom();  
      },
      error: (response)=>{
        console.log(response);
        alert(response);
      }
    })
  }

  private connectToChatRoom(){

    const user= this.user.username;
    const room= this.selectedValue.toString()+"-"+ this.user.username.toString();
    sessionStorage.setItem("user", user);
    this.chatService.joinRoom(user,room)
    .then(()=>{
      if(this.user.role=="Admin"){
        sessionStorage.setItem("category", this.selectedValue);
        console.log("Kategorija admina" , this.selectedValue);
        
        this.router.navigate(['admin-dashboard']);
      }else{
        
        this.chatService.addRoom(room);
        console.log("Dodata soba u listu soba");

        const sacuvanaListaStringovaJSON = localStorage.getItem('listaStringova');
        const sacuvanaListaStringova = sacuvanaListaStringovaJSON ? JSON.parse(sacuvanaListaStringovaJSON) : [];
        sacuvanaListaStringova.push(room);
        localStorage.setItem('listaStringova', JSON.stringify(sacuvanaListaStringova));
        
        console.log(room);
        console.log("Sacuvana lista",localStorage.getItem('listaStringova'));
        console.log(this.chatService.getRoomsForCategory(this.selectedValue));
        this.router.navigate(['chat']);
      }
      
      

    }).catch((error)=>{
      console.log("Url greska: ", this.chatService.connection.baseUrl);
      console.log(error);
    })
  }

  generateRandomString() {
    const length = 10; 
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Dozvoljeni karakteri

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return  result;
  }
}
