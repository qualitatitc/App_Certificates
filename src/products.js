import logo from './assets/logo.png';
import isoLogo from './assets/iso-logos.png';

import productsData from './data/products.json';

export const products = productsData;

export const certificateTypes = [
  {
    id: 'cert_calidad',
    name: 'Certificado de Calidad',
    enName: 'Certificate of Quality',
    text: 'El equipo o producto especificado ha sido fabricado y probado de acuerdo con los estándares de calidad vigentes de la empresa. Cumple con todas las especificaciones técnicas operativas requeridas para su correcto funcionamiento.'
  },
  {
    id: 'cert_mat_21',
    name: 'Certificado de materiales 2.1 - EN10204',
    enName: 'MATERIALS CERTIFICATE TYPE 2.1 - EN10204'
  },
  {
    id: 'cert_mat_22',
    name: 'Certificado de materiales 2.2 - EN10204',
    enName: 'MATERIALS CERTIFICATE TYPE 2.2 - EN10204'
  },
  {
    id: 'cert_mat_31',
    name: 'Certificado de materiales 3.1 - EN10204',
    enName: 'MATERIALS CERTIFICATE TYPE 3.1 - EN10204'
  },
  {
    id: 'cert_garantia',
    name: 'Certificado de Garantía',
    enName: 'Warranty Certificate'
  },
  {
    id: 'cert_ensayo_22',
    name: 'Certificado de informe de ensayo 2.2',
    enName: 'Test Report Certificate 2.2',
    text: 'Resultados de los ensayos realizados que avalan el correcto rendimiento y resistencia del producto bajo las condiciones de trabajo especificadas.'
  },
  {
    id: 'dec_conf_ce',
    name: 'Declaración de conformidad CE',
    enName: 'EC Declaration of Conformity',
    text: 'Declaramos bajo nuestra responsabilidad que el producto mencionado cumple con los requisitos esenciales de las directivas europeas aplicables y dispone del marcado CE correspondiente.'
  },
  {
    id: 'dec_conf_rohs',
    name: 'Declaración de conformidad RoHS',
    enName: 'RoHS Declaration of Conformity',
    text: 'Certificamos que el producto cumple con la directiva RoHS sobre la restricción del uso de ciertas sustancias peligrosas en equipos eléctricos y electrónicos.'
  },
  {
    id: 'dec_conf_ensayo_22',
    name: 'Declaración de conformidad y ensayo 2.2',
    enName: 'Declaration of Conformity and Test 2.2',
    text: 'Documento que unifica la declaración de cumplimiento normativo con los resultados de los ensayos no específicos realizados al lote de fabricación.'
  },
  {
    id: 'dec_conf',
    name: 'Declaración de conformidad',
    enName: 'Declaration of Conformity',
    text: 'Declaramos que el producto ha sido diseñado y fabricado cumpliendo íntegramente con las especificaciones internas y normatividad vigente aplicable.'
  },
  {
    id: 'cert_presion',
    name: 'Certificado de ensayo de presión hidroestática',
    enName: 'Hydrostatic Pressure Test Certificate',
    text: 'Certificamos que el equipo ha superado satisfactoriamente las pruebas de presión hidrostática requeridas, sin presentar fugas ni deformaciones permanentes.'
  }
];

export const companyData = {
    addressLines: [
        'Innovació Tecnológica Catalana',
        'P.I. Can Bernades Sobirà',
        'C/ Vallès, 26',
        '08130 Santa Perpètua de Mogoda.',
        'Barcelona'
    ],
    logoUrl: logo,
    isoLogoUrl: isoLogo,
    signatureUrl: 'https://placehold.co/150x80/ffffff/ffffff?text=',
    responsibleRole: 'Departamento de Calidad'
};
