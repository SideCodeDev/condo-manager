import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileMimeType } from "./consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(sizeInMb: number): string {
  const MB = 1;
  const GB = 1024;
  const TB = 1024 * 1024;
  const PB = 1024 * 1024 * 1024;

  const stripTrailingZeros = (value: string) =>
    value.replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");

  if (sizeInMb < MB) {
    return `${Math.round(sizeInMb * 1024)}KB`;
  }
  if (sizeInMb < GB) {
    return `${stripTrailingZeros(sizeInMb.toFixed(2))}MB`;
  }
  if (sizeInMb < TB) {
    return `${stripTrailingZeros((sizeInMb / GB).toFixed(2))}GB`;
  }
  if (sizeInMb < PB) {
    return `${stripTrailingZeros((sizeInMb / TB).toFixed(2))}TB`;
  }
  return `${stripTrailingZeros((sizeInMb / PB).toFixed(2))}PB`;
}

export function getValidFiles(
  files: FileList | null,
  validMimes: FileMimeType[] | "*",
  maxSizeInMb: number,
): File[] {
  if (!files?.length) return [];
  let filesArray = Array.from(files);
  if (validMimes !== "*") {
    filesArray = filesArray.filter((file) =>
      validMimes.includes(file.type as FileMimeType),
    );
  }
  if (maxSizeInMb) {
    const maxFileSizeBytes = maxSizeInMb * 1024 * 1024;
    filesArray = filesArray.filter((file) => file.size <= maxFileSizeBytes);
  }
  if (!filesArray.length) return [];
  return filesArray;
}
