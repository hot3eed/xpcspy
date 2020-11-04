from enum import IntEnum


__all__ = ['Filter', 'Event']


class FilterType(IntEnum):
    INCOMING = 1 << 0
    OUTGOING = 1 << 1
    ALL = INCOMING | OUTGOING

    @staticmethod
    def from_str(filter_type):
        if filter_type == 'i':
            return FilterType.INCOMING
        elif filter_type == 'o':
            return FilterType.OUTGOING
        else:
            return None


class Filter(dict):
    def __init__(self, filter_type: FilterType, connection_name_pattern: str):
        dict.__init__(self, type=filter_type, connectionNamePattern=connection_name_pattern)

    @staticmethod
    def from_str(filter_str):
        """
        Parse the filter string.

        @return Filter object if successful, None otherwise.
        """
        filter = filter_str.split(':')
        if len(filter) not in range(1, 3):  # 1 or 2 filter arguments
            return None
        filter_type = filter[0]
        if filter_type != 'i' and filter_type != 'o':
            return None

        connection_name_pattern = filter[1] if len(filter) > 1 else '*'       
        
        return Filter(FilterType.from_str(filter_type), connection_name_pattern)

    @staticmethod
    def default():
        return Filter(FilterType.ALL, '*')
    

class Event:
    def __init__(self, symbol):
        self.symbol = symbol
        self.data = None
