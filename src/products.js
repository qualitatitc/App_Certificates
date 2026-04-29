import logo from './assets/logo.png';
import isoLogo from './assets/iso-logos.png';
import generalManagerSignature from './assets/general-manager-signature.png';

import productsData from './data/products.json';

export const products = productsData;

/** Tipos “declaración de conformidad”. */
export const declarationConformityTypeIds = [
  'dec_conf_ce',
  'dec_conf_rohs',
  'dec_conf_ensayo_22',
  'dec_conf',
];

/** Tipos que requieren seleccionar factura/albarán y su número. */
export const declarationDocumentRefRequiredTypeIds = [
  'dec_conf_rohs',
  'dec_conf_ensayo_22',
  'dec_conf',
];

/** Referencia documental en declaraciones: factura o albarán. */
export const DOCUMENT_REF_INVOICE = 'invoice';
export const DOCUMENT_REF_DELIVERY = 'delivery';

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
    text: 'Declaramos bajo nuestra responsabilidad que el producto mencionado cumple con los requisitos esenciales de las directivas europeas aplicables y dispone del marcado CE correspondiente.',
    declarationTexts: {
      invoice: {
        es: 'Declaramos bajo nuestra responsabilidad que el producto mencionado cumple con los requisitos esenciales de las directivas europeas aplicables y dispone del marcado CE correspondiente, en el marco de la operación reflejada en la factura indicada en los datos del equipo.',
        en: 'We declare under our responsibility that the aforementioned product complies with the essential requirements of the applicable European directives and bears the corresponding CE marking, within the scope of the transaction reflected in the invoice stated in the equipment data.'
      },
      delivery: {
        es: 'Declaramos bajo nuestra responsabilidad que el producto mencionado cumple con los requisitos esenciales de las directivas europeas aplicables y dispone del marcado CE correspondiente, en el marco de la expedición reflejada en el albarán indicado en los datos del equipo.',
        en: 'We declare under our responsibility that the aforementioned product complies with the essential requirements of the applicable European directives and bears the corresponding CE marking, within the scope of the shipment reflected in the delivery note stated in the equipment data.'
      }
    }
  },
  {
    id: 'dec_conf_rohs',
    name: 'Declaración de conformidad RoHS',
    enName: 'RoHS Declaration of Conformity',
    text: 'Certificamos que el producto cumple con la directiva RoHS sobre la restricción del uso de ciertas sustancias peligrosas en equipos eléctricos y electrónicos.',
    declarationTexts: {
      invoice: {
        es: 'Certificamos que el producto cumple con la directiva RoHS sobre la restricción del uso de ciertas sustancias peligrosas en equipos eléctricos y electrónicos, en relación con la factura consignada en los datos del equipo.',
        en: 'We certify that the product complies with the RoHS directive on the restriction of the use of certain hazardous substances in electrical and electronic equipment, in relation to the invoice stated in the equipment data.'
      },
      delivery: {
        es: 'Certificamos que el producto cumple con la directiva RoHS sobre la restricción del uso de ciertas sustancias peligrosas en equipos eléctricos y electrónicos, en relación con el albarán consignado en los datos del equipo.',
        en: 'We certify that the product complies with the RoHS directive on the restriction of the use of certain hazardous substances in electrical and electronic equipment, in relation to the delivery note stated in the equipment data.'
      }
    }
  },
  {
    id: 'dec_conf_ensayo_22',
    name: 'Declaración de conformidad y ensayo 2.2',
    enName: 'Declaration of Conformity and Test 2.2',
    text: 'Documento que unifica la declaración de cumplimiento normativo con los resultados de los ensayos no específicos realizados al lote de fabricación.',
    declarationTexts: {
      invoice: {
        es: 'Documento que unifica la declaración de cumplimiento normativo con los resultados de los ensayos no específicos realizados al lote de fabricación, en el marco de la operación reflejada en la factura indicada en los datos del equipo.',
        en: 'This document combines the regulatory conformity declaration with the results of the non-specific tests carried out on the production batch, within the scope of the transaction reflected in the invoice stated in the equipment data.'
      },
      delivery: {
        es: 'Documento que unifica la declaración de cumplimiento normativo con los resultados de los ensayos no específicos realizados al lote de fabricación, en el marco de la expedición reflejada en el albarán indicado en los datos del equipo.',
        en: 'This document combines the regulatory conformity declaration with the results of the non-specific tests carried out on the production batch, within the scope of the shipment reflected in the delivery note stated in the equipment data.'
      }
    }
  },
  {
    id: 'dec_conf',
    name: 'Declaración de conformidad',
    enName: 'Declaration of Conformity',
    text: 'Declaramos que el producto ha sido diseñado y fabricado cumpliendo íntegramente con las especificaciones internas y normatividad vigente aplicable.',
    declarationTexts: {
      invoice: {
        es: 'Declaramos que el producto ha sido diseñado y fabricado cumpliendo íntegramente con las especificaciones internas y normatividad vigente aplicable, en relación con la factura consignada en los datos del equipo.',
        en: 'We declare that the product has been designed and manufactured in full compliance with internal specifications and applicable regulations, in relation to the invoice stated in the equipment data.'
      },
      delivery: {
        es: 'Declaramos que el producto ha sido diseñado y fabricado cumpliendo íntegramente con las especificaciones internas y normatividad vigente aplicable, en relación con el albarán consignado en los datos del equipo.',
        en: 'We declare that the product has been designed and manufactured in full compliance with internal specifications and applicable regulations, in relation to the delivery note stated in the equipment data.'
      }
    }
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
    responsibleRole: 'Departamento de Calidad',
    responsibleRoleEn: 'Quality Department',
    technicalManagerRole: 'Director Técnico',
    technicalManagerRoleEn: 'Technical Manager',
    technicalManagerName: 'Oriol Montasell',
    generalManagerRole: 'Manager general',
    generalManagerRoleEn: 'General manager',
    generalManagerSignatureUrl: generalManagerSignature,
};
