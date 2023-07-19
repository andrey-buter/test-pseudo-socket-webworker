/// <reference lib="webworker" />

import { WebWorkerMessage, WebWorkerMessageId } from '../app.models';
import { PseudoSocket } from '../socket/pseudo-socket';

const socket = new PseudoSocket();
socket.connect();
socket.getData$().subscribe(data => {
  postMessage(data);
})

addEventListener('message', ({ data }) => {
  const message: WebWorkerMessage = data;

  switch (message.id) {
    case WebWorkerMessageId.setConfig:
      socket.setConfig(message.value);
      break;

    case WebWorkerMessageId.terminate:
      socket.disconnect();
      break;
  }
});
