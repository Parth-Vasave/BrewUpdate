// UI Elements
const navItems = document.querySelectorAll('.nav-item');
const viewPanels = document.querySelectorAll('.view-panel');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');

// State
let installedPackages = [];
let outdatedPackages = [];

// Theme Management
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

function updateThemeIcons() {
    if (document.documentElement.classList.contains('dark')) {
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    } else {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons();
}

// Initialize Theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
updateThemeIcons();
themeToggleBtn.addEventListener('click', toggleTheme);

// Navigation Logic
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Reset all tabs to inactive styling
        navItems.forEach(n => {
            n.classList.remove('bg-slate-200/70', 'dark:bg-amber-500/10', 'text-slate-900', 'dark:text-amber-400');
            n.classList.add('text-slate-500', 'dark:text-slate-400');
            n.querySelector('svg').classList.remove('text-amber-500');
            n.querySelector('svg').classList.add('group-hover:text-amber-500');
        });

        // Hide all views
        viewPanels.forEach(v => v.classList.add('hidden'));
        
        // Set clicked tab to active styling
        item.classList.remove('text-slate-500', 'dark:text-slate-400');
        item.classList.add('bg-slate-200/70', 'dark:bg-amber-500/10', 'text-slate-900', 'dark:text-amber-400');
        item.querySelector('svg').classList.remove('group-hover:text-amber-500');
        item.querySelector('svg').classList.add('text-amber-500');

        // Show target view
        const targetView = item.getAttribute('data-view');
        document.getElementById(`view-${targetView}`).classList.remove('hidden');
        
        if (targetView === 'dashboard') loadDashboard();
        if (targetView === 'installed') renderInstalledList();
    });
});

// Loading Overlay
function showLoading(text = 'Loading...') {
    loadingText.textContent = text;
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.classList.add('flex');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
    loadingOverlay.classList.remove('flex');
}

// Global update trigger for generic buttons
function getLoadingButtonState(btn, text="WORKING...") {
    const originalText = btn.innerText;
    btn.innerText = text;
    btn.classList.add('animate-pulse', 'pointer-events-none', 'opacity-80');
    return () => {
        btn.innerText = originalText;
        btn.classList.remove('animate-pulse', 'pointer-events-none', 'opacity-80');
    }
}

// API Integration
async function loadDashboard() {
    showLoading('Fetching system data...');
    try {
        await new Promise(resolve => {
            if (window.pywebview) resolve();
            else window.addEventListener('pywebviewready', resolve);
        });

        const installedRes = await window.pywebview.api.list_installed();
        installedPackages = JSON.parse(installedRes);
        
        const outdatedRes = await window.pywebview.api.get_outdated();
        outdatedPackages = outdatedRes.split('\n').filter(p => p.trim() !== '');

        // Update Stats
        document.getElementById('sb-installed').textContent = installedPackages.length;
        document.getElementById('dash-installed').textContent = installedPackages.length;
        
        const outCount = outdatedPackages.length;
        document.getElementById('sb-outdated').textContent = outCount;
        document.getElementById('dash-outdated').textContent = outCount;
        
        if (outCount > 0) {
            document.getElementById('dash-updates-bg').classList.remove('hidden');
            document.getElementById('dash-outdated-sub').textContent = `${outCount} updates ready`;
            document.getElementById('dash-outdated-sub').classList.add('text-amber-600', 'dark:text-amber-500');
        } else {
            document.getElementById('dash-updates-bg').classList.add('hidden');
            document.getElementById('dash-outdated-sub').textContent = `You are up to date!`;
            document.getElementById('dash-outdated-sub').classList.remove('text-amber-600', 'dark:text-amber-500');
        }

        renderOutdatedList();
        renderInstalledList(); 
    } catch (e) {
        console.error("Dashboard Error:", e);
    } finally {
        hideLoading();
    }
}

