import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Subscription, tap } from 'rxjs';
import { UserGoogleRequest } from '../../../model/user-google-request.model';
import { UserResponse } from '../../../model/user-reponse.model';
import { AuthService } from '../../../services/auth.service';
import { AuthGoogleRequest } from '../../../model/auth-google-request.model';

declare var google: any;

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [],
  templateUrl: './login-google.component.html',
  styleUrl: './login-google.component.scss',
})
export class LoginGoogleComponent implements AfterViewInit, OnDestroy {
  @Input() isSignup: boolean = false;
  @Input() isSignin: boolean = false;

  @Output() eventLogin = new EventEmitter<UserResponse>();

  subscription = new Subscription();

  constructor(private readonly authService: AuthService) {}

  ngAfterViewInit(): void {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    const renderGoogleSignInButton = () => {
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id:
            '742366415553-74nr7e8mmoj23oqepblq9nhqk49rvtth.apps.googleusercontent.com',
          callback: this.handleCredentialResponse.bind(this),
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
    const token: any = jwtDecode(response.credential);
    if (this.isSignup) {
      const userReq: UserGoogleRequest = {
        idGoogle: token.sub,
        familyName: token.family_name,
        givenName: token.given_name,
        email: token.email,
        username: token.name,
        emailVerified: token.email_verified,
        sessionExpiration: token.exp,
      };

      this.subscription.add(
        this.authService
          .registerWithGoogle(userReq)
          .pipe(
            tap((userRes) => {
              userRes.googleId = token.sub;
              userRes.googlePicture = token.picture;
              this.eventLogin.next(userRes);
            })
          )
          .subscribe()
      );
    }

    if (this.isSignin) {
      const userReq: AuthGoogleRequest = {
        idGoogle: token.sub,
        email: token.email,
      };

      this.subscription.add(
        this.authService
          .loginWithGoogle(userReq)
          .pipe(
            tap((userRes) => {
              userRes.googleId = token.sub;
              userRes.googlePicture = token.picture;
              this.eventLogin.next(userRes);
            })
          )
          .subscribe()
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
