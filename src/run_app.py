import sys
import os

if not hasattr(sys, '_MEIPASS'):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from brewupdate.main import run

if __name__ == '__main__':
    run()
