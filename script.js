document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. Cart State & Methods ---
    let cart = JSON.parse(localStorage.getItem("dt_cart")) || [];

    function saveCart() {
        localStorage.setItem("dt_cart", JSON.stringify(cart));
        renderCart();
    }

    function addToCart(prodId) {
        const products = DB.getProducts();
        const product = products.find(p => p.id === prodId);
        if (!product) return;

        const cartItem = cart.find(item => item.product.id === prodId && !item.rentalStartDate);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }

        saveCart();
        
        // Auto-open cart drawer
        const cartSidebar = document.getElementById("cartSidebar");
        if (cartSidebar) {
            // Reset views
            document.getElementById("cartItemsList").style.display = 'flex';
            document.getElementById("cartMainFooter").style.display = 'block';
            document.getElementById("cartCheckoutFormContainer").style.display = 'none';
            document.getElementById("cartCheckoutSuccess").style.display = 'none';
            
            cartSidebar.classList.add("open");
        }
    }

    function addToCartWithRental(prodId, startDate, days) {
        const products = DB.getProducts();
        const product = products.find(p => p.id === prodId);
        if (!product) return;

        const cartItem = cart.find(item => 
            item.product.id === prodId && 
            item.rentalStartDate === startDate && 
            item.rentalDays === days
        );
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ 
                product, 
                quantity: 1,
                rentalStartDate: startDate,
                rentalDays: days
            });
        }

        saveCart();
        
        // Auto-open cart drawer
        const cartSidebar = document.getElementById("cartSidebar");
        if (cartSidebar) {
            document.getElementById("cartItemsList").style.display = 'flex';
            document.getElementById("cartMainFooter").style.display = 'block';
            document.getElementById("cartCheckoutFormContainer").style.display = 'none';
            document.getElementById("cartCheckoutSuccess").style.display = 'none';
            
            cartSidebar.classList.add("open");
        }
    }

    function updateQuantity(prodId, amount, startDate = null, days = null) {
        const cartItem = cart.find(item => 
            item.product.id === prodId && 
            (item.rentalStartDate || null) === (startDate || null) && 
            (item.rentalDays || null) === (days || null)
        );
        if (!cartItem) return;

        cartItem.quantity += amount;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => 
                !(item.product.id === prodId && 
                  (item.rentalStartDate || null) === (startDate || null) && 
                  (item.rentalDays || null) === (days || null))
            );
        }
        saveCart();
    }

    function removeFromCart(prodId, startDate = null, days = null) {
        cart = cart.filter(item => 
            !(item.product.id === prodId && 
              (item.rentalStartDate || null) === (startDate || null) && 
              (item.rentalDays || null) === (days || null))
        );
        saveCart();
    }

    function clearCart() {
        cart = [];
        saveCart();
    }

    // --- 1a. Rental Modal Handlers ---
    const rentalModal = document.getElementById("rentalModal");
    const closeRentalModalBtn = document.getElementById("closeRentalModalBtn");
    const rentalForm = document.getElementById("rentalForm");
    const rentalProductId = document.getElementById("rentalProductId");
    const rentalProductName = document.getElementById("rentalProductName");
    const rentalProductPrice = document.getElementById("rentalProductPrice");
    const rentalProductImg = document.getElementById("rentalProductImg");
    const rentalStartDate = document.getElementById("rentalStartDate");
    const rentalDaysCount = document.getElementById("rentalDaysCount");
    const rentalTotalCalc = document.getElementById("rentalTotalCalc");

    // Custom calendar state & elements
    const calMonthYear = document.getElementById("calMonthYear");
    const calendarDaysGrid = document.getElementById("calendarDaysGrid");
    const calPrevMonth = document.getElementById("calPrevMonth");
    const calNextMonth = document.getElementById("calNextMonth");

    let currentCalYear = new Date().getFullYear();
    let currentCalMonth = new Date().getMonth(); // 0-11

    const monthNames = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    function renderCustomCalendar(productPrice) {
        if (!calendarDaysGrid || !calMonthYear) return;
        
        calendarDaysGrid.innerHTML = "";
        calMonthYear.textContent = `${monthNames[currentCalMonth]} ${currentCalYear}`;

        // First day of the month (0 = Sunday, 1 = Monday, etc.)
        const firstDayIndex = new Date(currentCalYear, currentCalMonth, 1).getDay();
        // Convert to 0 = Monday, 6 = Sunday for our grid
        const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        // Total days in current month
        const totalDays = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();

        const today = new Date();
        today.setHours(0,0,0,0);

        // Render empty cells before first day
        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "calendar-day-btn empty";
            calendarDaysGrid.appendChild(emptyCell);
        }

        // Render day buttons
        for (let day = 1; day <= totalDays; day++) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "calendar-day-btn";
            btn.textContent = day;

            const cellDate = new Date(currentCalYear, currentCalMonth, day);
            const yyyy = cellDate.getFullYear();
            const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
            const dd = String(cellDate.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            // Disable past dates
            if (cellDate < today) {
                btn.classList.add("disabled");
                btn.disabled = true;
            } else {
                // Pre-select if matches the value in the hidden input
                if (rentalStartDate.value === dateStr) {
                    btn.classList.add("selected");
                }

                btn.addEventListener("click", () => {
                    calendarDaysGrid.querySelectorAll(".calendar-day-btn.selected").forEach(b => {
                        b.classList.remove("selected");
                    });
                    btn.classList.add("selected");
                    rentalStartDate.value = dateStr;
                    updateRentalTotalPrice(productPrice);
                });
            }

            calendarDaysGrid.appendChild(btn);
        }
    }

    function openRentalModal(product) {
        if (!rentalModal) return;
        rentalProductId.value = product.id;
        rentalProductName.textContent = product.name;
        rentalProductPrice.textContent = `$${product.price.toLocaleString()} / kun`;
        rentalProductImg.src = product.image;

        // Set state to current month
        const today = new Date();
        currentCalYear = today.getFullYear();
        currentCalMonth = today.getMonth();

        // Default start date to today
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        rentalStartDate.value = todayStr;
        rentalDaysCount.value = 1;

        // Render the calendar
        renderCustomCalendar(product.price);

        // Update total
        updateRentalTotalPrice(product.price);

        // Bind input calculation
        rentalDaysCount.oninput = () => {
            updateRentalTotalPrice(product.price);
        };

        rentalModal.classList.add("show");
    }

    function updateRentalTotalPrice(dailyPrice) {
        const days = parseInt(rentalDaysCount.value) || 1;
        const total = dailyPrice * days;
        rentalTotalCalc.textContent = `$${total.toLocaleString()}`;
    }

    // Calendar month navigation
    if (calPrevMonth) {
        calPrevMonth.addEventListener("click", () => {
            currentCalMonth--;
            if (currentCalMonth < 0) {
                currentCalMonth = 11;
                currentCalYear--;
            }
            const activeProductId = rentalProductId.value;
            const products = DB.getProducts();
            const product = products.find(p => p.id === activeProductId);
            renderCustomCalendar(product ? product.price : 0);
        });
    }

    if (calNextMonth) {
        calNextMonth.addEventListener("click", () => {
            currentCalMonth++;
            if (currentCalMonth > 11) {
                currentCalMonth = 0;
                currentCalYear++;
            }
            const activeProductId = rentalProductId.value;
            const products = DB.getProducts();
            const product = products.find(p => p.id === activeProductId);
            renderCustomCalendar(product ? product.price : 0);
        });
    }

    if (rentalForm) {
        rentalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const prodId = rentalProductId.value;
            const startDate = rentalStartDate.value;
            const days = parseInt(rentalDaysCount.value) || 1;

            if (!startDate) {
                alert("Iltimos, ijara boshlanish sanasini kalendardan belgilang!");
                return;
            }

            addToCartWithRental(prodId, startDate, days);
            rentalModal.classList.remove("show");
        });
    }

    if (closeRentalModalBtn) {
        closeRentalModalBtn.addEventListener("click", () => {
            rentalModal.classList.remove("show");
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === rentalModal) {
            rentalModal.classList.remove("show");
        }
    });

    // --- 2. Dynamic Catalog Rendering & Filtering ---
    const catalogGrid = document.getElementById("catalogGrid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    let activeFilter = 'all';

    function renderCatalog() {
        if (!catalogGrid) return;
        
        const products = DB.getProducts();
        catalogGrid.innerHTML = '';
        
        const filtered = products.filter(p => {
            if (activeFilter === 'all') return true;
            return p.category === activeFilter;
        });

        if (filtered.length === 0) {
            catalogGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <h3>Hozirda ushbu toifada mahsulotlar mavjud emas.</h3>
                </div>
            `;
            return;
        }

        filtered.forEach((p, idx) => {
            const card = document.createElement("div");
            const delayClass = idx % 3 === 1 ? 'delay-1' : (idx % 3 === 2 ? 'delay-2' : '');
            card.className = `product-card reveal ${delayClass} glass-card`;
            
            const isRental = p.category === 'ijara';
            const priceText = isRental ? `$${p.price.toLocaleString()} / kun` : `$${p.price.toLocaleString()}`;
            const btnText = isRental ? 'Ijaraga olish' : 'Sotib olish';

            card.innerHTML = `
                <div class="product-img">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800'">
                </div>
                <div class="product-info">
                    <span style="font-size: 11px; text-transform: uppercase; color: var(--primary); font-weight: 800; letter-spacing: 1px; display: block; margin-bottom: 6px;">
                        ${p.category === 'qism' ? 'Ehtiyot qism' : (p.category === 'ijara' ? 'Ijara' : 'Dron')}
                    </span>
                    <h3>${p.name}</h3>
                    <p class="desc">${p.desc}</p>
                    <div class="product-footer">
                        <span class="price">${priceText}</span>
                        <button class="btn-buy" data-id="${p.id}">${btnText}</button>
                    </div>
                </div>
            `;
            catalogGrid.appendChild(card);
        });

        const revealElements = catalogGrid.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            el.classList.add('active');
        });

        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(catalogGrid.querySelectorAll(".glass-card"), {
                max: 8,
                speed: 400,
                glare: true,
                "max-glare": 0.15,
                scale: 1.02
            });
        }

        catalogGrid.querySelectorAll(".btn-buy").forEach(btn => {
            btn.addEventListener("click", () => {
                const prodId = btn.getAttribute("data-id");
                const product = products.find(p => p.id === prodId);
                if (product && product.category === 'ijara') {
                    openRentalModal(product);
                } else {
                    addToCart(prodId);
                }
            });
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => {
                b.classList.remove("active");
                b.style.background = 'transparent';
                b.style.borderColor = 'rgba(255,255,255,0.1)';
                b.style.color = 'var(--text-muted)';
            });

            btn.classList.add("active");
            btn.style.background = 'rgba(255, 109, 0, 0.1)';
            btn.style.borderColor = 'var(--primary)';
            btn.style.color = 'white';

            activeFilter = btn.getAttribute("data-filter");
            renderCatalog();
        });
    });


    // --- 3. Render Cart Sidebar Drawer ---
    const cartItemsList = document.getElementById("cartItemsList");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartCountBadge = document.getElementById("cartCountBadge");
    
    const cartSidebar = document.getElementById("cartSidebar");
    const cartToggleBtn = document.getElementById("cartToggleBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");

    function renderCart() {
        if (!cartItemsList) return;

        cartItemsList.innerHTML = '';
        let subtotal = 0;
        let totalCount = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div style="text-align: center; margin: auto; padding: 20px; color: var(--text-muted);">
                    <i class="fas fa-shopping-basket" style="font-size: 40px; margin-bottom: 10px; color: var(--text-muted); display: block;"></i>
                    <p style="font-size: 14px;">Savatchangiz hozircha bo'sh</p>
                </div>
            `;
            cartSubtotal.textContent = '$0';
            cartCountBadge.textContent = '0';
            document.getElementById("goCheckoutBtn").disabled = true;
            document.getElementById("goCheckoutBtn").style.opacity = '0.5';
            return;
        }

        document.getElementById("goCheckoutBtn").disabled = false;
        document.getElementById("goCheckoutBtn").style.opacity = '1';

        cart.forEach(item => {
            const p = item.product;
            const isRental = p.category === 'ijara';
            const itemPrice = isRental 
                ? (p.price * (item.rentalDays || 1)) * item.quantity 
                : p.price * item.quantity;
            subtotal += itemPrice;
            totalCount += item.quantity;

            const priceText = isRental ? `$${p.price.toLocaleString()} / kun` : `$${p.price.toLocaleString()}`;

            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";

            let priceDetailsHtml = `<span class="price">${priceText}</span>`;
            if (isRental) {
                priceDetailsHtml = `
                    <span class="price">${priceText}</span>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                        <i class="fas fa-calendar-day" style="margin-right: 4px; color: var(--primary);"></i> ${item.rentalStartDate} dan (${item.rentalDays} kun)
                    </div>
                    <div style="font-size: 12px; color: var(--text-main); font-weight: 600; margin-top: 4px;">
                        Jami: $${((p.price * item.rentalDays) * item.quantity).toLocaleString()}
                    </div>
                `;
            }

            itemDiv.innerHTML = `
                <div class="cart-item-img">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800'">
                </div>
                <div class="cart-item-info">
                    <h4>${p.name}</h4>
                    ${priceDetailsHtml}
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn dec-qty" data-id="${p.id}" data-start-date="${item.rentalStartDate || ''}" data-days="${item.rentalDays || ''}">-</button>
                    <span style="font-size: 14px; font-weight: 600; min-width: 15px; text-align: center;">${item.quantity}</span>
                    <button class="qty-btn inc-qty" data-id="${p.id}" data-start-date="${item.rentalStartDate || ''}" data-days="${item.rentalDays || ''}">+</button>
                </div>
                <span class="cart-item-remove" data-id="${p.id}" data-start-date="${item.rentalStartDate || ''}" data-days="${item.rentalDays || ''}">&times;</span>
            `;
            cartItemsList.appendChild(itemDiv);
        });

        cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
        cartCountBadge.textContent = totalCount;

        cartItemsList.querySelectorAll(".dec-qty").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const startDate = btn.getAttribute("data-start-date") || null;
                const days = parseInt(btn.getAttribute("data-days")) || null;
                updateQuantity(id, -1, startDate, days);
            });
        });

        cartItemsList.querySelectorAll(".inc-qty").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const startDate = btn.getAttribute("data-start-date") || null;
                const days = parseInt(btn.getAttribute("data-days")) || null;
                updateQuantity(id, 1, startDate, days);
            });
        });

        cartItemsList.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const startDate = btn.getAttribute("data-start-date") || null;
                const days = parseInt(btn.getAttribute("data-days")) || null;
                removeFromCart(id, startDate, days);
            });
        });
    }

    if (cartToggleBtn && cartSidebar) {
        cartToggleBtn.addEventListener("click", () => {
            document.getElementById("cartItemsList").style.display = 'flex';
            document.getElementById("cartMainFooter").style.display = 'block';
            document.getElementById("cartCheckoutFormContainer").style.display = 'none';
            document.getElementById("cartCheckoutSuccess").style.display = 'none';
            
            cartSidebar.classList.toggle("open");
        });
    }

    if (closeCartBtn && cartSidebar) {
        closeCartBtn.addEventListener("click", () => {
            cartSidebar.classList.remove("open");
        });
    }

    window.addEventListener("click", (e) => {
        if (cartSidebar && cartSidebar.classList.contains("open")) {
            if (!cartSidebar.contains(e.target) && !cartToggleBtn.contains(e.target) && !e.target.classList.contains("btn-buy") && !e.target.closest(".btn-buy")) {
                cartSidebar.classList.remove("open");
            }
        }
    });


    // --- 4. Cart Sidebar Checkout Drawer Transitions ---
    const goCheckoutBtn = document.getElementById("goCheckoutBtn");
    const backToCartBtn = document.getElementById("backToCartBtn");
    const cartCheckoutFormContainer = document.getElementById("cartCheckoutFormContainer");
    const cartCheckoutForm = document.getElementById("cartCheckoutForm");
    const cartMainFooter = document.getElementById("cartMainFooter");
    const cartCheckoutSuccess = document.getElementById("cartCheckoutSuccess");
    const cartRentalOptions = document.getElementById("cartRentalOptions");
    
    const cartRentalDaysInput = document.getElementById("cartRentalDays");
    const cartRentalDateInput = document.getElementById("cartRentalDate");

    // --- Card Input & Visual Feedback Elements ---
    const cartPaymentMethod = document.getElementById("cartPaymentMethod");
    const creditCardSection = document.getElementById("creditCardSection");
    const virtualCard = document.getElementById("virtualCard");
    const cardNumberInput = document.getElementById("cardNumber");
    const cardExpiryInput = document.getElementById("cardExpiry");
    const cardCvvInput = document.getElementById("cardCvv");

    const cardNumDisp = document.getElementById("cardNumDisp");
    const cardNameDisp = document.getElementById("cardNameDisp");
    const cardExpiryDisp = document.getElementById("cardExpiryDisp");
    const cardCvvDisp = document.getElementById("cardCvvDisp");
    const paymentLoaderOverlay = document.getElementById("paymentLoaderOverlay");

    if (goCheckoutBtn) {
        goCheckoutBtn.addEventListener("click", () => {
            // Hide the redundant global rental options since details are set per product in the modal
            if (cartRentalOptions) {
                cartRentalOptions.style.display = 'none';
            }
            if (cartRentalDateInput) cartRentalDateInput.required = false;
            if (cartRentalDaysInput) cartRentalDaysInput.required = false;

            // Autofill user profile name if logged in
            const loggedInUser = DB.getCurrentUser();
            if (loggedInUser) {
                document.getElementById("cartClientName").value = loggedInUser.name;
                document.getElementById("cartClientName").readOnly = true;
                if (cardNameDisp) cardNameDisp.textContent = loggedInUser.name.toUpperCase();
            } else {
                document.getElementById("cartClientName").readOnly = false;
                document.getElementById("cartClientName").value = "";
                if (cardNameDisp) cardNameDisp.textContent = "ISMI SHARIFI";
            }

            // Reset Card Fields & Payment Method
            if (cartPaymentMethod) {
                cartPaymentMethod.value = "cash";
                creditCardSection.style.display = "none";
                cardNumberInput.value = "";
                cardNumberInput.required = false;
                cardExpiryInput.value = "";
                cardExpiryInput.required = false;
                cardCvvInput.value = "";
                cardCvvInput.required = false;
                if (cardNumDisp) cardNumDisp.textContent = "•••• •••• •••• ••••";
                if (cardExpiryDisp) cardExpiryDisp.textContent = "AA/YY";
                if (cardCvvDisp) cardCvvDisp.textContent = "•••";
            }

            cartItemsList.style.display = 'none';
            cartMainFooter.style.display = 'none';
            cartCheckoutFormContainer.style.display = 'flex';
        });
    }

    if (backToCartBtn) {
        backToCartBtn.addEventListener("click", () => {
            cartItemsList.style.display = 'flex';
            cartMainFooter.style.display = 'block';
            cartCheckoutFormContainer.style.display = 'none';
        });
    }

    // --- Card Inputs Interaction ---
    if (cartPaymentMethod) {
        cartPaymentMethod.addEventListener("change", () => {
            if (cartPaymentMethod.value === "card") {
                creditCardSection.style.display = "flex";
                cardNumberInput.required = true;
                cardExpiryInput.required = true;
                cardCvvInput.required = true;
            } else {
                creditCardSection.style.display = "none";
                cardNumberInput.required = false;
                cardExpiryInput.required = false;
                cardCvvInput.required = false;
            }
        });
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            let formatted = "";
            for (let i = 0; i < value.length && i < 16; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += " ";
                }
                formatted += value[i];
            }
            e.target.value = formatted;
            if (cardNumDisp) cardNumDisp.textContent = formatted || "•••• •••• •••• ••••";
        });
    }

    const clientNameInput = document.getElementById("cartClientName");
    if (clientNameInput) {
        clientNameInput.addEventListener("input", (e) => {
            if (cardNameDisp) {
                cardNameDisp.textContent = e.target.value.toUpperCase() || "ISMI SHARIFI";
            }
        });
    }

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            let formatted = "";
            if (value.length > 0) {
                formatted = value.substring(0, 2);
                if (value.length > 2) {
                    formatted += "/" + value.substring(2, 4);
                }
            }
            e.target.value = formatted;
            if (cardExpiryDisp) cardExpiryDisp.textContent = formatted || "AA/YY";
        });
    }

    if (cardCvvInput) {
        cardCvvInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            e.target.value = value;
            if (cardCvvDisp) cardCvvDisp.textContent = value.replace(/./g, "•") || "•••";
        });

        cardCvvInput.addEventListener("focus", () => {
            if (virtualCard) virtualCard.classList.add("flipped");
        });

        cardCvvInput.addEventListener("blur", () => {
            if (virtualCard) virtualCard.classList.remove("flipped");
        });
    }


    // --- 5. Submit Order from Cart Form ---
    if (cartCheckoutForm) {
        cartCheckoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const clientName = document.getElementById("cartClientName").value.trim();
            const clientPhone = document.getElementById("cartClientPhone").value.trim();
            const clientNotes = document.getElementById("cartClientNotes").value.trim();
            const paymentMethod = cartPaymentMethod ? cartPaymentMethod.value : "cash";

            let totalOrderPrice = 0;
            let rentalDays = null;
            let rentalStartDate = null;
            let orderProductsSummary = [];
            
            let hasRental = false;
            let hasDrone = false;
            let hasPart = false;

            cart.forEach(item => {
                const p = item.product;
                if (p.category === 'ijara') {
                    hasRental = true;
                    const itemDays = item.rentalDays || 1;
                    const itemStartDate = item.rentalStartDate || new Date().toISOString().split('T')[0];
                    if (rentalDays === null) rentalDays = itemDays;
                    if (rentalStartDate === null) rentalStartDate = itemStartDate;
                    totalOrderPrice += (p.price * itemDays) * item.quantity;
                    orderProductsSummary.push(`${p.name} (x${item.quantity}, ${itemDays} kun)`);
                } else {
                    if (p.category === 'qism') hasPart = true;
                    if (p.category === 'dron') hasDrone = true;
                    totalOrderPrice += p.price * item.quantity;
                    orderProductsSummary.push(`${p.name} (x${item.quantity})`);
                }
            });

            let finalCategory = 'dron';
            if (hasRental) finalCategory = 'ijara';
            else if (hasPart && !hasDrone) finalCategory = 'qism';

            const newOrder = {
                id: "ord-" + Date.now().toString().slice(-4),
                customerName: clientName,
                phone: clientPhone,
                productId: cart[0].product.id,
                productName: orderProductsSummary.join(" + "),
                price: totalOrderPrice,
                category: finalCategory,
                status: 'yangi',
                assignedTo: null,
                date: new Date().toISOString(),
                notes: clientNotes + (paymentMethod === "card" ? " [To'langan: Karta orqali]" : " [Naqd to'lov]"),
                rentalDays: rentalDays,
                rentalStartDate: rentalStartDate
            };

            const saveAndComplete = () => {
                const orders = DB.getOrders();
                orders.push(newOrder);
                DB.saveOrders(orders);

                clearCart();

                if (paymentLoaderOverlay) paymentLoaderOverlay.style.display = 'none';
                cartCheckoutFormContainer.style.display = 'none';
                cartCheckoutSuccess.style.display = 'block';

                setTimeout(() => {
                    cartSidebar.classList.remove("open");
                }, 3000);
            };

            if (paymentMethod === "card") {
                // Show processing payment simulated overlay
                if (paymentLoaderOverlay) {
                    paymentLoaderOverlay.style.display = 'flex';
                }
                setTimeout(() => {
                    saveAndComplete();
                }, 2000);
            } else {
                saveAndComplete();
            }
        });
    }


    // --- 6. User Login/Profile dropdown integration ---
    const currentUser = DB.getCurrentUser();
    const navLoginLink = document.getElementById("navLoginLink");
    const userProfileWrapper = document.getElementById("userProfileWrapper");
    const profileNameText = document.getElementById("profileNameText");
    const profileDropdownBtn = document.getElementById("profileDropdownBtn");
    const profileDropdownContent = document.getElementById("profileDropdownContent");
    const navLogoutBtn = document.getElementById("navLogoutBtn");

    const viewMyOrdersLink = document.getElementById("viewMyOrdersLink");
    const userOrdersModal = document.getElementById("userOrdersModal");
    const closeOrdersModal = document.getElementById("closeOrdersModal");

    if (currentUser) {
        // Authenticated header layout
        if (navLoginLink) navLoginLink.style.display = 'none';
        if (userProfileWrapper) {
            userProfileWrapper.style.display = 'inline-block';
            profileNameText.textContent = currentUser.name.split(' ')[0]; // Short name
        }

        // Dropdown toggle
        if (profileDropdownBtn && profileDropdownContent) {
            profileDropdownBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                profileDropdownContent.style.display = profileDropdownContent.style.display === 'flex' ? 'none' : 'flex';
            });
            document.addEventListener("click", () => {
                profileDropdownContent.style.display = 'none';
            });
        }

        // Logout action
        if (navLogoutBtn) {
            navLogoutBtn.addEventListener("click", () => {
                DB.logout();
            });
        }

        // Orders history action
        if (viewMyOrdersLink && userOrdersModal) {
            viewMyOrdersLink.addEventListener("click", (e) => {
                e.preventDefault();
                renderUserOrdersHistory();
                userOrdersModal.classList.add("show");
            });
        }

        if (closeOrdersModal && userOrdersModal) {
            closeOrdersModal.addEventListener("click", () => {
                userOrdersModal.classList.remove("show");
            });
            window.addEventListener("click", (e) => {
                if (e.target === userOrdersModal) {
                    userOrdersModal.classList.remove("show");
                }
            });
        }
    } else {
        if (navLoginLink) navLoginLink.style.display = 'inline-block';
        if (userProfileWrapper) userProfileWrapper.style.display = 'none';
    }

    function renderUserOrdersHistory() {
        const userOrdersHistoryTableBody = document.getElementById("userOrdersHistoryTableBody");
        const noOrdersHistoryMessage = document.getElementById("noOrdersHistoryMessage");
        if (!userOrdersHistoryTableBody) return;

        const allOrders = DB.getOrders();
        const userOrders = allOrders.filter(o => o.customerName === currentUser.name);

        userOrdersHistoryTableBody.innerHTML = '';

        if (userOrders.length === 0) {
            userOrdersHistoryTableBody.parentElement.style.display = 'none';
            noOrdersHistoryMessage.style.display = 'block';
            return;
        }

        userOrdersHistoryTableBody.parentElement.style.display = 'table';
        noOrdersHistoryMessage.style.display = 'none';

        function formatDateLocal(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('uz-UZ') + ' ' + date.toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'});
        }

        function getStatusBadgeHtml(status) {
            let bg, color, text;
            if (status === 'yangi') {
                bg = 'rgba(59, 130, 246, 0.15)'; color = '#3b82f6'; text = 'Yangi';
            } else if (status === 'yetkazilmoqda') {
                bg = 'rgba(245, 158, 11, 0.15)'; color = '#f59e0b'; text = 'Yo\'lda';
            } else if (status === 'yakunlandi') {
                bg = 'rgba(16, 185, 129, 0.15)'; color = '#10b981'; text = 'Yakunlandi';
            } else {
                bg = 'rgba(239, 68, 68, 0.15)'; color = '#ef4444'; text = 'Bekor qilingan';
            }
            return `<span style="background: ${bg}; color: ${color}; border: 1px solid ${color.replace(')', ', 0.25)')}; padding: 4px 8px; border-radius: 12px; font-weight: 600; font-size: 11px; display: inline-block;">${text}</span>`;
        }

        userOrders.forEach(o => {
            const tr = document.createElement("tr");
            tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
            
            let prodName = `<strong>${o.productName}</strong>`;
            if (o.category === 'ijara' && o.rentalDays) {
                prodName += `<div style="font-size: 11px; color: var(--primary); margin-top: 3px;"><i class="fas fa-calendar-alt" style="margin-right: 4px;"></i> Ijara: ${o.rentalStartDate} dan (${o.rentalDays} kun)</div>`;
            }

            tr.innerHTML = `
                <td style="padding: 12px 5px;"><strong>#${o.id.split('-')[1] || o.id}</strong></td>
                <td style="padding: 12px 5px; max-width: 240px;">${prodName}</td>
                <td style="padding: 12px 5px; font-weight: 700; color: var(--primary);">$${o.price.toLocaleString()}</td>
                <td style="padding: 12px 5px; color: var(--text-muted); font-size: 12px;">${formatDateLocal(o.date)}</td>
                <td style="padding: 12px 5px; text-align: right;">${getStatusBadgeHtml(o.status)}</td>
            `;
            userOrdersHistoryTableBody.appendChild(tr);
        });
    }


    // --- 7. Scroll Reveal animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 8. Initial Loads ---
    renderCatalog();
    renderCart();

});