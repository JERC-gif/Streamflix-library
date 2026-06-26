// ===========================================
// STREAMFLIX PREMIUM - JAVASCRIPT FUNCIONAL
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('StreamFlix Premium iniciado');
    
    initializeTheme();
    initializeToastSystem();
    initializeSearchAndFilters();
    initializeFormEnhancements();
    initializeTableEnhancements();
    initializeRatingVisuals();
    initializeHeaderSearch();
    
    console.log('StreamFlix cargado correctamente');
});

// Función para detectar dispositivos de bajo rendimiento
function detectLowEndDevice() {
    const isMobile = window.innerWidth <= 768;
    const isLowRAM = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    
    return isMobile || isLowRAM || isSlowCPU;
}

// ===========================================
// SISTEMA DE TEMA OSCURO/CLARO
// ===========================================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Cargar tema guardado o usar tema por defecto
    const savedTheme = localStorage.getItem('streamflix-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
            localStorage.setItem('streamflix-theme', newTheme);
        updateThemeIcon(newTheme);
        
            // Efecto de transición suave
            html.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                html.style.transition = '';
            }, 300);
            
            showToast(`Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info', 1500);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
        themeToggle.title = `Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`;
    }
}

// ===========================================
// SISTEMA DE NOTIFICACIONES TOAST
// ===========================================
function initializeToastSystem() {
    // Crear contenedor de toast si no existe
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    window.showToast = function(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = getToastIcon(type);
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        container.appendChild(toast);
        
        // Auto-remover después del tiempo especificado
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOutToRight 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    };
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '⏳'
    };
    return icons[type] || icons.info;
}

// ===========================================
// SISTEMA DE BÚSQUEDA Y FILTROS
// ===========================================
function initializeSearchAndFilters() {
    const searchInputs = document.querySelectorAll('.search-input');
    const filterSelects = document.querySelectorAll('.filter-select');
    
    // Configurar búsqueda en tiempo real optimizada
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(handleSearch, 500)); // Aumentar debounce
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
    
    // Configurar filtros
    filterSelects.forEach(select => {
        select.addEventListener('change', handleFilter);
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const table = event.target.closest('.table-section')?.querySelector('.data-table');
    
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        row.style.display = isVisible ? '' : 'none';
        
        if (isVisible) {
            visibleCount++;
            row.style.animation = 'fadeIn 0.3s ease-out';
        }
    });
    
    // Mostrar contador de resultados
    if (searchTerm.length > 0) {
        showToast(`${visibleCount} resultado${visibleCount !== 1 ? 's' : ''} encontrado${visibleCount !== 1 ? 's' : ''}`, 'info', 1500);
    }
    
    // Actualizar estado de la tabla
    updateTableState(table, visibleCount);
}

function handleFilter(event) {
    const filterValue = event.target.value;
    const filterType = event.target.dataset.filter;
    const table = event.target.closest('.table-section')?.querySelector('.data-table');
    
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let shouldShow = true;
        
        if (filterType === 'rating') {
            const ratingCell = row.querySelector('td:nth-child(4)');
            if (ratingCell) {
                const ratingText = ratingCell.textContent.trim();
                const rating = parseFloat(ratingText);
            
                if (!isNaN(rating)) {
            if (filterValue === 'high' && rating < 8) shouldShow = false;
            else if (filterValue === 'medium' && (rating < 5 || rating >= 8)) shouldShow = false;
            else if (filterValue === 'low' && rating >= 5) shouldShow = false;
                } else if (filterValue !== '') {
                    shouldShow = false;
                }
            }
        } else if (filterType === 'year') {
            const yearCell = row.querySelector('td:nth-child(3)');
            if (yearCell && filterValue !== '') {
                const year = yearCell.textContent.trim();
                shouldShow = year === filterValue;
            }
        }
        
        row.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    showToast(`Filtro aplicado: ${visibleCount} resultado${visibleCount !== 1 ? 's' : ''}`, 'info', 1500);
    updateTableState(table, visibleCount);
}

function updateTableState(table, visibleCount) {
    const totalRows = table.querySelectorAll('tbody tr').length;
    const tableSection = table.closest('.table-section');
    
    // Crear o actualizar indicador de estado
    let stateIndicator = tableSection.querySelector('.table-state');
    if (!stateIndicator) {
        stateIndicator = document.createElement('div');
        stateIndicator.className = 'table-state';
        tableSection.insertBefore(stateIndicator, table);
    }
    
    if (visibleCount < totalRows) {
        stateIndicator.textContent = `Mostrando ${visibleCount} de ${totalRows} elementos`;
        stateIndicator.style.display = 'block';
    } else {
        stateIndicator.style.display = 'none';
    }
}

// Función debounce para optimizar búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===========================================
// EFECTOS VISUALES Y ANIMACIONES
// ===========================================
function initializeVisualEffects() {
    // Efectos de parallax suave
    initializeParallax();
    
    // Efectos de hover en cards
    initializeCardEffects();
    
    // Efectos de partículas de fondo
    initializeBackgroundParticles();
}

function initializeParallax() {
    // Deshabilitar parallax en dispositivos móviles para mejor rendimiento
    if (window.innerWidth <= 768) return;
    
    const parallaxElements = document.querySelectorAll('.stat-card, .form-section, .table-section');
    
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const speed = 0.05; // Reducir velocidad
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

function initializeCardEffects() {
    const cards = document.querySelectorAll('.stat-card, .movie-card, .form-section, .table-section');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializeBackgroundParticles() {
    // Solo crear partículas en dispositivos potentes y si hay pocos elementos
    if (window.innerWidth > 1024 && 
        document.querySelectorAll('.stat-card, .movie-card').length < 5 &&
        navigator.hardwareConcurrency > 4) {
        createParticleSystem();
    }
}

function createParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `hsla(${Math.random() * 60 + 240}, 70%, 60%, 0.3)`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Interacción con el mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * 0.05;
                this.vy -= Math.sin(angle) * 0.05;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Reducir partículas para mejor rendimiento
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    resizeCanvas();
    initParticles();
    animate();
    
    // Limpiar cuando la página se descarga
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// ===========================================
// MEJORAS DE FORMULARIOS
// ===========================================
function initializeFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Mejorar inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            enhanceInput(input);
        });
        
        // Mejorar envío de formularios
        enhanceFormSubmission(form);
    });
}

function enhanceInput(input) {
            // Añadir clase cuando el campo tenga valor
            if (input.value) {
                input.classList.add('has-value');
            }
            
    input.addEventListener('input', function() {
                if (this.value) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
            
    // Efectos de focus
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
        this.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
        this.style.transform = 'translateY(0)';
    });
    
    // Validación en tiempo real
    input.addEventListener('blur', function() {
        validateInput(this);
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    // Limpiar validaciones anteriores
    input.classList.remove('valid', 'invalid');
    
    if (required && !value) {
        input.classList.add('invalid');
        showInputError(input, 'Este campo es obligatorio');
        return false;
    }
    
    if (value) {
        if (type === 'email' && !isValidEmail(value)) {
            input.classList.add('invalid');
            showInputError(input, 'Ingresa un email válido');
            return false;
        }
        
        if (type === 'number') {
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            const numValue = parseFloat(value);
            
            if (!isNaN(min) && numValue < min) {
                input.classList.add('invalid');
                showInputError(input, `El valor debe ser mayor a ${min}`);
                return false;
            }
            
            if (!isNaN(max) && numValue > max) {
                input.classList.add('invalid');
                showInputError(input, `El valor debe ser menor a ${max}`);
                return false;
            }
        }
        
        input.classList.add('valid');
        clearInputError(input);
        return true;
    }
    
    return true;
}

function showInputError(input, message) {
    clearInputError(input);
    
    const error = document.createElement('div');
    error.className = 'input-error';
    error.textContent = message;
    error.style.color = 'var(--error)';
    error.style.fontSize = '0.8rem';
    error.style.marginTop = '0.25rem';
    
    input.parentElement.appendChild(error);
}

function clearInputError(input) {
    const error = input.parentElement.querySelector('.input-error');
    if (error) {
        error.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function enhanceFormSubmission(form) {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                // Prevenir múltiples envíos
                if (submitBtn.disabled) {
                    e.preventDefault();
                    return;
                }
                
            // Validar todos los campos
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showToast('Por favor corrige los errores en el formulario', 'error', 3000);
                return;
            }
            
            // Mostrar estado de carga
                submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
                submitBtn.innerHTML = `
                    <span class="loading-spinner"></span>
                    Procesando...
                `;
                
            // Añadir spinner CSS si no existe
            if (!document.querySelector('#loading-spinner-style')) {
                const style = document.createElement('style');
                style.id = 'loading-spinner-style';
                style.textContent = `
                    .loading-spinner {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        border: 2px solid transparent;
                        border-top: 2px solid currentColor;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Timeout de seguridad
                setTimeout(() => {
                    if (submitBtn.disabled) {
                        submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    showToast('La operación está tardando más de lo esperado', 'warning', 3000);
                    }
                }, 10000);
            }
    });
}

