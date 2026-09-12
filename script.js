const loginScreen = document.getElementById("login-screen");
const dashboardScreen = document.getElementById("dashboard-screen");

const anonymousLogin = document.getElementById("anonymous-login");
const logoutButton = document.getElementById("logout-button");

const inventoryView = document.getElementById("inventory-view");
const dashboardView = document.querySelector(".dashboard-section");

const inventoryMenu = document.getElementById("inventory-menu");
const inventoryModule = document.getElementById("inventory-module");
const backDashboard = document.getElementById("back-dashboard");

const inventoryForm = document.getElementById("inventory-form");
const inventoryTableBody = document.getElementById("inventory-table-body");
const inventorySearch = document.getElementById("inventory-search");

const itemId = document.getElementById("inventory-id");
const itemCode = document.getElementById("item-code");
const itemName = document.getElementById("item-name");
const itemColor = document.getElementById("item-color");
const itemBrand = document.getElementById("item-brand");
const itemStock = document.getElementById("item-stock");
const itemPrice = document.getElementById("item-price");

const cancelEdit = document.getElementById("cancel-edit");
const inventoryFormTitle = document.getElementById("inventory-form-title");

const inventoryTabs = document.querySelectorAll(".inventory-tab");


/* =========================
   LOGIN
   ========================= */

function showDashboard() {
    loginScreen.classList.remove("active");
    dashboardScreen.classList.add("active");
}

function showLogin() {
    dashboardScreen.classList.remove("active");
    loginScreen.classList.add("active");
}

anonymousLogin.addEventListener("click", showDashboard);

logoutButton.addEventListener("click", showLogin);


/* =========================
   INVENTORY DATA
   ========================= */

let currentCategory = "rem";

const inventoryData = {

    rem: [
        {
            id: 1,
            code: "RM-001",
            name: "Racing Brake",
            color: "Black",
            brand: "Brembo",
            stock: 12,
            price: 850000
        },
        {
            id: 2,
            code: "RM-002",
            name: "Brake Set",
            color: "Red",
            brand: "Nissin",
            stock: 8,
            price: 625000
        }
    ],

    velg: [
        {
            id: 3,
            code: "VG-001",
            name: "Sport Wheel",
            color: "Black",
            brand: "Racing Boy",
            stock: 6,
            price: 1450000
        },
        {
            id: 4,
            code: "VG-002",
            name: "Premium Wheel",
            color: "Gold",
            brand: "TDR",
            stock: 4,
            price: 1850000
        }
    ],

    shock: [
        {
            id: 5,
            code: "SH-001",
            name: "Mono Shock",
            color: "Black",
            brand: "YSS",
            stock: 7,
            price: 1200000
        },
        {
            id: 6,
            code: "SH-002",
            name: "Rear Shock",
            color: "Silver",
            brand: "Ohlins",
            stock: 3,
            price: 2350000
        }
    ]

};


/* =========================
   INVENTORY VIEW
   ========================= */

function openInventory() {

    dashboardView.style.display = "none";
    inventoryView.classList.add("active");

    inventoryMenu.classList.add("active");

    renderInventory();
}

function closeInventory() {

    inventoryView.classList.remove("active");
    dashboardView.style.display = "";

    inventoryMenu.classList.remove("active");

    resetForm();
}

inventoryMenu.addEventListener("click", openInventory);
inventoryModule.addEventListener("click", openInventory);
backDashboard.addEventListener("click", closeInventory);


/* =========================
   CATEGORY
   ========================= */

inventoryTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        currentCategory = tab.dataset.category;

        inventoryTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        const titles = {
            rem: "Master Rem",
            velg: "Velg Motor",
            shock: "Shock Breaker"
        };

        inventoryFormTitle.textContent = titles[currentCategory];

        resetForm();
        renderInventory();

    });

});


/* =========================
   RENDER TABLE
   ========================= */

