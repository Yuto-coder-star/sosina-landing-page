// ========== グローバル変数 ==========
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');
const backToTopButton = document.querySelector('.back-to-top');
const contactForm = document.getElementById('contactForm');
const animationElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
const chatbotForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatbotMessages');
const chatStatus = document.getElementById('chatbotStatus');
const sendChatButton = document.getElementById('sendChat');
const clearChatButton = document.getElementById('clearChat');
const apiKeyInput = document.getElementById('openaiApiKey');
const saveApiKeyButton = document.getElementById('saveApiKey');
const toggleApiKeyButton = document.getElementById('toggleApiKeyVisibility');

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
  
  // URLに #thanks がある場合は、サンクスメッセージを表示
  if (window.location.hash === '#thanks' && contactForm) {
    contactForm.innerHTML = `
      <div class="form-success">
        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: var(--spacing-md);"></i>
        <h3>送信完了</h3>
        <p>お問い合わせありがとうございます。担当者より折り返しご連絡いたします。</p>
      </div>
    `;
    
    // お問い合わせセクションへスクロール
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerHeight = header.offsetHeight;
      const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
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
    let isValid = true;
    
    // 名前の検証
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
      e.preventDefault(); // フォーム送信を停止
      showError('name', 'お名前を入力してください');
      isValid = false;
    } else {
      clearError('name');
    }
    
    // メールアドレスの検証
    const emailInput = document.getElementById('email');
    if (!emailInput.value.trim()) {
      e.preventDefault(); // フォーム送信を停止
      showError('email', 'メールアドレスを入力してください');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      e.preventDefault(); // フォーム送信を停止
      showError('email', '有効なメールアドレスを入力してください');
      isValid = false;
    } else {
      clearError('email');
    }
    
    // メッセージの検証
    const messageInput = document.getElementById('message');
    if (!messageInput.value.trim()) {
      e.preventDefault(); // フォーム送信を停止
      showError('message', 'お問い合わせ内容を入力してください');
      isValid = false;
    } else {
      clearError('message');
    }
    
    // デバッグ用コンソール出力
    if (isValid) {
      console.log('フォームは有効です。FormSubmitに送信します...');
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

// ========== チャットボット機能 ==========
if (chatbotForm && chatMessages) {
  const OPENAI_STORAGE_KEY = 'sosina-openai-api-key';
  const CHATBOT_SYSTEM_PROMPT = `You are the AI concierge for Sosina, a Japanese SaaS company that builds custom business web applications. Reply in polite Japanese unless the user explicitly requests another language. Keep answers concise (around 5 sentences) and focus on actionable advice that highlights Sosina's strengths such as rapid delivery, low monthly pricing, and workflow automation. Ask clarifying questions when requirements are ambiguous.`;
  const INITIAL_ASSISTANT_MESSAGE = 'こんにちは。株式会社SosinaのAIアシスタントです。業務アプリの活用方法や機能の相談など、お気軽にご質問ください。';
  const MAX_CHAT_HISTORY = 16;
  const chatHistory = [{ role: 'system', content: CHATBOT_SYSTEM_PROMPT }];
  const decoder = new TextDecoder('utf-8');
  const sendButtonDefaultLabel = sendChatButton ? sendChatButton.textContent : '';

  function trimChatHistory() {
    if (chatHistory.length <= MAX_CHAT_HISTORY) return;
    const systemMessage = chatHistory[0];
    const recentMessages = chatHistory.slice(-1 * (MAX_CHAT_HISTORY - 1));
    chatHistory.length = 0;
    chatHistory.push(systemMessage, ...recentMessages);
  }

  function appendChatMessage(role, content, { persist = true } = {}) {
    if (!chatMessages) return null;
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.textContent = content;
    messageElement.appendChild(bubble);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (persist) {
      chatHistory.push({ role, content });
      trimChatHistory();
    }

    return bubble;
  }

  function updateChatStatus(message = '', type = 'info') {
    if (!chatStatus) return;
    chatStatus.textContent = message;
    chatStatus.classList.remove('error', 'success');
    if (type === 'error') {
      chatStatus.classList.add('error');
    } else if (type === 'success') {
      chatStatus.classList.add('success');
    }
  }

  function setLoadingState(isLoading) {
    if (sendChatButton) {
      sendChatButton.disabled = isLoading;
      sendChatButton.textContent = isLoading ? '送信中…' : (sendButtonDefaultLabel || '送信');
    }
    if (chatInput) {
      chatInput.disabled = isLoading;
    }
    if (clearChatButton) {
      clearChatButton.disabled = isLoading;
    }
  }

  function getStoredApiKey() {
    try {
      return localStorage.getItem(OPENAI_STORAGE_KEY) || '';
    } catch (error) {
      console.warn('APIキーの取得に失敗しました:', error);
      return '';
    }
  }

  function storeApiKey(keyValue) {
    try {
      if (!keyValue) {
        localStorage.removeItem(OPENAI_STORAGE_KEY);
      } else {
        localStorage.setItem(OPENAI_STORAGE_KEY, keyValue);
      }
    } catch (error) {
      console.warn('APIキーの保存に失敗しました:', error);
    }
  }

  function resolveApiKey() {
    const manualKey = (apiKeyInput && apiKeyInput.value.trim()) || '';
    if (manualKey) return manualKey;
    return getStoredApiKey();
  }

  async function streamChatCompletion(messages, apiKey, onDelta) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        stream: true,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      let errorMessage = `OpenAI APIエラー: ${response.status}`;
      try {
        const errorPayload = await response.json();
        if (errorPayload?.error?.message) {
          errorMessage = `OpenAI APIエラー: ${errorPayload.error.message}`;
        }
      } catch (err) {
        console.warn('エラーレスポンスの解析に失敗しました:', err);
      }
      throw new Error(errorMessage);
    }

    if (!response.body || !response.body.getReader) {
      const fallback = await response.json();
      const text = fallback?.choices?.[0]?.message?.content?.trim();
      if (text) {
        onDelta(text);
        return text;
      }
      throw new Error('応答の取得に失敗しました。');
    }

    const reader = response.body.getReader();
    let assistantText = '';
    let buffer = '';
    let doneReading = false;

    while (!doneReading) {
      const { value, done } = await reader.read();
      doneReading = done;
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split('\n');
      if (!done) {
        buffer = lines.pop() || '';
      } else {
        buffer = '';
      }

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) {
          continue;
        }

        const data = trimmed.replace(/^data:\s*/, '');
        if (data === '[DONE]') {
          doneReading = true;
          break;
        }

        try {
          const parsed = JSON.parse(data);
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (delta) {
            assistantText += delta;
            onDelta(assistantText);
          }
        } catch (error) {
          console.warn('レスポンスチャンクの解析に失敗しました:', error);
        }
      }
    }

    if (!assistantText) {
      throw new Error('応答の生成に失敗しました。');
    }

    return assistantText;
  }

  function resetChat() {
    chatHistory.length = 0;
    chatHistory.push({ role: 'system', content: CHATBOT_SYSTEM_PROMPT });
    if (chatMessages) {
      chatMessages.innerHTML = '';
    }
    appendChatMessage('assistant', INITIAL_ASSISTANT_MESSAGE);
    if (chatInput) {
      chatInput.value = '';
    }
  }

  function initialiseChatbot() {
    resetChat();
    const storedKey = getStoredApiKey();
    if (storedKey && apiKeyInput) {
      apiKeyInput.value = storedKey;
    }
    updateChatStatus('OpenAI APIキーを入力してチャットを開始してください。');
  }

  async function handleChatSubmit(event) {
    event.preventDefault();
    if (!chatInput) return;

    const userMessage = chatInput.value.trim();
    if (!userMessage) {
      updateChatStatus('メッセージを入力してください。', 'error');
      chatInput.focus();
      return;
    }

    const apiKey = resolveApiKey();
    if (!apiKey) {
      updateChatStatus('OpenAI APIキーを入力・保存してください。', 'error');
      if (apiKeyInput) {
        apiKeyInput.focus();
      }
      return;
    }

    appendChatMessage('user', userMessage);
    const outgoingMessages = chatHistory.map(message => ({ ...message }));
    const assistantBubble = appendChatMessage('assistant', '', { persist: false });

    setLoadingState(true);
    updateChatStatus('OpenAI APIと通信しています…');

    try {
      const assistantReply = await streamChatCompletion(outgoingMessages, apiKey, text => {
        if (assistantBubble) {
          assistantBubble.textContent = text;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });

      const bubbleToUpdate = assistantBubble || appendChatMessage('assistant', '', { persist: false });
      if (bubbleToUpdate) {
        bubbleToUpdate.textContent = assistantReply;
      }

      chatHistory.push({ role: 'assistant', content: assistantReply });
      trimChatHistory();
      if (chatInput) {
        chatInput.value = '';
        chatInput.focus();
      }
      updateChatStatus('回答が完了しました。', 'success');
    } catch (error) {
      console.error('チャットボットの応答に失敗しました:', error);
      const fallbackMessage = '申し訳ありません。応答の取得に失敗しました。APIキーとネットワーク状況をご確認ください。';
      const errorBubble = assistantBubble || appendChatMessage('assistant', '', { persist: false });
      if (errorBubble) {
        errorBubble.textContent = fallbackMessage;
      }
      chatHistory.push({ role: 'assistant', content: fallbackMessage });
      trimChatHistory();
      updateChatStatus(error.message || 'エラーが発生しました。', 'error');
    } finally {
      setLoadingState(false);
    }
  }

  initialiseChatbot();

  chatbotForm.addEventListener('submit', handleChatSubmit);

  if (chatInput) {
    chatInput.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        chatbotForm.requestSubmit();
      }
    });
  }

  if (clearChatButton) {
    clearChatButton.addEventListener('click', () => {
      resetChat();
      updateChatStatus('チャット履歴をリセットしました。', 'success');
    });
  }

  if (saveApiKeyButton) {
    saveApiKeyButton.addEventListener('click', () => {
      const keyValue = (apiKeyInput && apiKeyInput.value.trim()) || '';
      storeApiKey(keyValue);
      if (keyValue) {
        updateChatStatus('APIキーを保存しました。', 'success');
      } else {
        updateChatStatus('保存済みのAPIキーを削除しました。', 'success');
      }
    });
  }

  if (toggleApiKeyButton && apiKeyInput) {
    toggleApiKeyButton.addEventListener('click', () => {
      const isPassword = apiKeyInput.type === 'password';
      apiKeyInput.type = isPassword ? 'text' : 'password';
      toggleApiKeyButton.textContent = isPassword ? '非表示' : '表示';
      toggleApiKeyButton.setAttribute('aria-pressed', String(isPassword));
    });
  }
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
