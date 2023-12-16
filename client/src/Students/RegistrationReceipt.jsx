import React from 'react'
import html2pdf from 'html2pdf.js';
import saveAs from 'file-saver';
import logo from '../Components/img/logo.png'

function RegistrationReceipt() {

    const generatePdf = async () => {
        const element = document.getElementById('element');
    
        console.log("generate pdf");
    
        // Options for html2pdf
        const options = {
          margin: 10,
          filename: 'custom_filename.pdf', // Set your custom filename here
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
    
        try {
          const pdf = await html2pdf().from(element).set(options).outputPdf();
          const blob = new Blob([pdf], { type: 'application/pdf' });
          saveAs(blob, options.filename);
          console.log("PDF generated successfully");
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      };
      

  return (
    <>
    <div id="element">
  <div id="invoice-POS">
    <center id="top">
      <img src={logo}/>
      <div className="info">
        <h2>Uncodemy</h2>
      </div>
      {/*End Info*/}
    </center>
    {/*End InvoiceTop*/}
    <div id="mid">
      <div className="info">
        <h2>Contact Info</h2>
        <p>
          Address : street city, state 0000
          <br />
          Email : JohnDoe@gmail.com
          <br />
          Phone : 555-555-5555
          <br />
        </p>
      </div>
    </div>
    {/*End Invoice Mid*/}
    <div id="bot">
      <div id="table">
        <table>
          <tbody>
            <tr className="tabletitle">
              <td className="item">
                <h2>Item</h2>
              </td>
              <td className="Hours">
                <h2>Qty</h2>
              </td>
              <td className="Rate">
                <h2>Sub Total</h2>
              </td>
            </tr>
            <tr className="service">
              <td className="tableitem">
                <p className="itemtext">Communication</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">5</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">$375.00</p>
              </td>
            </tr>
            <tr className="service">
              <td className="tableitem">
                <p className="itemtext">Asset Gathering</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">3</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">$225.00</p>
              </td>
            </tr>
            <tr className="service">
              <td className="tableitem">
                <p className="itemtext">Design Development</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">5</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">$375.00</p>
              </td>
            </tr>
            <tr className="service">
              <td className="tableitem">
                <p className="itemtext">Animation</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">20</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">$1500.00</p>
              </td>
            </tr>
            <tr className="service">
              <td className="tableitem">
                <p className="itemtext">Animation Revisions</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">10</p>
              </td>
              <td className="tableitem">
                <p className="itemtext">$750.00</p>
              </td>
            </tr>
            <tr className="tabletitle">
              <td />
              <td className="Rate">
                <h2>tax</h2>
              </td>
              <td className="payment">
                <h2>$419.25</h2>
              </td>
            </tr>
            <tr className="tabletitle">
              <td />
              <td className="Rate">
                <h2>Total</h2>
              </td>
              <td className="payment">
                <h2>$3,644.25</h2>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*End Table*/}
      <div id="legalcopy">
        <p className="legal">
          <strong>Thank you for your business!</strong>&nbsp; Payment is
          expected within 31 days; please process this invoice within that time.
          There will be a 5% interest charge per month on late invoices.
        </p>
      </div>
    </div>
    {/*End InvoiceBot*/}
  </div>
  {/*End Invoice*/}

    </div>
    <div className="text-center"><button className="btn btn-primary" onClick={generatePdf}>Convert to Pdf</button></div>

</>

  )
}

export default RegistrationReceipt