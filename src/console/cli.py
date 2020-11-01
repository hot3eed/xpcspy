import sys

import click

from utils.agent import Agent


@click.command()
@click.argument('target')
def main(target):
    """The main XPC-intercepting command"""
    Agent(target) 
    sys.stdin.read()

