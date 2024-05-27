import { AfterViewInit, Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

declare var google: any;

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [],
  templateUrl: './login-google.component.html',
  styleUrl: './login-google.component.scss',
})
export class LoginGoogleComponent implements AfterViewInit {
  isSignin = false;
  isSignup = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    const renderGoogleSignInButton = () => {
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id:
            '742366415553-74nr7e8mmoj23oqepblq9nhqk49rvtth.apps.googleusercontent.com',
          callback: this.handleCredentialResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            shape: 'pill',
            logo_alignment: 'left',
          }
        );
      } else {
        setTimeout(renderGoogleSignInButton, 100);
      }
    };

    renderGoogleSignInButton();
  }

  handleCredentialResponse(response: any) {
    const token = jwtDecode(response.credential);
  }
}