function renderOutdatedList() {
    const list = document.getElementById('updates-list');
    list.innerHTML = '';
    
    if (outdatedPackages.length === 0) {
        list.innerHTML = '<div class="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">All packages are up to date! 🎉</div>';
        return;
    }

    outdatedPackages.forEach(pkgLine => {
        const pkgName = pkgLine.split(' ')[0];
        
        const item = document.createElement('div');
        item.className = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center justify-between gap-6 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all shadow-sm';
        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 flex-shrink-0 bg-amber-50 dark:bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <div>
                     <h3 class="text-lg font-bold text-slate-900 dark:text-white">${pkgName}</h3>
                     <p class="text-xs text-slate-500 dark:text-slate-400">Update available in Homebrew</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                 <button class="btn-update-pkg px-4 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white font-bold text-xs rounded transition-colors uppercase tracking-tight" data-pkg="${pkgName}">Update</button>
            </div>
        `;
        list.appendChild(item);
    });

    // Add event listeners for dynamic buttons
    document.querySelectorAll('.btn-update-pkg').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const pkg = e.target.getAttribute('data-pkg');
            const restore = getLoadingButtonState(e.target);
            try {
                await window.pywebview.api.update_package(pkg);
                await loadDashboard();
            } catch (err) {
                alert("Failed to update: " + err);
            } finally { restore(); }
        });
    });
}

function renderInstalledList(filter = '') {
    const list = document.getElementById('installed-list');
    list.innerHTML = '';
    
    const filtered = installedPackages.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    
    if (filtered.length === 0) {
        list.innerHTML = '<div class="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl text-slate-500 dark:text-slate-400">No packages found matching your search.</div>';
        return;
    }

    filtered.forEach(pkg => {
        const item = document.createElement('div');
        item.className = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm';
        
        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 flex-shrink-0 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                     <h3 class="text-base font-bold text-slate-900 dark:text-white leading-tight">${pkg.name}</h3>
                     <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">${pkg.desc}</p>
                </div>
            </div>
            <div class="flex gap-2">
                 <button class="btn-info-pkg px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs rounded transition-colors" data-pkg="${pkg.name}">Info / Manage</button>
            </div>
        `;
        list.appendChild(item);
    });

    document.querySelectorAll('.btn-info-pkg').forEach(btn => {
        btn.addEventListener('click', (e) => showPackageInfo(e.target.getAttribute('data-pkg')));
    });
}

// Dashboard Bulk Update
document.getElementById('btn-update-all').addEventListener('click', async (e) => {
    if (outdatedPackages.length === 0) {
        alert("System is up to date.");
        return;
    }
    const restore = getLoadingButtonState(e.target, "UPDATING...");
    showLoading('Updating all packages... This may take a while.');
    try {
        await window.pywebview.api.update_all();
        await loadDashboard(); 
    } catch (err) {
        alert("Error updating: " + err);
    } finally { 
        hideLoading(); 
        restore();
    }
});

// Search Filtering
document.getElementById('installed-search').addEventListener('input', (e) => {
    renderInstalledList(e.target.value);
});

// Modal Context
const modal = document.getElementById('package-modal');
const modalTitle = document.getElementById('modal-title');
const modalInfo = document.getElementById('modal-info');
const modalActions = document.getElementById('modal-actions');
const closeBtn = document.querySelector('.close-modal');

closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

