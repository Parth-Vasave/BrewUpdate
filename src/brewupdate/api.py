import os
import platform
import subprocess
import json

class Api:
    def execute_brew(self, args):
        """Execute homebrew commands with environment path resolution."""
        try:
            env = os.environ.copy()
            if platform.machine() == 'arm64':
                paths = ['/opt/homebrew/bin', '/opt/homebrew/sbin', env.get('PATH', '')]
            else:
                paths = ['/usr/local/bin', '/usr/local/sbin', env.get('PATH', '')]
            
            env['PATH'] = ':'.join(filter(None, paths))

            result = subprocess.run(
                ['brew'] + args, 
                capture_output=True, 
                text=True, 
                env=env
            )
            
            if result.returncode != 0 and args[0] not in ['outdated', 'doctor', 'search']:
                raise Exception(result.stderr.strip() or f"Command failed with exit code {result.returncode}")
                
            outp = result.stdout.strip() or result.stderr.strip()
            lines = [line for line in outp.split('\n') if not line.startswith('✔︎ JSON API') and line.strip()]
            return '\n'.join(lines)
            
        except FileNotFoundError:
            raise Exception("Homebrew (brew) executable not found. Ensure Homebrew is installed.")
        except Exception as e:
            raise Exception(str(e))

    def list_installed(self):
        """Fetch detailed info for all installed formulae and casks."""
        raw_json = self.execute_brew(['info', '--installed', '--json=v2'])
        try:
            data = json.loads(raw_json)
            installed = []
            
            for f in data.get('formulae', []):
                installed.append({
                    'name': f.get('name'),
                    'desc': f.get('desc', 'No description available.')
                })
            
            for c in data.get('casks', []):
                installed.append({
                    'name': c.get('token'),
                    'desc': c.get('desc', 'No description available.')
                })
                
            installed.sort(key=lambda x: x['name'].lower())
            return json.dumps(installed)
        except Exception:
            outp = self.execute_brew(['list'])
            fallback = [{'name': p, 'desc': ''} for p in outp.split('\n') if p.strip()]
            return json.dumps(fallback)

    def get_outdated(self):
        return self.execute_brew(['outdated'])

    def package_info(self, package_name):
        return self.execute_brew(['info', package_name, '--json=v2'])

    def update_package(self, package_name):
        return self.execute_brew(['upgrade', package_name])

    def uninstall_package(self, package_name):
        return self.execute_brew(['uninstall', package_name])

    def update_all(self):
        return self.execute_brew(['upgrade'])

    def search(self, query):
        return self.execute_brew(['search', query])

    def install(self, package_name):
        return self.execute_brew(['install', package_name])

    def cleanup(self):
        return self.execute_brew(['cleanup'])

    def doctor(self):
        return self.execute_brew(['doctor'])
