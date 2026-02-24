// --- STATE MANAGEMENT ---
let userProfile = {
    username: '',
    gender: 'male',
    age: 30,
    height: 180,
    weight: 85,
    tdee: 2500
};

// Daily Data
let dailyData = {
    totalKcal: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    meals: []
};


// --- CONFIGURATION ---
// Povezano sa tvojim Google Apps Scriptom
const API_URL = 'https://script.google.com/macros/s/AKfycbzydHpTGEyigElRio20Il0ga_S4awAnAlvrijkIFw789yc7xIDr40_q-OpcySKungel/exec';

// --- DOM ELEMENTS ---
const screens = {
    onboarding: document.getElementById('screenOnboarding'),
    dashboard: document.getElementById('screenDashboard'),
    stats: document.getElementById('screenStats')
};

const fabCamera = document.getElementById('fabCamera');
const inpCamera = document.getElementById('inpCamera');
const mealsList = document.getElementById('mealsList');
const textInputBar = document.getElementById('textInputBar');
const inpTextMeal = document.getElementById('inpTextMeal');
const btnSendText = document.getElementById('btnSendText');
const btnVoice = document.getElementById('btnVoice');

// Cropper DOM Elements
const cropModal = document.getElementById('cropModal');
const cropImage = document.getElementById('cropImage');
const btnCancelCrop = document.getElementById('btnCancelCrop');
const btnConfirmCrop = document.getElementById('btnConfirmCrop');
let cropperInstance = null;

// PWA Install Prompt
let deferredPrompt;
const installModal = document.getElementById('installModal');
const btnCancelInstall = document.getElementById('btnCancelInstall');
const btnConfirmInstall = document.getElementById('btnConfirmInstall');

// --- INITIALIZATION ---
function init() {
    registerServiceWorker();
    loadProfile();
    loadDailyData();
    bindEvents();
}

function loadDailyData() {
    const saved = localStorage.getItem('calorieShark_daily');
    const today = new Date().toLocaleDateString('hr-HR');

    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) {
            dailyData = parsed.data;
        } else {
            // Novi dan, resetiraj
            dailyData = { totalKcal: 0, carbs: 0, protein: 0, fat: 0, meals: [] };
        }
    }
}

function saveDailyData() {
    const today = new Date().toLocaleDateString('hr-HR');
    localStorage.setItem('calorieShark_daily', JSON.stringify({
        date: today,
        data: dailyData
    }));
}

function loadProfile() {
    const saved = localStorage.getItem('calorieShark_profile');

    if (saved) {
        userProfile = JSON.parse(saved);

        // Populate inputs if they go back to settings
        document.getElementById('inpUsername').value = userProfile.username || '';
        document.getElementById('inpAge').value = userProfile.age || 30;
        document.getElementById('inpHeight').value = userProfile.height || 180;
        document.getElementById('inpWeight').value = userProfile.weight || 85;

        // Populate active gender
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            if (btn.dataset.gender === userProfile.gender) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        showScreen('dashboard');
        updateDashboardUI();
    } else {
        showScreen('onboarding');
    }
}

function bindEvents() {
    // Gender Toggles
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            userProfile.gender = e.target.dataset.gender;
        });
    });

    // Save Profile
    document.getElementById('btnSaveProfile').addEventListener('click', () => {
        const usernameVal = document.getElementById('inpUsername').value.trim();
        if (!usernameVal) {
            alert("Molimo unesite korisničko ime!");
            return;
        }

        userProfile.username = usernameVal;
        userProfile.age = parseInt(document.getElementById('inpAge').value);
        userProfile.height = parseInt(document.getElementById('inpHeight').value);
        userProfile.weight = parseFloat(document.getElementById('inpWeight').value);

        calculateTDEE();
        localStorage.setItem('calorieShark_profile', JSON.stringify(userProfile));

        showScreen('dashboard');
        updateDashboardUI();
    });

    // Camera FAB
    fabCamera.addEventListener('click', () => {
        inpCamera.click();
    });

    inpCamera.addEventListener('change', handleImageUpload);

    // Settings Button
    document.getElementById('btnSettings').addEventListener('click', () => {
        showScreen('onboarding');
    });

    // Stats Button
    const btnStats = document.getElementById('btnStats');
    if (btnStats) {
        btnStats.addEventListener('click', () => {
            showScreen('stats');
            fetchAndRenderHistory();
        });
    }

    // Text & Voice Input
    btnSendText.addEventListener('click', () => {
        const text = inpTextMeal.value.trim();
        if (text) {
            handleTextUpload(text);
        }
    });

    inpTextMeal.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = inpTextMeal.value.trim();
            if (text) {
                handleTextUpload(text);
            }
        }
    });

    btnVoice.addEventListener('click', handleVoiceInput);
}

