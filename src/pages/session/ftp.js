export default class FTP {
  constructor(ftp) {
    this.ftp = ftp;
  }

  updateExternFiles = (path, callback) => {
    this.ftp.ls(path, (err, data) => {
      if (err) alert(err);
      else callback(data);
    })
  }
}
