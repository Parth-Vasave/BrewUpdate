import os
import sys
import webview
import traceback
from .api import Api

def get_entrypoint():
    """Determine the GUI entry point path."""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, 'ui', 'index.html')
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, 'ui', 'index.html')

def run():
    try:
        api = Api()
        html_path = get_entrypoint()
        
        if not os.path.exists(html_path):
            raise FileNotFoundError(f"GUI file not found: {html_path}")

        url = f"file://{os.path.abspath(html_path)}"
        
        window = webview.create_window(
            title='BrewUpdate', 
            url=url, 
            js_api=api,
            width=1000, 
            height=700,
            background_color='#121212'
        )
        
        from webview.menu import Menu, MenuAction, MenuSeparator
        
        menu = [
            Menu(
                'BrewUpdate',
                [
                    MenuAction('About BrewUpdate', lambda: window.evaluate_js('alert("BrewUpdate v1.0.0\\n\\nA modern Homebrew GUI.")')),
                    MenuSeparator(),
                    MenuAction('Check for Updates', lambda: window.evaluate_js('loadDashboard()')),
                    MenuSeparator(),
                    MenuAction('Quit BrewUpdate', lambda: sys.exit(0))
                ]
            ),
            Menu(
                'Edit',
                [
                    MenuAction('Undo', lambda: window.evaluate_js('document.execCommand("undo")')),
                    MenuAction('Redo', lambda: window.evaluate_js('document.execCommand("redo")')),
                    MenuSeparator(),
                    MenuAction('Cut', lambda: window.evaluate_js('document.execCommand("cut")')),
                    MenuAction('Copy', lambda: window.evaluate_js('document.execCommand("copy")')),
                    MenuAction('Paste', lambda: window.evaluate_js('document.execCommand("paste")')),
                    MenuAction('Select All', lambda: window.evaluate_js('document.execCommand("selectAll")')),
                ]
            ),
            Menu(
                'View',
                [
                    MenuAction('Toggle Fullscreen', window.toggle_fullscreen),
                    MenuAction('Reload', lambda: window.load_url(url))
                ]
            )
        ]
        
        webview.start(menu=menu, debug=False)
        
    except Exception as e:
        try:
            desktop = os.path.join(os.path.expanduser("~"), "Desktop")
            log_path = os.path.join(desktop, "brewupdate_crash.log")
            with open(log_path, "w") as f:
                f.write(f"Error: {str(e)}\n\n")
                f.write(traceback.format_exc())
        except Exception:
            pass
            
        sys.exit(1)

if __name__ == '__main__':
    run()