// ===========================================
// MEJORAS DE TABLAS
// ===========================================
function initializeTableEnhancements() {
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        // Hacer tabla responsive
        makeTableResponsive(table);
        
        // Añadir efectos de hover mejorados
        enhanceTableHover(table);
        
        // Añadir ordenamiento por columnas
        addTableSorting(table);
    });
}

function makeTableResponsive(table) {
        const container = table.parentElement;
    
    function checkResponsive() {
        if (table.offsetWidth > container.offsetWidth) {
            container.classList.add('table-responsive');
            
            // Añadir indicador de desplazamiento
            if (!container.querySelector('.scroll-hint')) {
                const hint = document.createElement('div');
                hint.className = 'scroll-hint';
                hint.innerHTML = '← Desplaza horizontalmente para ver más →';
                hint.style.cssText = `
                    text-align: center;
                    color: var(--foreground-muted);
                    font-size: 0.8rem;
                    margin: 1rem 0;
                    opacity: 0.7;
                `;
                container.appendChild(hint);
            }
        } else {
            container.classList.remove('table-responsive');
            const hint = container.querySelector('.scroll-hint');
            if (hint) hint.remove();
        }
    }
    
    // Verificar en carga y redimensionamiento
    checkResponsive();
    window.addEventListener('resize', debounce(checkResponsive, 250));
}

