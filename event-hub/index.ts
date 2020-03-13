class EventHub {
  private cache: { [key: string]: Array<(data?: unknown) => void> } = {};
  on(eventName: string, fn: (data?: unknown) => void) {
    this.cache[eventName] = this.cache[eventName] || [];
    
    this.cache[eventName].push(fn);
  };
  emit(eventName: string) {
    (this.cache[eventName] || []).forEach(fn => fn());
  };
  off(eventName: string, fn: (data?: unknown) => void) {
    const currentEventList = this.cache[eventName];
    const index = indexOf(currentEventList, fn);

    if (index === -1) return;

    currentEventList.splice(index, 1);
  };
}

function indexOf(array: Array<any>, item: any) {
  let index = -1;
  if (!array) return index;

  for (let i = 0; i < array.length; i++) {
    if (array[i] === item) { index = i; break; }
  }

  return index;
}

export default EventHub;
