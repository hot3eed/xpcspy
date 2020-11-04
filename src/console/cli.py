import sys
from platform import platform

import click
from frida import get_local_device, get_usb_device, InvalidArgumentError

from utils.agent import Agent
from . import logger
from lib.types import Filter


@click.command()
@click.argument('target', required=False)
@click.option('-U', '--usb', 'use_usb', is_flag=True)
@click.option('-p', '--attach-pid', 'pid')
@click.option('-f', '--filter-by', 'filter')
def main(target, use_usb, pid, filter):
    """The main XPC-intercepting command"""
    if target:
        pass
    elif pid:
        target = int(pid)
    else:
        ctx = click.get_current_context()
        click.secho(ctx.get_help())
        ctx.exit()
        sys.exit()

    os = None
    device = None
    if use_usb:
        os = 'ios'
        try:
            device = get_usb_device()
        except InvalidArgumentError:
            logger.exit_with_error(f"USB device not found")
            sys.exit()
    else:
        pf = platform()
        if pf.startswith('macOS'):
            os = 'macos'
            device = get_local_device()
        else:
            logger.exit_with_error(f"Unsupported platform: {pf}")
            sys.exit()

    if filter:
        filter = Filter.from_str(filter)
        if filter == None:
            logger.exit_with_error(f"Invalid filter string")
    else:
        filter = Filter.default()

    Agent(target, device, os, filter) 
    sys.stdin.read()
