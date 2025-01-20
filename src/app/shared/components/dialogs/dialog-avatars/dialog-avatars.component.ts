import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';

@Component({
  selector: 'app-dialog-avatars',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog-avatars.component.html',
  styleUrl: './dialog-avatars.component.scss',
})
export class DialogAvatarComponent implements OnInit {
  avatars = [
    'assets/svg/avatars/academic.png',
    'assets/svg/avatars/boy.png',
    'assets/svg/avatars/businessman.png',
    'assets/svg/avatars/businesswoman.png',
    'assets/svg/avatars/call-center-agent.png',
    'assets/svg/avatars/delivery-boy.png',
    'assets/svg/avatars/doctor.png',
    'assets/svg/avatars/farmer.png',
    'assets/svg/avatars/farmer-2.png',
    'assets/svg/avatars/gamer.png',
    'assets/svg/avatars/girl.png',
    'assets/svg/avatars/hacker.png',
    'assets/svg/avatars/magician.png',
    'assets/svg/avatars/man-2.png',
    'assets/svg/avatars/man-3.png',
    'assets/svg/avatars/man.png',
    'assets/svg/avatars/princess.png',
    'assets/svg/avatars/teacher.png',
    'assets/svg/avatars/woman.png',
    'assets/svg/avatars/woman-2.png',
  ];

  @Output() eventSelectAvatar = new EventEmitter<string>();

  subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogGenericService: DialogGenericService
  ) {}

  ngOnInit(): void {
    this.data = {
      title: 'Choisissez un avatar',
      message: '',
      buttons: [
        {
          isCloseButton: true,
          label: 'Fermer',
        },
      ],
    };
  }

  onClickAvatar(avatarUrl: string) {
    this.dialogGenericService.close(CodeModaleEnum.AVATAR, avatarUrl);
  }
}
