// ========== グローバル変数 ==========
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');
const backToTopButton = document.querySelector('.back-to-top');
const contactForm = document.getElementById('contactForm');
const animationElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');

// ========== ヘルパー関数 ==========

/**
 * 要素がビューポート内にあるかをチェック
 * @param {HTMLElement} element - チェックする要素
 * @param {number} offset - ビューポート内と見なす際のオフセット値
 * @returns {boolean} - 要素がビューポート内にあるかどうか
 */
function isInViewport(element, offset = 100) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight - offset) &&
    rect.bottom >= 0 &&
    rect.left <= window.innerWidth &&
    rect.right >= 0
  );
}

/**
 * メールアドレスを検証
 * @param {string} email - 検証するメールアドレス
 * @returns {boolean} - メールアドレスが有効かどうか
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * フォームフィールドにエラーメッセージを表示
 * @param {string} inputId - 入力フィールドのID
 * @param {string} message - 表示するエラーメッセージ
 */
function showError(inputId, message) {
  const errorElement = document.getElementById(`${inputId}Error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

/**
 * フォームフィールドのエラーメッセージをクリア
 * @param {string} inputId - 入力フィールドのID
 */
function clearError(inputId) {
  const errorElement = document.getElementById(`${inputId}Error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

// ========== イベントリスナー ==========

// モバイルメニュー切り替え
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

// スクロール時の効果
window.addEventListener('scroll', () => {
  // ヘッダースクロールクラス
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // トップに戻るボタンの表示切り替え
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
  
  // スクロール時のアニメーション要素をチェック
  animationElements.forEach(element => {
    if (isInViewport(element)) {
      element.classList.add('visible');
    }
  });
});

// ページ読み込み時のアニメーションチェック
window.addEventListener('load', () => {
  // 初期アニメーションのチェック
  setTimeout(() => {
    animationElements.forEach(element => {
      if (isInViewport(element, 0)) {
        element.classList.add('visible');
      }
    });
  }, 100);
});

// トップに戻るボタンクリック
if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ナビゲーションリンクのスムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    // モバイルメニューが開いていれば閉じる
    if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      nav.classList.remove('active');
    }
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
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

// お問い合わせフォームの検証
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // 名前の検証
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
      showError('name', 'お名前を入力してください');
      isValid = false;
    } else {
      clearError('name');
    }
    
    // メールアドレスの検証
    const emailInput = document.getElementById('email');
    if (!emailInput.value.trim()) {
      showError('email', 'メールアドレスを入力してください');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError('email', '有効なメールアドレスを入力してください');
      isValid = false;
    } else {
      clearError('email');
    }
    
    // メッセージの検証
    const messageInput = document.getElementById('message');
    if (!messageInput.value.trim()) {
      showError('message', 'お問い合わせ内容を入力してください');
      isValid = false;
    } else {
      clearError('message');
    }
    
    // 有効な場合、フォーム送信をシミュレート（実際の実装では、サーバーにフォームを送信）
    if (isValid) {
      // 成功メッセージを表示
      contactForm.innerHTML = `
        <div class="form-success">
          <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: var(--spacing-md);"></i>
          <h3>送信完了</h3>
          <p>お問い合わせありがとうございます。担当者より折り返しご連絡いたします。</p>
        </div>
      `;
      
      // 実際の実装では、ここでサーバーにフォームデータを送信
      console.log('フォームが正常に送信されました');
    }
  });
  
  // 入力時のエラークリア
  ['name', 'email', 'message'].forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', () => {
        clearError(inputId);
      });
    }
  });
}

// ========== エラーハンドリング ==========
// グローバルエラーハンドラー
window.addEventListener('error', function(e) {
  console.error('JavaScript エラー:', e.message);
  // より洗練されたエラー処理を実装することも可能
});

// 読み込みに失敗した画像の処理
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    console.warn(`画像の読み込みに失敗: ${this.src}`);
    
    // ロゴ画像の場合、テキストで代替
    if (this.alt.includes('ロゴ')) {
      const textLogo = document.createElement('div');
      textLogo.className = 'text-logo';
      textLogo.textContent = '株式会社Sosina';
      textLogo.style.fontWeight = 'bold';
      textLogo.style.fontSize = '1.2rem';
      this.parentNode.appendChild(textLogo);
    }
  });
});