function enhanceTableHover(table) {
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'var(--background-card-hover)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
}

function addTableSorting(table) {
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        // Permitir ordenar por todas las columnas excepto ID
        if (index > 0) {
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            header.innerHTML += ' <span class="sort-indicator">↕</span>';
            
            header.addEventListener('click', () => {
                sortTable(table, index);
                updateSortIndicators(headers, index);
            });
        }
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Detectar si es columna numérica (Año = 2, Calificación = 3)
    const isNumeric = columnIndex === 2 || columnIndex === 3;
    
    // Obtener dirección de ordenamiento
    const currentDirection = table.dataset.sortDirection === 'asc' ? 'desc' : 'asc';
    table.dataset.sortDirection = currentDirection;
    
    rows.sort((a, b) => {
        let aText = a.cells[columnIndex].textContent.trim();
        let bText = b.cells[columnIndex].textContent.trim();
        
        // Limpiar texto para ordenamiento numérico
        if (isNumeric) {
            aText = aText.replace(/[^\d.-]/g, '');
            bText = bText.replace(/[^\d.-]/g, '');
            const aNum = parseFloat(aText) || 0;
            const bNum = parseFloat(bText) || 0;
            return currentDirection === 'asc' ? aNum - bNum : bNum - aNum;
        } else {
            return currentDirection === 'asc' 
                ? aText.localeCompare(bText, 'es', { numeric: true })
                : bText.localeCompare(aText, 'es', { numeric: true });
        }
    });
    
    // Reordenar filas en la tabla
    rows.forEach(row => tbody.appendChild(row));
    
    // Mostrar notificación
    const columnNames = ['ID', 'Nombre', 'Año', 'Calificación', 'Fecha'];
    const columnName = columnNames[columnIndex] || 'Columna';
    showToast(`Ordenado por ${columnName} (${currentDirection === 'asc' ? 'A-Z' : 'Z-A'})`, 'info', 1500);
}

function updateSortIndicators(headers, activeIndex) {
    headers.forEach((header, index) => {
        const indicator = header.querySelector('.sort-indicator');
        if (indicator) {
            if (index === activeIndex) {
                const table = header.closest('table');
                const direction = table.dataset.sortDirection;
                indicator.textContent = direction === 'asc' ? ' ↑' : ' ↓';
            } else {
                indicator.textContent = ' ↕';
            }
        }
    });
}

// ===========================================
// VISUALIZACIÓN DE CALIFICACIONES
// ===========================================
function initializeRatingVisuals() {
    const ratingCells = document.querySelectorAll('table.data-table tr td:nth-child(4)');
    
    ratingCells.forEach(cell => {
        const content = cell.textContent.trim();
        
        if (content === '' || content === '-') {
            // Mostrar placeholder para calificaciones vacías
            cell.innerHTML = '<span style="color: var(--foreground-muted); font-style: italic;">Sin calificar</span>';
            return;
        }
        
        const rating = parseFloat(content);
        if (!isNaN(rating)) {
            createRatingVisual(cell, rating);
        }
    });
}

