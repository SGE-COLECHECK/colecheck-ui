declare const Chart: any;

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Logic ---
    const viewLinks = document.querySelectorAll('[data-view]');
    const viewTitle = document.getElementById('view-title');
    const views = document.querySelectorAll('.view-content');

    const viewTitles = {
        dashboard: 'Panel Principal',
        pagos: 'Pagos',
        asistencia: 'Asistencia de Estudiantes',
        notas: 'Notas de Estudiantes',
        comportamiento: 'Comportamiento de Estudiantes',
        comunicados: 'Comunicados',
        estudiantes: 'Gestión de Estudiantes',
        docentes: 'Gestión de Docentes',
        personal: 'Gestión de Personal',
        padres: 'Gestión de Padres',
    };

    function switchView(viewId) {
        views.forEach(view => {
            if (view.id === `view-${viewId}`) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });
        viewTitle.textContent = viewTitles[viewId] || 'ColeCheck';

         // Update active sidebar item
        viewLinks.forEach(link => {
            // FIX: Cast link to HTMLElement to access dataset property.
            if ((link as HTMLElement).dataset.view === viewId) {
                link.classList.add('sidebar-item-active');
            } else {
                link.classList.remove('sidebar-item-active');
            }
        });

        if (viewId === 'dashboard') {
            renderDashboardCharts();
        }
    }

    viewLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            // FIX: Cast link to HTMLElement to access dataset property.
            const viewId = (link as HTMLElement).dataset.view;
            switchView(viewId);
        });
    });

    // --- Dashboard Tab Logic ---
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const dashboardTabContents = document.querySelectorAll('.dashboard-tab-content');

    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // FIX: Cast tab to HTMLElement to access dataset property.
            const tabId = (tab as HTMLElement).dataset.tab;

            dashboardTabs.forEach(t => {
                t.classList.remove('tab-active', 'border-sky-500', 'text-sky-500');
                 t.classList.add('border-transparent', 'text-gray-500');
            });
            tab.classList.add('tab-active', 'border-sky-500', 'text-sky-500');
            
            dashboardTabContents.forEach(content => {
                if (content.id === `tab-${tabId}`) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // Set initial active tab for dashboard
    const initialTab = document.querySelector('[data-tab="asistencia"]');
    if(initialTab) {
       initialTab.classList.add('tab-active', 'border-sky-500', 'text-sky-500');
       document.getElementById('tab-asistencia')?.classList.remove('hidden');
    }


    // --- Chart.js Logic ---
    let charts = {};

    function renderDashboardCharts() {
        const grados = ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'];
        
        // Pestaña 1: Asistencia
        renderPieChart('asistenciaDiaChart', 'Descomposición de Asistencia', ['Presentes', 'Tardanzas', 'Faltas', 'Justificados'], [114, 4, 5, 2], ['#22C55E', '#FBBF24', '#EF4444', '#9CA3AF']);
        
        const asistenciaDatasets = [
            { label: 'Presentes', data: [18, 19, 18, 19, 20, 20], backgroundColor: '#22C55E'},
            { label: 'Tardanzas', data: [1, 0, 1, 1, 0, 1], backgroundColor: '#FBBF24' },
            { label: 'Faltas',   data: [1, 1, 1, 0, 0, 0], backgroundColor: '#EF4444' }
        ];
        renderStackedBarChart('asistenciaGradoChart', grados, asistenciaDatasets);


        // Pestaña 2: Rendimiento
        renderBarChart('rendimientoCursosChart', 'Promedio General', ['Personal Social', 'Ciencia y Amb.', 'Ed. Física', 'Arte y Cultura', 'Comunicación'], [11.5, 11.8, 12.1, 12.5, 12.9], 'y');
        renderBarChart('riesgoPorGradoChart', 'N° Alumnos', grados, [1, 2, 5, 3, 4, 2], 'x');

        // Pestaña 3: Finanzas
        renderLineChart('recaudacionChart', 'Recaudación (S/)', ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'], [45000, 48000, 42000, 51000, 49000, 50250]);
        renderBarChart('cargaLectivaChart', 'Horas Semanales', ['Prof. García', 'Prof. Torres', 'Prof. Luna', 'Prof. Soto', 'Prof. Reyes'], [26, 25, 25, 26, 24], 'y');

        // Pestaña 4: Resumen General
        const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
        const parentLogins = [15, 18, 12, 10, 25, 30, 22, 18, 17, 15, 28, 35, 29, 25, 45, 40, 38, 33, 29, 31, 25, 22, 24, 28, 39, 41, 37, 30, 28, 55];
        renderLineChart('parentalActivityChart', 'N° de Inicios de Sesión', daysInMonth, parentLogins);
    }

    const renderPieChart = (canvasId, label, labels, data, backgroundColors) => {
        const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!ctx) return;
        if (charts[canvasId]) {
            charts[canvasId].destroy();
        }
        charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } }
            }
        });
    };

    const renderBarChart = (canvasId, label, labels, data, axis = 'y') => {
         const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!ctx) return;
        if (charts[canvasId]) {
            charts[canvasId].destroy();
        }
        charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: '#5DADE2',
                    borderColor: '#3498DB',
                    borderWidth: 1,
                    borderRadius: 5,
                }]
            },
            options: {
                indexAxis: axis,
                scales: { 
                    x: { beginAtZero: true, stacked: axis === 'y' },
                    y: { stacked: axis === 'x' }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    const renderLineChart = (canvasId, label, labels, data) => {
        const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!ctx) return;
         if (charts[canvasId]) {
            charts[canvasId].destroy();
        }
        charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    fill: false,
                    borderColor: '#5DADE2',
                    tension: 0.1
                }]
            },
            options: {
                plugins: { legend: { display: true } }
            }
        });
    };
    
    const renderStackedBarChart = (canvasId, categoryLabels, datasets) => {
        const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!ctx) return;
        if (charts[canvasId]) {
            charts[canvasId].destroy();
        }
        charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: datasets,
            },
            options: {
                plugins: {
                  title: { display: false },
                  legend: { position: 'top'}
                },
                responsive: true,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true, beginAtZero: true }
                }
            }
        });
    };

    // Set initial view
    switchView('dashboard');
});