import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
// import { from, map, take } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  //   constructor() {
  //     from([1, 2, 3, 4, 5, 6, 7, 8, 9])
  //       .pipe(
  //         map((val: number) => val * 2),
  //         take(2)
  //       )
  //       .subscribe((val) => {
  //         console.log(val);
  //       });
  //   }     библиотека RxJS нужна для реактивного программирования в JavaScript. Она позволяет разработчикам писать асинхронный код, основанный на событиях, с использованием наблюдаемых значений (Observables). Это упрощает управление потоками данных, реакцию на взаимодействие пользователя и обработку сетевых запросов.

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value).subscribe((res) => {
        this.router.navigate(['']);
        console.log(res);
      });
    }
  }
  //   onSubmit(event: Event) {
  //     console.log(event);
  //   }
}
