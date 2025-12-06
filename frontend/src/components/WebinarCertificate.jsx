import React, { useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./WebinarCertificate.css";
import alumniPresidentSignature from "../assets/Alumni-President-removebg-preview.png";
import principalSignature from "../assets/principal-removebg-preview.png";
import necLogo from "../assets/NEC-college Logo.png";
import webinarBackground from "../assets/webinarcertificategreen.jpg";

const WebinarCertificate = ({ name = "John Doe", programTitle = "Introduction to React", date = "2023-10-01", autoDownload = false }) => {
  const certRef = useRef();

  const downloadPDF = () => {
    const input = certRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 842, 595);
      pdf.save(`${name}_Certificate.pdf`);
    });
  };

  useEffect(() => {
    if (autoDownload) {
      downloadPDF();
    }
  }, [autoDownload]);

  return (
    <div className="certificate-wrapper">
      {/* Certificate Area */}
      <div ref={certRef} className="certificate-container">
        {/* Background Image */}
        <img
          src={webinarBackground}
          alt="Certificate Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        />

        {/* Header with Logo */}
        <div className="certificate-header">
          <div className="college-info">
            <h2 className="college-name">NATIONAL ENGINEERING COLLEGE</h2>
            <p className="college-address">K.R. Nagar, Kovilpatti - 628 503</p>
          </div>
        </div>

        <h1 className="title">CERTIFICATE OF PARTICIPATION</h1>
        <p className="text">This is to certify that</p>

        <h2 className="name-field">{name}</h2>

        <p className="text">
          in recognition of their active participation in the
Webinar program entitled
        </p>

        <h3 className="program">{programTitle}</h3>

        <p className="text"> on  <strong>{date}</strong></p>
        <p className="text"> organized by
NEC Alumni Association.</p>
        {/* Signatures */}
        <div className="signatures">
          <div className="signature-item">
            <img src={alumniPresidentSignature} alt="Alumni President Signature" className="signature-image" />
            <p className="signature-label">Alumni President</p>
          </div>
          <div className="signature-item">
            <img src={principalSignature} alt="Principal Signature" className="signature-image" />
            <p className="signature-label">Principal</p>
          </div>
        </div>
      </div>

      {/* Button */}
      <button className="download-btn" onClick={downloadPDF}>
        Download Certificate
      </button>
    </div>
  );
};

export const downloadCertificatePDF = (name, programTitle, date) => {
  // Create a temporary certificate element
  const tempCert = document.createElement('div');
  tempCert.innerHTML = `
    <div style="position: relative; width: 842px; height: 595px; background: url(${webinarBackground}) no-repeat center center; background-size: cover; padding: 40px; box-sizing: border-box; font-family: Arial, sans-serif; color: #000;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 24px; font-weight: bold;">NATIONAL ENGINEERING COLLEGE</h2>
        <p style="margin: 5px 0; font-size: 16px;">K.R. Nagar, Kovilpatti - 628 503</p>
      </div>
      
      <h1 style="text-align: center; font-size: 36px; font-weight: bold; margin: 30px 0;">CERTIFICATE OF PARTICIPATION</h1>
      <p style="text-align: center; font-size: 18px; margin: 20px 0;">This is to certify that</p>
      
      <h2 style="text-align: center; font-size: 28px; font-weight: bold; margin: 20px 0; text-decoration: underline;">${name}</h2>
      
      <p style="text-align: center; font-size: 18px; margin: 20px 0;">
        in recognition of their active participation in the Webinar program entitled
      </p>
      
      <h3 style="text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">"${programTitle}"</h3>
      
      <p style="text-align: center; font-size: 18px; margin: 20px 0;">on <strong>${date}</strong></p>
      <p style="text-align: center; font-size: 18px; margin: 20px 0;">organized by NEC Alumni Association.</p>
      
      <div style="display: flex; justify-content: space-around; margin-top: 60px;">
        <div style="text-align: center;">
          <img src="${alumniPresidentSignature}" alt="Alumni President Signature" style="width: 100px; height: auto;" />
          <p style="margin-top: 10px; font-size: 16px;">Alumni President</p>
        </div>
        <div style="text-align: center;">
          <img src="${principalSignature}" alt="Principal Signature" style="width: 100px; height: auto;" />
          <p style="margin-top: 10px; font-size: 16px;">Principal</p>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(tempCert);
  
  html2canvas(tempCert, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 842, 595);
    pdf.save(`${name}_Certificate.pdf`);
    document.body.removeChild(tempCert);
  });
};

export default WebinarCertificate;
