import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  type: string = "password";
  isText : boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm! : FormGroup;
  chatService= inject(ChatService)
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
constructor(private formBuilder: FormBuilder,private authService: AuthenticationService,private router: Router ) {}

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
      const usernameControl = this.loginForm.get('username');
      const passwordControl = this.loginForm.get('password');

      if(usernameControl && passwordControl){
        const username=usernameControl.value;
        const password = passwordControl.value;

        this.user.username=username;
        this.user.password= password;
        this.user.id= "00000000-0000-0000-0000-000000000000";
        console.log(this.user);
        this.authService.logInUser(this.user).subscribe({
          next: (response)=>{
            console.log(response.message);
            alert(response.message);
            this.authService.storeToken(response.token);

            const user= this.user.username;
            const room= "chatRoom";
            this.chatService.start();
            sessionStorage.setItem("user", user);
            this.chatService.joinRoom(user,room)
            .then(()=>{
              this.router.navigate(['chat-room']);

            }).catch((error)=>{
              console.log(error);
            })
           

            
          },
          error: (response)=>{
            console.log(response);
            alert(response);
          }
        })
      }
     
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
}
