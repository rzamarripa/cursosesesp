import { Departamentos } from '../../imports/collections';

Meteor.publish("departamentos", function(params) {
    return Departamentos.find(params);
});