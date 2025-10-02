import { Component, effect, inject } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { firstValueFrom } from 'rxjs';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    AvatarUploadComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      // @ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack),
      });

      if (this.profileService.me()?.stack) {
        //@ts-ignore
        this.tags = this.profileService.me()?.stack;
      }

      if (this.tagSet) {
        this.tagSet = '';
      }
      console.log();
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    // @ts-ignore
    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.tags),
      })
    );
  }

  splitStack(stack: string | null | string[] | undefined) {
    if (!stack) return [];

    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';

    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }

  tagSet!: string;
  tags: string[] = [];

  onTagSet(event: Event) {
    event.preventDefault();

    if (
      this.tagSet == '' ||
      this.tagSet == ' ' ||
      this.tagSet == null ||
      this.tagSet == '\n' ||
      this.tagSet == '\r\n' ||
      this.tags.join(this.tagSet)
    ) {
      this.tagSet = '';
      return;
    }

    this.tags.push(this.tagSet);

    this.tagSet = '';
  }

  onTagDel(tag: string) {
    this.tags = this.tags.filter((item) => item !== tag);
  }
}
