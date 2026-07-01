const fs = require("node:fs/promises");
const path = require("node:path");
const { PDFParse } = require("pdf-parse");

const getRefundPolicy = async (query) => {
    try {
        const pdfPath = path.resolve(__dirname, "../../docs/Refund Policy.pdf");
        const dataBuffer = await fs.readFile(pdfPath);
        const parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();
        await parser.destroy();
        const text = pdfData.text || "";

        if (!query) {
            return text;
        }

        const normalizedQuery = String(query).toLowerCase();
        const matches = text
            .split("\n")
            .filter((line) => line.toLowerCase().includes(normalizedQuery))
            .slice(0, 20);

        return matches.length
            ? matches.join("\n")
            : "No matching refund policy text found.";
    } catch (error) {
        console.error("Error fetching refund policy:", error);
        throw new Error("Error fetching refund policy");
    }
};

module.exports = {
    getRefundPolicy,
};
