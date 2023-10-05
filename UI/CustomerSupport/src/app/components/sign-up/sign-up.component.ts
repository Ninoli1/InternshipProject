import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{
  
  type: string = "password";
  isText : boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signupForm! : FormGroup;
  user : User={
    id:'',
    username : '',
    firstName:'',
    lastName:'',
    token:'',
    role:'',
    email:'',
    password:''
  };

 
  constructor(private formBuilder: FormBuilder,private authService: AuthenticationService) {}

  ngOnInit(): void {
   this.buildSignupForm();

  }

  buildSignupForm(){
    this.signupForm=this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
    })

  }
  hideOrShowPassword(){
    this.isText= ! this.isText;

    this.isText ? this.eyeIcon="fa-eye" : this.eyeIcon= "fa-eye-slash";
    this.isText ? this.type="text" : this.type="password";
  }

  onSubmit(){
    if(this.signupForm.valid){
      const usernameControl= this.signupForm.get('username');
      const firstNameControl= this.signupForm.get('firstName');
      const lastNameControl= this.signupForm.get('lastName');
      const emailControl= this.signupForm.get('email');
      const passwordControl=this.signupForm.get('password');

      if(usernameControl && firstNameControl && lastNameControl && emailControl && passwordControl){
        this.user.id= "00000000-0000-0000-0000-000000000000";
        this.user.username= usernameControl.value;
        this.user.firstName=firstNameControl.value;
        this.user.lastName= lastNameControl.value;
        this.user.email= emailControl.value;
        this.user.password= passwordControl.value;
        this.user.role= "User";
        this.authService.registerUser(this.user).subscribe({
          next: (message)=>{
            console.log(message);
            alert(message);
          },
          error: (response)=>{
            console.log(response);
          }
      });

      }
      
    }else{
      console.log("All fields required");
      console.log(this.signupForm.value);
      this.validateAllFields(this.signupForm);
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