function renderInventory() {

    const keyword = inventorySearch.value.toLowerCase().trim();

    const items = inventoryData[currentCategory].filter(item => {

        return (
            item.code.toLowerCase().includes(keyword) ||
            item.name.toLowerCase().includes(keyword) ||
            item.color.toLowerCase().includes(keyword) ||
            item.brand.toLowerCase().includes(keyword)
        );

    });

    inventoryTableBody.innerHTML = "";

    if (items.length === 0) {

        inventoryTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;color:var(--muted);padding:25px;">
                    No inventory data found.
                </td>
            </tr>
        `;

        return;
    }

    items.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(item.code)}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${escapeHtml(item.color)}</td>
            <td>${escapeHtml(item.brand)}</td>
            <td>${item.stock}</td>
            <td>Rp ${formatNumber(item.price)}</td>
            <td>
                <button
                    class="table-action"
                    data-action="edit"
                    data-id="${item.id}"
                >
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>

                <button
                    class="table-action delete"
                    data-action="delete"
                    data-id="${item.id}"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </td>
        `;

        inventoryTableBody.appendChild(row);

    });

}


/* =========================
   SEARCH
   ========================= */

inventorySearch.addEventListener("input", renderInventory);


/* =========================
   SAVE
   ========================= */

inventoryForm.addEventListener("submit", event => {

    event.preventDefault();

    const id = Number(itemId.value);

    const item = {
        id: id || Date.now(),
        code: itemCode.value.trim(),
        name: itemName.value.trim(),
        color: itemColor.value.trim(),
        brand: itemBrand.value.trim(),
        stock: Number(itemStock.value),
        price: Number(itemPrice.value)
    };

    const items = inventoryData[currentCategory];

    if (id) {

        const index = items.findIndex(existing => existing.id === id);

        if (index !== -1) {
            items[index] = item;
        }

    } else {

        items.push(item);

    }

    resetForm();
    renderInventory();

});


/* =========================
   TABLE ACTIONS
   ========================= */

