// DOM要素の読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // 変数の定義
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contact-form');
    
    // メニュートグルの設定 - モバイル表示時のハンバーガーメニュー
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // スクロール時のヘッダースタイル変更 - スクロールするとヘッダーが小さくなる
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // コンタクトフォームのバリデーション
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームのフィールド
            const company = document.getElementById('company');
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // エラーメッセージ要素
            const companyError = document.getElementById('company-error');
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const messageError = document.getElementById('message-error');
            
            // バリデーションフラグ
            let isValid = true;
            
            // すべてのエラーメッセージをリセット
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.style.display = 'none';
                error.textContent = '';
            });
            
            // 会社名のバリデーション
            if (company.value.trim() === '') {
                companyError.textContent = '会社名を入力してください';
                companyError.style.display = 'block';
                isValid = false;
            }
            
            // 名前のバリデーション
            if (name.value.trim() === '') {
                nameError.textContent = 'お名前を入力してください';
                nameError.style.display = 'block';
                isValid = false;
            }
            
            // メールのバリデーション
            if (email.value.trim() === '') {
                emailError.textContent = 'メールアドレスを入力してください';
                emailError.style.display = 'block';
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                emailError.textContent = '有効なメールアドレスを入力してください';
                emailError.style.display = 'block';
                isValid = false;
            }
            
            // メッセージのバリデーション
            if (message.value.trim() === '') {
                messageError.textContent = 'お問い合わせ内容を入力してください';
                messageError.style.display = 'block';
                isValid = false;
            }
            
            // フォームが有効な場合の処理
            if (isValid) {
                // 実際にはここでメールを送信するか、APIにデータを送信する処理を行う
                // ここではアラートで送信成功を表示
                alert('お問い合わせありがとうございます。担当者より返信いたします。');
                contactForm.reset();
            }
        });
    }
    
    // メールアドレスのバリデーション関数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // スクロールアニメーション - 要素が画面に入ったときにフェードインする
    const elements = document.querySelectorAll('.highlight-item, .feature-card, .step, .github-step');
    
    // Intersection Observerの設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // 監視対象の要素を設定
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
});
