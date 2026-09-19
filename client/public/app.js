// Enhanced pollution analysis data
const EnhancedPollutionData = {
    sample_1: {
        pollution_areas: { high_pollution: 23.4, moderate_pollution: 31.7, clean_water: 44.9 },
        severity_score: 0.67, category: "Moderate", water_quality_status: "Caution",
        ecosystem_impact: "Medium", affected_area_sqm: 156.8, compliance_status: "Exceeds Standards",
        recommendations: ["Immediate water treatment required", "Monitor downstream contamination", "Restrict industrial discharge"]
    },
    sample_2: {
        pollution_areas: { high_pollution: 45.2, moderate_pollution: 28.1, clean_water: 26.7 },
        severity_score: 0.84, category: "Severe", water_quality_status: "Unsafe",
        ecosystem_impact: "High", affected_area_sqm: 287.3, compliance_status: "Violates Standards",
        recommendations: ["Emergency intervention needed", "Ban water consumption", "Immediate source identification"]
    },
    sample_3: {
        pollution_areas: { high_pollution: 8.1, moderate_pollution: 15.3, clean_water: 76.6 },
        severity_score: 0.32, category: "Clean", water_quality_status: "Safe",
        ecosystem_impact: "Low", affected_area_sqm: 67.4, compliance_status: "Meets Standards",
        recommendations: ["Continue monitoring", "Maintain current practices", "Regular quality checks"]
    }
};

// Application state
const AppState = {
    currentPage: 'home',
    uploadedFile: null,
    analysisResults: null,
    waterSamples: [
        {
            id: "WS001",
            location: "Ganges River - Haridwar",
            coordinates: { lat: 29.9457, lng: 78.1642 },
            date: "2024-10-01",
            pollution_level: "Moderate",
            confidence: 0.87,
            parameters: {
                ph: 7.2,
                temperature: 18.5,
                turbidity: 12.3,
                dissolved_oxygen: 6.8,
                tds: 245,
                conductivity: 420
            },
            image_url: "sample1.jpg",
            segmentation_data: [
                { x: 180, y: 100, radius: 35, intensity: 0.7, type: 'moderate' },
                { x: 300, y: 140, radius: 25, intensity: 0.6, type: 'moderate' }
            ]
        },
        {
            id: "WS002",
            location: "Yamuna River - Delhi",
            coordinates: { lat: 28.6139, lng: 77.2090 },
            date: "2024-10-02",
            pollution_level: "High",
            confidence: 0.92,
            parameters: {
                ph: 8.1,
                temperature: 22.1,
                turbidity: 28.7,
                dissolved_oxygen: 4.2,
                tds: 512,
                conductivity: 780
            },
            image_url: "sample2.jpg",
            segmentation_data: [
                { x: 120, y: 80, radius: 45, intensity: 0.9, type: 'high' },
                { x: 280, y: 120, radius: 35, intensity: 0.8, type: 'high' },
                { x: 200, y: 160, radius: 25, intensity: 0.7, type: 'moderate' }
            ]
        },
        {
            id: "WS003",
            location: "Godavari River - Nashik",
            coordinates: { lat: 19.9975, lng: 73.7898 },
            date: "2024-10-03",
            pollution_level: "Clean",
            confidence: 0.95,
            parameters: {
                ph: 7.0,
                temperature: 20.3,
                turbidity: 5.1,
                dissolved_oxygen: 8.5,
                tds: 156,
                conductivity: 298
            },
            image_url: "sample3.jpg",
            segmentation_data: [
                { x: 200, y: 110, radius: 15, intensity: 0.4, type: 'moderate' },
                { x: 150, y: 80, radius: 40, intensity: 0.5, type: 'clean' },
                { x: 280, y: 160, radius: 35, intensity: 0.6, type: 'clean' }
            ]
        },
        {
            id: "WS004",
            location: "Krishna River - Pune",
            coordinates: { lat: 18.5204, lng: 73.8567 },
            date: "2024-10-04",
            pollution_level: "Moderate",
            confidence: 0.89,
            parameters: {
                ph: 7.6,
                temperature: 19.8,
                turbidity: 15.2,
                dissolved_oxygen: 6.3,
                tds: 287,
                conductivity: 485
            },
            image_url: "sample4.jpg",
            segmentation_data: [
                { x: 180, y: 100, radius: 35, intensity: 0.7, type: 'moderate' },
                { x: 250, y: 70, radius: 30, intensity: 0.4, type: 'clean' }
            ]
        },
        {
            id: "WS005",
            location: "Cauvery River - Bangalore",
            coordinates: { lat: 12.9716, lng: 77.5946 },
            date: "2024-10-05",
            pollution_level: "High",
            confidence: 0.88,
            parameters: {
                ph: 8.3,
                temperature: 24.2,
                turbidity: 32.1,
                dissolved_oxygen: 3.9,
                tds: 623,
                conductivity: 865
            },
            image_url: "sample5.jpg",
            segmentation_data: [
                { x: 120, y: 80, radius: 45, intensity: 0.9, type: 'high' },
                { x: 280, y: 120, radius: 35, intensity: 0.8, type: 'high' },
                { x: 350, y: 90, radius: 20, intensity: 0.6, type: 'moderate' }
            ]
        }
    ],
    pollutionTrends: [
        { month: "Jan 2024", clean: 45, moderate: 32, high: 23 },
        { month: "Feb 2024", clean: 42, moderate: 35, high: 23 },
        { month: "Mar 2024", clean: 38, moderate: 37, high: 25 },
        { month: "Apr 2024", clean: 35, moderate: 40, high: 25 },
        { month: "May 2024", clean: 33, moderate: 38, high: 29 },
        { month: "Jun 2024", clean: 30, moderate: 35, high: 35 }
    ],
    charts: {}
};