inventoryTableBody.addEventListener("click", event => {

    const button = event.target.closest(".table-action");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const items = inventoryData[currentCategory];
    const item = items.find(existing => existing.id === id);

    if (!item) return;

    if (action === "edit") {

        itemId.value = item.id;
        itemCode.value = item.code;
        itemName.value = item.name;
        itemColor.value = item.color;
        itemBrand.value = item.brand;
        itemStock.value = item.stock;
        itemPrice.value = item.price;

        inventoryFormTitle.textContent += " — Edit";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    if (action === "delete") {

        const confirmed = confirm(
            `Delete "${item.name}" from this demo inventory?`
        );

        if (!confirmed) return;

        const index = items.findIndex(existing => existing.id === id);

        if (index !== -1) {
            items.splice(index, 1);
        }

        renderInventory();

    }

});


/* =========================
   CANCEL
   ========================= */

cancelEdit.addEventListener("click", resetForm);

function resetForm() {

    inventoryForm.reset();
    itemId.value = "";

    const titles = {
        rem: "Master Rem",
        velg: "Velg Motor",
        shock: "Shock Breaker"
    };

    inventoryFormTitle.textContent = titles[currentCategory];

}


/* =========================
   HELPERS
   ========================= */

function formatNumber(number) {

    return new Intl.NumberFormat("id-ID").format(number);

}

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

/* =========================
   EMPLOYEE MODULE
   ========================= */

const employeeView = document.getElementById("employee-view");
const employeeMenu = document.getElementById("employee-menu");
const employeeModule = document.getElementById("employee-module");
const backDashboardEmployee = document.getElementById("back-dashboard-employee");

const employeeForm = document.getElementById("employee-form");
const employeeTableBody = document.getElementById("employee-table-body");
const employeeSearch = document.getElementById("employee-search");

const employeeId = document.getElementById("employee-id");
const employeeCode = document.getElementById("employee-code");
const employeeName = document.getElementById("employee-name");
const employeeGender = document.getElementById("employee-gender");
const employeePosition = document.getElementById("employee-position");
const employeeEmail = document.getElementById("employee-email");
const employeePhone = document.getElementById("employee-phone");

const cancelEmployee = document.getElementById("cancel-employee");


let employeeData = [
    {
        id: 1,
        code: "EMP-001",
        name: "Andi Pratama",
        gender: "Male",
        position: "Admin",
        email: "andi@example.com",
        phone: "081234567890"
    },
    {
        id: 2,
        code: "EMP-002",
        name: "Dina Lestari",
        gender: "Female",
        position: "Cashier",
        email: "dina@example.com",
        phone: "082234567890"
    },
    {
        id: 3,
        code: "EMP-003",
        name: "Rizky Maulana",
        gender: "Male",
        position: "Mechanic",
        email: "rizky@example.com",
        phone: "083334567890"
    }
];


function openEmployees() {

    dashboardView.style.display = "none";
    inventoryView.classList.remove("active");

    employeeView.classList.add("active");

    renderEmployees();
}


function closeEmployees() {

    employeeView.classList.remove("active");
    dashboardView.style.display = "";

    employeeMenu.classList.remove("active");

    resetEmployeeForm();
}


employeeMenu.addEventListener("click", openEmployees);
employeeModule.addEventListener("click", openEmployees);
backDashboardEmployee.addEventListener("click", closeEmployees);


function renderEmployees() {

    const keyword = employeeSearch.value.toLowerCase().trim();

    const filtered = employeeData.filter(employee =>
        employee.code.toLowerCase().includes(keyword) ||
        employee.name.toLowerCase().includes(keyword) ||
        employee.position.toLowerCase().includes(keyword)
    );

    employeeTableBody.innerHTML = "";

    filtered.forEach(employee => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(employee.code)}</td>
            <td>${escapeHtml(employee.name)}</td>
            <td>${escapeHtml(employee.gender)}</td>
            <td>${escapeHtml(employee.position)}</td>
            <td>${escapeHtml(employee.email)}</td>
            <td>${escapeHtml(employee.phone)}</td>
            <td>
                <button
                    class="table-action"
                    data-employee-action="edit"
                    data-id="${employee.id}"
                >
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>

                <button
                    class="table-action delete"
                    data-employee-action="delete"
                    data-id="${employee.id}"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </td>
        `;

        employeeTableBody.appendChild(row);

    });
}


employeeSearch.addEventListener("input", renderEmployees);


employeeForm.addEventListener("submit", event => {

    event.preventDefault();

    const id = Number(employeeId.value);

    const employee = {
        id: id || Date.now(),
        code: employeeCode.value.trim(),
        name: employeeName.value.trim(),
        gender: employeeGender.value,
        position: employeePosition.value.trim(),
        email: employeeEmail.value.trim(),
        phone: employeePhone.value.trim()
    };

    if (id) {

        const index = employeeData.findIndex(item => item.id === id);

        if (index !== -1) {
            employeeData[index] = employee;
        }

    } else {

        employeeData.push(employee);

    }

    resetEmployeeForm();
    renderEmployees();

});


employeeTableBody.addEventListener("click", event => {

    const button = event.target.closest("[data-employee-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.employeeAction;

    const employee = employeeData.find(item => item.id === id);

    if (!employee) return;

    if (action === "edit") {

        employeeId.value = employee.id;
        employeeCode.value = employee.code;
        employeeName.value = employee.name;
        employeeGender.value = employee.gender;
        employeePosition.value = employee.position;
        employeeEmail.value = employee.email;
        employeePhone.value = employee.phone;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    if (action === "delete") {

        const confirmed = confirm(
            `Delete "${employee.name}" from this demo?`
        );

        if (!confirmed) return;

        employeeData = employeeData.filter(
            item => item.id !== id
        );

        renderEmployees();

    }

});


cancelEmployee.addEventListener("click", resetEmployeeForm);


function resetEmployeeForm() {

    employeeForm.reset();
    employeeId.value = "";

}

/* =========================
   PURCHASE MODULE
   ========================= */

const purchaseView = document.getElementById("purchase-view");
const purchaseMenu = document.getElementById("purchase-menu");
const purchaseModule = document.getElementById("purchase-module");
const backDashboardPurchase = document.getElementById("back-dashboard-purchase");

const purchaseForm = document.getElementById("purchase-form");
const purchaseTableBody = document.getElementById("purchase-table-body");
const purchaseSearch = document.getElementById("purchase-search");

const purchaseId = document.getElementById("purchase-id");
const purchaseCode = document.getElementById("purchase-code");
const purchaseType = document.getElementById("purchase-type");
const purchaseService = document.getElementById("purchase-service");
const purchaseNote = document.getElementById("purchase-note");

const cancelPurchase = document.getElementById("cancel-purchase");


let purchaseData = [
    {
        id: 1,
        code: "BUY-001",
        type: "Cash",
        service: "Yes",
        note: "Brake installation"
    },
    {
        id: 2,
        code: "BUY-002",
        type: "Transfer",
        service: "No",
        note: "Wheel purchase"
    }
];


function openPurchases() {

    dashboardView.style.display = "none";
    inventoryView.classList.remove("active");
    employeeView.classList.remove("active");
    paymentView.classList.remove("active");

    purchaseView.classList.add("active");

    renderPurchases();
}


function closePurchases() {

    purchaseView.classList.remove("active");
    dashboardView.style.display = "";

    purchaseMenu.classList.remove("active");

    resetPurchaseForm();
}


purchaseMenu.addEventListener("click", openPurchases);
purchaseModule.addEventListener("click", openPurchases);
backDashboardPurchase.addEventListener("click", closePurchases);


function renderPurchases() {

    const keyword = purchaseSearch.value.toLowerCase().trim();

    const filtered = purchaseData.filter(item =>
        item.code.toLowerCase().includes(keyword) ||
        item.type.toLowerCase().includes(keyword) ||
        item.service.toLowerCase().includes(keyword) ||
        item.note.toLowerCase().includes(keyword)
    );

    purchaseTableBody.innerHTML = "";

    filtered.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(item.code)}</td>
            <td>${escapeHtml(item.type)}</td>
            <td>${escapeHtml(item.service)}</td>
            <td>${escapeHtml(item.note)}</td>
            <td>
                <button
                    class="table-action"
                    data-purchase-action="edit"
                    data-id="${item.id}"
                >
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>

                <button
                    class="table-action delete"
                    data-purchase-action="delete"
                    data-id="${item.id}"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </td>
        `;

        purchaseTableBody.appendChild(row);

    });
}


