import { Component } from '@angular/core';
import { RoleService } from '../../services/role';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.html',
  styleUrl: './create-role.css'
})
export class CreateRoleComponent {

  constructor(
    private roleService: RoleService,
    private toastr: ToastrService
  ){}

  createRole(roleName:string){

    if(!roleName){
      this.toastr.error("Role name required");
      return;
    }

    this.roleService.createRole(roleName).subscribe({

      next:(res:any)=>{

        this.toastr.success("Role Created Successfully","FIRY");

      },

      error:()=>{

        this.toastr.error("Failed to create role","Error");

      }

    });

  }

}