import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

 
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm=this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      confirmPassword: ['',Validators.required]
    })
  }

  hideOrShowPassword(){
    this.isText= ! this.isText;

    this.isText ? this.eyeIcon="fa-eye" : this.eyeIcon= "fa-eye-slash";
    this.isText ? this.type="text" : this.type="password";
  }

  onSubmit(){
    if(this.signupForm.valid){
      //
      console.log(this.signupForm.value);
    }else{
      console.log("All fields required");
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