// Utility Functions
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 
                     'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${iconClass} toast-icon"></i>
        <div class="toast-content">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateSampleId() {
    return 'WS' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

function simulateAIAnalysis(file, isImage = true) {
    return new Promise((resolve) => {
        // Simulate processing time
        setTimeout(() => {
            const pollutionLevels = ['Clean', 'Moderate', 'High'];
            const randomLevel = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];
            const confidence = 0.75 + Math.random() * 0.25; // 75-100% confidence
            
            // Generate segmentation regions based on pollution level
            const segmentationData = generateSegmentationData(randomLevel);
            
            const result = {
                id: generateSampleId(),
                location: "User Upload",
                date: new Date().toISOString().split('T')[0],
                pollution_level: randomLevel,
                confidence: confidence,
                parameters: {
                    ph: 6.5 + Math.random() * 2, // 6.5-8.5
                    temperature: 15 + Math.random() * 10, // 15-25°C
                    turbidity: Math.random() * 35, // 0-35 NTU
                    dissolved_oxygen: 3 + Math.random() * 6, // 3-9 mg/L
                    tds: 100 + Math.random() * 600, // 100-700 mg/L
                    conductivity: 250 + Math.random() * 600 // 250-850 μS/cm
                },
                image_url: isImage ? URL.createObjectURL(file) : null,
                segmentation_data: segmentationData,
                file: file
            };
            
            resolve(result);
        }, 3000);
    });
}

function generateSegmentationData(pollutionLevel) {
    const regions = [];
    
    switch (pollutionLevel) {
        case 'High':
            // Multiple high pollution regions
            regions.push(
                { x: 120, y: 80, radius: 45, intensity: 0.9, type: 'high' },
                { x: 280, y: 120, radius: 35, intensity: 0.8, type: 'high' },
                { x: 200, y: 160, radius: 25, intensity: 0.7, type: 'moderate' },
                { x: 350, y: 90, radius: 20, intensity: 0.6, type: 'moderate' }
            );
            break;
        case 'Moderate':
            // Some moderate regions with minimal high pollution
            regions.push(
                { x: 180, y: 100, radius: 35, intensity: 0.7, type: 'moderate' },
                { x: 300, y: 140, radius: 25, intensity: 0.6, type: 'moderate' },
                { x: 120, y: 150, radius: 20, intensity: 0.8, type: 'high' },
                { x: 250, y: 70, radius: 30, intensity: 0.4, type: 'clean' }
            );
            break;
        case 'Clean':
            // Mostly clean with very small moderate areas
            regions.push(
                { x: 200, y: 110, radius: 15, intensity: 0.4, type: 'moderate' },
                { x: 320, y: 130, radius: 12, intensity: 0.3, type: 'moderate' },
                { x: 150, y: 80, radius: 40, intensity: 0.5, type: 'clean' },
                { x: 280, y: 160, radius: 35, intensity: 0.6, type: 'clean' }
            );
            break;
    }
    
    return regions;
}

