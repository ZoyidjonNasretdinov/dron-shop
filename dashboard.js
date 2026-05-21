// DronTech localStorage Database & Session Management

const DEFAULT_PRODUCTS = [
    // 1. Dronlar (Drones) - ARZONLASHTIRILGAN NARXLAR (Max $1000)
    {
        id: "prod-1",
        category: "dron",
        name: "DJI Mavic 3 Pro",
        desc: "Professional suratga olish uchun 3 ta kamerali tizim. 43 daqiqa parvoz vaqti.",
        price: 899,
        stock: 12,
        image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-2",
        category: "dron",
        name: "DJI Mini 4 Pro",
        desc: "Yengil (249g) va ixcham dron. Sayohat va kundalik vlogs uchun ideal.",
        price: 599,
        stock: 25,
        image: "https://images.unsplash.com/photo-1524143986875-3b098d78b363?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-3",
        category: "dron",
        name: "DJI Avata 2 (FPV)",
        desc: "Kinematografik FPV tajribasi. VR ko'zoynaklari orqali boshqarish tizimi.",
        price: 699,
        stock: 8,
        image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-4",
        category: "dron",
        name: "DJI Inspire 3",
        desc: "Haqiqiy kinorejissyorlar uchun 8K pikselli professional kinematografiya droni.",
        price: 999,
        stock: 3,
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-5",
        category: "dron",
        name: "Agras T40",
        desc: "Qishloq xo'jaligi uchun kuchli dori sepish va monitoring droni. 40 kg sig'im.",
        price: 950,
        stock: 5,
        image: "https://images.unsplash.com/photo-1581452445100-35368a5717bc?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-6",
        category: "dron",
        name: "Matrice 350 RTK",
        desc: "Xavfsizlik, qutqaruv va kartografiya sohalari uchun endustrial dron.",
        price: 980,
        stock: 4,
        image: "https://images.unsplash.com/photo-1506469717960-433cebe3f181?q=80&w=800&auto=format&fit=crop"
    },
    
    // 2. Ehtiyot qismlar (Spare Parts) - ARZONLASHTIRILGAN NARXLAR
    {
        id: "prod-7",
        category: "qism",
        name: "DJI Mavic 3 Pro Parraklari",
        desc: "Mavic 3 seriyali dronlari uchun kam shovqinli original parraklar to'plami.",
        price: 19,
        stock: 50,
        image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-8",
        category: "qism",
        name: "DJI Mini 4 Pro Akkumulyatori",
        desc: "Mini 4 Pro uchun Intelligent Flight Battery. 34 daqiqagacha parvoz vaqti.",
        price: 69,
        stock: 15,
        image: "https://images.unsplash.com/photo-1608630713783-0570b7415d6c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-9",
        category: "qism",
        name: "FPV Dron Motor (2207)",
        desc: "FPV poyga va kinematografik dronlari uchun yuqori tezlikdagi motor.",
        price: 35,
        stock: 3,
        image: "https://images.unsplash.com/photo-1597491817449-9b5528f80452?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-13",
        category: "qism",
        name: "DJI Air 3 Shassi va Oyoqlari",
        desc: "DJI Air 3 droni uchun mustahkam va yengil qo'nish shassisi hamda oyoqchalari to'plami.",
        price: 25,
        stock: 18,
        image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-14",
        category: "qism",
        name: "RunCam FPV Kamera (Pro)",
        desc: "FPV dronlar uchun kecha va kunduz rejimiga ega professional video kamera.",
        price: 45,
        stock: 0,
        image: "https://images.unsplash.com/photo-1597491817449-9b5528f80452?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-15",
        category: "qism",
        name: "Mavic 3 Gimbal Qopqog'i",
        desc: "Gimbal va kamera linzasini saqlash va tashish vaqtida himoya qiluvchi original qopqoq.",
        price: 9,
        stock: 30,
        image: "https://images.unsplash.com/photo-1608630713783-0570b7415d6c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-16",
        category: "qism",
        name: "Dron Uchish Maydonchasi (75cm)",
        desc: "Dronlarni chang va qumdan himoya qiluvchi suv o'tkazmaydigan universal maydoncha.",
        price: 15,
        stock: 8,
        image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=800&auto=format&fit=crop"
    },
    
    // 3. Ijara (Rentals) - ARZONLASHTIRILGAN NARXLAR
    {
        id: "prod-10",
        category: "ijara",
        name: "DJI Mavic 3 Pro (Ijara)",
        desc: "Professional suratga olish droni ijarasi. Kamera va pult to'plami bilan.",
        price: 59, // $59/kun
        stock: null,
        image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-11",
        category: "ijara",
        name: "DJI Avata 2 FPV (Ijara)",
        desc: "FPV ko'zoynagi va motion controller bilan kinematografik uchish ijarasi.",
        price: 39, // $39/kun
        stock: null,
        image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "prod-12",
        category: "ijara",
        name: "Agras T40 Qishloq Xo'jaligi Droni (Ijara)",
        desc: "Katta maydonlarni dori sepish va monitoring qilish uchun sanoat droni ijarasi.",
        price: 189, // $189/kun
        stock: null,
        image: "https://images.unsplash.com/photo-1581452445100-35368a5717bc?q=80&w=800&auto=format&fit=crop"
    }
];

