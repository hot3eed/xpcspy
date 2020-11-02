import sys
from platform import platform

import click
from frida import get_local_device, get_usb_device, InvalidArgumentError

from utils.agent import Agent


@click.command()
@click.argument('target', required=False)
@click.option('-U', '--usb', 'use_usb', is_flag=True)
@click.option('-p', '--attach-pid', 'pid')
def main(target, use_usb, pid):
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