// Navigation Functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        AppState.currentPage = pageId;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');
        
        // Initialize page-specific content
        if (pageId === 'dashboard') {
            initializeDashboard();
        }
    }
}

// Upload Functions
function setupUploadHandlers() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
    
    // Image upload
    const imageUpload = document.getElementById('image-upload');
    const imageInput = document.getElementById('image-input');
    const analyzeImageBtn = document.getElementById('analyze-image');
    
    imageUpload.addEventListener('click', () => imageInput.click());
    imageUpload.addEventListener('dragover', handleDragOver);
    imageUpload.addEventListener('drop', handleImageDrop);
    
    imageInput.addEventListener('change', handleImageSelect);
    analyzeImageBtn.addEventListener('click', () => analyzeUpload(true));
    
    // Data upload
    const dataUpload = document.getElementById('data-upload');
    const dataInput = document.getElementById('data-input');
    const analyzeDataBtn = document.getElementById('analyze-data');
    
    dataUpload.addEventListener('click', () => dataInput.click());
    dataUpload.addEventListener('dragover', handleDragOver);
    dataUpload.addEventListener('drop', handleDataDrop);
    
    dataInput.addEventListener('change', handleDataSelect);
    analyzeDataBtn.addEventListener('click', () => analyzeUpload(false));
}

function handleDragOver(e) {
    e.preventDefault();
    e.target.closest('.upload-area').classList.add('drag-over');
}

function handleImageDrop(e) {
    e.preventDefault();
    e.target.closest('.upload-area').classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
}

function handleDataDrop(e) {
    e.preventDefault();
    e.target.closest('.upload-area').classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleDataFile(files[0]);
    }
}

function handleImageSelect(e) {
    if (e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
    }
}

function handleDataSelect(e) {
    if (e.target.files.length > 0) {
        handleDataFile(e.target.files[0]);
    }
}

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
    }
    
    if (file.size > 20 * 1024 * 1024) { // 10MB limit
        showToast('File size must be less than 10MB', 'error');
        return;
    }
    
    AppState.uploadedFile = file;
    
    // Show preview
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    
    previewImg.src = URL.createObjectURL(file);
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    preview.classList.remove('hidden');
    document.getElementById('analyze-image').disabled = false;
    
    showToast('Image uploaded successfully', 'success');
}

function handleDataFile(file) {
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
        showToast('Please select a valid CSV file', 'error');
        return;
    }
    
    AppState.uploadedFile = file;
    
    // Read and preview CSV
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        
        if (lines.length < 2) {
            showToast('CSV file must contain headers and data', 'error');
            return;
        }
        
        // Parse CSV and show preview
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < Math.min(6, lines.length); i++) {
            if (lines[i].trim()) {
                const row = lines[i].split(',').map(cell => cell.trim());
                data.push(row);
            }
        }
        
        displayDataPreview(headers, data);
        document.getElementById('analyze-data').disabled = false;
        showToast('CSV data loaded successfully', 'success');
    };
    
    reader.readAsText(file);
}

function displayDataPreview(headers, data) {
    const preview = document.getElementById('data-preview');
    const table = document.getElementById('data-table');
    
    // Clear existing content
    table.innerHTML = '';
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    preview.classList.remove('hidden');
}

function analyzeUpload(isImage) {
    if (!AppState.uploadedFile) {
        showToast('Please upload a file first', 'error');
        return;
    }
    
    // Show processing modal
    const modal = document.getElementById('processing-modal');
    modal.classList.remove('hidden');
    
    // Update processing steps
    setTimeout(() => {
        document.querySelectorAll('.step')[1].classList.add('completed');
        document.querySelectorAll('.step')[1].classList.remove('active');
        document.querySelectorAll('.step')[2].classList.add('active');
    }, 1500);
    
    // Simulate AI analysis
    simulateAIAnalysis(AppState.uploadedFile, isImage)
        .then(result => {
            AppState.analysisResults = result;
            
            // Hide processing modal
            modal.classList.add('hidden');
            
            // Show results
            showAnalysisResults(result);
            
            // Add to samples
            AppState.waterSamples.unshift(result);
            
            showToast('Analysis completed successfully', 'success');
        })
        .catch(error => {
            modal.classList.add('hidden');
            showToast('Analysis failed. Please try again.', 'error');
            console.error('Analysis error:', error);
        });
}

