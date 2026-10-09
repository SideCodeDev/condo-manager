export type FileMimeType =
  | "application/pdf"
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "image/bmp"
  | "image/webp"
  | "image/svg+xml"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.ms-powerpoint"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  | "text/plain"
  | "text/csv"
  | "application/zip"
  | "application/x-rar-compressed"
  | "application/x-7z-compressed"
  | "application/json"
  | "application/xml"
  | "audio/mpeg"
  | "audio/wav"
  | "audio/ogg"
  | "video/mp4"
  | "video/x-msvideo"
  | "video/x-matroska";

export const MimeTypeDescriptions: Record<FileMimeType, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpeg": "JPEG",
  "image/gif": "GIF",
  "image/bmp": "BMP",
  "image/webp": "WEBP",
  "image/svg+xml": "SVG",
  "application/msword": "Word Document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word Document (DOCX)",
  "application/vnd.ms-excel": "Excel Spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "Excel Spreadsheet (XLSX)",
  "application/vnd.ms-powerpoint": "PowerPoint Presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "PowerPoint Presentation (PPTX)",
  "text/plain": "Text File",
  "text/csv": "CSV File",
  "application/zip": "ZIP Archive",
  "application/x-rar-compressed": "RAR Archive",
  "application/x-7z-compressed": "7z Archive",
  "application/json": "JSON File",
  "application/xml": "XML File",
  "audio/mpeg": "MP3 Audio",
  "audio/wav": "WAV Audio",
  "audio/ogg": "OGG Audio",
  "video/mp4": "MP4 Video",
  "video/x-msvideo": "AVI Video",
  "video/x-matroska": "MKV Video",
};
