import React, { useRef } from 'react';
import {
  companyData,
  declarationConformityTypeIds,
  DOCUMENT_REF_DELIVERY,
} from '../products.js';
import html2pdf from 'html2pdf.js';

const CERT_IDS_PREAMBLE_BEFORE_PRODUCT = [
  'cert_calidad',
  'cert_mat_21',
  'cert_mat_22',
  'cert_mat_31',
  'cert_garantia',
];

export default function CertificatePreview({ data, onBack }) {
  const certRef = useRef();
  if (!data) return null;
  const isCeConformity = data.type.id === 'dec_conf_ce';

  const handleDownloadPDF = () => {
    const element = certRef.current;
    const opt = {
      margin: 0,
      filename: `${data.type.name}_${data.product.code}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 4, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="preview-container">
      <div className="preview-actions">
        <button className="btn-secondary" onClick={onBack}>Volver</button>
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => window.print()}>Imprimir</button>
          <button className="btn-primary" onClick={handleDownloadPDF}>Descargar PDF</button>
        </div>
      </div>

      <div
        className={`a4-page${data.type.id === 'cert_garantia' ? ' a4-page--warranty' : ''}`}
        ref={certRef}
      >
        <header className="cert-header">
          <img src={companyData.logoUrl} alt="Company Logo" className="logo" />
          <div className="header-text">
            <h1>{data.type.name}</h1>
            <h2>{data.type.enName}</h2>
          </div>
          <img src={companyData.isoLogoUrl} alt="ISO Logo" className="iso-logo" />
        </header>

        <section className="company-info">
          {companyData.addressLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </section>

        <section className="date-info">
          {(() => {
            const dateObj = new Date(data.date);
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            const monthsEs = [
              'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
              'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];
            const monthsEn = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const monthEs = monthsEs[dateObj.getMonth()];
            const monthEn = monthsEn[dateObj.getMonth()];

            return (
              <>
                <p>Santa Perpètua de Mogoda, Barcelona (España), el {day} de {monthEs} de {year}</p>
                <p>Santa Perpètua de Mogoda, Barcelona (Spain), on {day} of {monthEn} of {year}</p>
              </>
            );
          })()}
        </section>

        {CERT_IDS_PREAMBLE_BEFORE_PRODUCT.includes(data.type.id) && (
          <div className="cert-preamble">
            <p>Por el presente documento ITC certifica que el producto siguiente:</p>
            <p><em>By this document ITC certifies that the following product:</em></p>
          </div>
        )}

        {data.type.id === 'dec_conf' && data.invoiceOrDeliveryNote && (
          <div className="cert-preamble">
            <p>
              Por el presente documento ITC certificamos que los productos detallados en (
              {data.documentRefType === DOCUMENT_REF_DELIVERY ? 'el albarán' : 'la factura'} {data.invoiceOrDeliveryNote}
              ) cumplen con las características técnicas descritas en el manual y hojas técnicas del producto.
            </p>
            <p>
              <em>
                By this document ITC certifies that the products detailed in (
                {data.documentRefType === DOCUMENT_REF_DELIVERY ? 'the delivery note' : 'the invoice'} {data.invoiceOrDeliveryNote}
                ) comply with the technical characteristics described in the product manual and technical data sheets.
              </em>
            </p>
          </div>
        )}

        {data.type.id !== 'dec_conf' && (
          <>
            {!CERT_IDS_PREAMBLE_BEFORE_PRODUCT.includes(data.type.id) && (
              <div className="cert-preamble">
                <p>Por el presente documento ITC certifica que el producto siguiente:</p>
                <p><em>By this document ITC certifies that the following product:</em></p>
              </div>
            )}
            <section className="product-info">
              <h3>Datos del Equipo / Product Data</h3>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td><strong>Código / Code:</strong></td>
                    <td>{data.product.code}</td>
                  </tr>
                  <tr>
                    <td><strong>Descripción:</strong></td>
                    <td>{data.product.esDesc}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>{data.product.enDesc}</td>
                  </tr>
                  <tr>
                    <td><strong>Número de Serie / S/N:</strong></td>
                    <td style={{ whiteSpace: 'pre-wrap' }}>{data.serialNumber}</td>
                  </tr>
                  {data.invoiceOrDeliveryNote && (
                    <tr>
                      <td>
                        <strong>
                          {data.documentRefType === DOCUMENT_REF_DELIVERY
                            ? 'Nº albarán / Delivery note no.:'
                            : 'Nº factura / Invoice no.:'}
                        </strong>
                      </td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{data.invoiceOrDeliveryNote}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}

        {isCeConformity && (
          <section className="cert-text cert-text--ce">
            <p>
              Cumple la Directiva de Máquinas 2006/042/CE y la Directiva de Baja Tensión D2014/35/UE, siempre que la
              instalación, el uso y el mantenimiento se efectúen de acuerdo con la normativa vigente y siguiendo las
              indicaciones del manual de instrucciones.
            </p>
            <p>
              <em>
                Complies with the Machinery Directive 2006/042/EC and the Low Voltage Directive D2014/35/EU, provided
                that installation, use and maintenance are carried out in accordance with current regulations and
                following the instructions in the user manual.
              </em>
            </p>
            <p className="cert-ce-norms">
              <strong>Normas/norms: EN12100:2012 - EN 60204-1:2019</strong>
            </p>
          </section>
        )}

        {isCeConformity && (
          <section className="cert-ce-technical-file">
            <div className="cert-ce-technical-file__left">
              <p>Persona autorizada para recopilar el archivo técnico:</p>
              <p>
                <em>Person authorised to compile technical file:</em>
              </p>
            </div>
            <div className="cert-ce-technical-file__right">
              <p>{companyData.technicalManagerRole}</p>
              <p>
                <em>{companyData.technicalManagerRoleEn}</em>
              </p>
              <p>{companyData.technicalManagerName}</p>
            </div>
          </section>
        )}

        {['cert_mat_21', 'cert_mat_22', 'cert_mat_31'].includes(data.type.id) && (
          <div className="cert-body-extra">
            <p>Ha sido fabricado con los materiales detallados en el manual, hojas técnicas o tarifa de precios.</p>
            <p><em>It has been manufactured with the materials detailed in the manual, technical data sheets or price list.</em></p>
          </div>
        )}

        {data.type.id === 'cert_calidad' && (
          <div className="cert-body-extra">
            <p>Ha sido fabricado y verificado en ITC. Este producto cumple los requisitos de calidad que verifican las características técnicas detalladas en el manual, hojas técnicas o tarifa de precios.</p>
            <p><em>It has been manufactured and verified in ITC. This product meets the quality requirements that verify the technical characteristics detailed in the manual, technical data sheets or price list.</em></p>
            <br />
            <p>Las pruebas se han realizado en el banco de pruebas de ITC con agua a temperatura ambiente.</p>
            <p><em>The tests have been carried out in the ITC test bench with water at room temperature.</em></p>
          </div>
        )}

        {data.type.id === 'cert_garantia' && (
          <div className="cert-body-extra cert-warranty-after-product">
            <p>
              ITC S.L. garantiza el producto especificado en este documento por el periodo de 12 meses a partir de la
              fecha de compra, contra todo defecto de fabricación o material, siempre que la instalación, uso y
              mantenimiento del equipo hayan sido correctos.
            </p>
            <p>
              <em>
                ITC S.L. guarantees the product specified in this document for a period of 12 months from the date of
                purchase, against any manufacturing or material defect, provided that the installation, use and
                maintenance of the equipment have been correct.
              </em>
            </p>
            <p className="cert-warranty-after-product__gap">
              El equipo debe ser remitido, libre de gastos, a nuestro taller o servicio técnico de ITC S.L. acreditado y
              su devolución será efectuada a portes debidos.
            </p>
            <p>
              <em>
                The equipment must be sent, carriage paid, to our workshop or an accredited ITC S.L. technical
                service, and its return shall be made with shipping charges payable by the recipient.
              </em>
            </p>
          </div>
        )}

        {data.type.id !== 'cert_calidad' &&
          data.type.id !== 'dec_conf' &&
          data.type.id !== 'dec_conf_ce' &&
          (() => {
            const isDecl =
              declarationConformityTypeIds.includes(data.type.id) &&
              data.type.declarationTexts &&
              data.documentRefType &&
              data.type.declarationTexts[data.documentRefType];
            if (isDecl) {
              const t = data.type.declarationTexts[data.documentRefType];
              return (
                <section className="cert-text">
                  <p>{t.es}</p>
                  <p>
                    <em>{t.en}</em>
                  </p>
                </section>
              );
            }
            if (data.type.text) {
              return (
                <section className="cert-text">
                  <p>{data.type.text}</p>
                </section>
              );
            }
            return null;
          })()}

        <footer
          className={`cert-footer${data.type.id === 'dec_conf' ? ' cert-footer--inline' : ''}${
            isCeConformity ? ' cert-footer--ce' : ''
          }`}
        >
          <div className="signature-area">
            {isCeConformity && companyData.generalManagerSignatureUrl && (
              <img
                src={companyData.generalManagerSignatureUrl}
                alt="General manager signature"
                className="signature signature--ce"
              />
            )}
            <p>
              <strong>{isCeConformity ? companyData.generalManagerRole : companyData.responsibleRole}</strong>
            </p>
            <p className="signature-area__role-en">
              <em>
                <strong>{isCeConformity ? companyData.generalManagerRoleEn : companyData.responsibleRoleEn}</strong>
              </em>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
