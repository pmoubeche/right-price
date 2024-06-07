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
import { RoleGuest } from '../../../constants/role.constant';
import { AuthGoogleRequest } from '../../../model/payload/request/auth-google-request.model';
import { UserGoogleRequest } from '../../../model/payload/request/user-google-request.model';
import { UserResponse } from '../../../model/payload/response/user-reponse.model';
import { AuthService } from '../../../services/auth.service';

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
        image: token.picture,
        emailVerified: token.email_verified,
        sessionExpiration: token.exp,
        roles: [RoleGuest],
      };

      this.subscription.add(
        this.authService
          .registerWithGoogle(userReq)
          .pipe(
            tap((userRes) => {
              userRes.googleId = token.sub;
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