const DEFAULT_ORDERS = [
    {
        id: "ord-1001",
        customerName: "Jaloliddin Rustamov",
        phone: "+998901111111",
        productId: "prod-1",
        productName: "DJI Mavic 3 Pro",
        price: 899,
        category: "dron",
        status: "yangi", // yangi, yetkazilmoqda, yakunlandi, bekor_qilindi
        assignedTo: null,
        date: "2026-05-18T10:30:00.000Z",
        notes: "Uyni yaqiniga yetkazib berishdan oldin tel qiling",
        rentalDays: null,
        rentalStartDate: null
    },
    {
        id: "ord-1002",
        customerName: "Sardor Alimov",
        phone: "+998932222222",
        productId: "prod-2",
        productName: "DJI Mini 4 Pro",
        price: 599,
        category: "dron",
        status: "yetkazilmoqda",
        assignedTo: "seller@gmail.com",
        date: "2026-05-19T14:15:00.000Z",
        notes: "",
        rentalDays: null,
        rentalStartDate: null
    },
    {
        id: "ord-1003",
        customerName: "Rayhon Asadova",
        phone: "+998943333333",
        productId: "prod-10",
        productName: "DJI Mavic 3 Pro (Ijara)",
        price: 295, // $59 * 5 kun
        category: "ijara",
        status: "yakunlandi",
        assignedTo: "seller@gmail.com",
        date: "2026-05-20T09:00:00.000Z",
        notes: "5 kunga ijara",
        rentalDays: 5,
        rentalStartDate: "2026-05-21"
    },
    {
        id: "ord-1004",
        customerName: "Bobur Tursunov",
        phone: "+998974444444",
        productId: "prod-5",
        productName: "Agras T40",
        price: 950,
        category: "dron",
        status: "bekor_qilindi",
        assignedTo: null,
        date: "2026-05-15T11:45:00.000Z",
        notes: "Kreditga olish variantini so'ramoqchi",
        rentalDays: null,
        rentalStartDate: null
    },
    {
        id: "ord-1005",
        customerName: "Kamronbek Yo'ldoshev",
        phone: "+998997777777",
        productId: "prod-7",
        productName: "DJI Mavic 3 Pro Parraklari",
        price: 38, // 2 ta parrak
        category: "qism",
        status: "yangi",
        assignedTo: null,
        date: "2026-05-20T12:00:00.000Z",
        notes: "Tez yetkazib berish kerak, bugun parvozim bor",
        rentalDays: null,
        rentalStartDate: null
    }
];

const DEFAULT_USERS = [
    { email: "admin@gmail.com", password: "admin123", role: "admin", name: "DronTech Admin" },
    { email: "seller@gmail.com", password: "admin123", role: "seller", name: "Toshkent Seller #1" },
    { email: "seller@gmail.com", password: "seller123", role: "seller", name: "Toshkent Seller #1" },
    { email: "user@gmail.com", password: "admin123", role: "user", name: "Dilshod Mijoz" }
];