function showAnalysisResults(result) {
    const modal = document.getElementById('results-modal');
    
    // Update pollution level
    const levelElement = document.getElementById('result-level');
    const confidenceElement = document.getElementById('result-confidence');
    
    levelElement.textContent = result.pollution_level;
    levelElement.className = `pollution-level ${result.pollution_level.toLowerCase()}`;
    confidenceElement.textContent = Math.round(result.confidence * 100) + '%';
    
    // Update parameters
    const parametersContainer = document.getElementById('result-parameters');
    parametersContainer.innerHTML = '';
    
    const parameterLabels = {
        ph: 'pH Level',
        temperature: 'Temperature',
        turbidity: 'Turbidity',
        dissolved_oxygen: 'Dissolved Oxygen',
        tds: 'TDS',
        conductivity: 'Conductivity'
    };
    
    const parameterUnits = {
        ph: '',
        temperature: '°C',
        turbidity: 'NTU',
        dissolved_oxygen: 'mg/L',
        tds: 'mg/L',
        conductivity: 'μS/cm'
    };
    
    Object.entries(result.parameters).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'parameter-item';
        item.innerHTML = `
            <div class="parameter-value">${typeof value === 'number' ? value.toFixed(1) : value}</div>
            <div class="parameter-label">${parameterLabels[key]} ${parameterUnits[key]}</div>
        `;
        parametersContainer.appendChild(item);
    });
    
    // Update original image
    if (result.image_url) {
        const originalImg = document.getElementById('original-image');
        originalImg.src = result.image_url;
        
        // Generate segmentation overlay after image loads
        originalImg.onload = () => {
            generateSegmentationOverlay(result.image_url, result.segmentation_data || []);
            // Generate pollution insights after segmentation
            setTimeout(() => generatePollutionInsights(result), 500);
        };
    } else {
        // For CSV uploads, generate a synthetic base image
        generateSyntheticImageSegmentation(result.segmentation_data || []);
        // Generate pollution insights
        setTimeout(() => generatePollutionInsights(result), 500);
    }
    
    modal.classList.remove('hidden');
}

function generateSegmentationOverlay(imageUrl, segmentationData) {
    const canvas = document.getElementById('segmented-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;
    
    // Create base image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        // Draw base image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply segmentation overlay
        drawSegmentationRegions(ctx, segmentationData, canvas.width, canvas.height);
    };
    
    img.onerror = () => {
        // Fallback: create synthetic segmentation
        generateSyntheticImageSegmentation(segmentationData);
    };
    
    img.src = imageUrl;
}

function generateSyntheticImageSegmentation(segmentationData) {
    const canvas = document.getElementById('segmented-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;
    
    // Create a water-like base
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(0.5, '#0284c7');
    gradient.addColorStop(1, '#0369a1');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some water texture
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 20, 2);
    }
    
    // Apply segmentation overlay
    drawSegmentationRegions(ctx, segmentationData, canvas.width, canvas.height);
}

function drawSegmentationRegions(ctx, regions, canvasWidth, canvasHeight) {
    // Create overlay with transparency
    ctx.globalCompositeOperation = 'overlay';
    
    regions.forEach(region => {
        const colors = {
            'high': 'rgba(239, 68, 68, 0.7)',      // Red
            'moderate': 'rgba(245, 158, 11, 0.6)',  // Orange
            'clean': 'rgba(34, 197, 94, 0.4)'      // Green
        };
        
        // Scale region coordinates to canvas size
        const scaledX = (region.x / 400) * canvasWidth;
        const scaledY = (region.y / 200) * canvasHeight;
        const scaledRadius = (region.radius / 400) * canvasWidth;
        
        // Create radial gradient for the pollution region
        const gradient = ctx.createRadialGradient(
            scaledX, scaledY, 0,
            scaledX, scaledY, scaledRadius
        );
        
        const color = colors[region.type] || colors['moderate'];
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.7, color.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(scaledX, scaledY, scaledRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add intensity-based inner glow for high pollution
        if (region.type === 'high' && region.intensity > 0.7) {
            ctx.globalCompositeOperation = 'screen';
            const glowGradient = ctx.createRadialGradient(
                scaledX, scaledY, 0,
                scaledX, scaledY, scaledRadius * 0.5
            );
            glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            glowGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(scaledX, scaledY, scaledRadius * 0.5, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.globalCompositeOperation = 'overlay';
        }
    });
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    
    // Add border outline for regions
    regions.forEach(region => {
        const borderColors = {
            'high': '#dc2626',
            'moderate': '#d97706',
            'clean': '#16a34a'
        };
        
        const scaledX = (region.x / 400) * canvasWidth;
        const scaledY = (region.y / 200) * canvasHeight;
        const scaledRadius = (region.radius / 400) * canvasWidth;
        
        ctx.strokeStyle = borderColors[region.type] || borderColors['moderate'];
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(scaledX, scaledY, scaledRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
    });
}

// Dashboard Functions
function initializeDashboard() {
    if (!AppState.charts.trend) {
        createTrendChart();
    }
    if (!AppState.charts.parameters) {
        createParametersChart();
    }
    updateSamplesTable();
}

function createTrendChart() {
    const ctx = document.getElementById('trend-chart').getContext('2d');
    
    AppState.charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: AppState.pollutionTrends.map(item => item.month),
            datasets: [
                {
                    label: 'Clean',
                    data: AppState.pollutionTrends.map(item => item.clean),
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Moderate',
                    data: AppState.pollutionTrends.map(item => item.moderate),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'High',
                    data: AppState.pollutionTrends.map(item => item.high),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50
                }
            }
        }
    });
}

