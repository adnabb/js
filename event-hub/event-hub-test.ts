import EventHub from './event-hub';

const test1 = (message:string) => {
  console.assert(EventHub instanceof Object, message);
  console.log(message);
}

const test2 = (message:string) => {
  const eventHub = new EventHub();
  let called = false;
  eventHub.on('楚天都市报', () => { called = true; });
  eventHub.emit('楚天都市报');
  console.assert(called, message);
  console.log(message);
}

const test3 = (message:string) => {
  const eventHub = new EventHub();
  let called = false;
  const calledEvent = () => { called = true; };
  eventHub.on('楚天都市报', calledEvent);
  eventHub.off('楚天都市报', calledEvent)
  eventHub.emit('楚天都市报');
  console.assert(!called, message);
  console.log(message);
}

test1('EventHub存在，且是一个对象');
test2('订阅和发布功能测试');
test3('发布后取消发布测试');