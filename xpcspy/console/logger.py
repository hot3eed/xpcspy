import sys

import click


def exit_with_error(err_str):
    """Log fatal error and exit"""
    click.secho(f"ERROR: {err_str}", fg='red')
    sys.exit()
