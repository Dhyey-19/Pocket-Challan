const { useEffect, useState } = React;

const { menuItems, reportItems, appVersion, appExpiry } = window.AppConstants;
const {
  sortByIdAsc,
  getTodayValue,
  createEmptyChallanItem,
  createEmptyMaterialOutItem,
  createEmptyMaterialInItem,
  getNetWeight,
  getAmount,
  formatNumber,
  buildChallanPrintHtml,
  buildMaterialOutPrintHtml,
  buildMaterialInPrintHtml,
  buildMaterialInOutPrintHtml,
  buildPartyListPrintHtml,
  buildItemListPrintHtml
} = window.AppUtils;
const {
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
} = window.AppComponents;

function App() {
  const [loading, setLoading] = useState(true);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");
  const [registrationKeyInput, setRegistrationKeyInput] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [registrationSaving, setRegistrationSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSaving, setLoginSaving] = useState(false);
  const [company, setCompany] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [error, setError] = useState("");
  const [partyName, setPartyName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [parties, setParties] = useState([]);
  const [partyError, setPartyError] = useState("");
  const [partyLoading, setPartyLoading] = useState(false);
  const [showPartyForm, setShowPartyForm] = useState(false);
  const [editingPartyId, setEditingPartyId] = useState(null);
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState([]);
  const [itemError, setItemError] = useState("");
  const [itemLoading, setItemLoading] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [receiptDate, setReceiptDate] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [payments, setPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentPartyId, setPaymentPartyId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [salesFilterParty, setSalesFilterParty] = useState("");
  const [salesFilterStart, setSalesFilterStart] = useState("");
  const [salesFilterEnd, setSalesFilterEnd] = useState("");
  const [salesFilterType, setSalesFilterType] = useState("");
  const [materialReceiptDate, setMaterialReceiptDate] = useState("");
  const [materialReceiptNo, setMaterialReceiptNo] = useState("");
  const [materialPayments, setMaterialPayments] = useState([]);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialPartyId, setMaterialPartyId] = useState("");
  const [materialAmount, setMaterialAmount] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [materialRemarks, setMaterialRemarks] = useState("");
  const [materialError, setMaterialError] = useState("");
  const [materialSaving, setMaterialSaving] = useState(false);
  const [editingMaterialPaymentId, setEditingMaterialPaymentId] = useState(null);
  const [materialFilterParty, setMaterialFilterParty] = useState("");
  const [materialFilterStart, setMaterialFilterStart] = useState("");
  const [materialFilterEnd, setMaterialFilterEnd] = useState("");
  const [materialFilterType, setMaterialFilterType] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [challanDate, setChallanDate] = useState("");
  const [challanPartyId, setChallanPartyId] = useState("");
  const [challanPartySearch, setChallanPartySearch] = useState("");
  const [challanItems, setChallanItems] = useState([]);
  const [challanRemarks, setChallanRemarks] = useState("");
  const [challanBillNo, setChallanBillNo] = useState("");
  const [challanVehicleNo, setChallanVehicleNo] = useState("");
  const [challanError, setChallanError] = useState("");
  const [challanSaving, setChallanSaving] = useState(false);
  const [challanList, setChallanList] = useState([]);
  const [printError, setPrintError] = useState("");
  const [printLoading, setPrintLoading] = useState(false);
  const [editingChallanId, setEditingChallanId] = useState(null);
  const [challanFilterParty, setChallanFilterParty] = useState("");
  const [challanFilterStart, setChallanFilterStart] = useState("");
  const [challanFilterEnd, setChallanFilterEnd] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [materialOutNo, setMaterialOutNo] = useState("");
  const [materialOutDate, setMaterialOutDate] = useState("");
  const [materialOutPartyId, setMaterialOutPartyId] = useState("");
  const [materialOutPartySearch, setMaterialOutPartySearch] = useState("");
  const [materialOutItems, setMaterialOutItems] = useState([]);
  const [materialOutRemarks, setMaterialOutRemarks] = useState("");
  const [materialOutVehicleNo, setMaterialOutVehicleNo] = useState("");
  const [materialOutError, setMaterialOutError] = useState("");
  const [materialOutSaving, setMaterialOutSaving] = useState(false);
  const [materialOutList, setMaterialOutList] = useState([]);
  const [materialOutPrintError, setMaterialOutPrintError] = useState("");
  const [materialOutPrintLoading, setMaterialOutPrintLoading] = useState(false);
  const [editingMaterialOutId, setEditingMaterialOutId] = useState(null);
  const [materialInNo, setMaterialInNo] = useState("");
  const [materialInDate, setMaterialInDate] = useState("");
  const [materialInPartyId, setMaterialInPartyId] = useState("");
  const [materialInPartySearch, setMaterialInPartySearch] = useState("");
  const [materialInItems, setMaterialInItems] = useState([]);
  const [materialInRemarks, setMaterialInRemarks] = useState("");
  const [materialInVehicleNo, setMaterialInVehicleNo] = useState("");
  const [materialInError, setMaterialInError] = useState("");
  const [materialInSaving, setMaterialInSaving] = useState(false);
  const [materialInList, setMaterialInList] = useState([]);
  const [materialInPrintError, setMaterialInPrintError] = useState("");
  const [materialInPrintLoading, setMaterialInPrintLoading] = useState(false);
  const [materialInChallanOptions, setMaterialInChallanOptions] = useState({});
  const [editingMaterialInId, setEditingMaterialInId] = useState(null);
  const [materialOutstandingRows, setMaterialOutstandingRows] = useState([]);
  const [materialOutstandingLoading, setMaterialOutstandingLoading] = useState(false);
  const [materialOutstandingError, setMaterialOutstandingError] = useState("");
  const [materialOutstandingStart, setMaterialOutstandingStart] = useState("");
  const [materialOutstandingEnd, setMaterialOutstandingEnd] = useState("");
  const [paymentOutstandingRows, setPaymentOutstandingRows] = useState([]);
  const [paymentOutstandingLoading, setPaymentOutstandingLoading] = useState(false);
  const [paymentOutstandingError, setPaymentOutstandingError] = useState("");
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupError, setBackupError] = useState("");
  const [backupMessage, setBackupMessage] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  const [restoreMessage, setRestoreMessage] = useState("");
  const [restoreFile, setRestoreFile] = useState(null);
  const [materialInOutPartyId, setMaterialInOutPartyId] = useState("");
  const [materialInOutStart, setMaterialInOutStart] = useState("");
  const [materialInOutEnd, setMaterialInOutEnd] = useState("");
  const [materialInOutLoading, setMaterialInOutLoading] = useState(false);
  const [materialInOutError, setMaterialInOutError] = useState("");
  const [materialInOutReport, setMaterialInOutReport] = useState(null);
  const [materialInOutPrintError, setMaterialInOutPrintError] = useState("");
  const [createUserUsername, setCreateUserUsername] = useState("");
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserError, setCreateUserError] = useState("");
  const [createUserSaving, setCreateUserSaving] = useState(false);
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [adminPasswordSaving, setAdminPasswordSaving] = useState(false);
  const [statementPartyId, setStatementPartyId] = useState("");
  const [statementStartDate, setStatementStartDate] = useState("");
  const [statementEndDate, setStatementEndDate] = useState("");
  const [statementLoading, setStatementLoading] = useState(false);
  const [statementError, setStatementError] = useState("");
  const [statementData, setStatementData] = useState(null);
  const [quickAction, setQuickAction] = useState("");
  const [dashboardData, setDashboardData] = useState({
    salesPaymentsTotal: 0,
    materialPaymentsTotal: 0,
    materialOutCount: 0,
    materialInCount: 0,
    salesTrend: [],
    materialPaymentsTrend: [],
    materialOutTrend: [],
    materialInTrend: []
  });

  const normalizeValue = (value) => String(value || "").trim().toLowerCase();

  const resolvePartyIdFromInput = (value) => {
    const match = parties.find(
      (party) => normalizeValue(party.partyName) === normalizeValue(value)
    );
    return match ? String(match.id) : "";
  };

  const resolveItemIdFromInput = (value) => {
    const match = items.find(
      (item) => normalizeValue(item.itemName) === normalizeValue(value)
    );
    return match ? String(match.id) : "";
  };

  const handleDownloadBackup = async () => {
    setBackupError("");
    setBackupMessage("");
    setBackupLoading(true);

    try {
      const response = await fetch("/api/backup");
      if (!response.ok) {
        throw new Error("Unable to download backup.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `pocket-challan-backup-${stamp}.db`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setBackupMessage("Backup downloaded. Save it to a safe location.");
    } catch (err) {
      setBackupError(err.message || "Unable to download backup.");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!restoreFile) {
      setRestoreError("Select a backup file first.");
      return;
    }

    setRestoreError("");
    setRestoreMessage("");
    setRestoreLoading(true);

    try {
      const buffer = await restoreFile.arrayBuffer();
      const response = await fetch("/api/backup/restore", {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream"
        },
        body: buffer
      });

      if (!response.ok) {
        let errorMessage = "Unable to restore backup.";
        try {
          const payload = await response.json();
          if (payload && payload.error) {
            errorMessage = payload.error;
          }
        } catch (error) {
          errorMessage = "Unable to restore backup.";
        }
        throw new Error(errorMessage);
      }

      setRestoreMessage("Restore complete. The app will close in a few seconds. Reopen it.");
    } catch (err) {
      setRestoreError(err.message || "Unable to restore backup.");
    } finally {
      setRestoreLoading(false);
    }
  };

  const getMonthStartValue = () => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().slice(0, 10);
  };

  const parseExpiryDate = (value) => {
    const cleaned = String(value || "").replace(/\s+/g, "");
    const parts = cleaned.split("/");
    if (parts.length !== 3) {
      return null;
    }
    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);
    if (!day || !month || !year) {
      return null;
    }
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  };

  const expiryDate = parseExpiryDate(appExpiry);
  const isExpired = expiryDate ? new Date() > expiryDate : false;
  const reportIndex = menuItems.indexOf("Reports");
  const visibleMenuItems =
    isExpired && reportIndex >= 0 ? menuItems.slice(reportIndex) : menuItems;

  const getMonthRange = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  };

  const buildMonthBuckets = (count) => {
    const today = new Date();
    const buckets = [];
    for (let i = count - 1; i >= 0; i -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      buckets.push({
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        date
      });
    }
    return buckets;
  };

  const parseDateValue = (value) => {
    if (!value) {
      return null;
    }
    const parts = value.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const matchesDateRange = (value) => {
    if (!salesFilterStart && !salesFilterEnd) {
      return true;
    }
    const current = parseDateValue(value);
    if (!current) {
      return true;
    }
    if (salesFilterStart) {
      const start = parseDateValue(salesFilterStart);
      if (start && current < start) {
        return false;
      }
    }
    if (salesFilterEnd) {
      const end = parseDateValue(salesFilterEnd);
      if (end) {
        end.setHours(23, 59, 59, 999);
        if (current > end) {
          return false;
        }
      }
    }
    return true;
  };

  const matchesChallanDateRange = (value) => {
    if (!challanFilterStart && !challanFilterEnd) {
      return true;
    }
    const current = parseDateValue(value);
    if (!current) {
      return true;
    }
    if (challanFilterStart) {
      const start = parseDateValue(challanFilterStart);
      if (start && current < start) {
        return false;
      }
    }
    if (challanFilterEnd) {
      const end = parseDateValue(challanFilterEnd);
      if (end) {
        end.setHours(23, 59, 59, 999);
        if (current > end) {
          return false;
        }
      }
    }
    return true;
  };

  const fetchMaterialOutstanding = (startDate, endDate) => {
    setMaterialOutstandingLoading(true);
    setMaterialOutstandingError("");

    const query = new URLSearchParams({
      startDate,
      endDate
    });

    fetch(`/api/material-outstanding?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const records = (data.records || []).map((record) => {
          const challanDate = parseDateValue(record.challanDate);
          let daysDifference = "";
          daysDifference = Math.floor((today.getTime() - challanDate.getTime()) / (1000 * 60 * 60 * 24));

          return {
            ...record,
            daysDifference
          };
        });

        setMaterialOutstandingRows(records);
        setMaterialOutstandingLoading(false);
      })
      .catch(() => {
        setMaterialOutstandingError("Unable to load material outstanding records.");
        setMaterialOutstandingLoading(false);
      });
  };

  const handleGenerateMaterialOutstanding = (event) => {
    event.preventDefault();
    setMaterialOutstandingError("");

    if (!materialOutstandingStart || !materialOutstandingEnd) {
      setMaterialOutstandingError("Start and end date are required.");
      return;
    }

    fetchMaterialOutstanding(materialOutstandingStart, materialOutstandingEnd);
  };

  const fetchPaymentOutstanding = () => {
    setPaymentOutstandingLoading(true);
    setPaymentOutstandingError("");

    fetch("/api/payment-outstanding")
      .then((res) => res.json())
      .then((data) => {
        setPaymentOutstandingRows(data.parties || []);
        setPaymentOutstandingLoading(false);
      })
      .catch(() => {
        setPaymentOutstandingError("Unable to load payment outstanding records.");
        setPaymentOutstandingLoading(false);
      });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setLoginError("");

    if (!loginUsername.trim() || !loginPassword) {
      setLoginError("Username and password are required.");
      return;
    }

    setLoginSaving(true);
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loginUsername.trim(), password: loginPassword })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Login failed.");
        }
        setCurrentUser(payload.user.username);
        setLoginPassword("");
        setLoginSaving(false);
        if (rememberMe) {
          window.localStorage.setItem("pocketchallanRememberUser", payload.user.username);
        } else {
          window.localStorage.removeItem("pocketchallanRememberUser");
        }
      })
      .catch((err) => {
        setLoginError(err.message || "Login failed.");
        setLoginSaving(false);
      });
  };

  const handleLogout = () => {
    window.localStorage.removeItem("pocketchallanRememberUser");
    setRememberMe(false);
    setCurrentUser("");
    setLoginPassword("");
    setActiveMenu("Dashboard");
    setShowReportsMenu(false);
  };

  const handleQuickNewChallan = () => {
    setEditingChallanId(null);
    setActiveMenu("Challan - Sales");
  };

  const handleQuickAddPayment = () => {
    setQuickAction("sales-payment");
    setActiveMenu("Sales Payment");
  };

  const handleQuickViewStatement = () => {
    setActiveMenu("Party Statement");
  };

  const handleCreateUser = (event) => {
    event.preventDefault();
    setCreateUserError("");

    if (!createUserUsername.trim() || !createUserPassword) {
      setCreateUserError("Username and password are required.");
      return;
    }

    setCreateUserSaving(true);
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-user": currentUser
      },
      body: JSON.stringify({ username: createUserUsername.trim(), password: createUserPassword })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to create user.");
        }
        setCreateUserUsername("");
        setCreateUserPassword("");
        setCreateUserSaving(false);
      })
      .catch((err) => {
        setCreateUserError(err.message || "Unable to create user.");
        setCreateUserSaving(false);
      });
  };

  const handleChangeAdminPassword = (event) => {
    event.preventDefault();
    setAdminPasswordError("");

    if (!adminNewPassword) {
      setAdminPasswordError("New password is required.");
      return;
    }

    setAdminPasswordSaving(true);
    fetch("/api/users/admin-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-user": currentUser
      },
      body: JSON.stringify({ password: adminNewPassword })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to change admin password.");
        }
        setAdminNewPassword("");
        setAdminPasswordSaving(false);
      })
      .catch((err) => {
        setAdminPasswordError(err.message || "Unable to change admin password.");
        setAdminPasswordSaving(false);
      });
  };

  const matchesMaterialDateRange = (value) => {
    if (!materialFilterStart && !materialFilterEnd) {
      return true;
    }
    const current = parseDateValue(value);
    if (!current) {
      return true;
    }
    if (materialFilterStart) {
      const start = parseDateValue(materialFilterStart);
      if (start && current < start) {
        return false;
      }
    }
    if (materialFilterEnd) {
      const end = parseDateValue(materialFilterEnd);
      if (end) {
        end.setHours(23, 59, 59, 999);
        if (current > end) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    fetch("/api/registration-status")
      .then((res) => res.json())
      .then((registrationData) => {
        if (registrationData.machineMismatch) {
          setRegistrationRequired(true);
          setRegistrationCode("");
          setRegistrationError("Registration is tied to another machine.");
          setLoading(false);
          return null;
        }

        if (!registrationData.verified) {
          setRegistrationRequired(true);
          setRegistrationCode(String(registrationData.randomCode || ""));
          setLoading(false);
          return null;
        }

        setRegistrationRequired(false);
        return fetch("/api/company").then((res) => res.json());
      })
      .then((companyData) => {
        if (!companyData) {
          return;
        }

        setCompany(companyData.company || { name: "Pocket Challan" });
        const rememberedUser = window.localStorage.getItem("pocketchallanRememberUser") || "";
        if (rememberedUser) {
          setCurrentUser(rememberedUser);
        }
        if (companyData.company?.name) {
          setProfileName(companyData.company.name);
          setActiveMenu("Dashboard");
        }
        setLoading(false);
      })
      .catch(() => {
        setRegistrationError("Unable to load registration setup.");
        setLoading(false);
      });
  }, []);

  const handleVerifyRegistration = (event) => {
    event.preventDefault();
    setRegistrationError("");

    if (!registrationKeyInput.trim()) {
      setRegistrationError("Registration key is required.");
      return;
    }

    setRegistrationSaving(true);
    fetch("/api/registration-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: registrationKeyInput.trim() })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Registration failed.");
        }
        return fetch("/api/company");
      })
      .then((res) => res.json())
      .then((companyData) => {
        setRegistrationRequired(false);
        setRegistrationSaving(false);
        setRegistrationKeyInput("");
        setCompany(companyData.company || { name: "Pocket Challan" });
        if (companyData.company?.name) {
          setProfileName(companyData.company.name);
          setActiveMenu("Dashboard");
        }
      })
      .catch((err) => {
        setRegistrationError(err.message || "Registration failed.");
        setRegistrationSaving(false);
      });
  };

  useEffect(() => {
    const preventNumberScroll = (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === "number") {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", preventNumberScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventNumberScroll);
    };
  }, []);

  useEffect(() => {
    if (activeMenu !== "Dashboard" || !company) {
      return;
    }

    const { start, end } = getMonthRange();
    const buckets = buildMonthBuckets(6);
    const bucketIndex = new Map(buckets.map((bucket, index) => [bucket.key, index]));
    const emptyTrend = buckets.map(() => 0);

    Promise.all([
      fetch("/api/sales-payments").then((res) => res.json()),
      fetch("/api/material-payments").then((res) => res.json()),
      fetch("/api/material-out").then((res) => res.json()),
      fetch("/api/material-in").then((res) => res.json())
    ])
      .then(([salesPayload, materialPayload, materialOutPayload, materialInPayload]) => {
        const salesPayments = salesPayload.payments || [];
        const materialPayments = materialPayload.payments || [];
        const materialOuts = materialOutPayload.challans || [];
        const materialIns = materialInPayload.challans || [];

        const inMonth = (value) => {
          const date = parseDateValue(value);
          return date ? date >= start && date <= end : false;
        };

        const salesPaymentsTotal = salesPayments
          .filter((payment) => inMonth(payment.receiptDate))
          .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

        const materialPaymentsTotal = materialPayments
          .filter((payment) => inMonth(payment.receiptDate))
          .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

        const materialOutCount = materialOuts.filter((item) => inMonth(item.challanDate)).length;
        const materialInCount = materialIns.filter((item) => inMonth(item.challanDate)).length;

        const salesTrend = [...emptyTrend];
        const materialPaymentsTrend = [...emptyTrend];
        const materialOutTrend = [...emptyTrend];
        const materialInTrend = [...emptyTrend];

        salesPayments.forEach((payment) => {
          const date = parseDateValue(payment.receiptDate);
          if (!date) {
            return;
          }
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const index = bucketIndex.get(key);
          if (index === undefined) {
            return;
          }
          salesTrend[index] += Number(payment.amount || 0);
        });

        materialPayments.forEach((payment) => {
          const date = parseDateValue(payment.receiptDate);
          if (!date) {
            return;
          }
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const index = bucketIndex.get(key);
          if (index === undefined) {
            return;
          }
          materialPaymentsTrend[index] += Number(payment.amount || 0);
        });

        materialOuts.forEach((item) => {
          const date = parseDateValue(item.challanDate);
          if (!date) {
            return;
          }
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const index = bucketIndex.get(key);
          if (index === undefined) {
            return;
          }
          materialOutTrend[index] += 1;
        });

        materialIns.forEach((item) => {
          const date = parseDateValue(item.challanDate);
          if (!date) {
            return;
          }
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const index = bucketIndex.get(key);
          if (index === undefined) {
            return;
          }
          materialInTrend[index] += 1;
        });

        setDashboardData({
          salesPaymentsTotal,
          materialPaymentsTotal,
          materialOutCount,
          materialInCount,
          salesTrend,
          materialPaymentsTrend,
          materialOutTrend,
          materialInTrend
        });
      })
      .catch(() => {
        setDashboardData({
          salesPaymentsTotal: 0,
          materialPaymentsTotal: 0,
          materialOutCount: 0,
          materialInCount: 0,
          salesTrend: [],
          materialPaymentsTrend: [],
          materialOutTrend: [],
          materialInTrend: []
        });
      });
  }, [activeMenu, company]);

  useEffect(() => {
    if (reportItems.some((item) => item.value === activeMenu)) {
      setShowReportsMenu(true);
    }
  }, [activeMenu]);

  useEffect(() => {
    if (activeMenu === "Profile" && company) {
      setProfileName(company.name || "");
      setProfileError("");
    }
  }, [activeMenu, company]);

  useEffect(() => {
    if (!company) {
      return;
    }

    setShowPartyForm(false);
    setShowItemForm(false);
    setShowPaymentForm(false);
    setShowMaterialForm(false);

    if (activeMenu === "Party Master") {
      setPartyLoading(true);
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
          setPartyLoading(false);
        })
        .catch(() => {
          setPartyError("Unable to load party records.");
          setPartyLoading(false);
        });
    }

    if (activeMenu === "Party Statement") {
      setStatementError("");
      setStatementData(null);
      if (!statementStartDate) {
        setStatementStartDate(getMonthStartValue());
      }
      if (!statementEndDate) {
        setStatementEndDate(getTodayValue());
      }
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setStatementError("Unable to load parties.");
        });
    }

      if (activeMenu === "Material In-Out") {
        setMaterialInOutError("");
        setMaterialInOutReport(null);
        if (!materialInOutStart) {
          setMaterialInOutStart(getMonthStartValue());
        }
        if (!materialInOutEnd) {
          setMaterialInOutEnd(getTodayValue());
        }
        fetch("/api/parties")
          .then((res) => res.json())
          .then((data) => {
            setParties(sortByIdAsc(data.parties || []));
          })
          .catch(() => {
            setMaterialInOutError("Unable to load parties.");
          });
      }

    if (activeMenu === "Item Master") {
      setItemLoading(true);
      fetch("/api/items")
        .then((res) => res.json())
        .then((data) => {
          setItems(sortByIdAsc(data.items || []));
          setItemLoading(false);
        })
        .catch(() => {
          setItemError("Unable to load item records.");
          setItemLoading(false);
        });
    }

    if (activeMenu === "Sales Payment") {
      setPaymentLoading(true);
      if (!salesFilterStart) {
        setSalesFilterStart(getMonthStartValue());
      }
      if (!salesFilterEnd) {
        setSalesFilterEnd(getTodayValue());
      }
      fetch("/api/sales-payments")
        .then((res) => res.json())
        .then((data) => {
          setPayments(sortByIdAsc(data.payments || []));
          setPaymentLoading(false);
        })
        .catch(() => {
          setPaymentError("Unable to load sales payments.");
          setPaymentLoading(false);
        });
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setPaymentError("Unable to load parties.");
        });
      if (quickAction === "sales-payment") {
        handleCreateNew();
        setQuickAction("");
      }
    }

    if (activeMenu === "Material Payment") {
      setMaterialLoading(true);
      if (!materialFilterStart) {
        setMaterialFilterStart(getMonthStartValue());
      }
      if (!materialFilterEnd) {
        setMaterialFilterEnd(getTodayValue());
      }
      fetch("/api/material-payments")
        .then((res) => res.json())
        .then((data) => {
          setMaterialPayments(sortByIdAsc(data.payments || []));
          setMaterialLoading(false);
        })
        .catch(() => {
          setMaterialError("Unable to load material payments.");
          setMaterialLoading(false);
        });
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setMaterialError("Unable to load parties.");
        });
    }

    if (activeMenu === "Challan - Sales") {
      setChallanError("");
      if (!editingChallanId) {
        if (!challanDate) {
          setChallanDate(getTodayValue());
        }
        if (challanItems.length === 0) {
          setChallanItems([createEmptyChallanItem()]);
        }
      }
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setChallanError("Unable to load parties.");
        });
      fetch("/api/items")
        .then((res) => res.json())
        .then((data) => {
          setItems(sortByIdAsc(data.items || []));
        })
        .catch(() => {
          setChallanError("Unable to load items.");
        });
      if (!editingChallanId) {
        fetch("/api/challan-sales/next-no")
          .then((res) => res.json())
          .then((data) => {
            setChallanNo(String(data.challanNo || ""));
          })
          .catch(() => {
            setChallanError("Unable to generate Challan number.");
          });
      }
    }

    if (activeMenu === "Material OUT") {
      setMaterialOutError("");
      if (!editingMaterialOutId) {
        if (!materialOutDate) {
          setMaterialOutDate(getTodayValue());
        }
        if (materialOutItems.length === 0) {
          setMaterialOutItems([createEmptyMaterialOutItem()]);
        }
      }
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setMaterialOutError("Unable to load parties.");
        });
      fetch("/api/items")
        .then((res) => res.json())
        .then((data) => {
          setItems(sortByIdAsc(data.items || []));
        })
        .catch(() => {
          setMaterialOutError("Unable to load items.");
        });
      if (!editingMaterialOutId) {
        fetch("/api/material-out/next-no")
          .then((res) => res.json())
          .then((data) => {
            setMaterialOutNo(String(data.challanNo || ""));
          })
          .catch(() => {
            setMaterialOutError("Unable to generate Challan number.");
          });
      }
    }

    if (activeMenu === "Material IN") {
      setMaterialInError("");
      if (!editingMaterialInId) {
        if (!materialInDate) {
          setMaterialInDate(getTodayValue());
        }
        if (materialInItems.length === 0) {
          setMaterialInItems([createEmptyMaterialInItem()]);
          setMaterialInChallanOptions({});
        }
      }
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setMaterialInError("Unable to load parties.");
        });
      fetch("/api/items")
        .then((res) => res.json())
        .then((data) => {
          setItems(sortByIdAsc(data.items || []));
        })
        .catch(() => {
          setMaterialInError("Unable to load items.");
        });
      if (!editingMaterialInId) {
        fetch("/api/material-in/next-no")
          .then((res) => res.json())
          .then((data) => {
            setMaterialInNo(String(data.challanNo || ""));
          })
          .catch(() => {
            setMaterialInError("Unable to generate Challan number.");
          });
      }
    }

    if (activeMenu === "Challan Report") {
      setPrintError("");
      setPrintLoading(true);
      if (!challanFilterStart) {
        setChallanFilterStart(getMonthStartValue());
      }
      if (!challanFilterEnd) {
        setChallanFilterEnd(getTodayValue());
      }
      fetch("/api/challan-sales")
        .then((res) => res.json())
        .then((data) => {
          setChallanList(sortByIdAsc(data.challans || []));
          setPrintLoading(false);
        })
        .catch(() => {
          setPrintError("Unable to load Challan records.");
          setPrintLoading(false);
        });
    }

    if (activeMenu === "Print Material Out") {
      setMaterialOutPrintError("");
      setMaterialOutPrintLoading(true);
      fetch("/api/material-out")
        .then((res) => res.json())
        .then((data) => {
          setMaterialOutList(sortByIdAsc(data.challans || []));
          setMaterialOutPrintLoading(false);
        })
        .catch(() => {
          setMaterialOutPrintError("Unable to load material out records.");
          setMaterialOutPrintLoading(false);
        });
    }

    if (activeMenu === "Print Material In") {
      setMaterialInPrintError("");
      setMaterialInPrintLoading(true);
      fetch("/api/material-in")
        .then((res) => res.json())
        .then((data) => {
          setMaterialInList(sortByIdAsc(data.challans || []));
          setMaterialInPrintLoading(false);
        })
        .catch(() => {
          setMaterialInPrintError("Unable to load material in records.");
          setMaterialInPrintLoading(false);
        });
    }

    if (activeMenu === "Material Outstanding") {
      const startDate = materialOutstandingStart || getMonthStartValue();
      const endDate = materialOutstandingEnd || getTodayValue();

      if (!materialOutstandingStart) {
        setMaterialOutstandingStart(startDate);
      }
      if (!materialOutstandingEnd) {
        setMaterialOutstandingEnd(endDate);
      }

      fetchMaterialOutstanding(startDate, endDate);
    }

    if (activeMenu === "Payment Outstanding") {
      fetchPaymentOutstanding();
    }
  }, [activeMenu, company, editingMaterialOutId, editingMaterialInId, editingChallanId]);

  const handleGenerateStatement = (event) => {
    event.preventDefault();
    setStatementError("");

    if (!statementPartyId) {
      setStatementError("Party is required.");
      return;
    }
    if (!statementStartDate || !statementEndDate) {
      setStatementError("Start and end date are required.");
      return;
    }

    setStatementLoading(true);
    const query = new URLSearchParams({
      partyId: statementPartyId,
      startDate: statementStartDate,
      endDate: statementEndDate
    });

    fetch(`/api/party-statement?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.party) {
          throw new Error("Unable to load statement.");
        }

        const rows = (data.rows || []).map((row) => {
          if (row.unit === "per_pcs") {
            return {
              ...row,
              rateWeight: 0,
              ratePcs: row.rate
            };
          }
          if (row.unit === "per_kg") {
            return {
              ...row,
              rateWeight: row.rate,
              ratePcs: 0
            };
          }
          return { ...row, rateWeight: 0, ratePcs: 0 };
        });

        const challanRows = rows.filter((row) => row.type === "challan");
        const challanAmount = challanRows.reduce(
          (sum, row) => sum + Number(row.amount || 0),
          0
        );
        const payments = (data.payments || []).map((payment) => ({
          ...payment,
          amount: Number(payment.amount || 0)
        }));
        const paymentsTotal = payments.reduce(
          (sum, payment) => sum + Number(payment.amount || 0),
          0
        );

        const openingBalance = Number(data.openingBalance || 0);
        const closingBalance = openingBalance + challanAmount - paymentsTotal;

        setStatementData({
          partyName: data.party.partyName,
          startDate: statementStartDate,
          endDate: statementEndDate,
          openingBalance,
          rows: challanRows,
          balance: closingBalance,
          challanAmount,
          paymentsTotal,
          closingBalance,
          payments
        });
        setStatementLoading(false);
      })
      .catch((err) => {
        setStatementError(err.message || "Unable to load statement.");
        setStatementLoading(false);
      });
  };

  const handleGenerateMaterialInOutReport = (event) => {
    event.preventDefault();
    setMaterialInOutError("");
    setMaterialInOutPrintError("");

    if (!materialInOutPartyId) {
      setMaterialInOutError("Party is required.");
      return;
    }

    if (!materialInOutStart || !materialInOutEnd) {
      setMaterialInOutError("Start and end date are required.");
      return;
    }

    setMaterialInOutLoading(true);
    const query = new URLSearchParams({
      partyId: materialInOutPartyId,
      startDate: materialInOutStart,
      endDate: materialInOutEnd
    });

    fetch(`/api/material-inout-report?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.party) {
          throw new Error("Unable to load material report.");
        }

        const outward = (data.outward || []).map((row) => ({
          ...row,
          netWeight: Number(row.netWeight || 0),
          pcs: Number(row.pcs || 0)
        }));
        const inward = (data.inward || []).map((row) => ({
          ...row,
          netWeight: Number(row.netWeight || 0),
          pcs: Number(row.pcs || 0),
          rate: Number(row.rate || 0),
          amount: Number(row.amount || 0)
        }));
        const payments = (data.payments || []).map((row) => ({
          ...row,
          amount: Number(row.amount || 0)
        }));

        const totalOutwardWeight = outward.reduce((sum, row) => sum + row.netWeight, 0);
        const totalOutwardPcs = outward.reduce((sum, row) => sum + row.pcs, 0);
        const totalInwardWeight = inward.reduce((sum, row) => sum + row.netWeight, 0);
        const totalInwardPcs = inward.reduce((sum, row) => sum + row.pcs, 0);
        const totalJobDoneWeight = inward.reduce(
          (sum, row) => sum + (row.rate > 0 ? row.netWeight : 0),
          0
        );
        const totalExtraMaterialWeight = inward.reduce(
          (sum, row) => sum + (row.rate > 0 ? 0 : row.netWeight),
          0
        );
        const totalPayment = inward.reduce((sum, row) => sum + row.amount, 0);
        const paymentMade = payments.reduce((sum, row) => sum + row.amount, 0);
        const balanceMaterial = totalOutwardWeight - totalInwardWeight;
        const balancePcs = totalOutwardPcs - totalInwardPcs;
        const outstandingAmount = totalPayment - paymentMade;

        setMaterialInOutReport({
          partyName: data.party.partyName,
          startDate: materialInOutStart,
          endDate: materialInOutEnd,
          outward,
          inward,
          payments,
          totals: {
            totalOutwardWeight,
            totalOutwardPcs,
            totalInwardWeight,
            totalInwardPcs,
            totalJobDoneWeight,
            totalExtraMaterialWeight,
            balanceMaterial,
            balancePcs,
            totalPayment,
            paymentMade,
            outstandingAmount
          }
        });
        setMaterialInOutLoading(false);
      })
      .catch((err) => {
        setMaterialInOutError(err.message || "Unable to load material report.");
        setMaterialInOutLoading(false);
      });
  };

  const handlePrintMaterialInOutReport = () => {
    setMaterialInOutPrintError("");

    if (!materialInOutReport) {
      setMaterialInOutPrintError("Generate the report before printing.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setMaterialInOutPrintError("Popup blocked. Allow popups to print.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildMaterialInOutPrintHtml(materialInOutReport));
    printWindow.document.close();
  };

  const handlePrintPartyMaster = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildPartyListPrintHtml(parties));
    printWindow.document.close();
  };

  const handlePrintItemMaster = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildItemListPrintHtml(items));
    printWindow.document.close();
  };

  const handleSetup = (event) => {
    event.preventDefault();
    setError("");

    fetch("/api/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: companyName })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Setup failed.");
        }
        setCompany(payload.company);
        setActiveMenu("Dashboard");
      })
      .catch((err) => {
        setError(err.message || "Setup failed.");
      });
  };

  const handleAddParty = (event) => {
    event.preventDefault();
    setPartyError("");

    const isEditingParty = Boolean(editingPartyId);
    const url = isEditingParty ? `/api/parties/${editingPartyId}` : "/api/parties";
    const method = isEditingParty ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partyName,
        openingBalance: openingBalance === "" ? 0 : Number(openingBalance)
      })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to save party.");
        }
        setParties((prev) => {
          if (isEditingParty) {
            return sortByIdAsc(
              prev.map((party) => (party.id === payload.party.id ? payload.party : party))
            );
          }
          return sortByIdAsc([...prev, payload.party]);
        });
        setPartyName("");
        setOpeningBalance("");
        setEditingPartyId(null);
        setShowPartyForm(false);
      })
      .catch((err) => {
        setPartyError(err.message || "Unable to save party.");
      });
  };

  const handleAddItem = (event) => {
    event.preventDefault();
    setItemError("");

    const isEditingItem = Boolean(editingItemId);
    const url = isEditingItem ? `/api/items/${editingItemId}` : "/api/items";
    const method = isEditingItem ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to save item.");
        }
        setItems((prev) =>
          sortByIdAsc(
            isEditingItem
              ? prev.map((item) => (item.id === payload.item.id ? payload.item : item))
              : [...prev, payload.item]
          )
        );
        setItemName("");
        setEditingItemId(null);
        setShowItemForm(false);
      })
      .catch((err) => {
        setItemError(err.message || "Unable to save item.");
      });
  };

  const handleCreateNew = () => {
    if (activeMenu === "Party Master") {
      setPartyError("");
      setEditingPartyId(null);
      setPartyName("");
      setOpeningBalance("");
      setShowPartyForm((prev) => !prev);
    }
    if (activeMenu === "Item Master") {
      setItemError("");
      setEditingItemId(null);
      setItemName("");
      setShowItemForm((prev) => !prev);
    }
    if (activeMenu === "Sales Payment") {
      setEditingPaymentId(null);
      setPaymentError("");
      setReceiptDate(getTodayValue());
      setReceiptNo("");
      setPaymentPartyId("");
      setPaymentAmount("");
      setPaymentType("");
      setPaymentRemarks("");
      setShowPaymentForm(true);
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setPaymentError("Unable to load parties.");
        });
      fetch("/api/sales-payments/next-receipt")
        .then((res) => res.json())
        .then((data) => {
          setReceiptNo(String(data.receiptNo || ""));
        })
        .catch(() => {
          setPaymentError("Unable to generate receipt number.");
        });
    }
    if (activeMenu === "Material Payment") {
      setEditingMaterialPaymentId(null);
      setMaterialError("");
      setMaterialReceiptDate(getTodayValue());
      setMaterialReceiptNo("");
      setMaterialPartyId("");
      setMaterialAmount("");
      setMaterialType("");
      setMaterialRemarks("");
      setShowMaterialForm(true);
      fetch("/api/parties")
        .then((res) => res.json())
        .then((data) => {
          setParties(sortByIdAsc(data.parties || []));
        })
        .catch(() => {
          setMaterialError("Unable to load parties.");
        });
      fetch("/api/material-payments/next-receipt")
        .then((res) => res.json())
        .then((data) => {
          setMaterialReceiptNo(String(data.receiptNo || ""));
        })
        .catch(() => {
          setMaterialError("Unable to generate receipt number.");
        });
    }
  };

  const handleOpenPartyModal = () => {
    setPartyError("");
    setEditingPartyId(null);
    setPartyName("");
    setOpeningBalance("");
    setShowPartyForm(true);
  };

  const handleEditParty = (party) => {
    setEditingPartyId(party.id);
    setPartyName(party.partyName || "");
    setOpeningBalance(String(party.openingBalance ?? ""));
    setPartyError("");
    setShowPartyForm(true);
  };

  const handleDeleteParty = (party) => {
    if (!confirmDelete(`party ${party.partyName || party.id}`.trim())) {
      return;
    }

    fetch(`/api/parties/${party.id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || "Unable to delete party.");
        }
        setParties((prev) => prev.filter((item) => item.id !== party.id));
        if (editingPartyId === party.id) {
          setEditingPartyId(null);
          setShowPartyForm(false);
          setPartyName("");
          setOpeningBalance("");
        }
      })
      .catch((err) => {
        setPartyError(err.message || "Unable to delete party.");
      });
  };

  const handleDeleteAllParties = () => {
    const response = window.prompt("Type delete all to remove all parties.");
    if (!response || response.trim().toLowerCase() !== "delete all") {
      return;
    }

    fetch("/api/parties", { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || "Unable to delete all parties.");
        }
        setParties([]);
        setEditingPartyId(null);
        setShowPartyForm(false);
        setPartyName("");
        setOpeningBalance("");
        setPartyError("");
      })
      .catch((err) => {
        setPartyError(err.message || "Unable to delete all parties.");
      });
  };

  const handleOpenItemModal = () => {
    setItemError("");
    setEditingItemId(null);
    setItemName("");
    setShowItemForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setItemName(item.itemName || "");
    setItemError("");
    setShowItemForm(true);
  };

  const handleDeleteItem = (item) => {
    if (!confirmDelete(`item ${item.itemName || item.id}`.trim())) {
      return;
    }

    fetch(`/api/items/${item.id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || "Unable to delete item.");
        }
        setItems((prev) => prev.filter((entry) => entry.id !== item.id));
        if (editingItemId === item.id) {
          setEditingItemId(null);
          setShowItemForm(false);
          setItemName("");
        }
      })
      .catch((err) => {
        setItemError(err.message || "Unable to delete item.");
      });
  };

  const handleEditPayment = (payment) => {
    setEditingPaymentId(payment.id);
    setReceiptDate(payment.receiptDate);
    setReceiptNo(String(payment.receiptNo));
    setPaymentPartyId(String(payment.partyId));
    setPaymentAmount(String(payment.amount));
    setPaymentType(payment.transactionType);
    setPaymentRemarks(payment.remarks || "");
    setPaymentError("");
    setShowPaymentForm(true);
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => {
        setParties(sortByIdAsc(data.parties || []));
      })
      .catch(() => {
        setPaymentError("Unable to load parties.");
      });
  };

  const confirmDelete = (label) => {
    const response = window.prompt(`Type delete to remove ${label}.`);
    if (!response) {
      return false;
    }
    return response.trim().toLowerCase() === "delete";
  };

  const handleDeletePayment = (payment) => {
    if (!confirmDelete(`payment ${payment.receiptNo || ""}`.trim())) {
      return;
    }
    fetch(`/api/sales-payments/${payment.id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || "Unable to delete payment.");
        }
        setPayments((prev) => prev.filter((item) => item.id !== payment.id));
      })
      .catch((err) => {
        setPaymentError(err.message || "Unable to delete payment.");
      });
  };

  const handleEditMaterialPayment = (payment) => {
    setEditingMaterialPaymentId(payment.id);
    setMaterialReceiptDate(payment.receiptDate);
    setMaterialReceiptNo(String(payment.receiptNo));
    setMaterialPartyId(String(payment.partyId));
    setMaterialAmount(String(payment.amount));
    setMaterialType(payment.transactionType);
    setMaterialRemarks(payment.remarks || "");
    setMaterialError("");
    setShowMaterialForm(true);
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => {
        setParties(sortByIdAsc(data.parties || []));
      })
      .catch(() => {
        setMaterialError("Unable to load parties.");
      });
  };

  const handleDeleteMaterialPayment = (payment) => {
    if (!confirmDelete(`payment ${payment.receiptNo || ""}`.trim())) {
      return;
    }
    fetch(`/api/material-payments/${payment.id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || "Unable to delete payment.");
        }
        setMaterialPayments((prev) => prev.filter((item) => item.id !== payment.id));
      })
      .catch((err) => {
        setMaterialError(err.message || "Unable to delete payment.");
      });
  };

  const handleSavePayment = (event) => {
    event.preventDefault();
    setPaymentError("");
    setPaymentSaving(true);

    const endpoint = editingPaymentId
      ? `/api/sales-payments/${editingPaymentId}`
      : "/api/sales-payments";
    const method = editingPaymentId ? "PUT" : "POST";

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiptNo: Number(receiptNo),
        receiptDate,
        partyId: Number(paymentPartyId),
        amount: paymentAmount === "" ? 0 : Number(paymentAmount),
        transactionType: paymentType,
        remarks: paymentRemarks
      })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to save payment.");
        }
        setPayments((prev) =>
          sortByIdAsc(
            editingPaymentId
              ? prev.map((item) => (item.id === payload.payment.id ? payload.payment : item))
              : [...prev, payload.payment]
          )
        );
        setPaymentAmount("");
        setPaymentRemarks("");
        setPaymentType("");
        setPaymentPartyId("");
        setEditingPaymentId(null);
        setShowPaymentForm(false);
        setPaymentSaving(false);
      })
      .catch((err) => {
        setPaymentError(err.message || "Unable to save payment.");
        setPaymentSaving(false);
      });
  };

  const handleSaveMaterialPayment = (event) => {
    event.preventDefault();
    setMaterialError("");
    setMaterialSaving(true);

    const endpoint = editingMaterialPaymentId
      ? `/api/material-payments/${editingMaterialPaymentId}`
      : "/api/material-payments";
    const method = editingMaterialPaymentId ? "PUT" : "POST";

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiptNo: Number(materialReceiptNo),
        receiptDate: materialReceiptDate,
        partyId: Number(materialPartyId),
        amount: materialAmount === "" ? 0 : Number(materialAmount),
        transactionType: materialType,
        remarks: materialRemarks
      })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to save payment.");
        }
        setMaterialPayments((prev) =>
          sortByIdAsc(
            editingMaterialPaymentId
              ? prev.map((item) => (item.id === payload.payment.id ? payload.payment : item))
              : [...prev, payload.payment]
          )
        );
        setMaterialAmount("");
        setMaterialRemarks("");
        setMaterialType("");
        setMaterialPartyId("");
        setEditingMaterialPaymentId(null);
        setShowMaterialForm(false);
        setMaterialSaving(false);
      })
      .catch((err) => {
        setMaterialError(err.message || "Unable to save payment.");
        setMaterialSaving(false);
      });
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileSaving(true);

    fetch("/api/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profileName })
    })
      .then(async (res) => {
        const raw = await res.text();
        let payload = null;
        try {
          payload = raw ? JSON.parse(raw) : null;
        } catch (err) {
          throw new Error("Profile update failed. Please restart the server and try again.");
        }
        if (!res.ok) {
          throw new Error(payload?.error || "Unable to update profile.");
        }
        setCompany(payload?.company || null);
        setProfileName(payload?.company?.name || profileName);
        setProfileSaving(false);
      })
      .catch((err) => {
        setProfileError(err.message || "Unable to update profile.");
        setProfileSaving(false);
      });
  };

  const salesPartyOptions = parties.length
    ? parties.map((party) => party.partyName)
    : Array.from(new Set(payments.map((payment) => payment.partyName).filter(Boolean)));

  const salesTypeOptions = Array.from(
    new Set(payments.map((payment) => payment.transactionType).filter(Boolean))
  );

  const filteredSalesPayments = payments.filter((payment) => {
    if (salesFilterParty && payment.partyName !== salesFilterParty) {
      return false;
    }
    if (salesFilterType && payment.transactionType !== salesFilterType) {
      return false;
    }
    return matchesDateRange(payment.receiptDate);
  });

  const materialPartyOptions = parties.length
    ? parties.map((party) => party.partyName)
    : Array.from(new Set(materialPayments.map((payment) => payment.partyName).filter(Boolean)));

  const materialTypeOptions = Array.from(
    new Set(materialPayments.map((payment) => payment.transactionType).filter(Boolean))
  );

  const filteredMaterialPayments = materialPayments.filter((payment) => {
    if (materialFilterParty && payment.partyName !== materialFilterParty) {
      return false;
    }
    if (materialFilterType && payment.transactionType !== materialFilterType) {
      return false;
    }
    return matchesMaterialDateRange(payment.receiptDate);
  });

  const challanPartyOptions = parties.length
    ? parties.map((party) => party.partyName)
    : Array.from(new Set(challanList.map((challan) => challan.partyName).filter(Boolean)));

  const filteredChallanList = challanList.filter((challan) => {
    if (challanFilterParty && challan.partyName !== challanFilterParty) {
      return false;
    }
    return matchesChallanDateRange(challan.challanDate);
  });

  const updateChallanItem = (index, key, value) => {
    if (key === "itemSearch") {
      const nextSearch = String(value || "");
      const nextItemId = resolveItemIdFromInput(nextSearch);
      setChallanItems((prev) =>
        prev.map((item, rowIndex) =>
          rowIndex === index
            ? {
                ...item,
                itemSearch: nextSearch,
                itemId: nextItemId || item.itemId
              }
            : item
        )
      );
      return;
    }

    setChallanItems((prev) =>
      prev.map((item, rowIndex) =>
        rowIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const handleChallanPartySearchChange = (partyName) => {
    const nextSearch = String(partyName || "");
    const nextPartyId = resolvePartyIdFromInput(nextSearch);

    setChallanPartySearch(nextSearch);
    setChallanPartyId(nextPartyId);
  };

  const handleAddChallanItem = () => {
    setChallanItems((prev) => [...prev, createEmptyChallanItem()]);
  };

  const handleRemoveChallanItem = (index) => {
    setChallanItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const printChallanById = (challanId) => {
    if (!challanId) {
      return Promise.resolve();
    }
    return fetch(`/api/challan-sales/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load challan.");
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          throw new Error("Popup blocked. Allow popups to print.");
        }
        printWindow.document.open();
        printWindow.document.write(buildChallanPrintHtml(data.challan, data.items || []));
        printWindow.document.close();
      });
  };

  const handleSaveChallan = (event, shouldPrint = false) => {
    if (event) {
      event.preventDefault();
    }
    setChallanError("");
    setChallanSaving(true);

    const endpoint = editingChallanId
      ? `/api/challan-sales/${editingChallanId}`
      : "/api/challan-sales";
    const method = editingChallanId ? "PUT" : "POST";

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challanNo: Number(challanNo),
        challanDate,
        partyId: Number(challanPartyId),
        remarks: challanRemarks,
        billNo: challanBillNo,
        vehicleNo: challanVehicleNo,
        items: challanItems.map((item) => ({
          itemId: Number(item.itemId),
          grossWeight: Number(item.grossWeight || 0),
          bagsCrate: Number(item.bagsCrate || 0),
          lessWeight: Number(item.lessWeight || 0),
          pcs: Number(item.pcs || 0),
          unit: item.unit,
          rate: Number(item.rate || 0),
          notes: item.notes
        }))
      })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to save Challan.");
        }
        const savedChallanId = payload?.challan?.id || editingChallanId;
        if (shouldPrint) {
          try {
            await printChallanById(savedChallanId);
          } catch (err) {
            setChallanError(err.message || "Unable to print challan.");
          }
        }
        setChallanRemarks("");
        setChallanBillNo("");
        setChallanVehicleNo("");
        setChallanPartyId("");
        setChallanPartySearch("");
        setChallanItems([createEmptyChallanItem()]);
        setEditingChallanId(null);
        return fetch("/api/challan-sales/next-no");
      })
      .then((res) => res.json())
      .then((data) => {
        setChallanNo(String(data.challanNo || ""));
        setChallanDate(getTodayValue());
        setChallanSaving(false);
      })
      .catch((err) => {
        setChallanError(err.message || "Unable to save Challan.");
        setChallanSaving(false);
      });
  };

  const handleEditChallanRecord = (challanId) => {
    setChallanError("");
    setEditingChallanId(challanId);
    setActiveMenu("Challan - Sales");

    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => {
        setParties(sortByIdAsc(data.parties || []));
      })
      .catch(() => {
        setChallanError("Unable to load parties.");
      });

    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(sortByIdAsc(data.items || []));
      })
      .catch(() => {
        setChallanError("Unable to load items.");
      });

    fetch(`/api/challan-sales/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load Challan.");
        }
        setChallanNo(String(data.challan.challanNo || ""));
        setChallanDate(data.challan.challanDate || "");
        setChallanPartyId(String(data.challan.partyId || ""));
        const partyMatch = parties.find(
          (party) => String(party.id) === String(data.challan.partyId || "")
        );
        setChallanPartySearch(
          data.challan.partyName || (partyMatch ? partyMatch.partyName : "")
        );
        setChallanRemarks(data.challan.remarks || "");
        setChallanBillNo(data.challan.billNo || "");
        setChallanVehicleNo(data.challan.vehicleNo || "");
        setChallanItems(
          (data.items || []).map((item) => ({
            itemId: String(item.itemId || ""),
            itemSearch: item.itemName || "",
            grossWeight: String(item.grossWeight ?? ""),
            bagsCrate: String(item.bagsCrate ?? ""),
            lessWeight: String(item.lessWeight ?? ""),
            pcs: String(item.pcs ?? ""),
            unit: item.unit || "per_kg",
            rate: String(item.rate ?? ""),
            notes: item.notes || ""
          }))
        );
      })
      .catch((err) => {
        setChallanError(err.message || "Unable to load Challan.");
      });
  };

  const handleCancelChallanEdit = () => {
    setEditingChallanId(null);
    setChallanError("");
    setChallanRemarks("");
    setChallanBillNo("");
    setChallanVehicleNo("");
    setChallanPartyId("");
    setChallanPartySearch("");
    setChallanItems([createEmptyChallanItem()]);
    setChallanDate(getTodayValue());
    fetch("/api/challan-sales/next-no")
      .then((res) => res.json())
      .then((data) => {
        setChallanNo(String(data.challanNo || ""));
      })
      .catch(() => {
        setChallanError("Unable to generate Challan number.");
      });
  };

  const handleDeleteChallanRecord = (challan) => {
    if (!confirmDelete(`Challan ${challan.challanNo || ""}`.trim())) {
      return;
    }
    fetch(`/api/challan-sales/${challan.id}`, { method: "DELETE" })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to delete Challan.");
        }
        setChallanList((prev) => prev.filter((item) => item.id !== challan.id));
        if (editingChallanId === challan.id) {
          handleCancelChallanEdit();
        }
      })
      .catch((err) => {
        setPrintError(err.message || "Unable to delete Challan.");
      });
  };

  const updateMaterialOutItem = (index, key, value) => {
    if (key === "itemSearch") {
      const nextSearch = String(value || "");
      const nextItemId = resolveItemIdFromInput(nextSearch);
      setMaterialOutItems((prev) =>
        prev.map((item, rowIndex) =>
          rowIndex === index
            ? {
                ...item,
                itemSearch: nextSearch,
                itemId: nextItemId || item.itemId
              }
            : item
        )
      );
      return;
    }

    setMaterialOutItems((prev) =>
      prev.map((item, rowIndex) =>
        rowIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const handleMaterialOutPartySearchChange = (partyName) => {
    const nextSearch = String(partyName || "");
    const nextPartyId = resolvePartyIdFromInput(nextSearch);

    setMaterialOutPartySearch(nextSearch);
    setMaterialOutPartyId(nextPartyId);
  };

  const handleAddMaterialOutItem = () => {
    setMaterialOutItems((prev) => [...prev, createEmptyMaterialOutItem()]);
  };

  const handleRemoveMaterialOutItem = (index) => {
    setMaterialOutItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const printMaterialOutById = (challanId) => {
    if (!challanId) {
      return Promise.resolve();
    }
    return fetch(`/api/material-out/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load material out.");
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          throw new Error("Popup blocked. Allow popups to print.");
        }
        printWindow.document.open();
        printWindow.document.write(buildMaterialOutPrintHtml(data.challan, data.items || []));
        printWindow.document.close();
      });
  };

  const handleSaveMaterialOut = (event, shouldPrint = false) => {
    if (event) {
      event.preventDefault();
    }
    setMaterialOutError("");
    setMaterialOutSaving(true);

    const endpoint = editingMaterialOutId
      ? `/api/material-out/${editingMaterialOutId}`
      : "/api/material-out";
    const method = editingMaterialOutId ? "PUT" : "POST";

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challanNo: Number(materialOutNo),
        challanDate: materialOutDate,
        partyId: Number(materialOutPartyId),
        remarks: materialOutRemarks,
        vehicleNo: materialOutVehicleNo,
        items: materialOutItems.map((item) => ({
          itemId: Number(item.itemId),
          grossWeight: Number(item.grossWeight || 0),
          bagsCrate: Number(item.bagsCrate || 0),
          lessWeight: Number(item.lessWeight || 0),
          pcs: Number(item.pcs || 0),
          processType: item.processType
        }))
      })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to save material out.");
        }
        const savedChallanId = payload?.challan?.id || editingMaterialOutId;
        if (shouldPrint) {
          try {
            await printMaterialOutById(savedChallanId);
          } catch (err) {
            setMaterialOutError(err.message || "Unable to print material out.");
          }
        }
        setMaterialOutRemarks("");
        setMaterialOutVehicleNo("");
        setMaterialOutPartyId("");
        setMaterialOutPartySearch("");
        setMaterialOutItems([createEmptyMaterialOutItem()]);
        setEditingMaterialOutId(null);
        return fetch("/api/material-out/next-no");
      })
      .then((res) => res.json())
      .then((data) => {
        setMaterialOutNo(String(data.challanNo || ""));
        setMaterialOutSaving(false);
      })
      .catch((err) => {
        setMaterialOutError(err.message || "Unable to save material out.");
        setMaterialOutSaving(false);
      });
  };

  const handleCancelMaterialOutEdit = () => {
    setEditingMaterialOutId(null);
    setMaterialOutError("");
    setMaterialOutRemarks("");
    setMaterialOutVehicleNo("");
    setMaterialOutPartyId("");
    setMaterialOutPartySearch("");
    setMaterialOutItems([createEmptyMaterialOutItem()]);
    setMaterialOutDate(getTodayValue());
    fetch("/api/material-out/next-no")
      .then((res) => res.json())
      .then((data) => {
        setMaterialOutNo(String(data.challanNo || ""));
      })
      .catch(() => {
        setMaterialOutError("Unable to generate Challan number.");
      });
  };

  const handleEditMaterialOutRecord = (challanId) => {
    setMaterialOutError("");
    setEditingMaterialOutId(challanId);
    setActiveMenu("Material OUT");

    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => {
        setParties(sortByIdAsc(data.parties || []));
      })
      .catch(() => {
        setMaterialOutError("Unable to load parties.");
      });

    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(sortByIdAsc(data.items || []));
      })
      .catch(() => {
        setMaterialOutError("Unable to load items.");
      });

    fetch(`/api/material-out/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load material out.");
        }
        setMaterialOutNo(String(data.challan.challanNo || ""));
        setMaterialOutDate(data.challan.challanDate || "");
        setMaterialOutPartyId(String(data.challan.partyId || ""));
        const partyMatch = parties.find(
          (party) => String(party.id) === String(data.challan.partyId || "")
        );
        setMaterialOutPartySearch(
          data.challan.partyName || (partyMatch ? partyMatch.partyName : "")
        );
        setMaterialOutRemarks(data.challan.remarks || "");
        setMaterialOutVehicleNo(data.challan.vehicleNo || "");
        setMaterialOutItems(
          (data.items || []).map((item) => ({
            itemId: String(item.itemId || ""),
            itemSearch: item.itemName || "",
            grossWeight: String(item.grossWeight ?? ""),
            bagsCrate: String(item.bagsCrate ?? ""),
            lessWeight: String(item.lessWeight ?? ""),
            pcs: String(item.pcs ?? ""),
            processType: item.processType || ""
          }))
        );
      })
      .catch((err) => {
        setMaterialOutError(err.message || "Unable to load material out.");
      });
  };

  const handleDeleteMaterialOutRecord = (challan) => {
    if (!confirmDelete(`Material Out Challan ${challan.challanNo || ""}`.trim())) {
      return;
    }
    fetch(`/api/material-out/${challan.id}`, { method: "DELETE" })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to delete material out.");
        }
        setMaterialOutList((prev) => prev.filter((item) => item.id !== challan.id));
        if (editingMaterialOutId === challan.id) {
          handleCancelMaterialOutEdit();
        }
      })
      .catch((err) => {
        setMaterialOutPrintError(err.message || "Unable to delete material out.");
      });
  };

  const handlePrintChallan = (challanId) => {
    setPrintError("");
    fetch(`/api/challan-sales/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load challan.");
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          throw new Error("Popup blocked. Allow popups to print.");
        }
        printWindow.document.open();
        printWindow.document.write(buildChallanPrintHtml(data.challan, data.items || []));
        printWindow.document.close();
      })
      .catch((err) => {
        setPrintError(err.message || "Unable to print challan.");
      });
  };

  const handlePrintMaterialOut = (challanId) => {
    setMaterialOutPrintError("");
    fetch(`/api/material-out/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load material out.");
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          throw new Error("Popup blocked. Allow popups to print.");
        }
        printWindow.document.open();
        printWindow.document.write(buildMaterialOutPrintHtml(data.challan, data.items || []));
        printWindow.document.close();
      })
      .catch((err) => {
        setMaterialOutPrintError(err.message || "Unable to print material out.");
      });
  };

  const updateMaterialInItem = (index, key, value) => {
    if (key === "itemSearch") {
      const nextSearch = String(value || "");
      const nextItemId = resolveItemIdFromInput(nextSearch);

      setMaterialInItems((prev) =>
        prev.map((item, rowIndex) =>
          rowIndex === index
            ? {
                ...item,
                itemSearch: nextSearch,
                itemId: nextItemId || item.itemId
              }
            : item
        )
      );

      if (!nextItemId) {
        return;
      }

      setMaterialInItems((prev) =>
        prev.map((item, rowIndex) =>
          rowIndex === index
            ? {
                ...item,
                itemId: nextItemId,
                materialOutItemId: "",
                weightBalance: "",
                pcsBalance: ""
              }
            : item
        )
      );

      const partyQuery = materialInPartyId
        ? `?partyId=${encodeURIComponent(materialInPartyId)}`
        : "";
      fetch(`/api/material-out/items/${nextItemId}/challans${partyQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setMaterialInChallanOptions((prev) => ({
            ...prev,
            [index]: data.challans || []
          }));
        })
        .catch(() => {
          setMaterialInChallanOptions((prev) => ({ ...prev, [index]: [] }));
        });
      return;
    }

    if (key === "itemId") {
      const nextItemId = String(value || "");
      setMaterialInItems((prev) =>
        prev.map((item, rowIndex) =>
          rowIndex === index
            ? {
                ...item,
                itemId: nextItemId,
                materialOutItemId: "",
                weightBalance: "",
                pcsBalance: ""
              }
            : item
        )
      );

      if (!nextItemId) {
        setMaterialInChallanOptions((prev) => ({ ...prev, [index]: [] }));
        return;
      }

      const partyQuery = materialInPartyId
        ? `?partyId=${encodeURIComponent(materialInPartyId)}`
        : "";
      fetch(`/api/material-out/items/${nextItemId}/challans${partyQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setMaterialInChallanOptions((prev) => ({
            ...prev,
            [index]: data.challans || []
          }));
        })
        .catch(() => {
          setMaterialInChallanOptions((prev) => ({ ...prev, [index]: [] }));
        });
      return;
    }

    if (key === "materialOutItemId") {
      const nextValue = String(value || "");
      const rowOptions = materialInChallanOptions[index] || [];
      const selected = rowOptions.find(
        (option) => String(option.materialOutItemId) === nextValue
      );

      setMaterialInItems((prev) =>
        prev.map((item, rowIndex) =>
          rowIndex === index
            ? {
                ...item,
                materialOutItemId: nextValue,
                weightBalance: selected ? selected.weightBalance : "",
                pcsBalance: selected ? selected.pcsBalance : ""
              }
            : item
        )
      );
      return;
    }

    setMaterialInItems((prev) =>
      prev.map((item, rowIndex) =>
        rowIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const fetchMaterialInItemsByParty = (partyId) => {
    if (!partyId) {
      setItems([]);
      return Promise.resolve([]);
    }

    const query = new URLSearchParams({ partyId: String(partyId) });
    return fetch(`/api/material-out/items?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const nextItems = sortByIdAsc(data.items || []);
        setItems(nextItems);
        return nextItems;
      })
      .catch(() => {
        setItems([]);
        setMaterialInError("Unable to load items.");
        return [];
      });
  };

  const handleMaterialInPartySearchChange = (partyName) => {
    const nextSearch = String(partyName || "");
    const nextPartyId = resolvePartyIdFromInput(nextSearch);

    setMaterialInPartySearch(nextSearch);
    setMaterialInPartyId(nextPartyId);
    setMaterialInChallanOptions({});
    setMaterialInItems([createEmptyMaterialInItem()]);
  };

  const handleAddMaterialInItem = () => {
    setMaterialInItems((prev) => [...prev, createEmptyMaterialInItem()]);
  };

  const handleRemoveMaterialInItem = (index) => {
    setMaterialInItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, rowIndex) => rowIndex !== index)
    );
    setMaterialInChallanOptions((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        const rowIndex = Number(key);
        if (Number.isNaN(rowIndex) || rowIndex === index) {
          return;
        }
        next[rowIndex > index ? rowIndex - 1 : rowIndex] = prev[key];
      });
      return next;
    });
  };

  const printMaterialInById = (challanId) => {
    if (!challanId) {
      return Promise.resolve();
    }
    return fetch(`/api/material-in/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load material in.");
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          throw new Error("Popup blocked. Allow popups to print.");
        }
        printWindow.document.open();
        printWindow.document.write(buildMaterialInPrintHtml(data.challan, data.items || []));
        printWindow.document.close();
      });
  };

  const handleSaveMaterialIn = (event, shouldPrint = false) => {
    if (event) {
      event.preventDefault();
    }
    setMaterialInError("");
    setMaterialInSaving(true);

    const endpoint = editingMaterialInId
      ? `/api/material-in/${editingMaterialInId}`
      : "/api/material-in";
    const method = editingMaterialInId ? "PUT" : "POST";

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challanNo: Number(materialInNo),
        challanDate: materialInDate,
        partyId: Number(materialInPartyId),
        remarks: materialInRemarks,
        vehicleNo: materialInVehicleNo,
        items: materialInItems.map((item) => ({
          itemId: Number(item.itemId),
          materialInItemName: item.materialInItemName || "",
          materialOutItemId: Number(item.materialOutItemId),
          grossWeight: Number(item.grossWeight || 0),
          bagsCrate: Number(item.bagsCrate || 0),
          lessWeight: Number(item.lessWeight || 0),
          pcs: Number(item.pcs || 0),
          unit: item.unit,
          rate: Number(item.rate || 0),
          processType: item.processType
        }))
      })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to save material in.");
        }
        const savedChallanId = payload?.challan?.id || editingMaterialInId;
        if (shouldPrint) {
          try {
            await printMaterialInById(savedChallanId);
          } catch (err) {
            setMaterialInError(err.message || "Unable to print material in.");
          }
        }
        setMaterialInRemarks("");
        setMaterialInVehicleNo("");
        setMaterialInPartyId("");
        setMaterialInPartySearch("");
        setMaterialInItems([createEmptyMaterialInItem()]);
        setMaterialInChallanOptions({});
        setEditingMaterialInId(null);
        return fetch("/api/material-in/next-no");
      })
      .then((res) => res.json())
      .then((data) => {
        setMaterialInNo(String(data.challanNo || ""));
        setMaterialInSaving(false);
      })
      .catch((err) => {
        setMaterialInError(err.message || "Unable to save material in.");
        setMaterialInSaving(false);
      });
  };

  const handleCancelMaterialInEdit = () => {
    setEditingMaterialInId(null);
    setMaterialInError("");
    setMaterialInRemarks("");
    setMaterialInVehicleNo("");
    setMaterialInPartyId("");
    setMaterialInPartySearch("");
    setMaterialInItems([createEmptyMaterialInItem()]);
    setMaterialInChallanOptions({});
    setMaterialInDate(getTodayValue());
    fetch("/api/material-in/next-no")
      .then((res) => res.json())
      .then((data) => {
        setMaterialInNo(String(data.challanNo || ""));
      })
      .catch(() => {
        setMaterialInError("Unable to generate Challan number.");
      });
  };

  const handleEditMaterialInRecord = (challanId) => {
    setMaterialInError("");
    setEditingMaterialInId(challanId);
    setActiveMenu("Material IN");

    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => {
        setParties(sortByIdAsc(data.parties || []));
      })
      .catch(() => {
        setMaterialInError("Unable to load parties.");
      });

    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(sortByIdAsc(data.items || []));
      })
      .catch(() => {
        setMaterialInError("Unable to load items.");
      });

    fetch(`/api/material-in/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load material in.");
        }
        setMaterialInNo(String(data.challan.challanNo || ""));
        setMaterialInDate(data.challan.challanDate || "");
        setMaterialInPartyId(String(data.challan.partyId || ""));
        setMaterialInPartySearch(data.challan.partyName || "");
        setMaterialInRemarks(data.challan.remarks || "");
        setMaterialInVehicleNo(data.challan.vehicleNo || "");

        const mappedItems = (data.items || []).map((item) => ({
          itemId: String(item.itemId || ""),
          itemSearch: item.itemName || "",
          materialInItemName: item.materialInItemName || "",
          materialOutItemId: String(item.materialOutItemId || ""),
          grossWeight: String(item.grossWeight ?? ""),
          bagsCrate: String(item.bagsCrate ?? ""),
          lessWeight: String(item.lessWeight ?? ""),
          pcs: String(item.pcs ?? ""),
          unit: item.unit || "per_kg",
          rate: String(item.rate ?? ""),
          processType: item.processType || "",
          weightBalance: "",
          pcsBalance: ""
        }));

        setMaterialInItems(mappedItems);
        setMaterialInChallanOptions({});

        return Promise.all(
          mappedItems.map((item, index) =>
            fetch(
              `/api/material-out/items/${item.itemId}/challans?partyId=${encodeURIComponent(
                data.challan.partyId
              )}`
            )
              .then((res) => res.json())
              .then((payload) => ({ index, options: payload.challans || [] }))
              .catch(() => ({ index, options: [] }))
          )
        ).then((results) => {
          const nextOptions = {};
          results.forEach(({ index, options }) => {
            nextOptions[index] = options;
          });

          setMaterialInChallanOptions(nextOptions);
          setMaterialInItems((prev) =>
            prev.map((item, index) => {
              const options = nextOptions[index] || [];
              const selected = options.find(
                (option) => String(option.materialOutItemId) === String(item.materialOutItemId)
              );
              return {
                ...item,
                weightBalance: selected ? selected.weightBalance : "",
                pcsBalance: selected ? selected.pcsBalance : ""
              };
            })
          );
        });
      })
      .catch((err) => {
        setMaterialInError(err.message || "Unable to load material in.");
      });
  };

  const handleDeleteMaterialInRecord = (challan) => {
    if (!confirmDelete(`Material In Challan ${challan.challanNo || ""}`.trim())) {
      return;
    }
    fetch(`/api/material-in/${challan.id}`, { method: "DELETE" })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Unable to delete material in.");
        }
        setMaterialInList((prev) => prev.filter((item) => item.id !== challan.id));
        if (editingMaterialInId === challan.id) {
          handleCancelMaterialInEdit();
        }
      })
      .catch((err) => {
        setMaterialInPrintError(err.message || "Unable to delete material in.");
      });
  };

  const handlePrintMaterialIn = (challanId) => {
    setMaterialInPrintError("");
    fetch(`/api/material-in/${challanId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.challan) {
          throw new Error("Unable to load material in.");
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          throw new Error("Popup blocked. Allow popups to print.");
        }
        printWindow.document.open();
        printWindow.document.write(buildMaterialInPrintHtml(data.challan, data.items || []));
        printWindow.document.close();
      })
      .catch((err) => {
        setMaterialInPrintError(err.message || "Unable to print material in.");
      });
  };

  if (loading) {
    return (
      <div className="setup">
        <h2>Loading</h2>
        <p>Preparing your workspace.</p>
      </div>
    );
  }

  if (registrationRequired) {
    return (
      <div className="setup">
        <h2>App registration</h2>
        <p>Complete quick registration to continue.</p>
        {registrationError ? <div className="notice">{registrationError}</div> : null}
        <form onSubmit={handleVerifyRegistration}>
          <div className="form-group">
            <label htmlFor="registrationCode">Registration code</label>
            <input
              id="registrationCode"
              type="text"
              value={registrationCode}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="registrationKey">Enter registration key</label>
            <input
              id="registrationKey"
              type="text"
              value={registrationKeyInput}
              onChange={(event) => setRegistrationKeyInput(event.target.value)}
              placeholder="Enter numeric key"
              required
            />
          </div>
          <div style={{ marginTop: "16px" }}>
            <button className="primary" type="submit" disabled={registrationSaving}>
              {registrationSaving ? "Verifying..." : "Verify and continue"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="setup">
        <h2>Login</h2>
        <p>Sign in to continue.</p>
        {loginError ? <div className="notice">{loginError}</div> : null}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="loginUsername">Username</label>
            <input
              id="loginUsername"
              type="text"
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="password"
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: "8px" }}>
            <label htmlFor="rememberMe" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>
          </div>
          <div style={{ marginTop: "16px" }}>
            <button className="primary" type="submit" disabled={loginSaving}>
              {loginSaving ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>Pocket Challan</span>
          <h1>{company?.name || "Pocket Challan"}</h1>
        </div>
        <nav className="nav">
          {visibleMenuItems.map((item) =>
            item === "Reports" ? (
              <div className="nav-group" key={item}>
                <button
                  className={`nav-parent ${
                    reportItems.some((entry) => entry.value === activeMenu) ? "active" : ""
                  }`}
                  type="button"
                  onClick={() => setShowReportsMenu((prev) => !prev)}
                >
                  Reports
                  <span className={`nav-caret ${showReportsMenu ? "open" : ""}`}>▾</span>
                </button>
                {showReportsMenu ? (
                  <div className="nav-sub">
                    {reportItems.map((report) => (
                      <button
                        key={report.value}
                        className={report.value === activeMenu ? "active" : ""}
                        onClick={() => {
                          setActiveMenu(report.value);
                          setShowReportsMenu(false);
                        }}
                      >
                        {report.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                key={item}
                className={item === activeMenu ? "active" : ""}
                onClick={() => setActiveMenu(item)}
              >
                {item}
              </button>
            )
          )}
          {currentUser === "admin" ? (
            <button
              key="manage-users"
              className={activeMenu === "Manage Users" ? "active" : ""}
              onClick={() => setActiveMenu("Manage Users")}
            >
              Manage Users
            </button>
          ) : null}
          <button key="logout" onClick={handleLogout}>Logout</button>
        </nav>
        <div className="sidebar-footer">Local database enabled</div>
      </aside>
      <main className="content">
        <div className="header">
          <div>
            <h2>{activeMenu}</h2>
          </div>
          {activeMenu === "Party Master" ? (
            <div className="header-actions">
              <button className="primary" onClick={handleCreateNew}>
                Create new
              </button>
              <button className="primary print-all" onClick={handlePrintPartyMaster}>
                Print all
              </button>
              <button className="danger" onClick={handleDeleteAllParties}>
                Delete all
              </button>
            </div>
          ) : activeMenu === "Item Master" ? (
            <div className="header-actions">
              <button className="primary" onClick={handleCreateNew}>
                Create new
              </button>
              <button className="primary print-all" onClick={handlePrintItemMaster}>
                Print all
              </button>
            </div>
          ) : activeMenu === "Sales Payment" ? (
            <button className="primary" onClick={handleCreateNew}>
              Add payment
            </button>
          ) : activeMenu === "Material Payment" ? (
            <button className="primary" onClick={handleCreateNew}>
              Add payment
            </button>
          ) : null}
        </div>
        {activeMenu === "Party Master" ? (
          <PartyMasterSection
            parties={parties}
            partyLoading={partyLoading}
            onEdit={handleEditParty}
            onDelete={handleDeleteParty}
          />
        ) : null}
        {activeMenu === "Item Master" ? (
          <ItemMasterSection
            items={items}
            itemLoading={itemLoading}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ) : null}
        {activeMenu === "Sales Payment" ? (
          <SalesPaymentSection
            payments={filteredSalesPayments}
            paymentLoading={paymentLoading}
            paymentError={paymentError}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
            parties={salesPartyOptions}
            filterParty={salesFilterParty}
            filterStart={salesFilterStart}
            filterEnd={salesFilterEnd}
            filterType={salesFilterType}
            typeOptions={salesTypeOptions}
            onFilterPartyChange={setSalesFilterParty}
            onFilterStartChange={setSalesFilterStart}
            onFilterEndChange={setSalesFilterEnd}
            onFilterTypeChange={setSalesFilterType}
          />
        ) : null}
        {activeMenu === "Party Statement" ? (
          <PartyStatementSection
            parties={parties}
            partyId={statementPartyId}
            startDate={statementStartDate}
            endDate={statementEndDate}
            onPartyChange={setStatementPartyId}
            onStartDateChange={setStatementStartDate}
            onEndDateChange={setStatementEndDate}
            onSubmit={handleGenerateStatement}
            loading={statementLoading}
            error={statementError}
            statement={statementData}
            formatNumber={formatNumber}
          />
        ) : null}
        {activeMenu === "Material In-Out" ? (
          <MaterialInOutReportSection
            parties={parties}
            partyId={materialInOutPartyId}
            startDate={materialInOutStart}
            endDate={materialInOutEnd}
            onPartyChange={setMaterialInOutPartyId}
            onStartDateChange={setMaterialInOutStart}
            onEndDateChange={setMaterialInOutEnd}
            onSubmit={handleGenerateMaterialInOutReport}
            onPrint={handlePrintMaterialInOutReport}
            loading={materialInOutLoading}
            error={materialInOutError}
            printError={materialInOutPrintError}
            report={materialInOutReport}
            formatNumber={formatNumber}
          />
        ) : null}
        {activeMenu === "Material Payment" ? (
          <MaterialPaymentSection
            materialPayments={filteredMaterialPayments}
            materialLoading={materialLoading}
            materialError={materialError}
            onEdit={handleEditMaterialPayment}
            onDelete={handleDeleteMaterialPayment}
            parties={materialPartyOptions}
            filterParty={materialFilterParty}
            filterStart={materialFilterStart}
            filterEnd={materialFilterEnd}
            filterType={materialFilterType}
            typeOptions={materialTypeOptions}
            onFilterPartyChange={setMaterialFilterParty}
            onFilterStartChange={setMaterialFilterStart}
            onFilterEndChange={setMaterialFilterEnd}
            onFilterTypeChange={setMaterialFilterType}
          />
        ) : null}
        {activeMenu === "Challan - Sales" ? (
          <ChallanSalesSection
            challanNo={challanNo}
            challanDate={challanDate}
            challanPartyId={challanPartyId}
            partySearch={challanPartySearch}
            challanItems={challanItems}
            challanRemarks={challanRemarks}
            challanBillNo={challanBillNo}
            challanVehicleNo={challanVehicleNo}
            parties={parties}
            items={items}
            challanError={challanError}
            challanSaving={challanSaving}
            onPartySearchChange={handleChallanPartySearchChange}
            onNoChange={setChallanNo}
            onDateChange={setChallanDate}
            onAddItem={handleAddChallanItem}
            onRemoveItem={handleRemoveChallanItem}
            onItemChange={updateChallanItem}
            onRemarksChange={setChallanRemarks}
            onBillNoChange={setChallanBillNo}
            onVehicleChange={setChallanVehicleNo}
            onSave={handleSaveChallan}
            onSaveAndPrint={(event) => handleSaveChallan(event, true)}
            getNetWeight={getNetWeight}
            getAmount={getAmount}
            onAddParty={handleOpenPartyModal}
            onAddItemModal={handleOpenItemModal}
            isEditing={Boolean(editingChallanId)}
            onCancelEdit={handleCancelChallanEdit}
          />
        ) : null}
        {activeMenu === "Material OUT" ? (
          <MaterialOutSection
            challanNo={materialOutNo}
            challanDate={materialOutDate}
            challanPartyId={materialOutPartyId}
            partySearch={materialOutPartySearch}
            materialItems={materialOutItems}
            remarks={materialOutRemarks}
            vehicleNo={materialOutVehicleNo}
            parties={parties}
            items={items}
            error={materialOutError}
            saving={materialOutSaving}
            onPartySearchChange={handleMaterialOutPartySearchChange}
            onNoChange={setMaterialOutNo}
            onDateChange={setMaterialOutDate}
            onAddItem={handleAddMaterialOutItem}
            onRemoveItem={handleRemoveMaterialOutItem}
            onItemChange={updateMaterialOutItem}
            onRemarksChange={setMaterialOutRemarks}
            onVehicleChange={setMaterialOutVehicleNo}
            onSave={handleSaveMaterialOut}
            onSaveAndPrint={(event) => handleSaveMaterialOut(event, true)}
            getNetWeight={getNetWeight}
            isEditing={Boolean(editingMaterialOutId)}
            onCancelEdit={handleCancelMaterialOutEdit}
            onAddParty={handleOpenPartyModal}
            onAddItemModal={handleOpenItemModal}
          />
        ) : null}
        {activeMenu === "Material IN" ? (
          <MaterialInSection
            challanNo={materialInNo}
            challanDate={materialInDate}
            challanPartyId={materialInPartyId}
            partySearch={materialInPartySearch}
            materialItems={materialInItems}
            remarks={materialInRemarks}
            vehicleNo={materialInVehicleNo}
            parties={parties}
            items={items}
            challanOptionsByRow={materialInChallanOptions}
            error={materialInError}
            saving={materialInSaving}
            onPartyChange={setMaterialInPartyId}
            onPartySearchChange={handleMaterialInPartySearchChange}
            onNoChange={setMaterialInNo}
            onDateChange={setMaterialInDate}
            onAddItem={handleAddMaterialInItem}
            onRemoveItem={handleRemoveMaterialInItem}
            onItemChange={updateMaterialInItem}
            onRemarksChange={setMaterialInRemarks}
            onVehicleChange={setMaterialInVehicleNo}
            onSave={handleSaveMaterialIn}
            onSaveAndPrint={(event) => handleSaveMaterialIn(event, true)}
            getNetWeight={getNetWeight}
            getAmount={getAmount}
            isEditing={Boolean(editingMaterialInId)}
            onCancelEdit={handleCancelMaterialInEdit}
            onAddParty={handleOpenPartyModal}
            onAddItemModal={handleOpenItemModal}
          />
        ) : null}
        {activeMenu === "Challan Report" ? (
          <PrintChallanSalesSection
            challanList={filteredChallanList}
            printLoading={printLoading}
            printError={printError}
            onPrint={handlePrintChallan}
            onEdit={handleEditChallanRecord}
            onDelete={handleDeleteChallanRecord}
            formatNumber={formatNumber}
            parties={challanPartyOptions}
            filterParty={challanFilterParty}
            filterStart={challanFilterStart}
            filterEnd={challanFilterEnd}
            onFilterPartyChange={setChallanFilterParty}
            onFilterStartChange={setChallanFilterStart}
            onFilterEndChange={setChallanFilterEnd}
          />
        ) : null}
        {activeMenu === "Print Material Out" ? (
          <PrintMaterialOutSection
            challanList={materialOutList}
            printLoading={materialOutPrintLoading}
            printError={materialOutPrintError}
            onPrint={handlePrintMaterialOut}
            onEdit={handleEditMaterialOutRecord}
            onDelete={handleDeleteMaterialOutRecord}
          />
        ) : null}
        {activeMenu === "Print Material In" ? (
          <PrintMaterialInSection
            challanList={materialInList}
            printLoading={materialInPrintLoading}
            printError={materialInPrintError}
            onPrint={handlePrintMaterialIn}
            onEdit={handleEditMaterialInRecord}
            onDelete={handleDeleteMaterialInRecord}
          />
        ) : null}
        {activeMenu === "Material Outstanding" ? (
          <MaterialOutstandingSection
            records={materialOutstandingRows}
            loading={materialOutstandingLoading}
            error={materialOutstandingError}
            startDate={materialOutstandingStart}
            endDate={materialOutstandingEnd}
            onStartDateChange={setMaterialOutstandingStart}
            onEndDateChange={setMaterialOutstandingEnd}
            onSubmit={handleGenerateMaterialOutstanding}
          />
        ) : null}
        {activeMenu === "Payment Outstanding" ? (
          <PaymentOutstandingSection
            rows={paymentOutstandingRows}
            loading={paymentOutstandingLoading}
            error={paymentOutstandingError}
          />
        ) : null}
        {activeMenu === "Backup" ? (
          <BackupSection
            backupLoading={backupLoading}
            backupError={backupError}
            backupMessage={backupMessage}
            onBackup={handleDownloadBackup}
            restoreLoading={restoreLoading}
            restoreError={restoreError}
            restoreMessage={restoreMessage}
            restoreFileName={restoreFile ? restoreFile.name : ""}
            onRestoreFileChange={setRestoreFile}
            onRestore={handleRestoreBackup}
          />
        ) : null}
        {activeMenu === "Dashboard" ? (
          <DashboardSection
            company={company}
            data={dashboardData}
            formatNumber={formatNumber}
            appVersion={appVersion}
            appExpiry={appExpiry}
            onQuickNewChallan={handleQuickNewChallan}
            onQuickAddPayment={handleQuickAddPayment}
            onQuickViewStatement={handleQuickViewStatement}
          />
        ) : null}
        {activeMenu === "Profile" ? (
          <ProfileSection
            profileName={profileName}
            profileError={profileError}
            profileSaving={profileSaving}
            onNameChange={setProfileName}
            onSubmit={handleSaveProfile}
          />
        ) : null}
        {activeMenu === "Manage Users" && currentUser === "admin" ? (
          <ManageUsersSection
            createUsername={createUserUsername}
            createPassword={createUserPassword}
            createError={createUserError}
            createSaving={createUserSaving}
            adminPassword={adminNewPassword}
            adminPasswordError={adminPasswordError}
            adminPasswordSaving={adminPasswordSaving}
            onCreateUsernameChange={setCreateUserUsername}
            onCreatePasswordChange={setCreateUserPassword}
            onCreateSubmit={handleCreateUser}
            onAdminPasswordChange={setAdminNewPassword}
            onAdminPasswordSubmit={handleChangeAdminPassword}
          />
        ) : null}
        {activeMenu !== "Party Master" &&
        activeMenu !== "Item Master" &&
        activeMenu !== "Sales Payment" &&
        activeMenu !== "Dashboard" &&
        activeMenu !== "Challan - Sales" &&
        activeMenu !== "Challan Report" &&
        activeMenu !== "Material OUT" &&
        activeMenu !== "Print Material Out" &&
        activeMenu !== "Material IN" &&
        activeMenu !== "Print Material In" &&
        activeMenu !== "Party Statement" &&
        activeMenu !== "Material In-Out" &&
        activeMenu !== "Material Payment" &&
        activeMenu !== "Material Outstanding" &&
        activeMenu !== "Payment Outstanding" &&
        activeMenu !== "Backup" &&
        activeMenu !== "Manage Users" &&
        activeMenu !== "Profile" ? (
          <section className="hero">
            <h3>Ready for the next step</h3>
            <p>
              This is your professional workspace. Each module will plug into the
              local database and keep operations aligned with your workflow.
            </p>
          </section>
        ) : null}
        {showPartyForm ? (
          <PartyModal
            partyName={partyName}
            openingBalance={openingBalance}
            isEditing={Boolean(editingPartyId)}
            partyError={partyError}
            onPartyNameChange={setPartyName}
            onOpeningBalanceChange={setOpeningBalance}
            onClose={() => {
              setShowPartyForm(false);
              setEditingPartyId(null);
            }}
            onSubmit={handleAddParty}
          />
        ) : null}
        {showItemForm ? (
          <ItemModal
            itemName={itemName}
            itemError={itemError}
            onItemNameChange={setItemName}
            isEditing={Boolean(editingItemId)}
            onClose={() => {
              setShowItemForm(false);
              setEditingItemId(null);
            }}
            onSubmit={handleAddItem}
          />
        ) : null}
        {showPaymentForm ? (
          <SalesPaymentModal
            receiptDate={receiptDate}
            receiptNo={receiptNo}
            parties={parties}
            paymentPartyId={paymentPartyId}
            paymentAmount={paymentAmount}
            paymentType={paymentType}
            paymentRemarks={paymentRemarks}
            paymentError={paymentError}
            paymentSaving={paymentSaving}
            onDateChange={setReceiptDate}
            onReceiptNoChange={setReceiptNo}
            onPartyChange={setPaymentPartyId}
            onAmountChange={setPaymentAmount}
            onTypeChange={setPaymentType}
            onRemarksChange={setPaymentRemarks}
            onClose={() => setShowPaymentForm(false)}
            onSubmit={handleSavePayment}
          />
        ) : null}
        {showMaterialForm ? (
          <MaterialPaymentModal
            receiptDate={materialReceiptDate}
            receiptNo={materialReceiptNo}
            parties={parties}
            partyId={materialPartyId}
            amount={materialAmount}
            paymentType={materialType}
            remarks={materialRemarks}
            paymentError={materialError}
            paymentSaving={materialSaving}
            onDateChange={setMaterialReceiptDate}
            onReceiptNoChange={setMaterialReceiptNo}
            onPartyChange={setMaterialPartyId}
            onAmountChange={setMaterialAmount}
            onTypeChange={setMaterialType}
            onRemarksChange={setMaterialRemarks}
            onClose={() => setShowMaterialForm(false)}
            onSubmit={handleSaveMaterialPayment}
          />
        ) : null}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
