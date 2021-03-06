import fs = require('fs');

/** Walk a directory to find all files inside. */
function walk(dir: string, base?: string): string[] {
  base = base ? base + '/' : '';

  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(function(file) {
    const stat = fs.statSync(dir + '/' + file);
    if (stat && stat.isDirectory()) results = results.concat(walk(dir + '/' + file, base + file));
    else results.push(base + file);
  });

  return results;
}

export default walk;
