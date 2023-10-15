import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: 'signup', component: SignUpComponent},
  {path : 'login', component: LoginComponent},
  {path : 'chat', component: ChatComponent},
  { path: 'chat-room', component: ChatRoomComponent, canActivate: [AuthGuard]}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
