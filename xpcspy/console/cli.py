from frida_tools.application import ConsoleApplication
from frida_tools.tracer import UI, OutputFile

from ..utils.agent import Agent
from ..lib.types import Filter


class XPCSpyApplication(ConsoleApplication, UI):
    def _usage(self):
        return "usage: %prog [options] target"

    def _needs_target(self):
        return True

    def _add_options(self, parser):
        parser.add_option('-t', '--filter', 
                        help="Filter by message direction and service name. 'i' denotes incoming and 'o' denotes outgoing. Service name can include the wildcard character '*'. For exmaple 'i:com.apple.*' or 'o:com.apple.apsd'.",
                        metavar='FILTER', type='string')
        parser.add_option('-r', '--parse',
                        help="Parse XPC dictionary keys that include either `bplist00` or `bplist16` data.",
                        metavar='SHOULD_PARSE', action='store_true') 
        # parser.add_option('-o', '--output', help="dump output to file OUTPUT", metavar='OUTPUT', type='string')
        parser.add_option('-d', '--print-date',
                        help='Print a current timestamp before every XPC message', 
                        action='store_true', default=False)

    def _initialize(self, parser, options, args):
        if options.filter:
            filter = Filter.from_str(options.filter)
            if filter is None:
                self._update_status("Error: invalid filter string")
                self._exit(1)
            self._filter = filter
        else:
            self._filter = Filter.default()
        self._should_parse = options.parse or False
        self._print_timestamp = options.print_date or False 

    def _start(self):
        agent = Agent(self._filter, self._should_parse, self._session, self._reactor, self._print_timestamp)
        agent.start_hooking(self)


def main():
    app = XPCSpyApplication()
    app.run()
