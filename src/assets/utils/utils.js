export function toAccurateFileSize(size) {
  const units = ["B", "KB", "MB", "GB"];
  let unit = 0;

  while (size >= 1000) {
    size *= 0.001;
    unit += 1;
  }

  return {unit: units[unit], size: size}
}

export function getExactFileType(file) {
  let extension = file.toLowerCase().split(".")[file.toLowerCase().split(".").length - 1];

  let imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "svg"];
  let videoExtensions = ["mp4", "mov", "avi", "flv"];
  let soundExtensions = ["mp3", "aac", "m4a", "wav"]

  let extensions = {
    "img": imageExtensions,
    "vid": videoExtensions,
    "snd": soundExtensions
  }

  for (let type in extensions) {
    if (extensions[type].includes(extension)) {
      return type;
    }
  }
}

export function toAccurateDate(timestamp) {
  let time = new Date(timestamp);

  return {
    year: time.getFullYear(),
    month: ("0" + (time.getMonth() + 1)).slice(-2),
    day: ("0" + time.getDate()).slice(-2)
  }
}