// --- CORE LOGIC ---
function calculateTDEE() {
    // Mifflin-St Jeor Equation
    let bmr = (10 * userProfile.weight) + (6.25 * userProfile.height) - (5 * userProfile.age);
    bmr += (userProfile.gender === 'male') ? 5 : -161;

    // Light activity multiplier as default for modern office workers
    userProfile.tdee = Math.round(bmr * 1.375);
}

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    fabCamera.classList.add('hidden');
    textInputBar.classList.add('hidden');

    if (screenId === 'dashboard') {
        screens.dashboard.classList.remove('hidden');
        fabCamera.classList.remove('hidden');
        textInputBar.classList.remove('hidden');
    } else if (screenId === 'onboarding') {
        screens.onboarding.classList.remove('hidden');
    } else if (screenId === 'stats') {
        screens.stats.classList.remove('hidden');
        // Dodajemo mali back button efekt na top-nav logo klikom (povratak na dashboard)
        document.querySelector('.brand-text').onclick = () => showScreen('dashboard');
        document.querySelector('.brand-text').style.cursor = 'pointer';
    }
}

// PWA Service Worker & Install Logic
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker Registriran'))
            .catch(err => console.error('Service Worker Greska:', err));
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default Chrome mini-infobar
    e.preventDefault();
    deferredPrompt = e;

    // Show our custom modal if they haven't installed it
    setTimeout(() => {
        installModal.classList.remove('hidden');
    }, 2000); // Pokazi 2 sekunde nakon loada
});

if (btnCancelInstall && btnConfirmInstall) {
    btnCancelInstall.addEventListener('click', () => {
        installModal.classList.add('hidden');
        deferredPrompt = null;
    });

    btnConfirmInstall.addEventListener('click', async () => {
        installModal.classList.add('hidden');
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
        }
    });
}