async function showPackageInfo(pkgName) {
    modalTitle.textContent = pkgName;
    modalInfo.innerHTML = `
        <div class="flex items-center justify-center py-10">
            <svg class="spinner w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            </svg>
        </div>
    `;
    modalActions.innerHTML = '';
    modal.classList.remove('hidden');

    try {
        const rawJson = await window.pywebview.api.package_info(pkgName);
        const data = JSON.parse(rawJson);
        const item = data.formulae?.[0] || data.casks?.[0];
        
        if (!item) throw new Error("Package not found");

        const isCask = !!data.casks?.[0];
        const description = item.desc || "No description available.";
        const homepage = item.homepage || "#";
        const license = item.license || "Not specified";
        const version = isCask ? item.version : item.versions?.stable;
        const installed = isCask ? item.installed : (item.installed?.[0]?.version);
        const outdated = item.outdated;

        modalInfo.innerHTML = `
            <!-- Description & Badge -->
            <div class="space-y-3">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isCask ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}">
                        ${isCask ? 'Cask' : 'Formula'}
                    </span>
                    ${outdated ? '<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">Update Available</span>' : ''}
                </div>
                <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">${description}</p>
            </div>

            <!-- Metadata Grid -->
            <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-700/50">
                <div>
                    <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Version</h4>
                    <p class="text-sm font-medium text-slate-900 dark:text-white mono">${version || 'N/A'}</p>
                </div>
                <div>
                    <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Installed</h4>
                    <p class="text-sm font-medium ${installed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">${installed || 'Not installed'}</p>
                </div>
                <div>
                    <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">License</h4>
                    <p class="text-sm font-medium text-slate-900 dark:text-white">${license}</p>
                </div>
                <div>
                    <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Homepage</h4>
                    <a href="${homepage}" target="_blank" class="text-sm font-medium text-amber-600 hover:text-amber-500 underline truncate block">${homepage.replace('https://', '')}</a>
                </div>
            </div>

            <!-- Dependencies -->
            ${!isCask && (item.dependencies?.length || item.build_dependencies?.length) ? `
                <div class="space-y-3">
                    <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dependencies</h4>
                    <div class="flex flex-wrap gap-1.5">
                        ${[...(item.build_dependencies || []), ...(item.dependencies || [])].map(dep => `
                            <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded border border-slate-200 dark:border-slate-700">${dep}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        modalActions.innerHTML = `
            <button class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded transition-colors close-modal-btn">Close</button>
            ${installed ? `<button class="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 text-sm font-medium rounded transition-colors" onclick="uninstallPackage('${pkgName}')">Uninstall</button>` : ''}
            <button class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[#0f172a] text-sm font-bold rounded transition-colors" onclick="updatePackage('${pkgName}')">${outdated ? 'Update Package' : 'Reinstall'}</button>
        `;
        modalActions.querySelector('.close-modal-btn').addEventListener('click', () => modal.classList.add('hidden'));
    } catch (e) {
        modalInfo.innerHTML = `<div class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900/30">Error loading details: ${e.message}</div>`;
    }
}

async function updatePackage(pkgName) {
    modal.classList.add('hidden');
    showLoading(`Updating ${pkgName}...`);
    try {
        await window.pywebview.api.update_package(pkgName);
        await loadDashboard();
    } catch (e) {
        alert("Failed to update: " + e);
    } finally { hideLoading(); }
}

async function uninstallPackage(pkgName) {
    if (!confirm(`Are you sure you want to uninstall ${pkgName}?`)) return;
    
    modal.classList.add('hidden');
    showLoading(`Uninstalling ${pkgName}...`);
    try {
        await window.pywebview.api.uninstall_package(pkgName);
        await loadDashboard();
    } catch (e) {
        alert("Failed to uninstall: " + e);
    } finally { hideLoading(); }
}

// Discover logic
document.getElementById('btn-search').addEventListener('click', async (e) => {
    const query = document.getElementById('discover-input').value.trim();
    if (!query) return;
    
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '<div class="text-center py-10 text-slate-500 animate-pulse">Searching Homebrew index...</div>';
    
    const restore = getLoadingButtonState(e.target, '...');
    try {
        const res = await window.pywebview.api.search(query);
        const lines = res.split('\n').filter(l => l.trim() !== '');
        
        resultsContainer.innerHTML = '';
        if (lines.length === 0) {
             resultsContainer.innerHTML = '<div class="text-center py-10 text-slate-500">No results found.</div>';
             return;
        }

        lines.forEach(line => {
            if (line.startsWith('==>')) {
                const header = document.createElement('h3');
                header.className = "text-sm font-bold text-slate-900 dark:text-white mt-6 mb-2 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1";
                header.textContent = line.replace('==>', '').trim();
                resultsContainer.appendChild(header);
            } else {
                const parts = line.trim().split(/\s+/);
                parts.forEach(pkg => {
                    const item = document.createElement('div');
                    item.className = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-2 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm';
                    item.innerHTML = `
                        <span class="font-medium text-slate-900 dark:text-white">${pkg}</span>
                        <div class="flex gap-2 w-full sm:w-auto">
                            <button class="flex-1 sm:flex-none py-1.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded transition-colors" onclick="showPackageInfo('${pkg}')">Info</button>
                            <button class="flex-1 sm:flex-none py-1.5 px-4 bg-amber-500 hover:bg-amber-600 text-[#0f172a] font-bold text-xs rounded transition-colors" onclick="installPackage('${pkg}')">Install</button>
                        </div>
                    `;
                    resultsContainer.appendChild(item);
                });
            }
        });

    } catch (err) {
        resultsContainer.innerHTML = `<div class="text-center py-10 text-red-500">Error: ${err}</div>`;
    } finally {
        restore();
    }
});

async function installPackage(pkgName) {
    showLoading(`Installing ${pkgName}...`);
    try {
        await window.pywebview.api.install(pkgName);
        alert(`Successfully installed ${pkgName}!`);
        await loadDashboard();
    } catch(err) {
        alert(`Error installing ${pkgName}:\n${err}`);
    } finally {
        hideLoading();
    }
}

// Maintenance Logic
document.getElementById('btn-cleanup').addEventListener('click', async (e) => {
    const consoleContainer = document.getElementById('maintenance-output');
    const pre = consoleContainer.querySelector('pre');
    
    consoleContainer.classList.remove('hidden');
    pre.textContent = "> Running brew cleanup...\n";
    const restore = getLoadingButtonState(e.target, 'Cleaning...');
    
    try {
        const res = await window.pywebview.api.cleanup();
        pre.textContent += (res || "Cleanup complete. Space recovered if applicable.") + "\n> Done.";
    } catch(err) {
        pre.textContent += "\nError: " + err;
    } finally {
        restore();
    }
});

document.getElementById('btn-doctor').addEventListener('click', async (e) => {
    const consoleContainer = document.getElementById('maintenance-output');
    const pre = consoleContainer.querySelector('pre');
    
    consoleContainer.classList.remove('hidden');
    pre.textContent = "> Running brew doctor...\n";
    const restore = getLoadingButtonState(e.target, 'Diagnosing...');
    
    try {
        const res = await window.pywebview.api.doctor();
        pre.textContent += res + "\n> Done.";
    } catch(err) {
        pre.textContent += "\nDoctor found potential issues:\n" + err;
    } finally {
        restore();
    }
});

// Initialize Webview
window.addEventListener('pywebviewready', function() {
    loadDashboard();
});
