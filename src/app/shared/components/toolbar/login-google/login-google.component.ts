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
import {
  AuthGoogleRequest,
  AuthService,
  RefreshTokenResponse,
  UserGoogleRequest,
} from '../../../../../generated';
import { RoleGuest } from '../../../constants/role.constant';

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

  @Output() eventLogin = new EventEmitter<RefreshTokenResponse>();

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
    const tokenFromGoogle: any = jwtDecode(response.credential);
    if (this.isSignup) {
      const userReq: UserGoogleRequest = {
        idGoogle: tokenFromGoogle.sub,
        familyName: tokenFromGoogle.family_name,
        givenName: tokenFromGoogle.given_name,
        email: tokenFromGoogle.email,
        username: tokenFromGoogle.name,
        image: tokenFromGoogle.picture,
        emailVerified: tokenFromGoogle.email_verified,
        sessionExpiration: tokenFromGoogle.exp,
        roles: [RoleGuest],
      };

      this.subscription.add(
        this.authService
          .registerWithGoogle(userReq)
          .pipe(
            tap((rtRes) => {
              this.eventLogin.next(rtRes);
            })
          )
          .subscribe()
      );
    }

    if (this.isSignin) {
      const userReq: AuthGoogleRequest = {
        idGoogle: tokenFromGoogle.sub,
        email: tokenFromGoogle.email,
      };

      this.subscription.add(
        this.authService
          .loginWithGoogle(userReq)
          .pipe(
            tap((rtRes) => {
              this.eventLogin.next(rtRes);
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
