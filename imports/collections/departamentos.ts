import { MongoObservable } from 'meteor-rxjs';

export const Departamentos = new MongoObservable.Collection<any[]>('departamentos');