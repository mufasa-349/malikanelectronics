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

// Ana görseli belirleme fonksiyonu (productsData.js ile aynı mantık)
const setMainImage = (product) => {
    const updatedProduct = { ...product };
    
    // Ana görseli image attribute'undan öncelikli olarak al
    // image -> img -> mainImage -> images[0] sırasıyla kontrol et
    if (updatedProduct.image) {
        updatedProduct.img = updatedProduct.image;
        updatedProduct.mainImage = updatedProduct.image;
    } else if (updatedProduct.img) {
        updatedProduct.mainImage = updatedProduct.img;
    } else if (updatedProduct.mainImage) {
        updatedProduct.img = updatedProduct.mainImage;
    } else if (updatedProduct.images && Array.isArray(updatedProduct.images) && updatedProduct.images.length > 0) {
        updatedProduct.img = updatedProduct.images[0];
        updatedProduct.mainImage = updatedProduct.images[0];
    }
    
    return updatedProduct;
};

// Firebase'deki tüm ürünleri güncelle
const updateMainImages = async () => {
    try {
        console.log('Firebase\'deki ürünlerin ana görselleri güncelleniyor...');
        
        // Firebase'den tüm ürünleri çek
        const productsSnapshot = await db.collection('products').get();
        console.log(`Toplam ${productsSnapshot.size} ürün bulundu.`);
        
        const BATCH_SIZE = 400;
        let updated = 0;
        let errors = 0;
        let skipped = 0;
        
        // Ürünleri batch'ler halinde güncelle
        for (let i = 0; i < productsSnapshot.size; i += BATCH_SIZE) {
            const batch = db.batch();
            const batchDocs = productsSnapshot.docs.slice(i, i + BATCH_SIZE);
            
            console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} işleniyor... (${i + 1}-${Math.min(i + BATCH_SIZE, productsSnapshot.size)})`);
            
            let batchUpdated = 0;
            let batchSkipped = 0;
            
            batchDocs.forEach((doc) => {
                try {
                    const product = doc.data();
                    
                    // Ana görseli kontrol et ve güncelle
                    const updatedProduct = setMainImage(product);
                    
                    // Eğer mainImage veya img eksikse veya değiştiyse güncelle
                    const needsUpdate = 
                        !product.mainImage || 
                        !product.img || 
                        product.mainImage !== updatedProduct.mainImage ||
                        product.img !== updatedProduct.img;
                    
                    if (needsUpdate && updatedProduct.mainImage) {
                        const productRef = db.collection('products').doc(doc.id);
                        batch.update(productRef, {
                            img: updatedProduct.img,
                            mainImage: updatedProduct.mainImage,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        batchUpdated++;
                    } else {
                        batchSkipped++;
                    }
                } catch (error) {
                    console.error(`Ürün ${doc.id} güncellenirken hata:`, error);
                    errors++;
                }
            });
            
            try {
                if (batchUpdated > 0) {
                    await batch.commit();
                    updated += batchUpdated;
                    skipped += batchSkipped;
                    console.log(`✓ ${batchUpdated} ürün güncellendi, ${batchSkipped} ürün atlandı. (Toplam: ${updated}/${productsSnapshot.size})`);
                } else {
                    skipped += batchSkipped;
                    console.log(`⊘ ${batchSkipped} ürün atlandı (zaten güncel).`);
                }
            } catch (error) {
                console.error(`Batch commit hatası:`, error);
                errors += batchDocs.length;
            }
            
            // Rate limiting için kısa bir bekleme
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log('\n✅ Güncelleme tamamlandı!');
        console.log(`✓ Güncellenen: ${updated}`);
        console.log(`⊘ Atlanan: ${skipped}`);
        console.log(`✗ Hatalı: ${errors}`);
        
    } catch (error) {
        console.error('Güncelleme hatası:', error);
        process.exit(1);
    }
};

// Scripti çalıştır
updateMainImages()
    .then(() => {
        console.log('İşlem tamamlandı.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Kritik hata:', error);
        process.exit(1);
    });

