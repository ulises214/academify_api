export type SamlUserAttributes = {
  uCorreo: string;
  uNombre: string;
  uDependencia: string;
  uCuenta: string;
  uTipo: 'Estudiante' | 'Trabajador';
  cn: string;
  sn: string;
  displayName: string;
  ImmutableID: string;
  givenName: string;
};
export type SamlUser = {
  issuer: string;
  inResponseTo: string;
  sessionIndex: string;
  nameID: string;
  nameIDFormat: string;
  spNameQualifier: string;
  uCorreo: string;
  uNombre: string;
  uDependencia: string;
  uCuenta: string;
  uTipo: 'Estudiante' | 'Trabajador';
  cn: string;
  sn: string;
  displayName: string;
  ImmutableID: string;
  givenName: string;
  attributes: SamlUserAttributes;
};
