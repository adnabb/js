class DeepClone {
  cache = [];
  
  clone(source) {
    if (!(source instanceof Object)) { return source; }
    
    if (source instanceof Date) {
      return new Date(source);
    } else if (source instanceof RegExp) {
      return new RegExp(source.source, source.flags);
    } else if (source instanceof Function) {
      return function() { return source.call(this, ...arguments) };
    } else {
        const findItem = this.findSourceInCache(source);
        if (findItem) return findItem;
        
        let dist;
        dist = Array.isArray(source) ? new Array() : new Object();
        this.cache.push([source, dist]);
  
        for (const key in source) {
          if (source.hasOwnProperty(key)) {
            const value = source[key];
            dist[key] = this.clone(value);
          }
        }
        return dist;
    }
  }
  
  findSourceInCache(source) {
    for (let i = 0; i < this.cache.length; i++) {
      if (source === this.cache[i][0]) return this.cache[i][1];
    }
  
    return null;
  }
}


module.exports = DeepClone;
