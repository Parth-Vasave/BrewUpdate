import sys
import os

# Root entry point for standard execution
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))

from brewupdate.main import run

if __name__ == '__main__':
    run()