function updateDashboardUI() {
    document.getElementById('lblKcalTarget').textContent = userProfile.tdee;

    // Update graphic ring
    const radius = 45;
    const circumference = 2 * Math.PI * radius; // ~283
    const percent = Math.min(dailyData.totalKcal / userProfile.tdee, 1);
    const offset = circumference - (percent * circumference);

    const progressCircle = document.getElementById('kcalProgress');
    progressCircle.style.strokeDashoffset = offset;

    // Color logic
    if (percent > 1.0) progressCircle.style.stroke = '#FF2A2A'; // Red if over
    else progressCircle.style.stroke = 'var(--accent-cyan)';

    // Obavezno iscrtaj povijest
    renderDailyMeals();
}

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!API_URL) {
        alert("Molimo unesite Google Apps Script Web App URL u postavkama!");
        showScreen('onboarding');
        return;
    }

    // Prikaz Crop Modala
    const reader = new FileReader();
    reader.onload = function (event) {
        cropImage.src = event.target.result;
        cropModal.classList.remove('hidden');

        if (cropperInstance) {
            cropperInstance.destroy();
        }

        cropperInstance = new Cropper(cropImage, {
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
    };
    reader.readAsDataURL(file);
}

// Otkazivanje Croppera
btnCancelCrop.addEventListener('click', () => {
    cropModal.classList.add('hidden');
    if (cropperInstance) cropperInstance.destroy();
    inpCamera.value = ''; // Resetiraj input da se može opet kliknuti
});

// Potvrda Croppera i Slanje na AI
btnConfirmCrop.addEventListener('click', async () => {
    if (!cropperInstance) return;

    // Uzmi izrezani dio
    const canvas = cropperInstance.getCroppedCanvas({
        maxWidth: 1024,
        maxHeight: 1024
    });

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.8);

    // Sakrij modal i očisti
    cropModal.classList.add('hidden');
    cropperInstance.destroy();
    inpCamera.value = '';

    // Skeleton loading UI
    mealsList.innerHTML = `<div class="empty-state" style="color:var(--accent-cyan);"><i class="fas fa-spinner fa-spin"></i><p>Šaljem izrezanu sliku na AI analizu...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
                action: 'analyzeImage',
                imageBase64: croppedBase64 // Šaljemo izrezani base64 umjesto originala
            })
        });

        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            throw new Error("Losa struktura odgovora: " + responseText.substring(0, 100));
        }

        if (result.status === 'success') {
            renderAIResult(result.data);
        } else {
            throw new Error(result.message || "Nepoznata greska s API-ja");
        }

    } catch (err) {
        console.error("Greska pri uploadu okrnjene slike:", err);
        mealsList.innerHTML = `<div class="empty-state" style="color:#FF2A2A;"><i class="fas fa-exclamation-triangle"></i><p>Greska: ${err.message}</p></div>`;
    }
});



// Tekstualni i Glasovni "Upload"
async function handleTextUpload(text) {
    if (!API_URL) {
        alert("Nije postavljen sustav (Google API_URL). Vratite se na postavke onboardinga.");
        return;
    }

    inpTextMeal.value = "";
    mealsList.innerHTML = `<div class="empty-state" style="color:var(--accent-cyan);"><i class="fas fa-spinner fa-spin"></i><p>Analiziram tekst obroka s AI...</p></div>`;

    // Scrolaj na vrh
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
                action: 'analyzeMeal',
                textDescription: text
            })
        });

        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            throw new Error("Losa struktura odgovora: " + responseText.substring(0, 100));
        }

        if (result.status === 'success') {
            renderAIResult(result.data);
        } else {
            throw new Error(result.message || "Nepoznata greska s API-ja");
        }

    } catch (err) {
        console.error("Greska pri uploadu teksta:", err);
        mealsList.innerHTML = `<div class="empty-state" style="color:#FF2A2A;"><i class="fas fa-exclamation-triangle"></i><p>AI greška: ${err.message}</p></div>`;
    }
}

// Web Speech API
function handleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Žao mi je, vaš preglednik ne podržava glasovni unos. (Pokušajte Chrome ili Safari).");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'hr-HR'; // Hrvatski jezik po defaultu
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
        btnVoice.classList.add('recording-pulse');
        inpTextMeal.placeholder = "Slušam... Pričaj sada!";
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        inpTextMeal.value = transcript;

        // Automatski pošalji text na analizu ako je uspjesno prepoznao
        setTimeout(() => {
            handleTextUpload(transcript);
        }, 800);
    };

    recognition.onspeechend = function () {
        recognition.stop();
        btnVoice.classList.remove('recording-pulse');
        inpTextMeal.placeholder = "Upiši ili izgovori obrok...";
    };

    recognition.onerror = function (event) {
        btnVoice.classList.remove('recording-pulse');
        inpTextMeal.placeholder = "Greška s mikrofonom. Pokušaj ponovno.";
        console.error("Speech recognition error", event.error);
    };

    recognition.start();
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

let currentUnsavedMeal = null;

function renderAIResult(aiJson) {
    if (!aiJson || !aiJson.items || aiJson.items.length === 0) {
        mealsList.innerHTML = `<div class="empty-state"><i class="fas fa-question-circle"></i><p>Nisam uspio prepoznati hranu. Pokušaj ponovno s jasnijom slikom.</p></div>`;
        return;
    }

    currentUnsavedMeal = aiJson;
    drawPendingMealUI();
}

function drawPendingMealUI() {
    let html = `<div class="pending-meal">
                    <h3 style="color:var(--accent-cyan); margin-bottom:15px;"><i class="fas fa-robot"></i> AI ANALIZA OBROKA</h3>`;

    let totalKcal = 0;

    currentUnsavedMeal.items.forEach((item, index) => {
        // Izračun trenutnih kalorija na bazi procijenjene gramaže
        const factor = item.estimatedWeightG / 100;
        const currentKcal = Math.round(item.kcalPer100g * factor);
        totalKcal += currentKcal;

        html += `
        <div class="meal-item-editor" style="background: rgba(255,255,255,0.05); padding:15px; border-radius:8px; margin-bottom:10px; border-left: 3px solid var(--accent-orange);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <strong>${item.name}</strong>
                <span style="color:var(--accent-cyan); font-weight:bold;">${currentKcal} kcal</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <label style="font-size:0.8rem; color:var(--text-muted);">Gramaža:</label>
                <input type="number" class="gram-input" data-index="${index}" value="${item.estimatedWeightG}" style="width:70px; padding:5px; border-radius:4px; border:1px solid var(--border-color); background:#FAFCFF; color:#2C3E50; text-align:center;">
                <span style="font-size:0.8rem; color:var(--text-muted);">g (AI procijenio)</span>
            </div>
        </div>`;
    });

    html += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin: 20px 0; padding-top:15px; border-top: 1px solid var(--border-color);">
            <strong style="font-size:1.2rem;">UKUPNO:</strong>
            <strong style="font-size:1.5rem; color:var(--accent-orange);">${totalKcal} kcal</strong>
        </div>
        <button id="btnConfirmMeal" class="primary-btn"><i class="fas fa-check"></i> SPREMI U DNEVNIK</button>
        <button id="btnCancelMeal" class="icon-btn" style="width:100%; margin-top:10px; color:var(--text-muted); font-size:1rem;"><i class="fas fa-times"></i> Odbaci</button>
    </div>`;

    mealsList.innerHTML = html;

    // Attach Listeners za mjenjanje gramaže
    document.querySelectorAll('.gram-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const idx = e.target.getAttribute('data-index');
            const newGrams = parseInt(e.target.value) || 0;
            currentUnsavedMeal.items[idx].estimatedWeightG = newGrams;
            drawPendingMealUI(); // Re-render to update calculations
        });
    });

    document.getElementById('btnConfirmMeal').addEventListener('click', saveMealToServer);
    document.getElementById('btnCancelMeal').addEventListener('click', () => {
        currentUnsavedMeal = null;
        mealsList.innerHTML = `<div class="empty-state"><i class="fas fa-utensils"></i><p>Nema zabilježenih obroka danas.</p></div>`;
    });
}

