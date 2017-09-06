import { Empleados } from '../../imports/collections';

Meteor.publish("empleados", function(params) {
    return Empleados.find(params);
});