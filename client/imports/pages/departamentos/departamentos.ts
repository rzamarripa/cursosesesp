import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { Departamentos } from '../../../../imports/collections';
import template from "./departamentos.html";
 
@Component({
  selector: 'departamentos',
  template
})

export class DepartamentosComponent implements OnInit{
	departamento = {nombre : "", area : "", direccion : ""};
	departamentos = [];
	accionGuardar = true;
	accionNuevo = true;

	constructor(private ngZone : NgZone){
		window.rc = this;
		self = this;
	}

	ngOnInit() {
		this.loadDepartamentos();
	}

	nuevo() {
		this.accionNuevo = !this.accionNuevo;
		this.accionGuardar = true;
	}

	loadDepartamentos(): void {
		MeteorObservable.subscribe('departamentos').subscribe(() => {
	        this.ngZone.run(() => {
	            this.departamentos = Departamentos.find({}, {sort: {nombre: 1}}).fetch();
	        });
    	});
	}

	guardar(departamento){
		departamento.estatus = true;
		departamento.fechaCreacion = new Date();	
		if(departamento.nombre == ""){
			delete departamento.nombre;
		}	
		Departamentos.insert(departamento);
		this.departamento = {};
		this.loadDepartamentos();
		this.accionGuardar = true;
		$("#collapseExample").collapse("hide");
	}

	cambiarEstatus(departamento){
		Departamentos.update({_id : departamento._id}, {$set : {estatus : !departamento.estatus}});
		this.loadDepartamentos();
	}

	editar(departamento){
		this.departamento = departamento;
		this.accionGuardar = false;
		this.accionNuevo = false;
		$("#collapseExample").collapse("show");
	}

	modificar(departamento){
		console.log(departamento);
		var idTemp = departamento._id;
		delete departamento._id;
		Departamentos.update({_id : idTemp},{$set : departamento});
		this.loadDepartamentos();
		this.accionGuardar = true;
		this.departamento = {};
		$("#collapseExample").collapse("hide");
	}

	eliminar(departamento){
		var resultado = confirm("Estás seguro que quieres elminar el departamento: " + departamento.nombre);
		if(resultado){
			Departamentos.remove({_id : departamento._id});
			this.loadDepartamentos();
			this.accionNuevo = true;
			this.accionGuardar = true;
			this.departamento = {};
			if(this.accionNuevo == false){
				$("#collapseExample").collapse("hide");
			}			
		}
	}
}