async function saveMealToServer() {
    const btn = document.getElementById('btnConfirmMeal');
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> SPREMAM...`;
    btn.disabled = true;

    // Preracunavanje totala makrosa
    let totals = { kcal: 0, carbs: 0, protein: 0, fat: 0 };
    currentUnsavedMeal.items.forEach(item => {
        const factor = item.estimatedWeightG / 100;
        totals.kcal += item.kcalPer100g * factor;
        if (item.macrosPer100g) {
            totals.carbs += (item.macrosPer100g.carbs || 0) * factor;
            totals.protein += (item.macrosPer100g.protein || 0) * factor;
            totals.fat += (item.macrosPer100g.fat || 0) * factor;
        }
    });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Izbjegava CORS preflight
            body: JSON.stringify({
                action: 'saveMeal',
                username: userProfile.username,
                userInfo: userProfile,
                mealData: {
                    items: currentUnsavedMeal.items,
                    totals: totals
                }
            })
        });

        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            throw new Error("Neispravan odgovor sa servera: " + responseText.substring(0, 100));
        }

        if (result.status === 'success') {
            applyMealToDashboard(currentUnsavedMeal.items, totals);
            currentUnsavedMeal = null;
            mealsList.innerHTML = `<div class="empty-state" style="color:var(--accent-cyan);"><i class="fas fa-check-circle"></i><p>Obrok uspješno spremljen!</p></div>`;
            setTimeout(() => {
                renderDailyMeals();
            }, 1500);
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        console.error("Greška pri spremanju:", err);
        alert("Greška pri spremanju: " + err.message);
        btn.innerHTML = `<i class="fas fa-check"></i> POKUŠAJ PONOVNO`;
        btn.disabled = false;
    }
}

function applyMealToDashboard(items, totals) {
    dailyData.totalKcal += totals.kcal;
    dailyData.carbs += totals.carbs;
    dailyData.protein += totals.protein;
    dailyData.fat += totals.fat;

    // Spremamo obrok lokalno u niz za današnji dan
    dailyData.meals.push({
        time: new Date().toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }),
        items: items,
        totals: totals
    });

    document.getElementById('lblKcalEaten').textContent = Math.round(dailyData.totalKcal);
    document.getElementById('lblCarbs').textContent = Math.round(dailyData.carbs) + "g";
    document.getElementById('lblProtein').textContent = Math.round(dailyData.protein) + "g";
    document.getElementById('lblFat').textContent = Math.round(dailyData.fat) + "g";

    saveDailyData();
    updateDashboardUI();
}

function renderDailyMeals() {
    if (dailyData.meals.length === 0) {
        mealsList.innerHTML = `<div class="empty-state"><i class="fas fa-utensils"></i><p>Nema zabilježenih obroka danas.</p></div>`;
        return;
    }

    let html = '';
    // Prikazujemo najnovije na vrhu (reverse)
    const reversedMeals = [...dailyData.meals].reverse();

    reversedMeals.forEach((meal, reversedIndex) => {
        const originalIndex = dailyData.meals.length - 1 - reversedIndex;
        let mealDesc = meal.items.map(item => `${item.name} (${item.estimatedWeightG}g)`).join(', ');

        html += `
        <div style="background: var(--bg-card); padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid var(--accent-cyan); box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex:1;">
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:5px;"><i class="fas fa-clock"></i> ${meal.time}</div>
                    <div style="font-weight:bold; font-size:0.95rem; color:var(--text-main); line-height:1.4;">${mealDesc}</div>
                </div>
                <div style="font-size:1.3rem; font-weight:900; color:var(--accent-orange); margin-left:15px; text-align:right;">
                    ${Math.round(meal.totals.kcal)}<br><span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">kcal</span>
                </div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border-color);">
                <button class="btn-edit-meal" data-index="${originalIndex}" style="background: none; border: none; color: var(--accent-cyan); cursor: pointer; padding: 5px; font-size: 0.9rem;">
                    <i class="fas fa-edit"></i> Uredi
                </button>
                <button class="btn-delete-meal" data-index="${originalIndex}" style="background: none; border: none; color: #FF2A2A; cursor: pointer; padding: 5px; font-size: 0.9rem;">
                    <i class="fas fa-trash"></i> Izbriši
                </button>
            </div>
        </div>
        `;
    });

    mealsList.innerHTML = html;

    // Attach Listeners
    document.querySelectorAll('.btn-delete-meal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            if (confirm("Jeste li sigurni da želite obrisati ovaj obrok?")) {
                deleteMeal(index);
            }
        });
    });

    document.querySelectorAll('.btn-edit-meal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            editMeal(index);
        });
    });
}

function editMeal(index) {
    // Spremi stari obrok u varijablu da imamo pocetne stavke za edit UI
    // Duboka kopija da ne mutiramo orginal dok se ne spremi
    currentUnsavedMeal = JSON.parse(JSON.stringify({ items: dailyData.meals[index].items }));

    // Odmah obrišemo originalni obrok, tako da kada završi u "Pending UI" ponovno zbrajanje ne dupla podatke
    deleteMeal(index);

    // Skoči na vrh i nacrtaj pending UI sa tim starim stavkama
    window.scrollTo({ top: 0, behavior: 'smooth' });
    drawPendingMealUI();
}

function deleteMeal(index) {
    const meal = dailyData.meals[index];

    // Oduzimanje makrosa
    dailyData.totalKcal -= meal.totals.kcal;
    dailyData.carbs -= meal.totals.carbs;
    dailyData.protein -= meal.totals.protein;
    dailyData.fat -= meal.totals.fat;

    // Fix floating point sub-zero rendering issues
    if (dailyData.totalKcal < 0) dailyData.totalKcal = 0;
    if (dailyData.carbs < 0) dailyData.carbs = 0;
    if (dailyData.protein < 0) dailyData.protein = 0;
    if (dailyData.fat < 0) dailyData.fat = 0;

    // Brisanje iz Array-a
    dailyData.meals.splice(index, 1);

    // Update screen
    document.getElementById('lblKcalEaten').textContent = Math.round(dailyData.totalKcal);
    document.getElementById('lblCarbs').textContent = Math.round(dailyData.carbs) + "g";
    document.getElementById('lblProtein').textContent = Math.round(dailyData.protein) + "g";
    document.getElementById('lblFat').textContent = Math.round(dailyData.fat) + "g";

    saveDailyData();
    renderDailyMeals();
    updateDashboardUI();
}

// ==========================================
// CLOUD STATISTIKA I GRAFOVI
// ==========================================
let kcalChartInstance = null;

async function fetchAndRenderHistory() {
    const listEl = document.getElementById('cloudMealsList');
    listEl.innerHTML = `<div class="empty-state" style="color:var(--accent-cyan);"><i class="fas fa-spinner fa-spin"></i><p>Povlačim podatke s Clouda...</p></div>`;

    if (!userProfile.username) {
        listEl.innerHTML = `<div class="empty-state" style="color:#FF2A2A;"><i class="fas fa-exclamation-triangle"></i><p>Nedostaje korisničko ime. Odi u Postavke.</p></div>`;
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'getHistory',
                username: userProfile.username
            })
        });

        const responseText = await response.text();
        const result = JSON.parse(responseText);

        if (result.status === 'success') {
            renderStatsUI(result.data);
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        console.error("Greška pri dohvaćanju povijesti:", err);
        listEl.innerHTML = `<div class="empty-state" style="color:#FF2A2A;"><i class="fas fa-exclamation-triangle"></i><p>Greška: ${err.message}</p></div>`;
    }
}

function renderStatsUI(meals) {
    const listEl = document.getElementById('cloudMealsList');

    if (!meals || meals.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><p>Još nemaš spremljenih obroka u Cloudu.</p></div>`;

        // Uništi stari graf ako postoji (nema podataka)
        if (kcalChartInstance) kcalChartInstance.destroy();
        return;
    }

    // 1. Grupiranje kalorija po datumima za Chart.js
    const dailySums = {};
    meals.forEach(m => {
        // Pretvaramo "dd.MM.yyyy" u kraći format "dd.MM."
        const shortDate = m.date.substring(0, 5);
        if (!dailySums[shortDate]) dailySums[shortDate] = 0;
        dailySums[shortDate] += m.totals.kcal;
    });

    // Chart.js očekuje nizove za X i Y os (moramo ih obrnuti jer su sortirani od najnovijeg nazad)
    const labels = Object.keys(dailySums).reverse();
    const dataKcal = Object.values(dailySums).reverse();

    // TDEE linija (Target) kreira se ispunjavajući niz istim brojem
    const tdeeLine = Array(labels.length).fill(userProfile.tdee);

    // Bojanje stupaca (Crveno ako prelazi TDEE, Lagana plava ako je ispod)
    const barColors = dataKcal.map(val => val > userProfile.tdee ? '#FF2A2A' : '#00A8B5');

    // Crtanje Grafa
    const ctx = document.getElementById('kcalChart').getContext('2d');

    if (kcalChartInstance) {
        kcalChartInstance.destroy(); // Uništi stari graf ako postoji prije crtanja novog
    }

    // Chart.js globalne postavke za dark mode estetiku
    Chart.defaults.color = '#7f8c8d';
    Chart.defaults.font.family = "'Orbitron', sans-serif";

    kcalChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'TDEE Cilj',
                    data: tdeeLine,
                    borderColor: '#2C3E50',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    type: 'bar',
                    label: 'Unos (kcal)',
                    data: dataKcal,
                    backgroundColor: barColors,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 2. Iscrtavanje kronološke liste ispod grafa
    let html = '';
    let currentDateDivider = '';

    meals.forEach(meal => {
        // Razdvajanje po datumima vizualno
        if (meal.date !== currentDateDivider) {
            html += `<div style="background:var(--border-color); padding:5px 10px; border-radius:4px; font-weight:bold; font-size:0.8rem; margin:15px 0 5px 0; color:var(--text-main);">${meal.date}</div>`;
            currentDateDivider = meal.date;
        }

        let mealDesc = meal.items.map(i => `${i.name} (${i.estimatedWeightG}g)`).join(', ');

        html += `
        <div style="background: var(--bg-card); padding: 10px; border-radius: 6px; margin-bottom: 5px; border-left: 3px solid var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <div style="font-size:0.75rem; color:var(--text-muted);"><i class="fas fa-clock"></i> ${meal.time}</div>
                <div style="font-size:0.9rem; color:var(--text-main); line-height:1.2;">${mealDesc}</div>
            </div>
            <div style="font-size:1rem; font-weight:bold; color:var(--accent-orange); margin-left:10px;">
                ${Math.round(meal.totals.kcal)} <span style="font-size:0.6rem; color:var(--text-muted);">kcal</span>
            </div>
        </div>
        `;
    });

    listEl.innerHTML = html;
}

// Boot
document.addEventListener('DOMContentLoaded', init);
