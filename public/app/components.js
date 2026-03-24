window.AppComponents = (() => {
  const PartyMasterSection = ({ parties, partyLoading, onEdit, onDelete }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Party master list</h4>
          {partyLoading ? (
            <p className="muted">Loading parties...</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Party name</th>
                    <th>Opening balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {parties.length === 0 ? (
                    <tr>
                      <td colSpan="4">No parties yet.</td>
                    </tr>
                  ) : (
                    parties.map((party) => (
                      <tr key={party.id}>
                        <td>{party.id}</td>
                        <td>{party.partyName}</td>
                        <td>{Number(party.openingBalance).toFixed(2)}</td>
                        <td>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onEdit(party)}
                            aria-label="Edit party"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5 7.5 16.5 11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onDelete(party)}
                            aria-label="Delete party"
                            title="Delete"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M6 7h12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5h6V7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M13.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const ItemMasterSection = ({ items, itemLoading, onEdit, onDelete }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Item master list</h4>
          {itemLoading ? (
            <p className="muted">Loading items...</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="3">No items yet.</td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.itemName}</td>
                        <td>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onEdit(item)}
                            aria-label="Edit item"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5 7.5 16.5 11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onDelete(item)}
                            aria-label="Delete item"
                            title="Delete"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M6 7h12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5h6V7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M13.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const SalesPaymentSection = ({
    payments,
    paymentLoading,
    paymentError,
    onEdit,
    onDelete,
    parties,
    filterParty,
    filterStart,
    filterEnd,
    filterType,
    typeOptions,
    onFilterPartyChange,
    onFilterStartChange,
    onFilterEndChange,
    onFilterTypeChange
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Sales payment list</h4>
          {paymentError ? <div className="notice">{paymentError}</div> : null}
          {paymentLoading ? (
            <p className="muted">Loading payments...</p>
          ) : (
            <div className="table-wrap">
              <div className="filter-bar">
                <div className="form-group">
                  <label htmlFor="salesFilterParty">Party name</label>
                  <select
                    id="salesFilterParty"
                    value={filterParty}
                    onChange={(event) => onFilterPartyChange(event.target.value)}
                  >
                    <option value="">All parties</option>
                    {parties.map((party) => (
                      <option key={party} value={party}>
                        {party}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="salesFilterStart">Start date</label>
                  <input
                    id="salesFilterStart"
                    type="date"
                    value={filterStart}
                    onChange={(event) => onFilterStartChange(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="salesFilterEnd">End date</label>
                  <input
                    id="salesFilterEnd"
                    type="date"
                    value={filterEnd}
                    onChange={(event) => onFilterEndChange(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="salesFilterType">Type</label>
                  <select
                    id="salesFilterType"
                    value={filterType}
                    onChange={(event) => onFilterTypeChange(event.target.value)}
                  >
                    <option value="">All types</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Receipt No.</th>
                    <th>Date</th>
                    <th>Party</th>
                    <th className="num">Amount</th>
                    <th>Type</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="7">No payments yet.</td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.receiptNo}</td>
                        <td>{payment.receiptDate}</td>
                        <td>{payment.partyName}</td>
                        <td className="num">{Number(payment.amount).toFixed(2)}</td>
                        <td>{payment.transactionType}</td>
                        <td>{payment.remarks || "-"}</td>
                        <td>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onEdit(payment)}
                            aria-label="Edit payment"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5 7.5 16.5 11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onDelete(payment)}
                            aria-label="Delete payment"
                            title="Delete"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M6 7h12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5h6V7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M13.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const MaterialPaymentSection = ({
    materialPayments,
    materialLoading,
    materialError,
    onEdit,
    onDelete,
    parties,
    filterParty,
    filterStart,
    filterEnd,
    filterType,
    typeOptions,
    onFilterPartyChange,
    onFilterStartChange,
    onFilterEndChange,
    onFilterTypeChange
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Material payment list</h4>
          {materialError ? <div className="notice">{materialError}</div> : null}
          {materialLoading ? (
            <p className="muted">Loading payments...</p>
          ) : (
            <div className="table-wrap">
              <div className="filter-bar">
                <div className="form-group">
                  <label htmlFor="materialFilterParty">Party name</label>
                  <select
                    id="materialFilterParty"
                    value={filterParty}
                    onChange={(event) => onFilterPartyChange(event.target.value)}
                  >
                    <option value="">All parties</option>
                    {parties.map((party) => (
                      <option key={party} value={party}>
                        {party}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="materialFilterStart">Start date</label>
                  <input
                    id="materialFilterStart"
                    type="date"
                    value={filterStart}
                    onChange={(event) => onFilterStartChange(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="materialFilterEnd">End date</label>
                  <input
                    id="materialFilterEnd"
                    type="date"
                    value={filterEnd}
                    onChange={(event) => onFilterEndChange(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="materialFilterType">Type</label>
                  <select
                    id="materialFilterType"
                    value={filterType}
                    onChange={(event) => onFilterTypeChange(event.target.value)}
                  >
                    <option value="">All types</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Receipt No.</th>
                    <th>Date</th>
                    <th>Party</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materialPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7">No payments yet.</td>
                    </tr>
                  ) : (
                    materialPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.receiptNo}</td>
                        <td>{payment.receiptDate}</td>
                        <td>{payment.partyName}</td>
                        <td>{Number(payment.amount).toFixed(2)}</td>
                        <td>{payment.transactionType}</td>
                        <td>{payment.remarks || "-"}</td>
                        <td>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onEdit(payment)}
                            aria-label="Edit payment"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5 7.5 16.5 11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onDelete(payment)}
                            aria-label="Delete payment"
                            title="Delete"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M6 7h12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5h6V7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M13.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const PartyStatementSection = ({
    parties,
    partyId,
    startDate,
    endDate,
    onPartyChange,
    onStartDateChange,
    onEndDateChange,
    onSubmit,
    loading,
    error,
    statement,
    formatNumber
  }) => (
    <section className="module">
      <div className="card">
        <h4>Party Statement</h4>
        {error ? <div className="notice">{error}</div> : null}
        <form className="challan-form" onSubmit={onSubmit}>
          <div className="challan-grid">
            <div className="form-group">
              <label htmlFor="statementParty">Party name</label>
              <select
                id="statementParty"
                value={partyId}
                onChange={(event) => onPartyChange(event.target.value)}
                required
              >
                <option value="">Select party</option>
                {parties.map((party) => (
                  <option key={party.id} value={party.id}>
                    {party.partyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="statementStart">Start date</label>
              <input
                id="statementStart"
                type="date"
                value={startDate}
                onChange={(event) => onStartDateChange(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="statementEnd">End date</label>
              <input
                id="statementEnd"
                type="date"
                value={endDate}
                onChange={(event) => onEndDateChange(event.target.value)}
                required
              />
            </div>
          </div>
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Generate"}
          </button>
        </form>
      </div>

      {statement ? (
        <>
          <div className="card">
            <div style={{ display: "grid", gap: "6px", marginBottom: "12px" }}>
              <div>
                <strong>Party Name.</strong> {statement.partyName}
              </div>
              <div>
                <strong>Duration.</strong> From {statement.startDate} to {statement.endDate}
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Challan No</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th className="num">Net Weight</th>
                    <th className="num">Rate</th>
                    <th className="num">PCS</th>
                    <th className="num">Rate</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.rows.length === 0 ? (
                    <tr>
                      <td colSpan="8">No records found.</td>
                    </tr>
                  ) : (
                    statement.rows.map((row, index) => (
                      <tr key={`${row.type}-${row.challanNo}-${index}`}>
                        <td>{row.challanNo || "-"}</td>
                        <td>{row.date}</td>
                        <td>{row.product}</td>
                        <td className="num">
                          {row.netWeight ? formatNumber(row.netWeight, 3) : ""}
                        </td>
                        <td className="num">
                          {row.rateWeight ? formatNumber(row.rateWeight, 2) : ""}
                        </td>
                        <td className="num">{row.pcs ? formatNumber(row.pcs, 0) : ""}</td>
                        <td className="num">
                          {row.ratePcs ? formatNumber(row.ratePcs, 2) : ""}
                        </td>
                        <td className="num">{formatNumber(row.amount, 2)}</td>
                      </tr>
                    ))
                  )}
                  <tr>
                    <td colSpan="7">
                      <strong>Total Challan Amount</strong>
                    </td>
                    <td className="num">
                      <strong>{formatNumber(statement.challanAmount || 0, 2)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h4>Payments</h4>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Receipt No.</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th className="num">Amount</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.payments.length === 0 ? (
                    <tr>
                      <td colSpan="5">No payments found.</td>
                    </tr>
                  ) : (
                    statement.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.receiptNo}</td>
                        <td>{payment.receiptDate}</td>
                        <td>{payment.transactionType}</td>
                        <td className="num">{formatNumber(payment.amount, 2)}</td>
                        <td>{payment.remarks || "-"}</td>
                      </tr>
                    ))
                  )}
                  <tr>
                    <td colSpan="3">
                      <strong>Total Payments</strong>
                    </td>
                    <td className="num">
                      <strong>{formatNumber(statement.paymentsTotal || 0, 2)}</strong>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h4>Summary</h4>
            <div className="table-wrap">
              <table className="data-table">
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
                    <td>{formatNumber(statement.openingBalance, 2)}</td>
                    <td>{formatNumber(statement.challanAmount || 0, 2)}</td>
                    <td>{formatNumber(statement.paymentsTotal || 0, 2)}</td>
                    <td>{formatNumber(statement.closingBalance || statement.balance || 0, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );

  const ChallanSalesSection = ({
    challanNo,
    challanDate,
    challanPartyId,
    partySearch,
    challanItems,
    challanRemarks,
    challanBillNo,
    challanVehicleNo,
    parties,
    items,
    challanError,
    challanSaving,
    onPartySearchChange,
    onNoChange,
    onDateChange,
    onAddItem,
    onRemoveItem,
    onItemChange,
    onRemarksChange,
    onBillNoChange,
    onVehicleChange,
    onSave,
    onSaveAndPrint,
    getNetWeight,
    getAmount,
    onAddParty,
    onAddItemModal,
    isEditing,
    onCancelEdit
  }) => (
    <section className="module">
      <div className="challan-card">
        <div className="challan-header">
          <h3>Delivery Challan</h3>
          <span>Challan No: {challanNo || "-"}</span>
        </div>
        {challanError ? <div className="notice">{challanError}</div> : null}
        <form className="challan-form" onSubmit={onSave}>
          <div className="challan-grid">
            <div className="form-group">
              <label htmlFor="challanParty">Party name</label>
              <div className="field-row">
                <input
                  id="challanParty"
                  list="challanPartyOptions"
                  value={partySearch}
                  onChange={(event) => onPartySearchChange(event.target.value)}
                  placeholder="Select party"
                  required
                />
                <button
                  className="ghost inline-add icon-only"
                  type="button"
                  onClick={onAddParty}
                  aria-label="Add party"
                  title="Add party"
                >
                  +
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="challanNo">Challan No.</label>
              <input
                id="challanNo"
                type="number"
                min="1"
                value={challanNo}
                onChange={(event) => onNoChange(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="challanDate">Challan date</label>
              <input
                id="challanDate"
                type="date"
                value={challanDate}
                onChange={(event) => onDateChange(event.target.value)}
                required
              />
            </div>
          </div>
          <datalist id="challanPartyOptions">
            {parties.map((party) => (
              <option key={party.id} value={party.partyName}></option>
            ))}
          </datalist>
          <div className="challan-table-wrap">
            <table className="challan-table material-in-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Gross Weight</th>
                  <th>No. of Bags/Crate</th>
                  <th>Less</th>
                  <th>Net Weight</th>
                  <th>PCS</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {challanItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="field-row item-cell">
                          <input
                            list="materialOutItemOptions"
                            value={item.itemSearch}
                            onChange={(event) =>
                              onItemChange(index, "itemSearch", event.target.value)
                            }
                            placeholder="Select item"
                            required
                          />
                        <button
                          className="ghost inline-add icon-only"
                          type="button"
                          onClick={onAddItemModal}
                          aria-label="Add item"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.001"
                        value={item.grossWeight}
                        onChange={(event) =>
                          onItemChange(index, "grossWeight", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="1"
                        value={item.bagsCrate}
                        onChange={(event) =>
                          onItemChange(index, "bagsCrate", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.001"
                        value={item.lessWeight}
                        onChange={(event) =>
                          onItemChange(index, "lessWeight", event.target.value)
                        }
                      />
                    </td>
                    <td className="cell-readonly">{getNetWeight(item).toFixed(3)}</td>
                    <td className="cell-narrow">
                      <input
                        type="number"
                        step="1"
                        value={item.pcs}
                        onChange={(event) => onItemChange(index, "pcs", event.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className="unit-select"
                        value={item.unit}
                        onChange={(event) => onItemChange(index, "unit", event.target.value)}
                      >
                        <option value="per_kg">KG</option>
                        <option value="per_pcs">PCS</option>
                      </select>
                    </td>
                    <td className="cell-narrow">
                      <input
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={(event) => onItemChange(index, "rate", event.target.value)}
                      />
                    </td>
                    <td className="cell-readonly">{getAmount(item).toFixed(2)}</td>
                    <td>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(event) => onItemChange(index, "notes", event.target.value)}
                        placeholder="Notes"
                      />
                    </td>
                    <td>
                      <button
                        className="ghost icon-button remove-icon"
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        aria-label="Remove item"
                        title="Remove"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path
                            d="M6 7h12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9 7V5.5h6V7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.5 10.5v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M13.5 10.5v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <datalist id="materialOutItemOptions">
            {items.map((option) => (
              <option key={option.id} value={option.itemName}></option>
            ))}
          </datalist>
          <div className="challan-actions">
            <button className="primary" type="button" onClick={onAddItem}>
              Add item
            </button>
          </div>
          <div className="challan-grid">
            <div className="form-group">
              <label htmlFor="challanRemarks">Remarks</label>
              <input
                id="challanRemarks"
                type="text"
                value={challanRemarks}
                onChange={(event) => onRemarksChange(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="challanBillNo">Bill No.</label>
              <input
                id="challanBillNo"
                type="text"
                value={challanBillNo}
                onChange={(event) => onBillNoChange(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="challanVehicle">Vehicle</label>
              <input
                id="challanVehicle"
                type="text"
                value={challanVehicleNo}
                onChange={(event) => onVehicleChange(event.target.value)}
              />
            </div>
          </div>
          <div className="challan-actions">
            <button className="primary" type="submit" disabled={challanSaving}>
              {challanSaving ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
            <button
              className="primary"
              type="button"
              onClick={onSaveAndPrint}
              disabled={challanSaving}
            >
              {challanSaving ? "Saving..." : isEditing ? "Update & Print" : "Save & Print"}
            </button>
            {isEditing ? (
              <button className="ghost" type="button" onClick={onCancelEdit}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );

  const MaterialOutSection = ({
    challanNo,
    challanDate,
    challanPartyId,
    partySearch,
    materialItems,
    remarks,
    vehicleNo,
    parties,
    items,
    error,
    saving,
    onPartySearchChange,
    onNoChange,
    onDateChange,
    onAddItem,
    onRemoveItem,
    onItemChange,
    onRemarksChange,
    onVehicleChange,
    onSave,
    onSaveAndPrint,
    getNetWeight,
    isEditing,
    onCancelEdit,
    onAddParty,
    onAddItemModal
  }) => (
    <section className="module">
      <div className="challan-card">
        <div className="challan-header">
          <h3>Material Out</h3>
          <span>Challan No: {challanNo || "-"}</span>
        </div>
        {error ? <div className="notice">{error}</div> : null}
        <form className="challan-form" onSubmit={onSave}>
          <div className="challan-grid">
            <div className="form-group">
              <label htmlFor="materialParty">Party name</label>
              <div className="field-row">
                <input
                  id="materialParty"
                  list="materialOutPartyOptions"
                  value={partySearch}
                  onChange={(event) => onPartySearchChange(event.target.value)}
                  placeholder="Select party"
                  required
                />
                <button
                  className="ghost inline-add icon-only"
                  type="button"
                  onClick={onAddParty}
                  aria-label="Add party"
                  title="Add party"
                >
                  +
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="materialOutNo">Challan No.</label>
              <input
                id="materialOutNo"
                type="number"
                min="1"
                value={challanNo}
                onChange={(event) => onNoChange(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="materialOutDate">Challan date</label>
              <input
                id="materialOutDate"
                type="date"
                value={challanDate}
                onChange={(event) => onDateChange(event.target.value)}
                required
              />
            </div>
          </div>
          <datalist id="materialOutPartyOptions">
            {parties.map((party) => (
              <option key={party.id} value={party.partyName}></option>
            ))}
          </datalist>
          <div className="challan-table-wrap">
            <table className="challan-table material-in-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Gross Weight</th>
                  <th>No. of Bags</th>
                  <th>Less</th>
                  <th>Net Weight</th>
                  <th>PCS</th>
                  <th>Type of Process</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {materialItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="field-row item-cell">
                          <input
                            list="challanItemOptions"
                            value={item.itemSearch}
                            onChange={(event) =>
                              onItemChange(index, "itemSearch", event.target.value)
                            }
                            placeholder="Select item"
                            required
                          />
                        <button
                          className="ghost inline-add icon-only"
                          type="button"
                          onClick={onAddItemModal}
                          aria-label="Add item"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.001"
                        value={item.grossWeight}
                        onChange={(event) =>
                          onItemChange(index, "grossWeight", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="1"
                        value={item.bagsCrate}
                        onChange={(event) =>
                          onItemChange(index, "bagsCrate", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.001"
                        value={item.lessWeight}
                        onChange={(event) =>
                          onItemChange(index, "lessWeight", event.target.value)
                        }
                      />
                    </td>
                    <td className="cell-readonly">{getNetWeight(item).toFixed(3)}</td>
                    <td>
                      <input
                        type="number"
                        step="1"
                        value={item.pcs}
                        onChange={(event) => onItemChange(index, "pcs", event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.processType}
                        onChange={(event) =>
                          onItemChange(index, "processType", event.target.value)
                        }
                        placeholder="Process"
                      />
                    </td>
                    <td>
                      <button
                        className="ghost icon-button remove-icon"
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        aria-label="Remove item"
                        title="Remove"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path
                            d="M6 7h12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9 7V5.5h6V7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.5 10.5v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M13.5 10.5v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <datalist id="challanItemOptions">
            {items.map((option) => (
              <option key={option.id} value={option.itemName}></option>
            ))}
          </datalist>
          <div className="challan-actions">
            <button className="primary" type="button" onClick={onAddItem}>
              Add item
            </button>
          </div>
          <div className="challan-grid">
            <div className="form-group">
              <label htmlFor="materialOutRemarks">Remarks</label>
              <input
                id="materialOutRemarks"
                type="text"
                value={remarks}
                onChange={(event) => onRemarksChange(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="materialOutVehicle">Vehicle</label>
              <input
                id="materialOutVehicle"
                type="text"
                value={vehicleNo}
                onChange={(event) => onVehicleChange(event.target.value)}
              />
            </div>
          </div>
          <div className="challan-actions">
            <button className="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
            <button
              className="primary"
              type="button"
              onClick={onSaveAndPrint}
              disabled={saving}
            >
              {saving ? "Saving..." : isEditing ? "Update & Print" : "Save & Print"}
            </button>
            {isEditing ? (
              <button className="ghost" type="button" onClick={onCancelEdit}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );

  const MaterialInSection = ({
    challanNo,
    challanDate,
    challanPartyId,
    partySearch,
    onPartySearchChange,
    materialItems,
    remarks,
    vehicleNo,
    parties,
    items,
    challanOptionsByRow,
    error,
    saving,
    onPartyChange,
    onNoChange,
    onDateChange,
    onAddItem,
    onRemoveItem,
    onItemChange,
    onRemarksChange,
    onVehicleChange,
    onSave,
    onSaveAndPrint,
    getNetWeight,
    getAmount,
    isEditing,
    onCancelEdit,
    onAddParty,
    onAddItemModal
  }) => (
    <section className="module">
      <div className="challan-card">
        <div className="challan-header">
          <h3>Material In</h3>
          <span>Challan No: {challanNo || "-"}</span>
        </div>
        {error ? <div className="notice">{error}</div> : null}
        <form className="challan-form" onSubmit={onSave}>
          <div className="challan-grid">
            <div className="form-group">
              <label htmlFor="materialInParty">Party name</label>
              <div className="field-row">
                <input
                  id="materialInParty"
                  list="materialInPartyOptions"
                  value={partySearch}
                  onChange={(event) => onPartySearchChange(event.target.value)}
                  placeholder="Select party"
                  required
                />
                <button
                  className="ghost inline-add icon-only"
                  type="button"
                  onClick={onAddParty}
                  aria-label="Add party"
                  title="Add party"
                >
                  +
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="materialInNo">Challan No.</label>
              <input
                id="materialInNo"
                type="number"
                min="1"
                value={challanNo}
                onChange={(event) => onNoChange(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="materialInDate">Challan date</label>
              <input
                id="materialInDate"
                type="date"
                value={challanDate}
                onChange={(event) => onDateChange(event.target.value)}
                required
              />
            </div>
          </div>
          <datalist id="materialInPartyOptions">
            {parties.map((party) => (
              <option key={party.id} value={party.partyName}></option>
            ))}
          </datalist>
          <div className="challan-table-wrap">
            <table className="challan-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Challan No</th>
                  <th>Weight Balance</th>
                  <th>PCS Balance</th>
                  <th>Gross Weight</th>
                  <th>No. of Bags Crate</th>
                  <th>Less</th>
                  <th>Net Weight</th>
                  <th>PCS</th>
                  <th>Per KG/PCS</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Type of Process</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {materialItems.map((item, index) => {
                  const rowOptions = challanOptionsByRow?.[index] || [];
                  return (
                    <tr key={index}>
                      <td>
                        <div className="field-row item-cell">
                          <input
                            list="materialInItemOptions"
                            value={item.itemSearch}
                            onChange={(event) =>
                              onItemChange(index, "itemSearch", event.target.value)
                            }
                            placeholder="Select item"
                            required
                          />
                          <input
                            type="text"
                            className="material-in-name"
                            value={item.materialInItemName}
                            onChange={(event) =>
                              onItemChange(index, "materialInItemName", event.target.value)
                            }
                            placeholder="MaterialInItemName"
                            aria-label="MaterialInItemName"
                          />
                          <button
                            className="ghost inline-add icon-only"
                            type="button"
                            onClick={onAddItemModal}
                            aria-label="Add item"
                            title="Add item"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <select
                          value={item.materialOutItemId}
                          onChange={(event) =>
                            onItemChange(index, "materialOutItemId", event.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {rowOptions.map((option) => (
                            <option key={option.materialOutItemId} value={option.materialOutItemId}>
                              {option.challanNo} (W:{Number(option.weightBalance || 0).toFixed(3)}, P:{Number(option.pcsBalance || 0).toFixed(0)})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="cell-readonly">
                        {Number(item.weightBalance || 0).toFixed(3)}
                      </td>
                      <td className="cell-readonly">
                        {Number(item.pcsBalance || 0).toFixed(0)}
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.001"
                          value={item.grossWeight}
                          onChange={(event) =>
                            onItemChange(index, "grossWeight", event.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="1"
                          value={item.bagsCrate}
                          onChange={(event) =>
                            onItemChange(index, "bagsCrate", event.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.001"
                          value={item.lessWeight}
                          onChange={(event) =>
                            onItemChange(index, "lessWeight", event.target.value)
                          }
                        />
                      </td>
                      <td className="cell-readonly">{getNetWeight(item).toFixed(3)}</td>
                      <td>
                        <input
                          type="number"
                          step="1"
                          value={item.pcs}
                          onChange={(event) => onItemChange(index, "pcs", event.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="unit-select"
                          value={item.unit}
                          onChange={(event) => onItemChange(index, "unit", event.target.value)}
                        >
                          <option value="per_kg">KG</option>
                          <option value="per_pcs">PCS</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(event) => onItemChange(index, "rate", event.target.value)}
                        />
                      </td>
                      <td className="cell-readonly">{getAmount(item).toFixed(2)}</td>
                      <td>
                        <input
                          type="text"
                          list="materialInProcessOptions"
                          value={item.processType}
                          onChange={(event) =>
                            onItemChange(index, "processType", event.target.value)
                          }
                          placeholder="Process"
                        />
                      </td>
                      <td>
                        <button
                          className="ghost icon-button remove-icon"
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          aria-label="Remove item"
                          title="Remove"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path
                              d="M6 7h12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9 7V5.5h6V7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10.5 10.5v6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                            <path
                              d="M13.5 10.5v6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <datalist id="materialInItemOptions">
              {items.map((option) => (
                <option key={option.id} value={option.itemName}></option>
              ))}
            </datalist>
            <datalist id="materialInProcessOptions">
              <option value="chhol"></option>
            </datalist>
          </div>
          <div className="challan-actions">
            <button className="primary" type="button" onClick={onAddItem}>
              Add item
            </button>
          </div>
          <div className="challan-grid">
            <div className="form-group">
              <label htmlFor="materialInRemarks">Remarks</label>
              <input
                id="materialInRemarks"
                type="text"
                value={remarks}
                onChange={(event) => onRemarksChange(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="materialInVehicle">Vehicle</label>
              <input
                id="materialInVehicle"
                type="text"
                value={vehicleNo}
                onChange={(event) => onVehicleChange(event.target.value)}
              />
            </div>
          </div>
          <div className="challan-actions">
            <button className="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
            <button
              className="primary"
              type="button"
              onClick={onSaveAndPrint}
              disabled={saving}
            >
              {saving ? "Saving..." : isEditing ? "Update & Print" : "Save & Print"}
            </button>
            {isEditing ? (
              <button className="ghost" type="button" onClick={onCancelEdit}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );

  const PrintChallanSalesSection = ({
    challanList,
    printLoading,
    printError,
    onPrint,
    onEdit,
    onDelete,
    formatNumber,
    parties,
    filterParty,
    filterStart,
    filterEnd,
    onFilterPartyChange,
    onFilterStartChange,
    onFilterEndChange
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Challan list</h4>
          {printError ? <div className="notice">{printError}</div> : null}
          {printLoading ? (
            <p className="muted">Loading challan records...</p>
          ) : (
            <div className="table-wrap">
              <div className="filter-bar">
                <div className="form-group">
                  <label htmlFor="challanFilterParty">Party name</label>
                  <select
                    id="challanFilterParty"
                    value={filterParty}
                    onChange={(event) => onFilterPartyChange(event.target.value)}
                  >
                    <option value="">All parties</option>
                    {parties.map((party) => (
                      <option key={party} value={party}>
                        {party}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="challanFilterStart">Start date</label>
                  <input
                    id="challanFilterStart"
                    type="date"
                    value={filterStart}
                    onChange={(event) => onFilterStartChange(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="challanFilterEnd">End date</label>
                  <input
                    id="challanFilterEnd"
                    type="date"
                    value={filterEnd}
                    onChange={(event) => onFilterEndChange(event.target.value)}
                  />
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Challan No.</th>
                    <th>Date</th>
                    <th>Party</th>
                    <th>Bill No.</th>
                    <th className="num">Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challanList.length === 0 ? (
                    <tr>
                      <td colSpan="6">No challan records yet.</td>
                    </tr>
                  ) : (
                    challanList.map((challan) => (
                      <tr key={challan.id}>
                        <td>{challan.challanNo}</td>
                        <td>{challan.challanDate}</td>
                        <td>{challan.partyName}</td>
                        <td>{challan.billNo || "-"}</td>
                        <td className="num">{formatNumber(challan.totalAmount || 0, 2)}</td>
                        <td>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onPrint(challan.id)}
                            aria-label="Print Challan"
                            title="Print"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M7 8V4h10v4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <rect
                                x="6"
                                y="14"
                                width="12"
                                height="6"
                                rx="1.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              />
                              <path
                                d="M6 11h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onEdit(challan.id)}
                            aria-label="Edit Challan"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5 7.5 16.5 11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onDelete(challan)}
                            aria-label="Delete Challan"
                            title="Delete"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M6 7h12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5h6V7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M13.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const PrintMaterialOutSection = ({
    challanList,
    printLoading,
    printError,
    onPrint,
    onEdit,
    onDelete
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Material out list</h4>
          {printError ? <div className="notice">{printError}</div> : null}
          {printLoading ? (
            <p className="muted">Loading records...</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Challan No.</th>
                    <th>Date</th>
                    <th>Party</th>
                    <th>Vehicle</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challanList.length === 0 ? (
                    <tr>
                      <td colSpan="5">No records yet.</td>
                    </tr>
                  ) : (
                    challanList.map((challan) => (
                      <tr key={challan.id}>
                        <td>{challan.challanNo}</td>
                        <td>{challan.challanDate}</td>
                        <td>{challan.partyName}</td>
                        <td>{challan.vehicleNo || "-"}</td>
                        <td>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onPrint(challan.id)}
                            aria-label="Print Challan"
                            title="Print"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M7 8V4h10v4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <rect
                                x="6"
                                y="14"
                                width="12"
                                height="6"
                                rx="1.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              />
                              <path
                                d="M6 11h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onEdit(challan.id)}
                            aria-label="Edit Challan"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5 7.5 16.5 11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onDelete(challan)}
                            aria-label="Delete Challan"
                            title="Delete"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M6 7h12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5h6V7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M13.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const PrintMaterialInSection = ({
    challanList,
    printLoading,
    printError,
    onPrint,
    onEdit,
    onDelete
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Material in list</h4>
          {printError ? <div className="notice">{printError}</div> : null}
          {printLoading ? (
            <p className="muted">Loading records...</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Challan No.</th>
                    <th>Date</th>
                    <th>Party</th>
                    <th>Vehicle</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challanList.length === 0 ? (
                    <tr>
                      <td colSpan="5">No records yet.</td>
                    </tr>
                  ) : (
                    challanList.map((challan) => (
                      <tr key={challan.id}>
                        <td>{challan.challanNo}</td>
                        <td>{challan.challanDate}</td>
                        <td>{challan.partyName}</td>
                        <td>{challan.vehicleNo || "-"}</td>
                        <td>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onPrint(challan.id)}
                            aria-label="Print Challan"
                            title="Print"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M7 8V4h10v4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <rect
                                x="6"
                                y="14"
                                width="12"
                                height="6"
                                rx="1.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              />
                              <path
                                d="M6 11h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onEdit(challan.id)}
                            aria-label="Edit Challan"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5 7.5 16.5 11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="ghost icon-button"
                            type="button"
                            onClick={() => onDelete(challan)}
                            aria-label="Delete Challan"
                            title="Delete"
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path
                                d="M6 7h12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9 7V5.5h6V7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M7.5 7.5 8.2 19h7.6l.7-11.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M13.5 10.5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const MaterialInOutReportSection = ({
    parties,
    partyId,
    startDate,
    endDate,
    onPartyChange,
    onStartDateChange,
    onEndDateChange,
    onSubmit,
    onPrint,
    loading,
    error,
    printError,
    report,
    formatNumber
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Material in-out report</h4>
          {error ? <div className="notice">{error}</div> : null}
          <form className="challan-form" onSubmit={onSubmit}>
            <div className="challan-grid">
              <div className="form-group">
                <label htmlFor="materialInOutParty">Party name</label>
                <select
                  id="materialInOutParty"
                  value={partyId}
                  onChange={(event) => onPartyChange(event.target.value)}
                  required
                >
                  <option value="">Select party</option>
                  {parties.map((party) => (
                    <option key={party.id} value={party.id}>
                      {party.partyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="materialInOutStart">Start date</label>
                <input
                  id="materialInOutStart"
                  type="date"
                  value={startDate}
                  onChange={(event) => onStartDateChange(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="materialInOutEnd">End date</label>
                <input
                  id="materialInOutEnd"
                  type="date"
                  value={endDate}
                  onChange={(event) => onEndDateChange(event.target.value)}
                  required
                />
              </div>
            </div>
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Fetch"}
            </button>
          </form>
        </div>
      </div>

      {report ? (
        <div className="module-grid">
          <div className="card report-meta">
            <div>
              <strong>Party name:</strong> {report.partyName}
            </div>
            <div>
              <strong>Duration:</strong> {report.startDate} to {report.endDate}
            </div>
            <div className="report-actions">
              <button
                className="ghost icon-button report-print"
                type="button"
                onClick={onPrint}
                aria-label="Print Material In-Out report"
                title="Print"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M7 8V4h10v4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="6"
                    y="14"
                    width="12"
                    height="6"
                    rx="1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M6 11h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {printError ? <div className="notice report-print-error">{printError}</div> : null}
          </div>
        </div>
      ) : null}

      {report ? (
        <div className="module-grid">
          <div className="card">
            <h4>Material outward</h4>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ch. No</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th className="num">Net Weight</th>
                    <th className="num">PCS</th>
                    <th>Process</th>
                  </tr>
                </thead>
                <tbody>
                  {report.outward.length === 0 ? (
                    <tr>
                      <td colSpan="6">No material outward records found.</td>
                    </tr>
                  ) : (
                    report.outward.map((row, index) => (
                      <tr key={`${row.challanNo}-${row.itemName}-${index}`}>
                        <td>{row.challanNo}</td>
                        <td>{row.challanDate}</td>
                        <td>{row.itemName}</td>
                        <td className="num">{formatNumber(row.netWeight, 3)}</td>
                        <td className="num">{formatNumber(row.pcs, 0)}</td>
                        <td>{row.processType || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3">Total</th>
                    <th className="num">{formatNumber(report.totals.totalOutwardWeight, 3)}</th>
                    <th className="num">{formatNumber(report.totals.totalOutwardPcs, 0)}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>Material inward</h4>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ch. No</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th className="num">Net Weight</th>
                    <th className="num">PCS</th>
                    <th className="num">Rate</th>
                    <th className="num">Amount</th>
                    <th>Process Done</th>
                  </tr>
                </thead>
                <tbody>
                  {report.inward.length === 0 ? (
                    <tr>
                      <td colSpan="8">No material inward records found.</td>
                    </tr>
                  ) : (
                    report.inward.map((row, index) => (
                      <tr key={`${row.challanNo}-${row.itemName}-${index}`}>
                        <td>{row.challanNo}</td>
                        <td>{row.challanDate}</td>
                        <td>{row.itemName}</td>
                        <td className="num">{formatNumber(row.netWeight, 3)}</td>
                        <td className="num">{formatNumber(row.pcs, 0)}</td>
                        <td className="num">{formatNumber(row.rate, 2)}</td>
                        <td className="num">{formatNumber(row.amount, 2)}</td>
                        <td>{row.processType || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3">Total</th>
                    <th className="num">{formatNumber(report.totals.totalInwardWeight, 3)}</th>
                    <th className="num">{formatNumber(report.totals.totalInwardPcs, 0)}</th>
                    <th></th>
                    <th className="num">{formatNumber(report.totals.totalPayment, 2)}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {report ? (
        <div className="module-grid">
          <div className="card">
            <h4>Payments</h4>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th className="num">Amount</th>
                    <th>Receipt No.</th>
                  </tr>
                </thead>
                <tbody>
                  {report.payments.length === 0 ? (
                    <tr>
                      <td colSpan="4">No payments found.</td>
                    </tr>
                  ) : (
                    report.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.receiptDate}</td>
                        <td>{payment.transactionType}</td>
                        <td className="num">{formatNumber(payment.amount, 2)}</td>
                        <td>{payment.receiptNo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="2">Total</th>
                    <th className="num">{formatNumber(report.totals.paymentMade, 2)}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>Summary</h4>
            <div className="table-wrap">
              <table className="data-table">
                <tbody>
                  <tr>
                    <td>Total outward</td>
                    <td className="num">{formatNumber(report.totals.totalOutwardWeight, 3)}</td>
                  </tr>
                  <tr>
                    <td>Total job done</td>
                    <td className="num">{formatNumber(report.totals.totalJobDoneWeight, 3)}</td>
                  </tr>
                  <tr>
                    <td>Total extra material</td>
                    <td className="num">{formatNumber(report.totals.totalExtraMaterialWeight, 3)}</td>
                  </tr>
                  <tr>
                    <td>Balance material</td>
                    <td className="num">{formatNumber(report.totals.balanceMaterial, 3)}</td>
                  </tr>
                  <tr>
                    <td>Total payment</td>
                    <td className="num">{formatNumber(report.totals.totalPayment, 2)}</td>
                  </tr>
                  <tr>
                    <td>Payment made</td>
                    <td className="num">{formatNumber(report.totals.paymentMade, 2)}</td>
                  </tr>
                  <tr>
                    <td>Outstanding amount</td>
                    <td className="num">{formatNumber(report.totals.outstandingAmount, 2)}</td>
                  </tr>
                  <tr>
                    <td>Balance PCS</td>
                    <td className="num">{formatNumber(report.totals.balancePcs, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );

  const MaterialOutstandingSection = ({
    records,
    loading,
    error,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onSubmit
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Material outstanding</h4>
          {error ? <div className="notice">{error}</div> : null}
          <form className="challan-form" onSubmit={onSubmit}>
            <div className="challan-grid">
              <div className="form-group">
                <label htmlFor="materialOutstandingStart">Start date</label>
                <input
                  id="materialOutstandingStart"
                  type="date"
                  value={startDate}
                  onChange={(event) => onStartDateChange(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="materialOutstandingEnd">End date</label>
                <input
                  id="materialOutstandingEnd"
                  type="date"
                  value={endDate}
                  onChange={(event) => onEndDateChange(event.target.value)}
                  required
                />
              </div>
            </div>
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Fetch"}
            </button>
          </form>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Challan No.</th>
                  <th>Date</th>
                  <th>Party</th>
                  <th>Item</th>
                  <th className="num">Net Weight</th>
                  <th className="num">PCS</th>
                  <th className="num">Weight Balance</th>
                  <th className="num">PCS Balance</th>
                  <th className="num">Days Difference</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="9">No outstanding records found.</td>
                  </tr>
                ) : (
                  records.map((row, index) => (
                    <tr key={`${row.challanNo}-${row.challanDate}-${row.partyName}-${row.itemName}-${index}`}>
                      <td>{row.challanNo}</td>
                      <td>{row.challanDate}</td>
                      <td>{row.partyName}</td>
                      <td>{row.itemName}</td>
                      <td className="num">{Number(row.netWeight || 0).toFixed(3)}</td>
                      <td className="num">{Number(row.pcs || 0).toFixed(0)}</td>
                      <td className="num">{Number(row.weightBalance || 0).toFixed(3)}</td>
                      <td className="num">{Number(row.pcsBalance || 0).toFixed(0)}</td>
                      <td className="num">{row.daysDifference}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );

  const PaymentOutstandingSection = ({ rows, loading, error }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Payment outstanding</h4>
          {error ? <div className="notice">{error}</div> : null}
          {loading ? (
            <p className="muted">Loading outstanding balances...</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Party name</th>
                    <th className="num">Outstanding balance</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="2">No outstanding records found.</td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.partyName}</td>
                        <td className="num">{Number(row.outstandingBalance || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const BackupSection = ({
    backupLoading,
    backupError,
    backupMessage,
    onBackup,
    restoreLoading,
    restoreError,
    restoreMessage,
    restoreFileName,
    onRestoreFileChange,
    onRestore
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Backup database</h4>
          {backupError ? <div className="notice">{backupError}</div> : null}
          {backupMessage ? <div className="notice">{backupMessage}</div> : null}
          <p className="muted">
            Download a copy of data/app.db. You will be asked where to save it.
          </p>
          <button className="primary" type="button" onClick={onBackup} disabled={backupLoading}>
            {backupLoading ? "Preparing..." : "Download backup"}
          </button>
        </div>
        <div className="card">
          <h4>Restore database</h4>
          {restoreError ? <div className="notice">{restoreError}</div> : null}
          {restoreMessage ? <div className="notice">{restoreMessage}</div> : null}
          <p className="muted">
            Choose a previously downloaded .db file. The app will close after restore; reopen it.
          </p>
          <div className="form-group">
            <label htmlFor="restoreFile">Backup file</label>
            <input
              id="restoreFile"
              type="file"
              accept=".db"
              onChange={(event) =>
                onRestoreFileChange(event.target.files && event.target.files[0])
              }
            />
            {restoreFileName ? <div className="muted">{restoreFileName}</div> : null}
          </div>
          <button className="primary" type="button" onClick={onRestore} disabled={restoreLoading}>
            {restoreLoading ? "Restoring..." : "Restore backup"}
          </button>
        </div>
      </div>
    </section>
  );

  const PartyModal = ({
    partyName,
    openingBalance,
    isEditing,
    partyError,
    onPartyNameChange,
    onOpeningBalanceChange,
    onClose,
    onSubmit
  }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h4>{isEditing ? "Edit party" : "Add party"}</h4>
            <span>{isEditing ? "Update party details" : "Record the opening balance"}</span>
          </div>
          <button className="ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="inline-form" onSubmit={onSubmit}>
          {partyError ? <div className="notice">{partyError}</div> : null}
          <div className="form-group">
            <label htmlFor="partyName">Party name</label>
            <input
              id="partyName"
              type="text"
              value={partyName}
              onChange={(event) => onPartyNameChange(event.target.value)}
              placeholder="Royal Traders"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="openingBalance">Opening balance</label>
            <input
              id="openingBalance"
              type="number"
              step="0.01"
              value={openingBalance}
              onChange={(event) => onOpeningBalanceChange(event.target.value)}
              placeholder="0"
            />
          </div>
          <button className="primary" type="submit">
            {isEditing ? "Update party" : "Save party"}
          </button>
        </form>
      </div>
    </div>
  );

  const ItemModal = ({
    itemName,
    itemError,
    onItemNameChange,
    onClose,
    onSubmit,
    isEditing
  }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h4>{isEditing ? "Edit item" : "Add item"}</h4>
            <span>Keep items consistent and searchable</span>
          </div>
          <button className="ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="inline-form" onSubmit={onSubmit}>
          {itemError ? <div className="notice">{itemError}</div> : null}
          <div className="form-group">
            <label htmlFor="itemName">Item name</label>
            <input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(event) => onItemNameChange(event.target.value)}
              placeholder="Steel Sheet"
              required
            />
          </div>
          <button className="primary" type="submit">
            {isEditing ? "Update item" : "Save item"}
          </button>
        </form>
      </div>
    </div>
  );

  const SalesPaymentModal = ({
    receiptDate,
    receiptNo,
    parties,
    paymentPartyId,
    paymentAmount,
    paymentType,
    paymentRemarks,
    paymentError,
    paymentSaving,
    onDateChange,
    onReceiptNoChange,
    onPartyChange,
    onAmountChange,
    onTypeChange,
    onRemarksChange,
    onClose,
    onSubmit
  }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h4>Payment Receipt</h4>
            <span>Record sales payment details</span>
          </div>
          <button className="ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        {paymentError ? <div className="notice">{paymentError}</div> : null}
        <form className="receipt-form" onSubmit={onSubmit}>
          <div className="receipt-row">
            <label htmlFor="receiptDate">Dated</label>
            <input
              id="receiptDate"
              type="date"
              value={receiptDate}
              onChange={(event) => onDateChange(event.target.value)}
              required
            />
          </div>
          <div className="receipt-row">
            <label htmlFor="receiptNo">Receipt No.</label>
            <input
              id="receiptNo"
              type="number"
              min="1"
              value={receiptNo}
              onChange={(event) => onReceiptNoChange(event.target.value)}
              required
            />
          </div>
          <div className="receipt-row">
            <label htmlFor="paymentParty">Party name</label>
            <select
              id="paymentParty"
              value={paymentPartyId}
              onChange={(event) => onPartyChange(event.target.value)}
              required
            >
              <option value="">Select party</option>
              {parties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.partyName}
                </option>
              ))}
            </select>
          </div>
          <div className="receipt-row">
            <label htmlFor="paymentAmount">Amount</label>
            <input
              id="paymentAmount"
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="0"
              required
            />
          </div>
          <div className="receipt-row">
            <label htmlFor="paymentType">Transaction type</label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(event) => onTypeChange(event.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="cash">Cash</option>
              <option value="gpay">Gpay</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div className="receipt-row receipt-remarks">
            <label htmlFor="paymentRemarks">Remarks</label>
            <textarea
              id="paymentRemarks"
              value={paymentRemarks}
              onChange={(event) => onRemarksChange(event.target.value)}
              placeholder="Add remarks"
              rows="3"
            />
          </div>
          <button className="primary" type="submit" disabled={paymentSaving}>
            {paymentSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );

  const MaterialPaymentModal = ({
    receiptDate,
    receiptNo,
    parties,
    partyId,
    amount,
    paymentType,
    remarks,
    paymentError,
    paymentSaving,
    onDateChange,
    onReceiptNoChange,
    onPartyChange,
    onAmountChange,
    onTypeChange,
    onRemarksChange,
    onClose,
    onSubmit
  }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h4>Material Payment</h4>
            <span>Record material payment details</span>
          </div>
          <button className="ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        {paymentError ? <div className="notice">{paymentError}</div> : null}
        <form className="receipt-form" onSubmit={onSubmit}>
          <div className="receipt-row">
            <label htmlFor="materialReceiptDate">Dated</label>
            <input
              id="materialReceiptDate"
              type="date"
              value={receiptDate}
              onChange={(event) => onDateChange(event.target.value)}
              required
            />
          </div>
          <div className="receipt-row">
            <label htmlFor="materialReceiptNo">Receipt No.</label>
            <input
              id="materialReceiptNo"
              type="number"
              min="1"
              value={receiptNo}
              onChange={(event) => onReceiptNoChange(event.target.value)}
              required
            />
          </div>
          <div className="receipt-row">
            <label htmlFor="materialParty">Party name</label>
            <select
              id="materialParty"
              value={partyId}
              onChange={(event) => onPartyChange(event.target.value)}
              required
            >
              <option value="">Select party</option>
              {parties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.partyName}
                </option>
              ))}
            </select>
          </div>
          <div className="receipt-row">
            <label htmlFor="materialAmount">Amount</label>
            <input
              id="materialAmount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="0"
              required
            />
          </div>
          <div className="receipt-row">
            <label htmlFor="materialType">Transaction type</label>
            <select
              id="materialType"
              value={paymentType}
              onChange={(event) => onTypeChange(event.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="cash">Cash</option>
              <option value="gpay">Gpay</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div className="receipt-row receipt-remarks">
            <label htmlFor="materialRemarks">Remarks</label>
            <textarea
              id="materialRemarks"
              value={remarks}
              onChange={(event) => onRemarksChange(event.target.value)}
              placeholder="Add remarks"
              rows="3"
            />
          </div>
          <button className="primary" type="submit" disabled={paymentSaving}>
            {paymentSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );

  const ProfileSection = ({ profileName, profileError, profileSaving, onNameChange, onSubmit }) => (
    <section className="module">
      <div className="card">
        <h4>Profile</h4>
        {profileError ? <div className="notice">{profileError}</div> : null}
        <form className="inline-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="profileName">Profile name</label>
            <input
              id="profileName"
              type="text"
              value={profileName}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Your business name"
              required
            />
          </div>
          <button className="primary" type="submit" disabled={profileSaving}>
            {profileSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </section>
  );

  const ManageUsersSection = ({
    createUsername,
    createPassword,
    createError,
    createSaving,
    adminPassword,
    adminPasswordError,
    adminPasswordSaving,
    onCreateUsernameChange,
    onCreatePasswordChange,
    onCreateSubmit,
    onAdminPasswordChange,
    onAdminPasswordSubmit
  }) => (
    <section className="module">
      <div className="module-grid">
        <div className="card">
          <h4>Manage users</h4>
          <p className="muted">Admin can create users and change the admin password.</p>
          {createError ? <div className="notice">{createError}</div> : null}
          <form className="inline-form" onSubmit={onCreateSubmit}>
            <div className="form-group">
              <label htmlFor="newUsername">New username</label>
              <input
                id="newUsername"
                type="text"
                value={createUsername}
                onChange={(event) => onCreateUsernameChange(event.target.value)}
                placeholder="username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                type="password"
                value={createPassword}
                onChange={(event) => onCreatePasswordChange(event.target.value)}
                placeholder="password"
                required
              />
            </div>
            <button className="primary" type="submit" disabled={createSaving}>
              {createSaving ? "Saving..." : "Create user"}
            </button>
          </form>
        </div>
        <div className="card">
          <h4>Admin password</h4>
          <p className="muted">Admin username is fixed and cannot be changed.</p>
          {adminPasswordError ? <div className="notice">{adminPasswordError}</div> : null}
          <form className="inline-form" onSubmit={onAdminPasswordSubmit}>
            <div className="form-group">
              <label htmlFor="adminUsername">Username</label>
              <input id="adminUsername" type="text" value="admin" readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="adminPassword">New admin password</label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(event) => onAdminPasswordChange(event.target.value)}
                placeholder="new password"
                required
              />
            </div>
            <button className="primary" type="submit" disabled={adminPasswordSaving}>
              {adminPasswordSaving ? "Saving..." : "Change admin password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  const DashboardSection = ({
    company,
    data,
    formatNumber,
    appVersion,
    appExpiry,
    onQuickNewChallan,
    onQuickAddPayment,
    onQuickViewStatement
  }) => {
    const buildHeights = (values) => {
      if (!values || values.length === 0) {
        return Array.from({ length: 6 }).map(() => 20);
      }
      const max = Math.max(...values, 0);
      return values.map((value) => (max > 0 ? 20 + (value / max) * 70 : 20));
    };

    const salesHeights = buildHeights(data.salesTrend);
    const materialPaymentHeights = buildHeights(data.materialPaymentsTrend);
    const materialOutHeights = buildHeights(data.materialOutTrend);
    const materialInHeights = buildHeights(data.materialInTrend);
    const performanceHeights = buildHeights(data.salesTrend);

    return (
      <section className="module">
        <div className="dashboard-hero">
          <div>
            <div className="muted">Expiry: {appExpiry} | Version: {appVersion}</div>
            <h3>Welcome back, {company?.name || ""}</h3>
            <p>Here is a quick view of sales, materials, and payments for the month.</p>
          </div>
          <div className="dashboard-badge">Live overview</div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span>Sales payments (month)</span>
            <strong>Rs {formatNumber(data.salesPaymentsTotal, 2)}</strong>
            <div className="sparkline">
              {salesHeights.map((height, index) => (
                <span key={`sales-${index}`} style={{ height: `${height}%` }}></span>
              ))}
            </div>
          </div>
          <div className="dashboard-card">
            <span>Material payments (month)</span>
            <strong>Rs {formatNumber(data.materialPaymentsTotal, 2)}</strong>
            <div className="sparkline">
              {materialPaymentHeights.map((height, index) => (
                <span key={`material-pay-${index}`} style={{ height: `${height}%` }}></span>
              ))}
            </div>
          </div>
          <div className="dashboard-card">
            <span>Material out (month)</span>
            <strong>{formatNumber(data.materialOutCount, 0)} entries</strong>
            <div className="sparkline">
              {materialOutHeights.map((height, index) => (
                <span key={`material-out-${index}`} style={{ height: `${height}%` }}></span>
              ))}
            </div>
          </div>
          <div className="dashboard-card">
            <span>Material in (month)</span>
            <strong>{formatNumber(data.materialInCount, 0)} entries</strong>
            <div className="sparkline">
              {materialInHeights.map((height, index) => (
                <span key={`material-in-${index}`} style={{ height: `${height}%` }}></span>
              ))}
            </div>
          </div>
        </div>
        <div className="dashboard-charts">
          <div className="dashboard-panel">
            <div>
              <h4>Monthly performance</h4>
              <p>Track sales payment totals over the last 6 months.</p>
            </div>
            <div className="bar-chart">
              {performanceHeights.map((height, index) => (
                <div key={`perf-${index}`} style={{ height: `${height}%` }}>
                  <span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-panel">
            <div>
              <h4>Quick actions</h4>
              <p>Jump to your most used workflows.</p>
            </div>
            <div className="quick-actions">
              <button className="ghost" type="button" onClick={onQuickNewChallan}>
                New Challan
              </button>
              <button className="ghost" type="button" onClick={onQuickAddPayment}>
                Add payment
              </button>
              <button className="ghost" type="button" onClick={onQuickViewStatement}>
                View statement
              </button>
            </div>
          </div>
        </div>
        <div className="muted" style={{ marginTop: "16px", textAlign: "center" }}>
          Developed by DTech
        </div>
      </section>
    );
  };

  return {
    PartyMasterSection,
    ItemMasterSection,
    SalesPaymentSection,
    MaterialPaymentSection,
    PartyStatementSection,
    ChallanSalesSection,
    MaterialOutSection,
    MaterialInSection,
    MaterialOutstandingSection,
    PaymentOutstandingSection,
    BackupSection,
    PrintChallanSalesSection,
    PrintMaterialOutSection,
    PrintMaterialInSection,
    MaterialInOutReportSection,
    ManageUsersSection,
    ProfileSection,
    DashboardSection,
    PartyModal,
    ItemModal,
    SalesPaymentModal,
    MaterialPaymentModal
  };
})();
