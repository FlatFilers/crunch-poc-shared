import api from "@flatfile/api";
import { jobHandler } from "@flatfile/plugin-job-handler";
import { Simplified } from "@flatfile/util-common";
import * as chrono from "chrono-node";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

// Handles job for the "sheet:auto-fix" event
export default jobHandler("sheet:auto-fix", async ({ context }, tick) => {
  const { jobId, sheetId } = context;

  try {
    const updates = [];
    const delete_ids = [];

    const records = await Simplified.getAllRecords(sheetId);

    records.forEach((record) => {
      const newRecord: Record<string, any> = { _id: record._id };
      let updateRecord = false;
      const issuedDate = record.issuedDate as string;
      const dueDate = record.dueDate as string;
      const netAmount = record.netAmount as string;
      const grossAmount = record.grossAmount as string;

      // Normalize the issuedDate field if it exists
      if (issuedDate) {
        const normalizedDate = normalizeDate(issuedDate);
        if (normalizedDate) {
          newRecord["issuedDate"] = normalizedDate;
          updateRecord = true;
        }
      }
            // Normalize the dueDate field if it exists
      if (dueDate) {
        const normalizedDate = normalizeDate(dueDate);
        if (normalizedDate) {
          newRecord["dueDate"] = normalizedDate;
          updateRecord = true;
        }
      }

      // Normalize the netAmount field if it exists
      if (netAmount) {
        const normalizedCost = parseFloat(netAmount).toFixed(2);
        if (normalizedCost) {
          newRecord["netAmount"] = normalizedCost;
          updateRecord = true;
        }
      }
      // Normalize the grossAmount field if it exists
      if (grossAmount) {
        const normalizedCost = parseFloat(grossAmount).toFixed(2);
        if (normalizedCost) {
          newRecord["grossAmount"] = normalizedCost;
          updateRecord = true;
        }
      }
      if (updateRecord) {
        updates.push(newRecord);
      }
    });
    await Simplified.updateAllRecords(sheetId, updates as any);
    if (delete_ids.length > 0) {
      await api.records.delete(sheetId, { ids: delete_ids });
    }
    await api.jobs.complete(jobId, { info: "Completed processing records" });
  } catch (error) {
    await api.jobs.fail(jobId, { info: "Failed processing records" });
  }
});

export interface DateFormatNormalizerConfig {
  sheetSlug?: string;
  dateFields: string[];
  outputFormat: string;
  includeTime: boolean;
  locale?: string;
}

export function normalizeDate(dateString: string): string | null {
  try {
    const parsedDate = chrono.parseDate(dateString);
    if (parsedDate) {
      const formattedDate = format(parsedDate, "yyyy-MM-dd", {
        locale: enUS,
      });

      // If time should not be included, truncate the formatted date to just the date part
      return formattedDate.split(" ")[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
