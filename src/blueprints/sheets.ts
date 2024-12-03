import { Flatfile } from "@flatfile/api";

export const bankAccounts: Flatfile.SheetConfig = {
  name: "Bank Accounts",
  slug: "bankAccounts",
  fields: [
    {
      key: "id",
      type: "number",
      label: "ID",
    },
    {
      key: "bankName",
      type: "string",
      label: "Bank Name",
      constraints: [
        {
          type: "required",
        },
      ],
    },
    {
      key: "displayName",
      type: "string",
      label: "Display Name",
      constraints: [
        {
          type: "required",
        },
        {
          type: "unique",
        },
      ],
    },
    {
      key: "accountName",
      type: "string",
      label: "Account Name",
    },
    {
      key: "sortCode",
      type: "string",
      label: "Sort Code",
    },
    {
      key: "accountNumber",
      type: "string",
      label: "Account Number",
    },
    {
      key: "iban",
      type: "string",
      label: "IBAN",
    },
    {
      key: "bic",
      type: "string",
      label: "BIC",
    },
    {
      key: "unmatchedEntriesAmount",
      type: "number",
      label: "Unmatched Entries Amount",
    },
    {
      key: "unreconciledCrunchPaymentsAmount",
      type: "number",
      label: "Unreconciled Crunch Payments Amount",
    },
    {
      key: "sortCodeAndAccountNumberEditable",
      type: "boolean",
      label: "Sort Code And Account Number Editable",
    },
    {
      key: "deletable",
      type: "boolean",
      label: "Deletable",
    },
    {
      key: "personal",
      type: "boolean",
      label: "Personal",
    },
    {
      key: "doesLastReconciledStatementEntryFallIntoClosedFinancialYear",
      type: "boolean",
      label:
        "Does Last Reconciled Statement Entry Fall Into Closed Financial Year",
    },
    {
      key: "archived",
      type: "boolean",
      label: "Archived",
    },
    {
      key: "canBeArchived",
      type: "boolean",
      label: "Can Be Archived",
    },
    {
      key: "default",
      type: "boolean",
      label: "Default",
    },
  ],
};

export const customers: Flatfile.SheetConfig = {
  name: "Customers",
  slug: "customers",
  fields: [
    {
      key: "id",
      type: "number",
      label: "ID",
    },
    {
      key: "name",
      type: "string",
      label: "Name",
    },
    {
      key: "email",
      type: "string",
      label: "Email",
    },
    {
      key: "paymentTermsDays",
      type: "number",
      label: "Payment Terms Days",
    },
    {
      key: "billingAddressLine1",
      type: "string",
      label: "Billing Address Line 1",
    },
    {
      key: "billingAddressLine2",
      type: "string",
      label: "Billing Address Line 2",
    },
    {
      key: "billingAddressLine3",
      type: "string",
      label: "Billing Address Line 3",
    },
    {
      key: "billingAddressLine4",
      type: "string",
      label: "Billing Address Line 4",
    },
    {
      key: "postCode",
      type: "string",
      label: "Post Code",
    },
    {
      key: "country",
      type: "string",
      label: "Country",
    },
    {
      key: "noteId",
      type: "number",
      label: "Note ID",
    },
    {
      key: "noteText",
      type: "string",
      label: "Note Text",
    },
  ],
};

export const invoices: Flatfile.SheetConfig = {
  name: "Invoices",
  slug: "invoices",
  fields: [
    {
      key: "id",
      type: "number",
      label: "ID",
    },
    {
      key: "customerId",
      type: "string",
      label: "Customer ID",
    },
    {
      key: "customerName",
      type: "reference",
      label: "Customer Name",
      config: {
        ref: "customers",
        key: "name",
        relationship: "has-one",
      },
    },
    {
      key: "customerEmail",
      type: "string",
      label: "Customer Email",
    },
    {
      key: "issuedDate",
      type: "date",
      label: "Issued Date",
    },
    {
      key: "dueDate",
      type: "date",
      label: "Due Date",
    },
    {
      key: "currency",
      type: "string",
      label: "Currency",
    },
    {
      key: "recurring",
      type: "boolean",
      label: "Recurring",
    },
    {
      key: "reference",
      type: "string",
      label: "Reference",
    },
    {
      key: "lineItemType",
      type: "enum",
      label: "Line Item Type",

      config: {
        options: [
          {
            label: "Simple",
            value: "SIMPLE",
          },
          {
            label: "Detailed",
            value: "DETAILED",
          },
        ],
      },
    },
    {
      key: "netAmount",
      type: "number",
      label: "Net Amount",
    },
    {
      key: "vatAmount",
      type: "number",
      label: "VAT Amount",
    },
    {
      key: "grossAmount",
      type: "number",
      label: "Gross Amount",
    },
    {
      key: "status",
      type: "string",
      label: "Status",
    },
    {
      key: "outstandingBalance",
      type: "number",
      label: "Outstanding Balance",
    },
    {
      key: "paymentTerms",
      type: "string",
      label: "Payment Terms",
    },
    {
      key: "deletable",
      type: "boolean",
      label: "Deletable",
    },
    {
      key: "noteId",
      type: "string",
      label: "Note ID",
    },
    {
      key: "noteText",
      type: "string",
      label: "Note Text",
    },
    {
      key: "purchaseOrder",
      type: "string",
      label: "Purchase Order",
    },
  ],
  actions: [
    {
      operation: "auto-fix",
      mode: "background",
      label: "Autofix",
      primary: true,
    },
  ],
};
