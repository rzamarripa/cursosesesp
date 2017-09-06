import { MongoObservable } from 'meteor-rxjs';

export const Empleados = new MongoObservable.Collection<any[]>('empleados');