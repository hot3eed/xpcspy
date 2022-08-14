from frida_tools.application import ConsoleApplication
from frida_tools.tracer import UI, OutputFile

from ..utils.agent import Agent
from ..lib.types import Filter


class XPCSpyApplication(ConsoleApplication, UI):
    def _usage(self):
        return "%(prog)s [options] target"

    def _needs_target(self):
        return True

    def _add_options(self, parser):
        parser.add_argument('-t', '--filter',
                        help="Filter by message direction and service name. 'i' denotes incoming and 'o' denotes outgoing. Service name can include the wildcard character '*'. For exmaple 'i:com.apple.*' or 'o:com.apple.apsd'.",
                        metavar='FILTER', type=str)
        parser.add_argument('-r', '--parse',
                        help="Parse XPC dictionary keys that include `bplist` data. Currently `bplist00` and `bplist16` are officially supported, while `bplist15` and `bplist17` support is still experimental.",
                        action='store_true')
        # parser.add_argument('-o', '--output', help="dump output to file OUTPUT", metavar='OUTPUT', type=str)
        parser.add_argument('-d', '--print-date',
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
