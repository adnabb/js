class EventHub {
  cache = {};
  on(eventName: string, fn: unknown) {
    this.cache[eventName] = this.cache[eventName] || [];
    
    this.cache[eventName].push(fn);
  };
  emit(eventName: string) {
    if (!this.cache[eventName]) return;

    this.cache[eventName].forEach(fn => fn());
  };
  off(eventName: string, fn: unknown) {
    const currentEventList = this.cache[eventName];
    if (!currentEventList) return;

    let index: number;
    for (let i = 0; i < currentEventList.length; i++) {
      const content = currentEventList[i];
      
      if (content === fn) {
        index = i;
        break;
      }
    }

    currentEventList.splice(index, 1);
  };
}

export default EventHub;
