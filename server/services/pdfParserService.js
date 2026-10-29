const { PDFParse } = require('pdf-parse');

/**
 * Service to parse text from PDF buffers with security validation
 * and scanned document detection.
 */
class PdfParserService {
  /**
   * Validate buffer header for PDF magic bytes
   * @param {Buffer} buffer
   */
  static validatePdfBuffer(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Invalid input: No file buffer received.');
    }

    if (buffer.length < 10) {
      throw new Error('Corrupted or empty PDF file provided.');
    }

    // Check PDF magic header %PDF-
    const header = buffer.subarray(0, 5).toString('ascii');
    if (header !== '%PDF-') {
      throw new Error('Invalid file format: File does not have a valid PDF header.');
    }
  }

  /**
   * Extract text and metadata from PDF buffer
   * @param {Buffer} buffer
   * @returns {Promise<{ text: string, numPages: number, isScanned: boolean, wordCount: number }>}
   */
  static async extractText(buffer) {
    this.validatePdfBuffer(buffer);

    let parser = null;
    let extractedText = '';
    let totalPages = 1;

    try {
      parser = new PDFParse({ data: buffer });
      await parser.load();
      const result = await parser.getText();
      extractedText = result?.text || '';
      totalPages = result?.total || result?.pages?.length || 1;
    } catch (parseError) {
      throw new Error(`PDF Parsing failed: ${parseError.message || 'Unable to read PDF content.'}`);
    } finally {
      if (parser && typeof parser.destroy === 'function') {
        try {
          await parser.destroy();
        } catch (_) {
          // ignore cleanup errors
        }
      }
    }

    // Clean whitespace and normalize newlines
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove unprintable control chars
      .trim();

    // Check for scanned / image-only PDFs
    const alphanumericCount = (cleanedText.match(/[a-zA-Z0-9]/g) || []).length;
    const isScanned = alphanumericCount < 60;

    const words = cleanedText.split(/\s+/).filter(Boolean);

    return {
      text: cleanedText,
      numPages: totalPages,
      isScanned,
      wordCount: words.length,
      alphanumericCount,
    };
  }
}

module.exports = PdfParserService;
