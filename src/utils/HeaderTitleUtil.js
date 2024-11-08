export const setTitleFunc = (path, states) => {
  return path === "/admin/dashboard"
    ? "Dashboard"
    : path === "/admin/users"
    ? "Users"
    : path === "/admin/employees"
    ? "Employees"
    : path === "/admin/transactions"
    ? "Transactions"
    : path === "/admin/transactions"
    ? "Transactions"
    : path === "/admin/cred-req"
    ? "Credit Requests"
    : path === "/admin/accounts"
    ? "Accounts"
    : path === "/admin/banks"
    ? "Banks"
    : path === "/admin/messages"
    ? "Messages"
    : path === "/admin/my-profile"
    ? "My Profile"
    : path === "/admin/accountStatement"
    ? "Account Statement " + states.acc_name + " (" + states.mobile + ")"
    : path === "/customer/khata-statement"
    ? "Khata Statement " + states.name + " (" + states.id + ")"
    : path === "/admin/bankStatement"
    ? states.bank_name + " Bank Statement"
    : path === "/admin/operators"
    ? "Operators"
    : path === "/admin/notification"
    ? "Notifications"
    : path === "/admin/prabhu-transactions"
    ? "Prabhu Transactions"
    : path === "/admin/prabhu-customers"
    ? "Prabhu Customers"
    : path === "/admin/routes"
    ? "Routes"
    : path === "/admin/plans"
    ? "Plans"
    : path === "/admin/complaints"
    ? "Complaints"
    : path === "/admin/risk"
    ? "Risk"
    : path === "/admin/pg-orders"
    ? "PG Orders"
    : path === "/admin/employees"
    ? "Employees"
    : path === "/admin/virtual-accounts"
    ? "Virtual Accounts"
    : path === "/asm/dashboard"
    ? "Dashboard"
    : path === "/zsm/dashboard"
    ? "Dashboard"
    : path === "/asm/users"
    ? "Users"
    : path === "/zsm/users"
    ? "Users"
    : path === "/asm/transactions"
    ? "Transactions"
    : path === "/zsm/transactions"
    ? "Transactions"
    : path === "/asm/cred-req"
    ? "Credit Requests"
    : path === "/zsm/cred-req"
    ? "Credit Requests"
    : path === "/asm/my-profile"
    ? "My Profile"
    : path === "/zsm/my-profile"
    ? "My Profile"
    : path === "/ad/dashboard"
    ? "Dashboard"
    : path === "/md/dashboard"
    ? "Dashboard"
    : path === "/ad/users"
    ? "Users"
    : path === "/md/users"
    ? "Users"
    : path === "/ad/cred-req"
    ? "Credit Requests"
    : path === "/md/cred-req"
    ? "Credit Requests"
    : path === "/ad/transactions"
    ? "Transactions"
    : path === "/md/transactions"
    ? "Transactions"
    : path === "/ad/sale"
    ? "My Sale"
    : path === "/md/sale"
    ? "My Sale"
    : path === "/ad/purchase"
    ? "My Purchase"
    : path === "/md/purchase"
    ? "My Purchase"
    : path === "/ad/ledger"
    ? "My Ledger"
    : path === "/md/ledger"
    ? "My Ledger"
    : path === "/md/ledger"
    ? "My Ledger"
    : path === "/ad/my-profile"
    ? "My Ledger"
    : path === "/md/my-profile"
    ? "My Profile"
    : path === "/ad/khata-book"
    ? "Khata Book"
    : path === "/md/khata-book"
    ? "Khata Book"
    : path === "/customer/dashboard"
    ? "Dashboard"
    : path === "/customer/recharge"
    ? "Recharge/Bill Payments"
    : path === "/customer/cred-req"
    ? "Credit Requests"
    : path === "/customer/transactions"
    ? "Transactions"
    : path === "/customer/account-ledger"
    ? "Account Ledger"
    : path === "/customer/sale"
    ? "Sales"
    : path === "/customer/purchase"
    ? "Purchase"
    : path === "/customer/money-transfer"
    ? "Money Transfer"
    : path === "/customer/express-transfer"
    ? "Express Transfer"
    : path === "/customer/super-transfer"
    ? "Super Transfer"
    : path === "/customer/settlements"
    ? "Settlements"
    : path === "/customer/nepal-transfer"
    ? "Nepal Transfer"
    : path === "/customer/upi-transfer"
    ? "UPI Transfer"
    : path === "/customer/bbps"
    ? "BBPS Services"
    : path === "/customer/aeps"
    ? "AEPS Services"
    : path === "/customer/wallet-transfer"
    ? "Wallet Transfer"
    : path === "/customer/complaints"
    ? "My Complaints"
    : path === "/customer/cms"
    ? "Cash Management System"
    : path === "/customer/khata-book"
    ? "Khata Book"
    : path === "/customer/my-profile"
    ? "My Profile"
    : path === "/customer/services"
    ? "Services"
    : path === "/api-user/dashboard"
    ? "Dashboard"
    : path === "/api-user/transactions"
    ? "Transaction"
    : path === "/api-user/cred-req"
    ? "Credit Request"
    : path === "/customer/travel"
    ? "Travel Booking"
    : path === "/api-user/my-profile"
    ? "My Profile"
    : "";
};
