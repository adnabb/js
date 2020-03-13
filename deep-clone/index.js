let cache = [];

function deepClone(source) {
  if (!(source instanceof Object)) { return source; }
  
  if (source instanceof Date) {
    return new Date(source);
  } else if (source instanceof RegExp) {
    return new RegExp(source.source, source.flags);
  } else if (source instanceof Function) {
    return function() { return source.call(this, ...arguments) };
  } else {
      const findItem = findSourceInCache(source);
      if (findItem) return findItem;
      
      let dist;
      dist = Array.isArray(source) ? new Array() : new Object();
      cache.push([source, dist]);

      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          const value = source[key];
          dist[key] = deepClone(value);
        }
      }
      return dist;
  }
}

function findSourceInCache(source) {
  for (let i = 0; i < cache.length; i++) {
    if (source === cache[i][0]) return cache[i][1];
  }

  return null;
}

module.exports = deepClone;
