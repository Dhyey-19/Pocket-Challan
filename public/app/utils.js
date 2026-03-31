window.AppUtils = (() => {
  const sortByIdAsc = (rows) =>
    [...rows].sort((left, right) => Number(left.id) - Number(right.id));

  const getTodayValue = () => new Date().toISOString().slice(0, 10);

  const formatNumber = (value, digits = 2) => Number(value || 0).toFixed(digits);

  const createEmptyChallanItem = () => ({
    itemId: "",
    itemSearch: "",
    grossWeight: "",
    bagsCrate: "",
    lessWeight: "",
    pcs: "",
    unit: "per_kg",
    rate: "",
    notes: ""
  });

  const createEmptyMaterialOutItem = () => ({
    itemId: "",
    itemSearch: "",
    grossWeight: "",
    bagsCrate: "",
    lessWeight: "",
    pcs: "",
    processType: ""
  });

  const createEmptyMaterialInItem = () => ({
    itemId: "",
    itemSearch: "",
    materialInItemName: "",
    materialOutItemId: "",
    grossWeight: "",
    bagsCrate: "",
    lessWeight: "",
    pcs: "",
    unit: "per_kg",
    rate: "",
    processType: "",
    weightBalance: "",
    pcsBalance: ""
  });

  const getNetWeight = (item) => {
    const gross = Number(item.grossWeight || 0);
    const less = Number(item.lessWeight || 0);
    return gross - less;
  };

  const getAmount = (item) => {
    const rate = Number(item.rate || 0);
    const netWeight = getNetWeight(item);
    if (item.unit === "per_pcs") {
      return Number(item.pcs || 0) * rate;
    }
    return netWeight * rate;
  };

  const buildChallanPrintHtml = (challan, items) => {
    const totals = items.reduce(
      (acc, item) => {
        acc.grossWeight += Number(item.grossWeight || 0);
        acc.bagsCrate += Number(item.bagsCrate || 0);
        acc.lessWeight += Number(item.lessWeight || 0);
        acc.netWeight += Number(item.netWeight || 0);
        acc.pcs += Number(item.pcs || 0);
        return acc;
      },
      { grossWeight: 0, bagsCrate: 0, lessWeight: 0, netWeight: 0, pcs: 0 }
    );

    const rowsHtml = items
      .map(
        (item) => `
          <tr>
            <td>${item.itemName || ""}</td>
            <td class="num">${formatNumber(item.grossWeight, 3)}</td>
            <td class="num">${formatNumber(item.bagsCrate, 0)}</td>
            <td class="num">${formatNumber(item.lessWeight, 3)}</td>
            <td class="num">${formatNumber(item.netWeight, 3)}</td>
            <td class="num">${formatNumber(item.pcs, 0)}</td>
            <td>${item.notes || ""}</td>
          </tr>
        `
      )
      .join("");

    const maxRows = 5;
    const blankRowCount = Math.max(0, maxRows - items.length);
    const blankRowsHtml = Array.from({ length: blankRowCount })
      .map(
        () => `
          <tr class="blank">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Delivery Challan</title>
          <style>
            * { box-sizing: border-box; }
              @page { margin: 6mm; }
              body { font-family: "Times New Roman", serif; margin: 0; padding: 6mm; color: #000; }
            @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; } }
            .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 8px; }
            .header-grid { border: 1px solid #000; border-bottom: none; padding: 10px; font-size: 13px; }
            .header-row { display: flex; justify-content: space-between; gap: 8px; }
            .header-row + .header-row { margin-top: 4px; }
            .label { font-weight: bold; }
            .value { font-weight: bold; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: -1px; }
              .col-desc { width: 34%; }
              .col-gross { width: 12%; }
              .col-bags { width: 8%; }
              .col-less { width: 8%; }
              .col-net { width: 10%; }
              .col-pcs { width: 6%; }
              .col-notes { width: 12%; }
            th, td { border: 1px solid #000; padding: 3px; text-align: left; }
            tbody tr:nth-child(-n+2) td { padding-top: 6px; padding-bottom: 6px; }
            th { padding-top: 6px; padding-bottom: 6px; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .totals td { font-weight: bold; padding-top: 8px; padding-bottom: 8px; }
            .footer-row td { height: 44px; vertical-align: top; }
            .footer-label { font-weight: bold; display: block; }
            .page { min-height: 100%; display: flex; flex-direction: column; }
            .content { flex: 1; display: flex; flex-direction: column; gap: 0; }
            .spacer { flex: 1; }
            .blank td { height: 34px; }
            .sign { font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="content">
              <div class="title">Delivery Challan</div>
              <div class="header-grid">
                <div class="header-row">
                  <div class="label">PARTY NAME :</div>
                  <div class="label">CHALLAN NO : ${challan.challanNo}</div>
                </div>
                <div class="header-row">
                  <div class="value">${challan.partyName || ""}</div>
                  <div class="label">CHALLAN DATE : ${challan.challanDate}</div>
                </div>
              </div>
              <table>
                <colgroup>
                  <col class="col-desc" />
                  <col class="col-gross" />
                  <col class="col-bags" />
                  <col class="col-less" />
                  <col class="col-net" />
                  <col class="col-pcs" />
                  <col class="col-notes" />
                </colgroup>
            <thead>
              <tr>
                <th>Description</th>
                <th>Gross WT</th>
                <th>Bags</th>
                <th>Less</th>
                <th>Net WT</th>
                <th>PCS</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${blankRowsHtml}
              <tr class="totals">
                <td>Total</td>
                <td class="num">${formatNumber(totals.grossWeight, 3)}</td>
                <td class="num">${formatNumber(totals.bagsCrate, 0)}</td>
                <td class="num">${formatNumber(totals.lessWeight, 3)}</td>
                <td class="num">${formatNumber(totals.netWeight, 3)}</td>
                <td class="num">${formatNumber(totals.pcs, 0)}</td>
                <td></td>
              </tr>
              <tr class="footer-row">
                <td colspan="2">
                  <span class="footer-label">Remarks</span>
                  <span>${challan.remarks || ""}</span>
                </td>
                <td colspan="2">
                  <span class="footer-label">Vehicle</span>
                  <span>${challan.vehicleNo || ""}</span>
                </td>
                <td colspan="2">
                  <span class="footer-label">Bill No.</span>
                  <span>${challan.billNo || ""}</span>
                </td>
                <td class="sign">
                  <span class="footer-label">Sign</span>
                </td>
              </tr>
            </tbody>
              </table>
            </div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
  };

  const buildMaterialOutPrintHtml = (challan, items) => {
    const totals = items.reduce(
      (acc, item) => {
        acc.grossWeight += Number(item.grossWeight || 0);
        acc.bagsCrate += Number(item.bagsCrate || 0);
        acc.lessWeight += Number(item.lessWeight || 0);
        acc.netWeight += Number(item.netWeight || 0);
        acc.pcs += Number(item.pcs || 0);
        return acc;
      },
      { grossWeight: 0, bagsCrate: 0, lessWeight: 0, netWeight: 0, pcs: 0 }
    );

    const rowsHtml = items
      .map(
        (item) => `
          <tr>
            <td>${item.itemName || ""}</td>
            <td class="num">${formatNumber(item.grossWeight, 3)}</td>
            <td class="num">${formatNumber(item.bagsCrate, 0)}</td>
            <td class="num">${formatNumber(item.lessWeight, 3)}</td>
            <td class="num">${formatNumber(item.netWeight, 3)}</td>
            <td class="num">${formatNumber(item.pcs, 0)}</td>
            <td>${item.processType || ""}</td>
          </tr>
        `
      )
      .join("");

    const maxRows = 5;
    const blankRowCount = Math.max(0, maxRows - items.length);
    const blankRowsHtml = Array.from({ length: blankRowCount })
      .map(
        () => `
          <tr class="blank">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Material Out</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: "Times New Roman", serif; margin: 0; padding: 6mm; color: #000; }
            @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; } }
            .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 8px; }
            .header-grid { border: 1px solid #000; border-bottom: none; padding: 10px; font-size: 13px; }
            .header-row { display: flex; justify-content: space-between; gap: 8px; }
            .header-row + .header-row { margin-top: 4px; }
            .label { font-weight: bold; }
            .value { font-weight: bold; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: -1px; }
            .col-desc { width: 36%; }
            .col-gross { width: 12%; }
            .col-bags { width: 8%; }
            .col-less { width: 8%; }
            .col-net { width: 10%; }
            .col-pcs { width: 6%; }
            .col-process { width: 6%; }
            th, td { border: 1px solid #000; padding: 3px; text-align: left; }
            tbody tr:nth-child(-n+2) td { padding-top: 6px; padding-bottom: 6px; }
            th { padding-top: 6px; padding-bottom: 6px; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .totals td { font-weight: bold; padding-top: 8px; padding-bottom: 8px; }
            .footer-row td { height: 44px; vertical-align: top; }
            .footer-label { font-weight: bold; display: block; }
            .page { min-height: 100%; display: flex; flex-direction: column; }
            .content { flex: 1; display: flex; flex-direction: column; gap: 0; }
            .spacer { flex: 1; }
            .blank td { height: 34px; }
            .sign { font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="content">
              <div class="title">Material Out</div>
              <div class="header-grid">
                <div class="header-row">
                  <div class="label">Party Name:- ${challan.partyName || ""}</div>
                  <div class="label">Challan No:- ${challan.challanNo}</div>
                </div>
                <div class="header-row">
                  <div></div>
                  <div class="label">Challan Date:- ${challan.challanDate}</div>
                </div>
              </div>
              <table>
                <colgroup>
                  <col class="col-desc" />
                  <col class="col-gross" />
                  <col class="col-bags" />
                  <col class="col-less" />
                  <col class="col-net" />
                  <col class="col-pcs" />
                  <col class="col-process" />
                </colgroup>
            <thead>
              <tr>
                <th>Description</th>
                <th>Gross WT</th>
                <th>Bags</th>
                <th>Less</th>
                <th>Net WT</th>
                <th>PCS</th>
                <th>Process</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${blankRowsHtml}
              <tr class="totals">
                <td>Total</td>
                <td class="num">${formatNumber(totals.grossWeight, 3)}</td>
                <td class="num">${formatNumber(totals.bagsCrate, 0)}</td>
                <td class="num">${formatNumber(totals.lessWeight, 3)}</td>
                <td class="num">${formatNumber(totals.netWeight, 3)}</td>
                <td class="num">${formatNumber(totals.pcs, 0)}</td>
                <td></td>
              </tr>
              <tr class="footer-row">
                <td colspan="3">
                  <span class="footer-label">Remarks</span>
                  <span>${challan.remarks || ""}</span>
                </td>
                <td colspan="3">
                  <span class="footer-label">Vehicle</span>
                  <span>${challan.vehicleNo || ""}</span>
                </td>
                <td class="sign">
                  <span class="footer-label">Sign</span>
                </td>
              </tr>
            </tbody>
              </table>
            </div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
  };

  const buildMaterialInOutPrintHtml = (report) => {
    const outwardRows = (report.outward || [])
      .map(
        (row) => `
          <tr>
            <td>${row.challanNo || ""}</td>
            <td>${row.challanDate || ""}</td>
            <td>${row.itemName || ""}</td>
            <td class="num">${formatNumber(row.netWeight, 3)}</td>
            <td class="num">${formatNumber(row.pcs, 0)}</td>
            <td>${row.processType || "-"}</td>
          </tr>
        `
      )
      .join("");

    const inwardRows = (report.inward || [])
      .map(
        (row) => `
          <tr>
            <td>${row.challanNo || ""}</td>
            <td>${row.challanDate || ""}</td>
            <td>${row.itemName || ""}</td>
            <td class="num">${formatNumber(row.netWeight, 3)}</td>
            <td class="num">${formatNumber(row.pcs, 0)}</td>
            <td class="num">${formatNumber(row.rate, 2)}</td>
            <td class="num">${formatNumber(row.amount, 2)}</td>
            <td>${row.processType || "-"}</td>
          </tr>
        `
      )
      .join("");

    const paymentRows = (report.payments || [])
      .map(
        (payment) => `
          <tr>
            <td>${payment.receiptDate || ""}</td>
            <td>${payment.transactionType || ""}</td>
            <td class="num">${formatNumber(payment.amount, 2)}</td>
            <td>${payment.receiptNo || ""}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Material In-Out Report</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4 landscape; margin: 8mm; }
            body { font-family: "Times New Roman", serif; margin: 0; padding: 8mm; color: #000; }
            @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; } }
            h1 { text-align: center; font-size: 16px; margin: 0 0 8px; }
            h2 { font-size: 12px; margin: 0 0 4px; }
            .meta { display: flex; justify-content: space-between; gap: 8px; border: 1px solid #000; padding: 6px; font-size: 10px; }
            .meta strong { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; font-size: 9px; }
            th, td { border: 1px solid #000; padding: 3px; text-align: left; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .totals td { font-weight: bold; padding-top: 8px; padding-bottom: 8px; }
            .section { margin-top: 0; }
            .layout-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: auto auto;
              grid-template-areas:
                "outward inward"
                "payments summary";
              gap: 10px;
              margin-top: 6px;
              align-items: start;
            }
            .area-outward { grid-area: outward; }
            .area-inward { grid-area: inward; }
            .area-payments { grid-area: payments; }
            .area-summary { grid-area: summary; }
          </style>
        </head>
        <body>
          <h1>Material In-Out Report</h1>
          <div class="meta">
            <div><strong>Party name:</strong> ${report.partyName || ""}</div>
            <div><strong>Duration:</strong> ${report.startDate || ""} to ${report.endDate || ""}</div>
          </div>

          <div class="layout-grid">
            <div class="section area-outward">
              <h2>Material outward</h2>
              <table>
                <thead>
                  <tr>
                    <th>Ch#</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Net Wt</th>
                    <th>PCS</th>
                    <th>Proc</th>
                  </tr>
                </thead>
                <tbody>
                  ${outwardRows || `<tr><td colspan="6">No material outward records found.</td></tr>`}
                  <tr class="totals">
                    <td colspan="3">Total</td>
                    <td class="num">${formatNumber(report.totals.totalOutwardWeight, 3)}</td>
                    <td class="num">${formatNumber(report.totals.totalOutwardPcs, 0)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section area-inward">
              <h2>Material inward</h2>
              <table>
                <thead>
                  <tr>
                    <th>Ch#</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Net Wt</th>
                    <th>PCS</th>
                    <th>Rate</th>
                    <th>Amt</th>
                    <th>Proc</th>
                  </tr>
                </thead>
                <tbody>
                  ${inwardRows || `<tr><td colspan="8">No material inward records found.</td></tr>`}
                  <tr class="totals">
                    <td colspan="3">Total</td>
                    <td class="num">${formatNumber(report.totals.totalInwardWeight, 3)}</td>
                    <td class="num">${formatNumber(report.totals.totalInwardPcs, 0)}</td>
                    <td></td>
                    <td class="num">${formatNumber(report.totals.totalPayment, 2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section area-payments">
              <h2>Payments</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Rcpt#</th>
                  </tr>
                </thead>
                <tbody>
                  ${paymentRows || `<tr><td colspan="4">No payments found.</td></tr>`}
                  <tr class="totals">
                    <td colspan="2">Total</td>
                    <td class="num">${formatNumber(report.totals.paymentMade, 2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section area-summary">
              <h2>Summary</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Total outward</td>
                    <td class="num">${formatNumber(report.totals.totalOutwardWeight, 3)}</td>
                  </tr>
                  <tr>
                    <td>Total job done</td>
                    <td class="num">${formatNumber(report.totals.totalJobDoneWeight, 3)}</td>
                  </tr>
                  <tr>
                    <td>Total extra material</td>
                    <td class="num">${formatNumber(report.totals.totalExtraMaterialWeight, 3)}</td>
                  </tr>
                  <tr>
                    <td>Balance material</td>
                    <td class="num">${formatNumber(report.totals.balanceMaterial, 3)}</td>
                  </tr>
                  <tr>
                    <td>Total payment</td>
                    <td class="num">${formatNumber(report.totals.totalPayment, 2)}</td>
                  </tr>
                  <tr>
                    <td>Payment made</td>
                    <td class="num">${formatNumber(report.totals.paymentMade, 2)}</td>
                  </tr>
                  <tr>
                    <td>Outstanding amount</td>
                    <td class="num">${formatNumber(report.totals.outstandingAmount, 2)}</td>
                  </tr>
                  <tr>
                    <td>Balance PCS</td>
                    <td class="num">${formatNumber(report.totals.balancePcs, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
  };

  const buildPartyStatementPrintHtml = (statement) => {
    const rowsHtml = (statement.rows || [])
      .map(
        (row) => `
          <tr>
            <td>${row.challanNo || "-"}</td>
            <td>${row.date || ""}</td>
            <td>${row.product || ""}</td>
            <td class="num">${row.netWeight ? formatNumber(row.netWeight, 3) : ""}</td>
            <td class="num">${row.rateWeight ? formatNumber(row.rateWeight, 2) : ""}</td>
            <td class="num">${row.pcs ? formatNumber(row.pcs, 0) : ""}</td>
            <td class="num">${row.ratePcs ? formatNumber(row.ratePcs, 2) : ""}</td>
            <td class="num">${formatNumber(row.amount, 2)}</td>
            <td>${row.notes || ""}</td>
          </tr>
        `
      )
      .join("");

    const paymentRows = (statement.payments || [])
      .map(
        (payment) => `
          <tr>
            <td>${payment.receiptNo || ""}</td>
            <td>${payment.receiptDate || ""}</td>
            <td>${payment.transactionType || ""}</td>
            <td class="num">${formatNumber(payment.amount, 2)}</td>
            <td>${payment.remarks || "-"}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Party Statement</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4; margin: 10mm; }
            body { font-family: "Times New Roman", serif; margin: 0; padding: 10mm; color: #000; }
            @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; } }
            h1 { text-align: center; font-size: 22px; margin: 0 0 10px; }
            .meta { display: flex; justify-content: space-between; gap: 8px; border: 1px solid #000; padding: 8px; font-size: 13px; }
            .meta strong { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .section { margin-top: 10px; }
            .totals td { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Party Statement</h1>
          <div class="meta">
            <div><strong>Party Name:</strong> ${statement.partyName || ""}</div>
            <div><strong>Duration:</strong> ${statement.startDate || ""} to ${statement.endDate || ""}</div>
          </div>

          <div class="section">
            <table>
              <thead>
                <tr>
                  <th>Challan No</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Net Wt</th>
                  <th>Rate</th>
                  <th>PCS</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml || `<tr><td colspan="9">No records found.</td></tr>`}
                <tr class="totals">
                  <td colspan="7">Total Challan Amount</td>
                  <td class="num">${formatNumber(statement.challanAmount || 0, 2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2 style="font-size: 12px; margin: 0 0 4px;">Payments</h2>
            <table>
              <thead>
                <tr>
                  <th>Receipt No.</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${paymentRows || `<tr><td colspan="5">No payments found.</td></tr>`}
                <tr class="totals">
                  <td colspan="3">Total Payments</td>
                  <td class="num">${formatNumber(statement.paymentsTotal || 0, 2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2 style="font-size: 12px; margin: 0 0 4px;">Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Opening Balance</th>
                  <th>Challan Amount</th>
                  <th>Payments</th>
                  <th>Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="num">${formatNumber(statement.openingBalance || 0, 2)}</td>
                  <td class="num">${formatNumber(statement.challanAmount || 0, 2)}</td>
                  <td class="num">${formatNumber(statement.paymentsTotal || 0, 2)}</td>
                  <td class="num">${formatNumber(statement.closingBalance || statement.balance || 0, 2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
  };

  const buildPartyListPrintHtml = (parties) => {
    const rowsHtml = (parties || [])
      .map(
        (party) => `
          <tr>
            <td>${party.id || ""}</td>
            <td>${party.partyName || ""}</td>
            <td class="num">${formatNumber(party.openingBalance, 2)}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Party Master</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: "Times New Roman", serif; margin: 24px; color: #0b0d12; }
            .sheet { border: 2px solid #0f7a5c; border-radius: 12px; padding: 18px; }
            .title { text-align: center; font-size: 26px; margin: 0 0 6px; color: #0f7a5c; }
            .subtitle { text-align: center; margin: 0 0 16px; font-size: 12px; color: #4b5565; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { border: 1px solid #c7efe2; padding: 8px; text-align: left; }
            th { text-align: center; font-weight: bold; background: #e6f7f1; color: #0b5f47; }
            tbody tr:nth-child(even) { background: #f2fbf7; }
            .num { text-align: right; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <h1 class="title">Party Master</h1>
            <p class="subtitle">All registered parties and opening balances</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Party name</th>
                  <th>Opening balance</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml || `<tr><td colspan="3">No parties yet.</td></tr>`}
              </tbody>
            </table>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
  };

  const buildItemListPrintHtml = (items) => {
    const rowsHtml = (items || [])
      .map(
        (item) => `
          <tr>
            <td>${item.id || ""}</td>
            <td>${item.itemName || ""}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Item Master</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: "Times New Roman", serif; margin: 24px; color: #0b0d12; }
            .sheet { border: 2px solid #1f5bff; border-radius: 12px; padding: 18px; }
            .title { text-align: center; font-size: 26px; margin: 0 0 6px; color: #1f5bff; }
            .subtitle { text-align: center; margin: 0 0 16px; font-size: 12px; color: #4b5565; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { border: 1px solid #d7e0ff; padding: 8px; text-align: left; }
            th { text-align: center; font-weight: bold; background: #eef2ff; color: #0f3db5; }
            tbody tr:nth-child(even) { background: #f7f8ff; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <h1 class="title">Item Master</h1>
            <p class="subtitle">Catalog of all items available</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item name</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml || `<tr><td colspan="2">No items yet.</td></tr>`}
              </tbody>
            </table>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
  };

  const buildMaterialInPrintHtml = (challan, items) => {
    const totals = items.reduce(
      (acc, item) => {
        acc.grossWeight += Number(item.grossWeight || 0);
        acc.bagsCrate += Number(item.bagsCrate || 0);
        acc.lessWeight += Number(item.lessWeight || 0);
        acc.netWeight += Number(item.netWeight || 0);
        acc.pcs += Number(item.pcs || 0);
        return acc;
      },
      { grossWeight: 0, bagsCrate: 0, lessWeight: 0, netWeight: 0, pcs: 0 }
    );

    const rowsHtml = items
      .map(
        (item) => `
          <tr>
            <td>${item.itemName || ""}</td>
            <td class="num">${formatNumber(item.grossWeight, 3)}</td>
            <td class="num">${formatNumber(item.bagsCrate, 0)}</td>
            <td class="num">${formatNumber(item.lessWeight, 3)}</td>
            <td class="num">${formatNumber(item.netWeight, 3)}</td>
            <td class="num">${formatNumber(item.pcs, 0)}</td>
            <td>${item.processType || ""}</td>
          </tr>
        `
      )
      .join("");

    const maxRows = 5;
    const blankRowCount = Math.max(0, maxRows - items.length);
    const blankRowsHtml = Array.from({ length: blankRowCount })
      .map(
        () => `
          <tr class="blank">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Material In</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: "Times New Roman", serif; margin: 0; padding: 6mm; color: #000; }
            @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; } }
            .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 8px; }
            .header-grid { border: 1px solid #000; border-bottom: none; padding: 10px; font-size: 13px; }
            .header-row { display: flex; justify-content: space-between; gap: 8px; }
            .header-row + .header-row { margin-top: 4px; }
            .label { font-weight: bold; }
            .value { font-weight: bold; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: -1px; }
            .col-desc { width: 36%; }
            .col-gross { width: 12%; }
            .col-bags { width: 8%; }
            .col-less { width: 8%; }
            .col-net { width: 10%; }
            .col-pcs { width: 6%; }
            .col-process { width: 6%; }
            th, td { border: 1px solid #000; padding: 3px; text-align: left; }
            tbody tr:nth-child(-n+2) td { padding-top: 6px; padding-bottom: 6px; }
            th { padding-top: 6px; padding-bottom: 6px; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .totals td { font-weight: bold; padding-top: 8px; padding-bottom: 8px; }
            .footer-row td { height: 44px; vertical-align: top; }
            .footer-label { font-weight: bold; display: block; }
            .page { min-height: 100%; display: flex; flex-direction: column; }
            .content { flex: 1; display: flex; flex-direction: column; gap: 0; }
            .spacer { flex: 1; }
            .blank td { height: 34px; }
            .sign { font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="content">
              <div class="title">Material In</div>
              <div class="header-grid">
                <div class="header-row">
                  <div class="label">Party Name:- ${challan.partyName || ""}</div>
                  <div class="label">Challan No:- ${challan.challanNo}</div>
                </div>
                <div class="header-row">
                  <div></div>
                  <div class="label">Challan Date:- ${challan.challanDate}</div>
                </div>
              </div>
              <table>
                <colgroup>
                  <col class="col-desc" />
                  <col class="col-gross" />
                  <col class="col-bags" />
                  <col class="col-less" />
                  <col class="col-net" />
                  <col class="col-pcs" />
                  <col class="col-process" />
                </colgroup>
            <thead>
              <tr>
                <th>Description</th>
                <th>Gross WT</th>
                <th>Bags</th>
                <th>Less</th>
                <th>Net WT</th>
                <th>PCS</th>
                <th>Process</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${blankRowsHtml}
              <tr class="totals">
                <td>Total</td>
                <td class="num">${formatNumber(totals.grossWeight, 3)}</td>
                <td class="num">${formatNumber(totals.bagsCrate, 0)}</td>
                <td class="num">${formatNumber(totals.lessWeight, 3)}</td>
                <td class="num">${formatNumber(totals.netWeight, 3)}</td>
                <td class="num">${formatNumber(totals.pcs, 0)}</td>
                <td></td>
              </tr>
              <tr class="footer-row">
                <td colspan="3">
                  <span class="footer-label">Remarks</span>
                  <span>${challan.remarks || ""}</span>
                </td>
                <td colspan="3">
                  <span class="footer-label">Vehicle</span>
                  <span>${challan.vehicleNo || ""}</span>
                </td>
                <td class="sign">
                  <span class="footer-label">Sign</span>
                </td>
              </tr>
            </tbody>
              </table>
            </div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
  };

  return {
    sortByIdAsc,
    getTodayValue,
    formatNumber,
    createEmptyChallanItem,
    createEmptyMaterialOutItem,
    createEmptyMaterialInItem,
    getNetWeight,
    getAmount,
    buildChallanPrintHtml,
    buildMaterialOutPrintHtml,
    buildMaterialInPrintHtml,
    buildMaterialInOutPrintHtml,
    buildPartyStatementPrintHtml,
    buildPartyListPrintHtml,
    buildItemListPrintHtml
  };
})();
