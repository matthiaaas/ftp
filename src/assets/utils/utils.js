export function toAccurateFileSize(size) {
  const units = ["B", "KB", "MB", "GB"];
  let unit = 0;

  while (size >= 1000) {
    size *= 0.001;
    unit += 1;
  }

  return {unit: units[unit], size: size}
}
