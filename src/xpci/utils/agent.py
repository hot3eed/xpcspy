from pathlib import Path
from collections import OrderedDict

from frida import get_local_device
import frida
import click


_pending_events = OrderedDict()

class Agent:
    def __init__(self, process):
        self.device = get_local_device()
        self._script_path = Path.joinpath(Path().absolute(), 'xpci/agent/interceptor.js') 
        with open(self._script_path) as src_f:
            self._script_src = src_f.read()
        session = frida.attach(process)  # `process` is str or int depending on whether it's a name or pid
        script = session.create_script(self._script_src)
        script.on('message', Agent.on_message)
        script.load()
       

    @staticmethod
    def on_message(message, d):
        timestamp = message['payload']['message']['timestamp']
        if message['payload']['type'] == 'agent:trace:symbol':
            symbol = message['payload']['message']['symbol']
            _pending_events.update({ timestamp: [symbol] })
        elif message['payload']['type'] == 'agent:trace:data':
            data = message['payload']['message']['data']
            _pending_events[timestamp].append(data)
        
        for ts, data in _pending_events.items():
            if len(data) < 2:
                break
            print(ts, data)
            del _pending_events[ts]