function createRatingVisual(cell, rating) {
    const container = document.createElement('div');
    container.className = 'rating-container';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '0.5rem';
    
    // Crear barra de progreso
    const progressBar = document.createElement('div');
    progressBar.className = 'rating-visual';
    progressBar.style.cssText = `
        width: 80px;
        height: 8px;
        background: var(--background-card-hover);
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    `;
    
    const fill = document.createElement('div');
    fill.style.cssText = `
        width: 0%;
        height: 100%;
        background: ${getRatingColor(rating)};
        border-radius: 4px;
        transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    progressBar.appendChild(fill);
    
    // Valor numérico
    const numericValue = document.createElement('span');
    numericValue.textContent = rating;
    numericValue.style.cssText = `
        font-weight: 700;
        color: ${getRatingColor(rating)};
        font-size: 0.9rem;
    `;
    
    // Estrellas
    const stars = createStarRating(rating);
    
    container.appendChild(progressBar);
    container.appendChild(numericValue);
    container.appendChild(stars);
    
    // Limpiar contenido y añadir el visualizador
    cell.innerHTML = '';
    cell.appendChild(container);
    
    // Animar la barra de progreso
    setTimeout(() => {
        fill.style.width = `${rating * 10}%`;
    }, 100);
}

function createStarRating(rating) {
    const starsContainer = document.createElement('div');
    starsContainer.style.cssText = `
        display: flex;
        gap: 1px;
        font-size: 0.8rem;
    `;
    
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating % 2) >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.style.color = '#ffd700';
        starsContainer.appendChild(star);
    }
    
    // Media estrella
    if (hasHalfStar) {
        const star = document.createElement('span');
        star.textContent = '☆';
        star.style.color = '#ffd700';
        starsContainer.appendChild(star);
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        const star = document.createElement('span');
        star.textContent = '☆';
        star.style.color = 'var(--foreground-muted)';
        starsContainer.appendChild(star);
    }
    
    return starsContainer;
}

function getRatingColor(rating) {
    if (rating >= 8) return 'var(--success)';
    if (rating >= 6) return 'var(--warning)';
    if (rating >= 4) return '#ff9500';
    return 'var(--error)';
}

// ===========================================
// ANIMACIONES DE ENTRADA
// ===========================================
function initializeAnimations() {
    // Configurar animaciones de entrada optimizadas
    const animatedElements = document.querySelectorAll('.stat-card, .form-section, .table-section, .subtitle');
    
    // Reducir animaciones en dispositivos móviles
    const isMobile = window.innerWidth <= 768;
    
    animatedElements.forEach((el, index) => {
        if (!isMobile) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            el.style.transitionDelay = `${index * 0.05}s`;
        }
        
        // Activar animación cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isMobile) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(el);
    });
}

// ===========================================
// UTILIDADES ADICIONALES
// ===========================================

// Función para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copiado al portapapeles', 'success', 1500);
    }).catch(() => {
        showToast('Error al copiar', 'error', 1500);
    });
}

// Función para formatear fechas
function formatDate(dateString) {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para generar colores aleatorios
function getRandomColor() {
    const colors = [
        '#e50914', '#ff6b6b', '#4ecdc4', '#45b7d1', 
        '#96ceb4', '#feca57', '#ff9ff3', '#a55eea'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para mostrar/ocultar elementos en móvil
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    if (nav) {
        nav.classList.toggle('mobile-open');
    }
}

// ===========================================
// EVENTOS GLOBALES
// ===========================================

// Manejar redimensionamiento de ventana
window.addEventListener('resize', debounce(() => {
    // Reajustar efectos visuales
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        makeTableResponsive(table);
    });
}, 250));

// Manejar errores de JavaScript
window.addEventListener('error', (e) => {
    console.error('Error en StreamFlix:', e.error);
    showToast('Ocurrió un error inesperado', 'error', 3000);
});

// ===========================================
// BÚSQUEDA DEL HEADER
// ===========================================
function initializeHeaderSearch() {
    const searchForm = document.querySelector('.search-bar form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const query = this.querySelector('input[name="q"]').value.trim();
            if (!query) {
                e.preventDefault();
                showToast('Escribe algo para buscar', 'warning');
            }
        });
    }
}

// Manejar conexión/desconexión de red
window.addEventListener('online', () => {
    showToast('Conexión restaurada', 'success', 2000);
});

window.addEventListener('offline', () => {
    showToast('Sin conexión a internet', 'warning', 3000);
});

console.log('🎬 StreamFlix Premium JavaScript cargado correctamente');