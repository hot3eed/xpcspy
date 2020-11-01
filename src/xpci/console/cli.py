import sys

import click

from ..utils.agent import Agent


@click.command()
@click.argument('process')
def main(process):
    """The main XPC-intercepting command"""
    Agent(process) 
    sys.stdin.read()

