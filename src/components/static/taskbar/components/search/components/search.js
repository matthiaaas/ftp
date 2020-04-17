const path = window.require("path");

export default class Find {
  constructor(term, socket) {
    this.socket = socket || undefined;
    this.term = term;
  }

  resort = (results) => {
    results = results.sort((a, b) => {
      return a.depth - b.depth + a.name.length - b.name.length
    })
    return results;
  }

  find = (type, callback) => {
    console.debug("searching using cmd...");
    const handleResults = (data) => {
      let results = [];
      for (let i = 0; i < data.length; i++) {
        let result = data[i];
        if (result === "" || !(result.startsWith("./") || result.startsWith("/"))) continue;
        let split = result.split("/");
    
        let name = split[split.length - 1];
        let depth = split.length;
        split.pop();
        let path = split.join("/") + "/";
    
        results.push({
          name: name,
          path: path,
          depth: depth
        })
      }
      return results;
    }
    
    this.socket.raw(`find . -iname *${this.term}* -type ${type || "f"} -not -path '*/\.*'`, (err, data) => {
      if (err) alert(err);
      if (data) {
        let results = handleResults(data.text.split("\n"));
        results = this.resort(results);
        callback(results);
      }
    })
  }

  findRecursive = (callback) => {
    console.debug("searching recursive...");
    let maxDepth = 16;
    let depth = 0;
    
    const list = (dir) => {
      return new Promise((resolve, reject) => {
        this.socket.ls(dir, (err, files) => {
          if (err) { return alert(err); }
          let results = [];
          let path = dir !== "/" && dir !== "./" ? dir + "/" : dir;
          files.map(file => {
            results.push({
              name: file.name,
              type: file.type,
              path: path,
              depth: dir.split("/").length - 1
            })
          })
          resolve(results)
        });
      })
    }
    const walk = (dir, callback) => {
      return list(dir).then((files) => {
        callback(files)
        depth++;
        if (files.length === 0) {
          return Promise.resolve();
        }
        return Promise.all(files.map((file) => {
          file.filepath = path.join(dir, file.name);
          let promises = [];
          if (file.type === 1 && !file.name.startsWith(".") && depth <= maxDepth) {
            promises.push(walk(path.join(dir, file.name), callback));
          }
          return Promise.all(promises)
        }))
      });
    }
    const getMatches = (results) => {
      let matches = [];
      results.map(result => {
        if (result.name.toLowerCase().includes(this.term)) {
          matches.push(result)
        }
      })
      return matches;
    }
    walk("/", (results) => {
      if (results) {
        let matches = getMatches(results);
        if (matches.length > 0) {
          callback(matches);
        }
      }
    }).then(() => {
      callback(undefined, true)
    })
  }
}