purchaseSearch.addEventListener("input", renderPurchases);


purchaseForm.addEventListener("submit", event => {

    event.preventDefault();

    const id = Number(purchaseId.value);

    const purchase = {
        id: id || Date.now(),
        code: purchaseCode.value.trim(),
        type: purchaseType.value,
        service: purchaseService.value,
        note: purchaseNote.value.trim()
    };

    if (id) {

        const index = purchaseData.findIndex(item => item.id === id);

        if (index !== -1) {
            purchaseData[index] = purchase;
        }

    } else {

        purchaseData.push(purchase);

    }

    resetPurchaseForm();
    renderPurchases();

});


purchaseTableBody.addEventListener("click", event => {

    const button = event.target.closest("[data-purchase-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.purchaseAction;

    const purchase = purchaseData.find(item => item.id === id);

    if (!purchase) return;

    if (action === "edit") {

        purchaseId.value = purchase.id;
        purchaseCode.value = purchase.code;
        purchaseType.value = purchase.type;
        purchaseService.value = purchase.service;
        purchaseNote.value = purchase.note;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    if (action === "delete") {

        const confirmed = confirm(
            `Delete "${purchase.code}" from this demo?`
        );

        if (!confirmed) return;

        purchaseData = purchaseData.filter(
            item => item.id !== id
        );

        renderPurchases();

    }

});


cancelPurchase.addEventListener("click", resetPurchaseForm);


function resetPurchaseForm() {

    purchaseForm.reset();
    purchaseId.value = "";

}


/* =========================
   PAYMENT MODULE
   ========================= */

const paymentView = document.getElementById("payment-view");
const paymentMenu = document.getElementById("payment-menu");
const paymentModule = document.getElementById("payment-module");
const backDashboardPayment = document.getElementById("back-dashboard-payment");

const paymentForm = document.getElementById("payment-form");
const paymentTableBody = document.getElementById("payment-table-body");
const paymentSearch = document.getElementById("payment-search");

const paymentId = document.getElementById("payment-id");
const paymentCode = document.getElementById("payment-code");
const paymentType = document.getElementById("payment-type");
const paymentTotal = document.getElementById("payment-total");
const paymentDate = document.getElementById("payment-date");

const cancelPayment = document.getElementById("cancel-payment");


let paymentData = [
    {
        id: 1,
        code: "PAY-001",
        type: "Cash",
        total: 850000,
        date: "2025-01-05"
    },
    {
        id: 2,
        code: "PAY-002",
        type: "Transfer",
        total: 1450000,
        date: "2025-01-08"
    }
];


function openPayments() {

    dashboardView.style.display = "none";
    inventoryView.classList.remove("active");
    employeeView.classList.remove("active");
    purchaseView.classList.remove("active");

    paymentView.classList.add("active");

    renderPayments();
}


function closePayments() {

    paymentView.classList.remove("active");
    dashboardView.style.display = "";

    paymentMenu.classList.remove("active");

    resetPaymentForm();
}


paymentMenu.addEventListener("click", openPayments);
paymentModule.addEventListener("click", openPayments);
backDashboardPayment.addEventListener("click", closePayments);


function renderPayments() {

    const keyword = paymentSearch.value.toLowerCase().trim();

    const filtered = paymentData.filter(item =>
        item.code.toLowerCase().includes(keyword) ||
        item.type.toLowerCase().includes(keyword) ||
        item.date.includes(keyword)
    );

    paymentTableBody.innerHTML = "";

    filtered.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(item.code)}</td>
            <td>${escapeHtml(item.type)}</td>
            <td>Rp ${formatNumber(item.total)}</td>
            <td>${escapeHtml(item.date)}</td>
            <td>
                <button
                    class="table-action"
                    data-payment-action="edit"
                    data-id="${item.id}"
                >
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>

                <button
                    class="table-action delete"
                    data-payment-action="delete"
                    data-id="${item.id}"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </td>
        `;

        paymentTableBody.appendChild(row);

    });
}


paymentSearch.addEventListener("input", renderPayments);


paymentForm.addEventListener("submit", event => {

    event.preventDefault();

    const id = Number(paymentId.value);

    const payment = {
        id: id || Date.now(),
        code: paymentCode.value.trim(),
        type: paymentType.value,
        total: Number(paymentTotal.value),
        date: paymentDate.value
    };

    if (id) {

        const index = paymentData.findIndex(item => item.id === id);

        if (index !== -1) {
            paymentData[index] = payment;
        }

    } else {

        paymentData.push(payment);

    }

    resetPaymentForm();
    renderPayments();

});


paymentTableBody.addEventListener("click", event => {

    const button = event.target.closest("[data-payment-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.paymentAction;

    const payment = paymentData.find(item => item.id === id);

    if (!payment) return;

    if (action === "edit") {

        paymentId.value = payment.id;
        paymentCode.value = payment.code;
        paymentType.value = payment.type;
        paymentTotal.value = payment.total;
        paymentDate.value = payment.date;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    if (action === "delete") {

        const confirmed = confirm(
            `Delete "${payment.code}" from this demo?`
        );

        if (!confirmed) return;

        paymentData = paymentData.filter(
            item => item.id !== id
        );

        renderPayments();

    }

});


cancelPayment.addEventListener("click", resetPaymentForm);


function resetPaymentForm() {

    paymentForm.reset();
    paymentId.value = "";

}

/* =========================
   REPORT MODULE
   ========================= */

const reportView = document.getElementById("report-view");
const reportMenu = document.getElementById("report-menu");
const reportModule = document.getElementById("report-module");
const backDashboardReport = document.getElementById("back-dashboard-report");

const reportType = document.getElementById("report-type");
const reportPeriod = document.getElementById("report-period");

const viewReportButton = document.getElementById("view-report");
const printReportButton = document.getElementById("print-report");

const reportPreview = document.getElementById("report-preview");
const reportTitle = document.getElementById("report-title");
const reportPeriodLabel = document.getElementById("report-period-label");

const reportTableHead = document.getElementById("report-table-head");
const reportTableBody = document.getElementById("report-table-body");


function openReports() {

    dashboardView.style.display = "none";

    inventoryView.classList.remove("active");
    employeeView.classList.remove("active");
    purchaseView.classList.remove("active");
    paymentView.classList.remove("active");

    reportView.classList.add("active");

    reportMenu.classList.add("active");

}


function closeReports() {

    reportView.classList.remove("active");

    dashboardView.style.display = "";

    reportMenu.classList.remove("active");

}


reportMenu.addEventListener("click", openReports);
reportModule.addEventListener("click", openReports);
backDashboardReport.addEventListener("click", closeReports);


/* =========================
   GENERATE REPORT
   ========================= */

viewReportButton.addEventListener("click", generateReport);


function generateReport() {

    const type = reportType.value;
    const period = reportPeriod.value;

    reportPreview.classList.add("show");

    const titles = {
        barang: "Laporan Barang",
        karyawan: "Laporan Karyawan",
        pembelian: "Laporan Pembelian",
        pembayaran: "Laporan Pembayaran"
    };

    const periods = {
        all: "All Data",
        month: "Current Month",
        year: "Current Year"
    };

    reportTitle.textContent = titles[type];
    reportPeriodLabel.textContent = periods[period];


    if (type === "barang") {

        reportTableHead.innerHTML = `
            <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Stock</th>
                <th>Price</th>
            </tr>
        `;

        reportTableBody.innerHTML = inventoryData.rem
            .concat(inventoryData.velg, inventoryData.shock)
            .map(item => `
                <tr>
                    <td>${escapeHtml(item.code)}</td>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${escapeHtml(item.brand)}</td>
                    <td>${item.stock}</td>
                    <td>Rp ${formatNumber(item.price)}</td>
                </tr>
            `)
            .join("");

    }


    if (type === "karyawan") {

        reportTableHead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Email</th>
            </tr>
        `;

        reportTableBody.innerHTML = employeeData
            .map(employee => `
                <tr>
                    <td>${escapeHtml(employee.code)}</td>
                    <td>${escapeHtml(employee.name)}</td>
                    <td>${escapeHtml(employee.position)}</td>
                    <td>${escapeHtml(employee.email)}</td>
                </tr>
            `)
            .join("");

    }


    if (type === "pembelian") {

        reportTableHead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Payment Type</th>
                <th>Installation</th>
                <th>Notes</th>
            </tr>
        `;

        reportTableBody.innerHTML = purchaseData
            .map(item => `
                <tr>
                    <td>${escapeHtml(item.code)}</td>
                    <td>${escapeHtml(item.type)}</td>
                    <td>${escapeHtml(item.service)}</td>
                    <td>${escapeHtml(item.note)}</td>
                </tr>
            `)
            .join("");

    }


    if (type === "pembayaran") {

        reportTableHead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Payment Type</th>
                <th>Total</th>
                <th>Date</th>
            </tr>
        `;

        reportTableBody.innerHTML = paymentData
            .map(item => `
                <tr>
                    <td>${escapeHtml(item.code)}</td>
                    <td>${escapeHtml(item.type)}</td>
                    <td>Rp ${formatNumber(item.total)}</td>
                    <td>${escapeHtml(item.date)}</td>
                </tr>
            `)
            .join("");

    }

}


/* =========================
   PRINT
   ========================= */

printReportButton.addEventListener("click", () => {

    if (!reportPreview.classList.contains("show")) {
        generateReport();
    }

    setTimeout(() => {
        window.print();
    }, 100);

});