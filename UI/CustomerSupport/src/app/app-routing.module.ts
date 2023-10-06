import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

const routes: Routes = [
  { path: 'signup', component: SignUpComponent},
  {path : 'login', component: LoginComponent},
  { path: 'chat-room', component: ChatRoomComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
