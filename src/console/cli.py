import sys
from platform import platform

import click
from frida import get_local_device, get_usb_device, InvalidArgumentError

from utils.agent import Agent


@click.command()
@click.argument('target')
@click.option('-U', '--usb', 'use_usb', is_flag=True)
def main(target, use_usb):
    """The main XPC-intercepting command"""
    os = None
    device = None
    if use_usb:
        os = 'ios'
        try:
            device = get_usb_device()
        except InvalidArgumentError:
            click.secho("USB device not found", fg='red')
            sys.exit()
    else:
        pf = platform()
        if pf.startswith('macOS'):
            os = 'macos'
            device = get_local_device()
        else:
            click.secho(f"Unsupported platform: {pf}", fg='red')
            sys.exit()

    Agent(target, device, os) 
    sys.stdin.read()