function createParametersChart() {
    const ctx = document.getElementById('parameters-chart').getContext('2d');
    
    // Calculate average parameters from recent samples
    const recentSamples = AppState.waterSamples.slice(0, 5);
    const avgParams = {
        ph: recentSamples.reduce((sum, s) => sum + s.parameters.ph, 0) / recentSamples.length,
        temperature: recentSamples.reduce((sum, s) => sum + s.parameters.temperature, 0) / recentSamples.length,
        turbidity: recentSamples.reduce((sum, s) => sum + s.parameters.turbidity, 0) / recentSamples.length,
        dissolved_oxygen: recentSamples.reduce((sum, s) => sum + s.parameters.dissolved_oxygen, 0) / recentSamples.length,
        tds: recentSamples.reduce((sum, s) => sum + s.parameters.tds, 0) / recentSamples.length
    };
    
    AppState.charts.parameters = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['pH Level', 'Temperature', 'Turbidity', 'Dissolved Oxygen', 'TDS'],
            datasets: [{
                label: 'Average Values',
                data: [
                    (avgParams.ph / 14) * 100, // Normalize pH to 0-100
                    (avgParams.temperature / 30) * 100, // Normalize temp to 0-100
                    Math.min((avgParams.turbidity / 50) * 100, 100), // Normalize turbidity
                    (avgParams.dissolved_oxygen / 15) * 100, // Normalize DO
                    Math.min((avgParams.tds / 1000) * 100, 100) // Normalize TDS
                ],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updateSamplesTable() {
    const tbody = document.querySelector('#samples-table tbody');
    tbody.innerHTML = '';
    
    AppState.waterSamples.forEach(sample => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sample.id}</td>
            <td>${sample.location}</td>
            <td>${sample.date}</td>
            <td><span class="pollution-level ${sample.pollution_level.toLowerCase()}">${sample.pollution_level}</span></td>
            <td>${Math.round(sample.confidence * 100)}%</td>
            <td>${sample.parameters.ph.toFixed(1)}</td>
            <td>${sample.parameters.temperature.toFixed(1)}°C</td>
            <td>
                <button class="btn btn--sm btn--outline" onclick="viewSampleDetails('${sample.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewSampleDetails(sampleId) {
    const sample = AppState.waterSamples.find(s => s.id === sampleId);
    if (sample) {
        showAnalysisResults(sample);
    }
}

// Search and Filter Functions
function setupSearchAndFilters() {
    const searchInput = document.getElementById('samples-search');
    const pollutionFilter = document.getElementById('pollution-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterSamples);
    }
    
    if (pollutionFilter) {
        pollutionFilter.addEventListener('change', filterSamples);
    }
}

function filterSamples() {
    const searchTerm = document.getElementById('samples-search')?.value.toLowerCase() || '';
    const pollutionLevel = document.getElementById('pollution-filter')?.value || 'all';
    
    let filteredSamples = AppState.waterSamples;
    
    // Filter by search term
    if (searchTerm) {
        filteredSamples = filteredSamples.filter(sample => 
            sample.location.toLowerCase().includes(searchTerm) ||
            sample.id.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by pollution level
    if (pollutionLevel !== 'all') {
        filteredSamples = filteredSamples.filter(sample => 
            sample.pollution_level === pollutionLevel
        );
    }
    
    // Update table with filtered results
    const tbody = document.querySelector('#samples-table tbody');
    tbody.innerHTML = '';
    
    filteredSamples.forEach(sample => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sample.id}</td>
            <td>${sample.location}</td>
            <td>${sample.date}</td>
            <td><span class="pollution-level ${sample.pollution_level.toLowerCase()}">${sample.pollution_level}</span></td>
            <td>${Math.round(sample.confidence * 100)}%</td>
            <td>${sample.parameters.ph.toFixed(1)}</td>
            <td>${sample.parameters.temperature.toFixed(1)}°C</td>
            <td>
                <button class="btn btn--sm btn--outline" onclick="viewSampleDetails('${sample.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Export Functions
function setupExportHandlers() {
    document.querySelectorAll('.export-option button').forEach(button => {
        button.addEventListener('click', (e) => {
            const text = e.target.textContent;
            if (text.includes('CSV')) {
                exportToCSV();
            } else if (text.includes('PDF')) {
                generatePDFReport();
            } else if (text.includes('JSON')) {
                exportToJSON();
            }
        });
    });
}

function exportToCSV() {
    const headers = ['Sample ID', 'Location', 'Date', 'Pollution Level', 'Confidence', 'pH', 'Temperature', 'Turbidity', 'Dissolved Oxygen', 'TDS', 'Conductivity'];
    const rows = AppState.waterSamples.map(sample => [
        sample.id,
        sample.location,
        sample.date,
        sample.pollution_level,
        (sample.confidence * 100).toFixed(1) + '%',
        sample.parameters.ph.toFixed(1),
        sample.parameters.temperature.toFixed(1),
        sample.parameters.turbidity.toFixed(1),
        sample.parameters.dissolved_oxygen.toFixed(1),
        sample.parameters.tds.toFixed(0),
        sample.parameters.conductivity.toFixed(0)
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    
    downloadFile(csvContent, 'water_samples.csv', 'text/csv');
    showToast('CSV export completed', 'success');
}

function generatePDFReport() {
    // Simulate PDF generation
    showToast('PDF report generation initiated', 'info');
    setTimeout(() => {
        showToast('PDF report would be generated in a real implementation', 'info');
    }, 2000);
}

function exportToJSON() {
    const data = {
        exportDate: new Date().toISOString(),
        totalSamples: AppState.waterSamples.length,
        samples: AppState.waterSamples,
        trends: AppState.pollutionTrends
    };
    
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'analytics_data.json', 'application/json');
    showToast('JSON export completed', 'success');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Modal Functions
function setupModalHandlers() {
    // Close modal handlers
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
            
            // --- CRITICAL ADDITION ---
            // This line cleans up the URL hash (#) which can cause the browser to loop or refresh.
            history.replaceState(null, null, ' '); 
            // -------------------------
        });
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Results modal buttons
    document.getElementById('save-result')?.addEventListener('click', () => {
        showToast('Result saved successfully', 'success');
        document.getElementById('results-modal').classList.add('hidden');
    });
    
    document.getElementById('export-result')?.addEventListener('click', () => {
        if (AppState.analysisResults) {
            const reportData = {
                ...AppState.analysisResults,
                generatedAt: new Date().toISOString()
            };
            const jsonContent = JSON.stringify(reportData, null, 2);
            downloadFile(jsonContent, `report_${AppState.analysisResults.id}.json`, 'application/json');
            showToast('Report exported successfully', 'success');
        }
    });
}

// Initialize Application
function initializeApp() {
    // Navigation event listeners
    document.querySelectorAll('[data-page]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.getAttribute('data-page') || e.target.closest('[data-page]').getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Setup various handlers
    setupUploadHandlers();
    setupSearchAndFilters();
    setupExportHandlers();
    setupModalHandlers();
    
    // Initialize dashboard if it's the current page
    if (AppState.currentPage === 'dashboard') {
        initializeDashboard();
    }
    
    showToast('River Pollution Detection System loaded successfully', 'success');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Pollution Insights Functions
function generatePollutionInsights(result) {
    // Calculate pollution areas from segmentation data
    const pollutionAreas = calculatePollutionAreas(result.segmentation_data || []);
    
    // Get enhanced data based on pollution level or generate realistic data
    const enhancedData = getEnhancedPollutionData(result.pollution_level, pollutionAreas);
    
    // Update statistics panel
    updateStatisticsPanel(enhancedData);
    
    // Create charts
    createPollutionDonutChart(enhancedData.pollution_areas);
    createSeverityGaugeChart(enhancedData.severity_score);
    
    // Update environmental impact assessment
    updateEnvironmentalAssessment(enhancedData);
    
    // Update recommendations
    updateRecommendations(enhancedData.recommendations);
    
    // Update trend indicator
    updateTrendIndicator(enhancedData.severity_score);
}

function calculatePollutionAreas(segmentationData) {
    if (!segmentationData.length) {
        return { high_pollution: 15, moderate_pollution: 25, clean_water: 60 };
    }
    
    let totalArea = 0;
    let highArea = 0;
    let moderateArea = 0;
    let cleanArea = 0;
    
    segmentationData.forEach(region => {
        const area = Math.PI * region.radius * region.radius;
        totalArea += area;
        
        if (region.type === 'high') {
            highArea += area;
        } else if (region.type === 'moderate') {
            moderateArea += area;
        } else {
            cleanArea += area;
        }
    });
    
    // Assume canvas area as base (400 * 200 = 80000)
    const canvasArea = 80000;
    const remainingArea = Math.max(0, canvasArea - totalArea);
    cleanArea += remainingArea;
    
    const totalCalculatedArea = highArea + moderateArea + cleanArea;
    
    return {
        high_pollution: (highArea / totalCalculatedArea) * 100,
        moderate_pollution: (moderateArea / totalCalculatedArea) * 100,
        clean_water: (cleanArea / totalCalculatedArea) * 100
    };
}

function getEnhancedPollutionData(pollutionLevel, calculatedAreas) {
    // Use predefined data as base and merge with calculated areas
    let baseData;
    switch (pollutionLevel) {
        case 'High':
        case 'Severe':
            baseData = EnhancedPollutionData.sample_2;
            break;
        case 'Moderate':
            baseData = EnhancedPollutionData.sample_1;
            break;
        case 'Clean':
        default:
            baseData = EnhancedPollutionData.sample_3;
            break;
    }
    
    // Merge calculated areas with base data
    return {
        ...baseData,
        pollution_areas: calculatedAreas,
        severity_score: calculateSeverityScore(calculatedAreas)
    };
}

function calculateSeverityScore(areas) {
    // Weighted average: High=1.0, Moderate=0.6, Clean=0.0
    return ((areas.high_pollution * 1.0) + (areas.moderate_pollution * 0.6) + (areas.clean_water * 0.0)) / 100;
}

function updateStatisticsPanel(data) {
    // Update percentage values with animation
    animateValue('high-pollution-percent', 0, data.pollution_areas.high_pollution, '%', 1);
    animateValue('moderate-pollution-percent', 0, data.pollution_areas.moderate_pollution, '%', 1);
    animateValue('clean-water-percent', 0, data.pollution_areas.clean_water, '%', 1);
    
    // Update severity score
    animateValue('severity-score', 0, data.severity_score, '', 2);
    
    // Update category with styling
    const categoryElement = document.getElementById('pollution-category');
    categoryElement.textContent = data.category;
    categoryElement.className = `metric-value ${data.category.toLowerCase()}`;
    
    // Update affected area
    animateValue('affected-area-sqm', 0, data.affected_area_sqm, '', 1);
}

function animateValue(elementId, start, end, suffix = '', decimals = 0) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const range = end - start;
    
    element.parentElement.classList.add('updating');
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (range * easeOut);
        
        element.textContent = current.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.parentElement.classList.remove('updating');
        }
    }
    
    requestAnimationFrame(updateValue);
}

function createPollutionDonutChart(areas) {
    const canvas = document.getElementById('pollution-donut-chart');
    if (!canvas) return;
    
    // Destroy existing chart if it exists
    if (AppState.pollutionInsightsCharts.donut) {
        AppState.pollutionInsightsCharts.donut.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    AppState.pollutionInsightsCharts.donut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['High Pollution', 'Moderate Pollution', 'Clean Water'],
            datasets: [{
                data: [areas.high_pollution, areas.moderate_pollution, areas.clean_water],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderColor: ['#dc2626', '#d97706', '#059669'],
                borderWidth: 2,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(1) + '%';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000
            }
        }
    });
}

function createSeverityGaugeChart(severityScore) {
    const canvas = document.getElementById('severity-gauge-chart');
    if (!canvas) return;
    
    // Update percentage display
    const gaugePercentage = document.getElementById('gauge-percentage');
    if (gaugePercentage) {
        animateValue('gauge-percentage', 0, severityScore * 100, '', 0);
    }
    
    // Destroy existing chart if it exists
    if (AppState.pollutionInsightsCharts.gauge) {
        AppState.pollutionInsightsCharts.gauge.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const percentage = severityScore * 100;
    
    // Create gauge chart as a doughnut with custom styling
    AppState.pollutionInsightsCharts.gauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: [
                    percentage < 30 ? '#10b981' : percentage < 70 ? '#f59e0b' : '#ef4444',
                    'rgba(0, 0, 0, 0.1)'
                ],
                borderWidth: 0,
                cutout: '75%',
                circumference: 180,
                rotation: 270
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000
            }
        }
    });
}

function updateEnvironmentalAssessment(data) {
    // Update water quality status
    const waterQualityElement = document.getElementById('water-quality-status');
    const waterQualityDescElement = document.getElementById('water-quality-desc');
    
    if (waterQualityElement && waterQualityDescElement) {
        waterQualityElement.textContent = data.water_quality_status;
        waterQualityElement.className = `assessment-value ${data.water_quality_status.toLowerCase()}`;
        
        const descriptions = {
            'Safe': 'Suitable for consumption with standard treatment',
            'Caution': 'Additional treatment required before consumption',
            'Unsafe': 'Not suitable for consumption - health risk'
        };
        waterQualityDescElement.textContent = descriptions[data.water_quality_status] || descriptions['Safe'];
    }
    
    // Update ecosystem impact
    const ecosystemElement = document.getElementById('ecosystem-impact');
    const ecosystemDescElement = document.getElementById('ecosystem-desc');
    
    if (ecosystemElement && ecosystemDescElement) {
        ecosystemElement.textContent = data.ecosystem_impact;
        
        const descriptions = {
            'Low': 'Minimal impact on aquatic life',
            'Medium': 'Moderate stress on aquatic ecosystem',
            'High': 'Severe threat to aquatic biodiversity'
        };
        ecosystemDescElement.textContent = descriptions[data.ecosystem_impact] || descriptions['Low'];
    }
    
    // Update compliance status
    const complianceElement = document.getElementById('compliance-status');
    
    if (complianceElement) {
        complianceElement.textContent = data.compliance_status;
    }
}

function updateRecommendations(recommendations) {
    const recommendationsContainer = document.getElementById('recommendations-list');
    if (!recommendationsContainer) return;
    
    recommendationsContainer.innerHTML = '';
    
    recommendations.forEach((recommendation, index) => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        
        const icons = ['fas fa-exclamation-triangle', 'fas fa-eye', 'fas fa-cog'];
        const icon = icons[index % icons.length];
        
        item.innerHTML = `
            <div class="recommendation-icon">
                <i class="${icon}"></i>
            </div>
            <div class="recommendation-text">${recommendation}</div>
        `;
        
        // Animate entry
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        recommendationsContainer.appendChild(item);
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function updateTrendIndicator(severityScore) {
    const trendArrow = document.getElementById('trend-arrow');
    const trendText = document.getElementById('trend-text');
    
    if (!trendArrow || !trendText) return;
    
    // Determine trend based on severity score
    let direction, text, iconClass;
    
    if (severityScore > 0.7) {
        direction = 'up';
        text = 'Above average pollution levels detected';
        iconClass = 'fas fa-arrow-up';
    } else if (severityScore < 0.3) {
        direction = 'down';
        text = 'Below average pollution levels detected';
        iconClass = 'fas fa-arrow-down';
    } else {
        direction = 'stable';
        text = 'Normal pollution levels detected';
        iconClass = 'fas fa-minus';
    }
    
    trendArrow.className = `${iconClass} trend-arrow ${direction}`;
    trendText.textContent = text;
}

// Make functions globally available for onclick handlers
window.viewSampleDetails = viewSampleDetails;
window.showPage = showPage;
window.generatePollutionInsights = generatePollutionInsights;