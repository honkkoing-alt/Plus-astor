// 1. قائمة التطبيقات ومعلومات الشحن (لوحة التحكم بالأسعار والكميات الأدنى)
const appsData = [
    // [pricePer1000] هو سعر كل 1000 وحدة. [minQuantity] هو أقل كمية مسموح بها.
    { name: "كوكو لايف", id: "koko", img: "https://example.com/koko.png", unitName: "كوينز", pricePer1000: 9, minQuantity: 100 },
    { name: "اوهلا شات", id: "ohla", img: "https://example.com/ohla.png", unitName: "ماسة", pricePer1000: 15, minQuantity: 50 },
    { name: "وناسة", id: "wanasa", img: "https://example.com/wanasa.png", unitName: "نقطة", pricePer1000: 20, minQuantity: 500 },
    { name: "هلا شات", id: "hala", img: "https://example.com/hala.png", unitName: "كوينز", pricePer1000: 10, minQuantity: 300 },
    { name: "مرحبا شات", id: "marhaba", img: "https://example.com/marhaba.png", unitName: "عملة", pricePer1000: 25, minQuantity: 100 },
    { name: "سول شيل", id: "soulchill", img: "https://example.com/soulchill.png", unitName: "رصيد", pricePer1000: 11, minQuantity: 100 },
    { name: "سول يو", id: "soulyou", img: "https://example.com/soulyou.png", unitName: "ماسة", pricePer1000: 16, minQuantity: 50 },
    { name: "تاكا تاكا", id: "takataka", img: "https://example.com/takataka.png", unitName: "نقطة", pricePer1000: 12, minQuantity: 1000 },
    { name: "بارتي ستار", id: "partystar", img: "https://example.com/partystar.png", unitName: "قطعة", pricePer1000: 15, minQuantity: 500 },
    { name: "بيغو لايف", id: "bigo", img: "https://example.com/bigo.png", unitName: "ماسة", pricePer1000: 23.8, minQuantity: 420 },
    { name: "ليجو لايف", id: "lego", img: "https://example.com/lego.png", unitName: "كوينز", pricePer1000: 15, minQuantity: 1000 }
    // يمكنك إضافة المزيد هنا
];

const container = document.querySelector('.app-list-container');
const modal = document.getElementById('purchaseModal');
const closeButton = document.querySelector('.close-button');
const quantityInput = document.getElementById('quantity');
const priceDisplay = document.getElementById('currentPrice');
let currentApp = null; 

// 💡 متغيرات وأزرار الإشعار المخصص
const customAlert = document.getElementById('customAlert');
const customAlertMessage = document.getElementById('customAlertMessage');
const customAlertCloseButton = document.getElementById('customAlertCloseButton');

// 💡 دالة لإظهار الإشعار المخصص بدلاً من alert()
function showCustomAlert(message) {
    customAlertMessage.innerHTML = message;
    customAlert.style.display = 'block';
}

customAlertCloseButton.onclick = function() {
    customAlert.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    // 💡 إغلاق الإشعار المخصص عند الضغط خارج حدوده
    if (event.target == customAlert) {
        customAlert.style.display = 'none';
    }
}


// 2. إنشاء بطاقات التطبيقات في HTML
appsData.forEach(app => {
    const card = document.createElement('div');
    card.classList.add('app-card');
    card.setAttribute('data-app-id', app.id);
    card.innerHTML = `
        <img src="${app.img}" alt="صورة ${app.name}">
        <div class="app-name-box">
            ${app.name}
        </div>
    `;
    card.addEventListener('click', () => openPurchaseModal(app));
    container.appendChild(card);
});

// 3. فتح نافذة الشراء (المودال)
function openPurchaseModal(app) {
    currentApp = app;
    document.getElementById('modalAppName').textContent = app.name;
    document.getElementById('modalAppImage').src = app.img;
    document.getElementById('userId').value = ''; 
    document.getElementById('quantity').value = ''; 
    
    // تغيير placeholder الكمية ليوضح الوحدة والحد الأدنى
    document.getElementById('quantity').placeholder = `أدخل الكمية المطلوبة (${app.unitName}، الحد الأدنى: ${app.minQuantity})`;

    // ربط حقل الكمية النصي بتحديث السعر فوراً عند الكتابة
    document.getElementById('quantity').oninput = updatePriceDisplay;
    
    priceDisplay.textContent = '0'; 
    modal.style.display = 'block';
}

// 4. تحديث عرض السعر (منطق الحساب الجديد)
function updatePriceDisplay() {
    // إزالة أي نص غير رقمي والسماح فقط للأرقام
    const quantityValue = parseFloat(document.getElementById('quantity').value.replace(/[^0-9.]/g, ''));
    
    let price = 0;
    
    if (currentApp && !isNaN(quantityValue) && quantityValue > 0) {
        // formula: Price = (Input Quantity / 1000) * Price Per 1000
        price = (quantityValue / 1000) * currentApp.pricePer1000;
        
        // عرض السعر مع تقريب لأقرب سنتين
        priceDisplay.textContent = price.toFixed(2);
        return;
    }
    
    priceDisplay.textContent = '0';
}

// 6. وظيفة إتمام الطلب (مع فحص الحد الأدنى ورسالة التحذير المخصصة)
function completePurchase() {
    const userId = document.getElementById('userId').value;
    const quantityText = document.getElementById('quantity').value;
    const quantityValue = parseFloat(quantityText.replace(/[^0-9.]/g, '')); // القيمة الرقمية المدخلة
    
    const minQ = currentApp.minQuantity;

    if (!userId) {
        showCustomAlert("الرجاء إدخال إيدي المستخدم.");
        return;
    }

    if (isNaN(quantityValue) || quantityValue < minQ) {
        showCustomAlert(`الرجاء إدخال كمية صحيحة، الحد الأدنى هو ${minQ} ${currentApp.unitName}.`);
        return;
    }
    
    // رسالة التحذير المطلوبة (محاكاة فشل عملية الدفع)
    showCustomAlert("❌ رصيدك غير كاف لإتمام هذه العملية! 🔴");
    
    // إغلاق النافذة الأساسية بعد محاولة الطلب الفاشلة
    modal.style.display = 'none'; 
}
