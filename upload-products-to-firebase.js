const fs = require('fs');
const path = require('path');

// Firebase Client SDK kullanıyoruz (projede zaten yüklü)
const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDClfGg2ANXmXGM2L4vGtYwNYIjIH0kLo8",
  authDomain: "malikane-18a27.firebaseapp.com",
  projectId: "malikane-18a27",
  storageBucket: "malikane-18a27.firebasestorage.app",
  messagingSenderId: "842152348833",
  appId: "1:842152348833:web:06e93edeb76132b3e8b4e0",
  measurementId: "G-HGZSJLDLNV"
};

// Firebase'i başlat
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Ürün adından benzersiz 6 haneli kod oluştur
const generateProductCode = (productName) => {
    if (!productName) return '000000';
    const cleanName = productName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '');
    
    let hash = 0;
    for (let i = 0; i < cleanName.length; i++) {
        const char = cleanName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    const positiveHash = Math.abs(hash);
    const code = (positiveHash % 900000) + 100000;
    return code.toString();
};

// Ürünleri formatla
const formatProduct = (product, index) => {
    const formattedProduct = { ...product };
    const productIdString = (formattedProduct.id || formattedProduct['Product ID'] || formattedProduct.productId || '').toString();
    const numericId = parseInt(productIdString, 10);

    // ID'yi sayıya çevir
    formattedProduct.originalId = productIdString || null;
    formattedProduct.id = Number.isNaN(numericId) ? index + 1 : numericId;
    
    // Eğer productCode yoksa oluştur
    if (!formattedProduct.productCode) {
        formattedProduct.productCode = generateProductCode(
            formattedProduct.name || 
            formattedProduct['Product Name'] || 
            formattedProduct.title || 
            'Ürün'
        );
    }

    // Ana görseli image attribute'undan öncelikli olarak al
    if (formattedProduct.image) {
        formattedProduct.img = formattedProduct.image;
        formattedProduct.mainImage = formattedProduct.image;
    } else if (formattedProduct.img) {
        formattedProduct.mainImage = formattedProduct.img;
    } else if (formattedProduct.mainImage) {
        formattedProduct.img = formattedProduct.mainImage;
    } else if (formattedProduct.images && formattedProduct.images.length > 0) {
        formattedProduct.img = formattedProduct.images[0];
        formattedProduct.mainImage = formattedProduct.images[0];
    }
    
    // title alanını name'den oluştur
    if (!formattedProduct.title) {
        formattedProduct.title = formattedProduct.name || formattedProduct['Product Name'] || 'Ürün';
    }
    
    // inStock varsayılan olarak true
    if (formattedProduct.inStock === undefined) {
        formattedProduct.inStock = true;
    }

    // Timestamp ekle
    formattedProduct.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    formattedProduct.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    return formattedProduct;
};

// Batch olarak ürünleri yükle
const uploadProducts = async () => {
    try {
        console.log('Ürünler yükleniyor...');
        
        // JSON dosyasını oku
        const jsonPath = path.join(__dirname, 'all_products_merged.json');
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        const products = JSON.parse(jsonData);
        
        console.log(`Toplam ${products.length} ürün bulundu.`);
        
        // Batch size (Firestore limit: 500 operations per batch, ama güvenli olması için 400 kullanıyoruz)
        const BATCH_SIZE = 400;
        let uploaded = 0;
        let errors = 0;
        
        // Ürünleri batch'ler halinde yükle
        for (let i = 0; i < products.length; i += BATCH_SIZE) {
            const batch = db.batch();
            const batchProducts = products.slice(i, i + BATCH_SIZE);
            
            console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} işleniyor... (${i + 1}-${Math.min(i + BATCH_SIZE, products.length)})`);
            
            batchProducts.forEach((product, index) => {
                try {
                    const formattedProduct = formatProduct(product, i + index);
                    const productRef = db.collection('products').doc(formattedProduct.id.toString());
                    // set ile ürünü ekle (mevcut varsa üzerine yazar)
                    batch.set(productRef, formattedProduct);
                } catch (error) {
                    console.error(`Ürün ${i + index} formatlanırken hata:`, error);
                    errors++;
                }
            });
            
            try {
                await batch.commit();
                uploaded += batchProducts.length;
                console.log(`✓ ${uploaded}/${products.length} ürün yüklendi.`);
            } catch (error) {
                console.error(`Batch commit hatası:`, error);
                errors += batchProducts.length;
            }
            
            // Rate limiting için kısa bir bekleme (Firestore rate limit'lerini aşmamak için)
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log('\n✅ Yükleme tamamlandı!');
        console.log(`✓ Başarılı: ${uploaded}`);
        console.log(`✗ Hatalı: ${errors}`);
        
    } catch (error) {
        console.error('Yükleme hatası:', error);
        process.exit(1);
    }
};

// Scripti çalıştır
uploadProducts()
    .then(() => {
        console.log('İşlem tamamlandı.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Kritik hata:', error);
        process.exit(1);
    });

