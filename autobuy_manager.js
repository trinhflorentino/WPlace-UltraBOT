const fs = require('fs');
const path = require('path');

// Đường dẫn đến file accounts.json
const accountsPath = path.join(__dirname, 'db', 'accounts.json');

// Hàm đọc file accounts.json
function readAccounts() {
    try {
        const accountsData = fs.readFileSync(accountsPath, 'utf8');
        return JSON.parse(accountsData);
    } catch (error) {
        console.error('❌ Lỗi đọc file:', error.message);
        process.exit(1);
    }
}

// Hàm ghi file accounts.json
function writeAccounts(accounts) {
    try {
        const updatedData = JSON.stringify(accounts, null, 2);
        fs.writeFileSync(accountsPath, updatedData, 'utf8');
    } catch (error) {
        console.error('❌ Lỗi ghi file:', error.message);
        process.exit(1);
    }
}

// Hàm thêm autobuy: "rec" cho tất cả tài khoản
function addAutobuy() {
    console.log('🔄 Đang thêm autobuy: "rec" cho tất cả tài khoản...\n');
    
    const accounts = readAccounts();
    console.log(`📊 Tìm thấy ${accounts.length} tài khoản\n`);
    
    let updatedCount = 0;
    let alreadyHasCount = 0;
    
    accounts.forEach((account, index) => {
        if (!account.hasOwnProperty('autobuy') || account.autobuy !== "rec") {
            const oldValue = account.autobuy || 'undefined';
            account.autobuy = "rec";
            updatedCount++;
            console.log(`✓ Cập nhật tài khoản ${account.name || account.id}: autobuy "${oldValue}" → "rec"`);
        } else {
            alreadyHasCount++;
            console.log(`- Tài khoản ${account.name || account.id} đã có autobuy: "rec"`);
        }
    });
    
    if (updatedCount > 0) {
        writeAccounts(accounts);
        console.log(`\n✅ Hoàn thành! Đã cập nhật ${updatedCount} tài khoản`);
    } else {
        console.log(`\n✅ Tất cả ${accounts.length} tài khoản đã có autobuy: "rec"!`);
    }
    
    console.log(`📊 Tổng kết:`);
    console.log(`   - Tài khoản đã có autobuy: "rec": ${alreadyHasCount}`);
    console.log(`   - Tài khoản được cập nhật: ${updatedCount}`);
    console.log(`   - Tổng tài khoản: ${accounts.length}`);
}

// Hàm xóa thuộc tính autobuy khỏi tất cả tài khoản
function removeAutobuy() {
    console.log('🗑️ Đang xóa thuộc tính autobuy khỏi tất cả tài khoản...\n');
    
    const accounts = readAccounts();
    console.log(`📊 Tìm thấy ${accounts.length} tài khoản\n`);
    
    let removedCount = 0;
    let noAutobuyCount = 0;
    
    accounts.forEach((account, index) => {
        if (account.hasOwnProperty('autobuy')) {
            const oldValue = account.autobuy;
            delete account.autobuy;
            removedCount++;
            console.log(`✓ Đã xóa autobuy: "${oldValue}" khỏi tài khoản ${account.name || account.id}`);
        } else {
            noAutobuyCount++;
            console.log(`- Tài khoản ${account.name || account.id} không có thuộc tính autobuy`);
        }
    });
    
    if (removedCount > 0) {
        writeAccounts(accounts);
        console.log(`\n✅ Hoàn thành! Đã xóa autobuy khỏi ${removedCount} tài khoản`);
    } else {
        console.log(`\n✅ Không có tài khoản nào có thuộc tính autobuy!`);
    }
    
    console.log(`📊 Tổng kết:`);
    console.log(`   - Tài khoản không có autobuy: ${noAutobuyCount}`);
    console.log(`   - Tài khoản được xóa autobuy: ${removedCount}`);
    console.log(`   - Tổng tài khoản: ${accounts.length}`);
}

// Hàm kiểm tra trạng thái autobuy
function checkAutobuy() {
    try {
        console.log('🔍 Kiểm tra trạng thái thuộc tính autobuy...\n');
        
        const accounts = readAccounts();
        console.log(`📊 Tổng số tài khoản: ${accounts.length}\n`);
        
        // Thống kê theo giá trị autobuy
        const stats = {};
        accounts.forEach(account => {
            const autobuyValue = account.autobuy || 'undefined';
            if (!stats[autobuyValue]) {
                stats[autobuyValue] = [];
            }
            stats[autobuyValue].push(account.name || account.id);
        });
        
        // Hiển thị thống kê
        console.log('📈 Thống kê thuộc tính autobuy:');
        Object.entries(stats).forEach(([value, accounts]) => {
            console.log(`\n   "${value}": ${accounts.length} tài khoản`);
            accounts.forEach(account => {
                console.log(`     - ${account}`);
            });
        });
        
        // Kiểm tra xem tất cả có phải là "rec" không
        const allRec = Object.keys(stats).length === 1 && stats.hasOwnProperty('rec');
        
        console.log('\n' + '='.repeat(50));
        if (allRec) {
            console.log('✅ TẤT CẢ TÀI KHOẢN ĐÃ CÓ autobuy: "rec"');
            console.log(`🎉 Hoàn thành! ${accounts.length}/${accounts.length} tài khoản`);
        } else if (Object.keys(stats).length === 1 && stats.hasOwnProperty('undefined')) {
            console.log('⚠️  TẤT CẢ TÀI KHOẢN KHÔNG CÓ autobuy');
            console.log('💡 Chạy: node autobuy_manager.js add để thêm');
        } else {
            console.log('⚠️  CÓ TÀI KHOẢN CHƯA CÓ autobuy: "rec"');
            console.log('💡 Chạy: node autobuy_manager.js add để thêm');
        }
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Lỗi trong quá trình kiểm tra:', error.message);
    }
}

// Xử lý tham số dòng lệnh
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'add':
        addAutobuy();
        break;
        
    case 'remove':
        removeAutobuy();
        break;
        
    case 'check':
        checkAutobuy();
        break;
        
    default:
        console.log('🔧 Cách sử dụng:');
        console.log('   node autobuy_manager.js add     - Thêm autobuy: "rec" cho tất cả tài khoản');
        console.log('   node autobuy_manager.js remove  - Xóa thuộc tính autobuy khỏi tất cả tài khoản');
        console.log('   node autobuy_manager.js check   - Kiểm tra trạng thái autobuy');
        console.log('');
        console.log('📝 Ví dụ:');
        console.log('   node autobuy_manager.js add');
        console.log('   node autobuy_manager.js remove');
        console.log('   node autobuy_manager.js check');
}
