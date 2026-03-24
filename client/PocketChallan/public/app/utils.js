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
        acc.amount += Number(item.amount || 0);
        return acc;
      },
      { grossWeight: 0, bagsCrate: 0, lessWeight: 0, netWeight: 0, pcs: 0, amount: 0 }
    );

    const rowsHtml = items
      .map(
        (item) => `
          <tr>
            <td>${item.materialInItemName || ""}</td>
            <td class="num">${formatNumber(item.grossWeight, 3)}</td>
            <td class="num">${formatNumber(item.bagsCrate, 0)}</td>
            <td class="num">${formatNumber(item.lessWeight, 3)}</td>
            <td class="num">${formatNumber(item.netWeight, 3)}</td>
            <td class="num">${formatNumber(item.pcs, 0)}</td>
            <td>${item.unit === "per_pcs" ? "per PCS" : "per KG"}</td>
            <td class="num">${formatNumber(item.rate, 2)}</td>
            <td class="num">${formatNumber(item.amount, 2)}</td>
            <td>${item.notes || ""}</td>
          </tr>
        `
      )
      .join("");

    const maxRows = 10;
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
            body { font-family: "Times New Roman", serif; margin: 0; padding: 6mm; color: #000; }
            @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; } }
            .title { text-align: center; font-size: 15px; font-weight: bold; margin-bottom: 6px; }
            .header-grid { border: 1px solid #000; border-bottom: none; padding: 6px; font-size: 9px; }
            .header-row { display: flex; justify-content: space-between; gap: 8px; }
            .header-row + .header-row { margin-top: 4px; }
            .label { font-weight: bold; }
            .value { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: -1px; }
            .col-desc { width: 36%; }
            .col-gross { width: 10%; }
            .col-bags { width: 8%; }
            .col-less { width: 8%; }
            .col-net { width: 10%; }
            .col-pcs { width: 6%; }
            th, td { border: 1px solid #000; padding: 3px; text-align: left; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .totals td { font-weight: bold; }
            .page { min-height: 100%; display: flex; flex-direction: column; }
            .content { flex: 1; display: flex; flex-direction: column; gap: 6px; }
            .spacer { flex: 1; }
            .blank td { height: 22px; border-top: none; border-bottom: none; }
            .footer-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; font-size: 10px; }
            .footer-table td { border-right: 1px solid #000; padding: 4px 6px; vertical-align: top; height: 32px; }
            .footer-table td:last-child { border-right: none; text-align: right; }
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
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
            <thead>
              <tr>
                <th>Description</th>
                <th>Gross WT</th>
                <th>Bags</th>
                <th>Less</th>
                <th>Net WT</th>
                <th>PCS</th>
                <th>per Kg/Pcs</th>
                <th>Rate</th>
                <th>Amount</th>
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
                <td></td>
                <td class="num">${formatNumber(totals.amount, 2)}</td>
                <td></td>
              </tr>
            </tbody>
              </table>
            </div>
            <table class="footer-table">
              <tr>
                <td>
                  <div class="label">Remarks</div>
                  <div>${challan.remarks || ""}</div>
                </td>
                <td>
                  <div class="label">Vehicle</div>
                  <div>${challan.vehicleNo || ""}</div>
                </td>
                <td>
                  <div class="label">Bill No.</div>
                  <div>${challan.billNo || ""}</div>
                </td>
                <td class="sign">Sign</td>
              </tr>
            </table>
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

    const maxRows = 10;
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
            .title { text-align: center; font-size: 15px; font-weight: bold; margin-bottom: 6px; }
            .header-grid { border: 1px solid #000; border-bottom: none; padding: 6px; font-size: 9px; }
            .header-row { display: flex; justify-content: space-between; gap: 8px; }
            .header-row + .header-row { margin-top: 4px; }
            .label { font-weight: bold; }
            .value { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: -1px; }
            .col-desc { width: 36%; }
            .col-gross { width: 10%; }
            .col-bags { width: 8%; }
            .col-less { width: 8%; }
            .col-net { width: 10%; }
            .col-pcs { width: 6%; }
            th, td { border: 1px solid #000; padding: 3px; text-align: left; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .totals td { font-weight: bold; }
            .page { min-height: 100%; display: flex; flex-direction: column; }
            .content { flex: 1; display: flex; flex-direction: column; gap: 6px; }
            .spacer { flex: 1; }
            .blank td { height: 22px; border-top: none; border-bottom: none; }
            .footer-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; font-size: 10px; }
            .footer-table td { border-right: 1px solid #000; padding: 4px 6px; vertical-align: top; height: 32px; }
            .footer-table td:last-child { border-right: none; text-align: right; }
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
                  <col />
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
            </tbody>
              </table>
            </div>
            <table class="footer-table">
              <tr>
                <td>
                  <div class="label">Remarks</div>
                  <div>${challan.remarks || ""}</div>
                </td>
                <td>
                  <div class="label">Vehicle</div>
                  <div>${challan.vehicleNo || ""}</div>
                </td>
                <td class="sign">Sign</td>
              </tr>
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
        acc.amount += Number(item.amount || 0);
        return acc;
      },
      { grossWeight: 0, bagsCrate: 0, lessWeight: 0, netWeight: 0, pcs: 0, amount: 0 }
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
            <td>${item.unit === "per_pcs" ? "per PCS" : "per KG"}</td>
            <td class="num">${formatNumber(item.rate, 2)}</td>
            <td class="num">${formatNumber(item.amount, 2)}</td>
            <td>${item.processType || ""}</td>
          </tr>
        `
      )
      .join("");

    const maxRows = 10;
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
            @page { margin: 6mm; }
            body { font-family: "Times New Roman", serif; margin: 0; padding: 6mm; color: #000; }
            @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; } }
            .title { text-align: center; font-size: 15px; font-weight: bold; margin-bottom: 6px; }
            .header-grid { border: 1px solid #000; border-bottom: none; padding: 6px; font-size: 9px; }
            .header-row { display: flex; justify-content: space-between; gap: 8px; }
            .header-row + .header-row { margin-top: 4px; }
            .label { font-weight: bold; }
            .value { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: -1px; }
            .col-desc { width: 36%; }
            .col-gross { width: 10%; }
            .col-bags { width: 8%; }
            .col-less { width: 8%; }
            .col-net { width: 10%; }
            .col-pcs { width: 6%; }
            th, td { border: 1px solid #000; padding: 3px; text-align: left; }
            th { text-align: center; font-weight: bold; }
            .num { text-align: right; }
            .totals td { font-weight: bold; }
            .page { min-height: 100%; display: flex; flex-direction: column; }
            .content { flex: 1; display: flex; flex-direction: column; gap: 6px; }
            .spacer { flex: 1; }
            .blank td { height: 22px; border-top: none; border-bottom: none; }
            .footer-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; font-size: 10px; }
            .footer-table td { border-right: 1px solid #000; padding: 4px 6px; vertical-align: top; height: 32px; }
            .footer-table td:last-child { border-right: none; text-align: right; }
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
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
            <thead>
              <tr>
                <th>Description</th>
                <th>Gross WT</th>
                <th>Bags</th>
                <th>Less</th>
                <th>Net WT</th>
                <th>PCS</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Amt</th>
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
                <td></td>
                <td class="num">${formatNumber(totals.amount, 2)}</td>
                <td></td>
              </tr>
            </tbody>
              </table>
            </div>
            <table class="footer-table">
              <tr>
                <td>
                  <div class="label">Remarks</div>
                  <div>${challan.remarks || ""}</div>
                </td>
                <td>
                  <div class="label">Vehicle</div>
                  <div>${challan.vehicleNo || ""}</div>
                </td>
                <td class="sign">Sign</td>
              </tr>
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
    buildPartyListPrintHtml,
    buildItemListPrintHtml
  };
})();
