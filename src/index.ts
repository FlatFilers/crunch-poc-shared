import FlatfileListener, { FlatfileEvent } from "@flatfile/listener";
import { configureSpace } from "@flatfile/plugin-space-configure";
import { jobHandler } from "@flatfile/plugin-job-handler";
import { customers, bankAccounts, invoices } from "./blueprints/sheets";
import autoFix from "./jobs/autoFix";
import { FlatfileRecord, bulkRecordHook } from "@flatfile/plugin-record-hook";
import { automap } from "@flatfile/plugin-automap";

// Main function to configure the Flatfile listener
export default function (listener: FlatfileListener) {
  // Configure the space with workbooks and sheets
  listener.use(
    configureSpace({
      workbooks: [
        {
          name: "Crunch Workbook",
          sheets: [customers, bankAccounts, invoices],
          actions: [
            {
              operation: "submitActionBg",
              mode: "background",
              label: "Submit",
              primary: true,
            },
          ],
        },
      ],
      space: {
        metadata: {
          theme: {
            root: {
              primaryColor: "#ec0052",
              actionColor: "#ec0052",
            },
            sidebar: {
              logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC2KstUFQ381aBgWX8nhIUxVku9N-B_kiFMg&s",
            },
          },
        },
      },
    }),
  );

  // Handle the submit action
  listener.use(
    jobHandler("workbook:submitActionBg", async (event, tick) => {
      // TODO: Add your own submit logic here
      console.log(event);
    }),
  );

  // Automap plugin to automatically map the bankAccounts sheet
  listener.use(
    automap({
      accuracy: "confident",
      defaultTargetSheet: "bankAccounts",
      matchFilename: /bankAccounts.csv$/g,
      onFailure: (event: FlatfileEvent) => {
        // send an SMS, an email, post to an endpoint, etc.
        console.error(
          `Please visit https://spaces.flatfile.com/space/${event.context.spaceId}/files?mode=import to manually import file.`,
        );
      },
    }),
  );

  listener.use(autoFix);

  // Logic to validate and process records in the "invoices" sheet
  listener.use(
    bulkRecordHook("invoices", (records: FlatfileRecord[]) => {
      records.map((record) => {
        const issuedDate = record.get("issuedDate") as string;
        const dueDate = record.get("dueDate") as string;
        const netAmount = record.get("netAmount") as string;
        const grossAmount = record.get("grossAmount") as string;

        const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
        const priceRegex = /^\d{0,8}(\.\d{1,2})?$/;
        // Validate the date format
        if (issuedDate) {
          if (!dateRegex.test(issuedDate)) {
            record.addError("issuedDate", `Dates must be in YYYY-MM-DD format`);
          }
        }
        if (dueDate) {
          if (!dateRegex.test(dueDate)) {
            record.addError("dueDate", `Dates must be in YYYY-MM-DD format`);
          }
        }
        // Validate the price format
        if (netAmount) {
          if (!priceRegex.test(netAmount)) {
            record.addError("netAmount", `Ammount must be in 0.00 format`);
          }
        }
        if (grossAmount) {
          if (!priceRegex.test(grossAmount)) {
            record.addError("grossAmount", `Ammount must be in 0.00 format`);
          }
        }

        const referenceFieldKey = "customerName";
        const links = record.getLinks(referenceFieldKey);
        const lookupIdValue = links?.[0]?.["id"];
        const lookupEmailValue = links?.[0]?.["email"];

        // Vlookup: set customerId and customerEmail based on customerName
        if (lookupIdValue) {
          record.set("customerId", lookupIdValue);
          record.addInfo(
            "customerId",
            `customerId set based on customerName.`
          );
        }

        if (lookupEmailValue) {
          record.set("customerEmail", lookupEmailValue);
          record.addInfo(
            "customerEmail",
            `customerEmail set based on customerName.`
          );
        }

        return record;
      });
    }),
  );

  // Logic to validate and process records in the "customers" sheet  
  listener.use(
    bulkRecordHook("customers", (records: FlatfileRecord[]) => {
      records.map((record) => {
        if (record.get("email")) {
          if (
            !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(
              record.get("email") as string,
            )
          ) {
            record.addError("email", "Invalid email format");
          }
        }
        return record;
      });
    }),
  );
}