// Initialize Database
function initDB() {
    const savedProducts = localStorage.getItem("dt_products");
    if (!savedProducts || !savedProducts.includes('"category"')) {
        localStorage.setItem("dt_products", JSON.stringify(DEFAULT_PRODUCTS));
        localStorage.setItem("dt_orders", JSON.stringify(DEFAULT_ORDERS));
    }
    
    if (!localStorage.getItem("dt_products")) {
        localStorage.setItem("dt_products", JSON.stringify(DEFAULT_PRODUCTS));
    } else {
        try {
            let products = JSON.parse(localStorage.getItem("dt_products"));
            let updated = false;
            DEFAULT_PRODUCTS.forEach(p => {
                const existingIndex = products.findIndex(item => item.id === p.id);
                if (existingIndex === -1) {
                    products.push(p);
                    updated = true;
                } else {
                    if (products[existingIndex].price !== p.price) {
                        products[existingIndex].price = p.price;
                        updated = true;
                    }
                    if (products[existingIndex].stock === undefined || products[existingIndex].stock !== p.stock) {
                        products[existingIndex].stock = p.stock;
                        updated = true;
                    }
                }
            });
            products.forEach(p => {
                if (p.price > 1000) {
                    p.price = 1000;
                    updated = true;
                }
            });
            if (updated) {
                localStorage.setItem("dt_products", JSON.stringify(products));
            }
        } catch (e) {
            console.error("Migration error:", e);
        }
    }
    if (!localStorage.getItem("dt_orders")) {
        localStorage.setItem("dt_orders", JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem("dt_users") || !localStorage.getItem("dt_users").includes("user@gmail.com")) {
        localStorage.setItem("dt_users", JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem("dt_activity_logs")) {
        localStorage.setItem("dt_activity_logs", JSON.stringify([
            { id: "log-1", user: "Tizim", action: "Tizim muvaffaqiyatli ishga tushirildi va ma'lumotlar bazasi yuklandi.", date: new Date().toISOString() }
        ]));
    }
}

initDB();

// Helper database functions
const DB = {
    getProducts: () => JSON.parse(localStorage.getItem("dt_products")) || [],
    saveProducts: (products) => localStorage.setItem("dt_products", JSON.stringify(products)),
    
    getOrders: () => JSON.parse(localStorage.getItem("dt_orders")) || [],
    saveOrders: (orders) => localStorage.setItem("dt_orders", JSON.stringify(orders)),
    
    getUsers: () => JSON.parse(localStorage.getItem("dt_users")) || [],
    
    getCurrentUser: () => {
        const userJson = localStorage.getItem("dt_current_user");
        return userJson ? JSON.parse(userJson) : null;
    },
    
    login: (email, password) => {
        const users = DB.getUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            localStorage.setItem("dt_current_user", JSON.stringify({
                email: foundUser.email,
                role: foundUser.role,
                name: foundUser.name
            }));
            DB.addLog(foundUser.email, `Tizimga muvaffaqiyatli kirdi (Rol: ${foundUser.role})`);
            return foundUser;
        }
        return null;
    },

    register: (name, email, password) => {
        const users = DB.getUsers();
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            return { success: false, message: "Ushbu e-pochta manzili allaqachon ro'yxatdan o'tgan!" };
        }
        const newUser = {
            name: name,
            email: email.trim(),
            password: password,
            role: "user"
        };
        users.push(newUser);
        localStorage.setItem("dt_users", JSON.stringify(users));
        
        localStorage.setItem("dt_current_user", JSON.stringify({
            email: newUser.email,
            role: newUser.role,
            name: newUser.name
        }));
        DB.addLog(newUser.email, "Yangi foydalanuvchi sifatida ro'yxatdan o'tdi.");
        return { success: true, user: newUser };
    },

    registerSeller: (name, email, password) => {
        const users = DB.getUsers();
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            return { success: false, message: "Ushbu e-pochta manzili allaqachon ro'yxatdan o'tgan!" };
        }
        const newUser = {
            name: name,
            email: email.trim(),
            password: password,
            role: "seller"
        };
        users.push(newUser);
        localStorage.setItem("dt_users", JSON.stringify(users));
        DB.addLog("admin@gmail.com", `Yangi sotuvchi qo'shdi: ${name} (${email})`);
        return { success: true, user: newUser };
    },
    
    logout: () => {
        const user = DB.getCurrentUser();
        if (user) {
            DB.addLog(user.email, "Tizimdan chiqdi.");
        }
        localStorage.removeItem("dt_current_user");
        window.location.href = "login.html";
    },
    
    checkAuth: (requiredRole) => {
        const user = DB.getCurrentUser();
        if (!user) {
            window.location.href = "login.html";
            return null;
        }
        if (requiredRole && user.role !== requiredRole) {
            if (user.role === "admin") {
                window.location.href = "admin.html";
            } else if (user.role === "seller") {
                window.location.href = "seller.html";
            } else {
                window.location.href = "login.html";
            }
            return null;
        }
        return user;
    },

    addLog: (user, action) => {
        try {
            const logs = JSON.parse(localStorage.getItem("dt_activity_logs")) || [];
            const newLog = {
                id: "log-" + Date.now() + Math.floor(Math.random() * 1000),
                user: user || "Tizim",
                action: action,
                date: new Date().toISOString()
            };
            logs.unshift(newLog);
            if (logs.length > 50) logs.pop();
            localStorage.setItem("dt_activity_logs", JSON.stringify(logs));
            return newLog;
        } catch (e) {
            console.error(e);
        }
    },
    getLogs: () => {
        return JSON.parse(localStorage.getItem("dt_activity_logs")) || [];
    }
};
