from os import path
from collections import OrderedDict

import frida

from ..lib.types import Event


_pending_events = OrderedDict()  # A map of stacks, each stack holding events for that particular timestamp


class Agent:
    def __init__(self, filter, should_parse, session, reactor):
        """
        Initialize the Frida agent
        """
        self._filter = filter
        self._should_parse = should_parse
        self._script_path = path.join(path.abspath(path.dirname(__file__)), '../../_agent.js')
        with open(self._script_path) as src_f:
            script_src = src_f.read()
        self._script = session.create_script(script_src)
        self._reactor = reactor
        self._agent = None

    def start_hooking(self, ui):
        def on_message(message, data):
            self._reactor.schedule(lambda: self._on_message(message, data, ui))

        self._script.on('message', on_message)
        self._script.load()
        self._agent = self._script.exports
        self._agent.install_hooks(self._filter, self._should_parse)

    def _on_message(self, message, data, ui):
        if message['type'] == 'error':
            click.secho(message['stack'], fg='red');
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

        Agent.flush_pending_events()


    @staticmethod
    def flush_pending_events():
        """Flush pending events that are ready, i.e. have received both its symbol and data"""
        for ts, events_stack in list(_pending_events.items()):
            while len(events_stack) > 0:
                last_event = events_stack[-1]  # Peek
                if last_event.data == None:
                    return
                #print(f"Pop {ts}")
                print('\n' + '-' * 60)
                print(f"{last_event.symbol}\n{last_event.data['conn']}\n{last_event.data['message']}")
                print('-' * 60 + '\n')
                events_stack.pop()
            del _pending_events[ts]
