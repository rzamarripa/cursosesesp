import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Empleados, Departamentos } from '../../../../imports/collections';
import template from "./empleados.html";
 
@Component({
  selector: 'empleados',
  template
})
@InjectUser('user')
export class EmpleadosComponent implements OnInit{
	empleado = {nombre : "", departamento_id : "", cursos : []};
	empleados = [];
	departamentos = [];
	accionGuardar = true;
	accionNuevo = true;
	cursoActual = {nombre : "", archivo : "", tipo : ""};
	imagenSeleccionada = {};
	user = Meteor.user();

	constructor(private ngZone : NgZone){
		window.rc = this;
		self = this;
		
	}

	ngOnInit() {
		this.loadEmpleados();
		console.log(Meteor.user(), this.user)
	}

	nuevo() {
		this.accionNuevo = !this.accionNuevo;
		this.accionGuardar = true;
		this.empleado = {nombre : "", 
						departamento_id : "", 
						cursos : []};
	}

	loadEmpleados(): void {
	
    	MeteorObservable.subscribe('departamentos').subscribe(() => {
	        MeteorObservable.autorun().subscribe(() => {
	            this.departamentos = Departamentos.find({}, {sort: {nombre: 1}}).fetch();
	        });
    	});

		MeteorObservable.subscribe('empleados').subscribe(() => {
	        MeteorObservable.autorun().subscribe(() => {
	            this.empleados = Empleados.find({}, {sort: {nombre: 1}}).fetch();
	          	_.each(this.empleados, function(empleado){
	          		empleado.departamento = Departamentos.findOne({_id : empleado.departamento_id})
	          	})
	        });
    	});

    	$(".select").select2();
    	$('.select').on('change', function(e){
            	var objeto = $(e.target).val();
            	objeto = objeto.split(": ");           	
            	self.empleado.departamento_id = objeto[1];
            }
        );

        var archivo = document.getElementById('archivo');

		//JavaScript para agregar la Foto
		archivo.addEventListener('change', function(e) {
			var file = archivo.files[0];
			var reader = new FileReader();

			reader.onload = function(e) {
				self.cursoActual.archivo = reader.result;
				self.cursoActual.tipo = file.type;
			}
			reader.readAsDataURL(file);
		});
	}

	guardar(empleado){
		empleado.estatus = true;
		empleado.fechaCreacion = new Date();	
		if(empleado.nombre == ""){
			delete empleado.nombre;
		}	
		Empleados.insert(empleado);
		this.empleado = {nombre : "", departamento_id : "", cursos : []};
		this.loadEmpleados();
		this.accionGuardar = true;
		this.accionNuevo = true;
		$("#collapseExample").collapse("hide");
		toastr.success("Se ha insertado el empleado");
	}

	cambiarEstatus(empleado){
		Empleados.update({_id : empleado._id}, {$set : {estatus : !empleado.estatus}});
		this.loadEmpleados();
	}

	editar(empleado){
		this.empleado = empleado;
		this.accionGuardar = false;
		this.accionNuevo = false;
		$("#collapseExample").collapse("show");
	}

	modificar(empleado){
		var idTemp = empleado._id;
		delete empleado._id;
		Empleados.update({_id : idTemp},{$set : empleado});
		this.loadEmpleados();
		this.accionGuardar = true;
		this.accionNuevo = true;
		this.empleado = {nombre : "", departamento_id : "", cursos : []};
		$("#collapseExample").collapse("hide");
	}

	eliminar(empleado){
		var resultado = confirm("Estás seguro que quieres elminar el empleado: " + empleado.nombre);
		if(resultado){
			Empleados.remove({_id : empleado._id});
			this.loadEmpleados();			
			this.accionGuardar = true;
			this.empleado = {};
			if(this.accionNuevo == false){
				$("#collapseExample").collapse("hide");
				this.accionNuevo = true;
			}			
		}
	}

	agregar(){
		//this.empleado.cursos = this.empleado.cursos ? this.empleado.cursos : [];
		//this.empleado.cursos = this.empleado.cursos || [];
		/*if(this.empleado.cursos == undefined){			
			this.empleado.cursos = [];
		}*/
		this.empleado.cursos.push(this.cursoActual);
		this.cursoActual = {nombre : "", archivo : "", tipo : ""};
		toastr.success("Agregó un nuevo curso");
	}

	quitar(index){
		this.empleado.cursos.splice(index, 1);
		toastr.warning("Curso eliminado");
	}

	mostrarImagen(curso){
		this.imagenSeleccionada = curso;
		$('#visor').modal('show');
	}

	tomarFoto(){
		var options = {
			width : 100,
			height : 100,
			quality : 20
		}

		MeteorCamera.getPicture([options], function(error, data){
			self.empleado.foto = data;
		});
	}
}