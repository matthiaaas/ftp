const path = window.require("path")
const process = window.require("process");

export function toAccurateFileSize(size) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let unit = 0;

  while (size >= 1000) {
    size *= 0.001;
    unit += 1;
  }

  return {unit: units[unit], size: size}
}

export function getExactFileType(file) {
  let extension = path.extname(file).substr(1);

  let imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "svg"];
  let videoExtensions = ["mp4", "mov", "avi", "flv"];
  let soundExtensions = ["mp3", "aac", "m4a", "wav"];
  let scriptExtensions = ["sh", "bash", "bat", "exe", "app", "js", "py", "cpp", "c", "java", "rb", "pl"];
  let textExtensions = ["txt", "md", "html", "htm", "rtf", "doc", "docx", "pages", "odt", "apt", "rtx", "man"];

  let extensions = {
    "img": imageExtensions,
    "vid": videoExtensions,
    "snd": soundExtensions,
    "scr": scriptExtensions,
    "txt": textExtensions
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

export function getPlatformStartCmd() {
  switch (process.platform) { 
     case "darwin": return "open";
     case "win32": return "start";
     case "win64": return "start";
     default: return "xdg-open";
  }
}
