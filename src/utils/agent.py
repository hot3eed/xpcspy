from pathlib import Path
from collections import OrderedDict

from frida import get_local_device
import frida
import click


_pending_events = OrderedDict()


class Event:
    def __init__(self, symbol):
        self.symbol = symbol
        self.data = None


class Agent:
    _pening_events = OrderedDict()  # This will be a map of stacks, each stack holding events for that particular timestamp

    def __init__(self, process):
        _pending_events = OrderedDict()
        self.device = get_local_device()
        self._script_path = Path.joinpath(Path().absolute(), 'agent/interceptor.js') 
        with open(self._script_path) as src_f:
            self._script_src = src_f.read()
        session = frida.attach(process)  # `process` is str or int depending on whether it's a name or pid
        script = session.create_script(self._script_src)
        script.on('message', Agent.on_message)
        script.load()
       


    @staticmethod
    def on_message(message, data):
        timestamp = message['payload']['message']['timestamp']

        if message['payload']['type'] == 'agent:trace:symbol':
            symbol = message['payload']['message']['symbol']
            if timestamp in _pending_events:
                _pending_events[timestamp].append(Event(symbol)) 
                #print(f"Update {timestamp}")
            else:
                _pending_events.update({ timestamp: [Event(symbol)] })
                #print(f"Add {timestamp}")

        elif message['payload']['type'] == 'agent:trace:data':
            data = message['payload']['message']['data']
            _pending_events[timestamp][-1].data = data
        
        # Pop pending events that are "ready", or have received both its symbol and data
        for ts, events_stack in list(_pending_events.items()):
            while len(events_stack) > 0:
                last_event = events_stack[-1]  # Peek
                if last_event.data == None:
                    return
                #print(f"Pop {ts} {last_event}")
                print(ts, last_event.symbol, last_event.data)
                events_stack.pop()
            del _pending_events[ts]

