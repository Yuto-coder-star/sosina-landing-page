/**
 * 株式会社Sosina ランディングページ JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 変数の定義
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const contactForm = document.getElementById('contactForm');
    const privacyPolicyLink = document.getElementById('privacy-policy-link');
    const privacyModal = document.getElementById('privacy-modal');
    const closeModalBtn = document.querySelector('.close');
    
    // モバイルメニューの開閉
    mobileMenuBtn.addEventListener('click', function() {
        document.body.classList.toggle('mobile-menu-open');
        
        // ハンバーガーメニューのアニメーション
        const spans = this.querySelectorAll('span');
        spans.forEach(span => {
            span.classList.toggle('active');
        });
    });
    
    // スムーススクロール
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // モバイルメニューが開いている場合は閉じる
            if (document.body.classList.contains('mobile-menu-open')) {
                document.body.classList.remove('mobile-menu-open');
            }
            
            const targetId = this.getAttribute('href');
            
            // 通常のリンク（#で始まらないもの）は通常の挙動
            if (!targetId.startsWith('#')) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // プライバシーポリシーモーダル
    privacyPolicyLink.addEventListener('click', function(e) {
        e.preventDefault();
        privacyModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // スクロール防止
    });
    
    closeModalBtn.addEventListener('click', function() {
        privacyModal.style.display = 'none';
        document.body.style.overflow = ''; // スクロール復活
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // フォームのバリデーションと送信処理
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 簡易バリデーション
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const privacy = document.getElementById('privacy').checked;
        
        let isValid = true;
        let errorMessage = '';
        
        if (name === '') {
            isValid = false;
            errorMessage += 'お名前を入力してください。\n';
        }
        
        if (email === '') {
            isValid = false;
            errorMessage += 'メールアドレスを入力してください。\n';
        } else if (!isValidEmail(email)) {
            isValid = false;
            errorMessage += '有効なメールアドレスを入力してください。\n';
        }
        
        if (message === '') {
            isValid = false;
            errorMessage += 'お問い合わせ内容を入力してください。\n';
        }
        
        if (!privacy) {
            isValid = false;
            errorMessage += 'プライバシーポリシーに同意してください。\n';
        }
        
        if (!isValid) {
            alert(errorMessage);
            return;
        }
        
        // メール送信（mailto:スキーム）
        const phone = document.getElementById('phone').value.trim();
        const mailtoLink = `mailto:tsuruta@marutto.jp?subject=Sosinaお問い合わせ（${name}様）&body=お名前: ${name}%0D%0Aメールアドレス: ${email}%0D%0A電話番号: ${phone}%0D%0A%0D%0A${message}`;
        
        window.location.href = mailtoLink;
        
        // フォームのリセット
        this.reset();
        
        // 送信完了メッセージ
        alert('お問い合わせありがとうございます。メーラーが起動します。');
    });
    
    // メールアドレスのバリデーション関数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // スクロール時のヘッダースタイル変更
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Formspree利用の場合（コメントアウト状態）
    /*
    const formspreeForm = document.getElementById('formspreeForm');
    if (formspreeForm) {
        formspreeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // FormspreeのエンドポイントURL（実際に使う場合は自分のフォームIDに置き換え）
            const formspreeUrl = 'https://formspree.io/f/xxxxxxxxxxxx';
            
            // フォームデータの取得
            const formData = new FormData(this);
            
            // Formspreeに送信
            fetch(formspreeUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('ネットワークエラーが発生しました');
            })
            .then(data => {
                // 送信成功時の処理
                alert('お問い合わせありがとうございます。担当者より連絡いたします。');
                formspreeForm.reset();
            })
            .catch(error => {
                // エラー処理
                alert('送信に失敗しました。時間をおいて再度お試しください。');
                console.error('Error:', error);
            });
        });
    }
    */
});
