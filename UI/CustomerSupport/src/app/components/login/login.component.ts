import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
constructor(private formBuilder: FormBuilder ) {}

  ngOnInit(): void {
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
      //
      console.log(this.loginForm.value);
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
