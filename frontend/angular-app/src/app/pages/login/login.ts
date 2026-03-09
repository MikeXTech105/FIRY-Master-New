import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  constructor(
  private router: Router,
  private auth: AuthService,
  private toastr: ToastrService
){}

//   login(email:string,password:string){

//   this.auth.login(email,password).subscribe({

//     next:(res:any)=>{
//       console.log("Login Success",res)

//       localStorage.setItem("token",res.token)

//       this.router.navigate(['/dashboard'])

//     },

//     error:(err)=>{
//       console.log("Login Failed",err)
//       alert("Invalid email or password")
//     }

//   })

// }
login(email:string,password:string){

  this.auth.login(email,password).subscribe({

    next:(res:any)=>{

      if(res.statusCode == 1){

        this.toastr.success("Login Successful","FIRY");
        this.router.navigate(['/dashboard']);

      }else{

        this.toastr.error(res.message,"Login Failed");

      }

    },

    error:(err)=>{

      this.toastr.error("Something went wrong","Error");

    }

  });

}
}