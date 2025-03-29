document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニュートグル
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            // メニューボタンとナビゲーションリンクにactiveクラスを切り替える
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // アンカーリンクのスムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // モバイルメニューが開いている場合は閉じる
            if (menuBtn && menuBtn.classList.contains('active')) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
            
            // 対象要素へスクロール
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // ヘッダーの高さ分を調整
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // スクロール時の要素アニメーション
    const animateElements = document.querySelectorAll('.service-card, .feature, .process-step');
    
    function checkVisibility() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // 要素が画面内に入ったらアニメーションクラスを追加
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate-fadeInUp');
            }
        });
    }
    
    // ページ読み込み時に初期チェック
    checkVisibility();
    
    // スクロール時にチェック
    window.addEventListener('scroll', checkVisibility);
    
    // フォームバリデーション
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // お名前のバリデーション
            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('nameError');
            
            if (!nameInput.value.trim()) {
                showError(nameInput, nameError, 'お名前を入力してください');
                isValid = false;
            } else {
                hideError(nameInput, nameError);
            }
            
            // メールアドレスのバリデーション
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailInput.value.trim()) {
                showError(emailInput, emailError, 'メールアドレスを入力してください');
                isValid = false;
            } else if (!emailPattern.test(emailInput.value)) {
                showError(emailInput, emailError, '有効なメールアドレスを入力してください');
                isValid = false;
            } else {
                hideError(emailInput, emailError);
            }
            
            // お問い合わせ内容のバリデーション
            const messageInput = document.getElementById('message');
            const messageError = document.getElementById('messageError');
            
            if (!messageInput.value.trim()) {
                showError(messageInput, messageError, 'お問い合わせ内容を入力してください');
                isValid = false;
            } else {
                hideError(messageInput, messageError);
            }
            
            // バリデーション成功時、フォームを送信
            if (isValid) {
                // フォームデータの準備
                const formData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    company: document.getElementById('company').value.trim(),
                    message: messageInput.value.trim()
                };
                
                // メール送信（デモ用にアラートを表示）
                // 実際の環境では、FormspreeやNetlify Formsなどの外部サービスを利用するか、
                // サーバーサイドのプログラムでメール送信処理を実装します
                alert('フォームが送信されました。実際の実装では、ここでデータが' + 
                      'tsuruta@marutto.jp' + 'に送信されます。');
                
                // フォームをリセット
                contactForm.reset();
            }
        });
    }
    
    // フォームバリデーション用ヘルパー関数
    function showError(input, errorElement, message) {
        input.parentElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function hideError(input, errorElement) {
        input.parentElement.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
});
