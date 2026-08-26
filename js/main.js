/**
 * 株式会社NextBridge (NextBridge Inc.) - コーポレートサイト JavaScript
 * 
 * サイト全体のインタラクティブな機能（モバイルメニュー、スクロールアニメーション、
 * 数値カウンター、アコーディオン、フォーム送信）を制御します。
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. スクロールに応じたヘッダーのスタイル制御
  initHeaderScroll();

  // 2. モバイル用ハンバーガーメニューの開閉制御
  initMobileMenu();

  // 3. スクロール連動のフェードインアニメーション (Intersection Observer)
  initScrollAnimations();

  // 4. 数字で見るNextBridge (実績数値のカウントアップアニメーション)
  initCountUpAnimation();

  // 5. よくある質問 (FAQ) & 採用職種アコーディオンの開閉
  initAccordions();

  // 6. お問い合わせフォーム送信体験 (バリデーション＆送信完了モーダル)
  initContactForm();
});

/**
 * 1. スクロールヘッダー制御
 * 画面を少し下にスクロールした際に、ヘッダーに影と半透明効果を付与して見やすくします。
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 初期読み込み時の状態を反映
}

/**
 * 2. モバイルハンバーガーメニュー制御
 * スマートフォン閲覧時に、メニューの開閉と背景オーバーレイを切り替えます。
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!hamburger || !mobileNav || !overlay) return;

  const toggleMenu = () => {
    const isOpen = hamburger.classList.contains('is-active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // 背景のスクロールをロック
  };

  const closeMenu = () => {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = ''; // スクロールロック解除
  };

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // メニュー内のリンクをクリックした時も閉じる
  const navLinks = mobileNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * 3. スクロールフェードインアニメーション
 * Intersection Observer API（要素が画面内に入ったかを検知するブラウザ標準機能）を用いて、
 * スクロールに合わせて要素をふわっと表示させます。
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if (!animatedElements.length) return;

  // Intersection Observerの作成
  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observerInstance.unobserve(entry.target); // 一度表示されたら監視を解除して軽量化
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px', // 画面下部から60px手前でアニメーション開始
    threshold: 0.1
  });

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * 4. 実績数値のカウントアップアニメーション
 * 画面内に実績エリアが入ったら、0から目標の数値まで滑らかにカウントアップします。
 */
function initCountUpAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1600; // アニメーション時間 (ミリ秒)
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // イージング関数 (スムーズに減速する動き: easeOutQuad)
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentVal = (easeProgress * targetValue).toFixed(decimals);

          el.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            el.textContent = targetValue.toFixed(decimals);
          }
        };

        requestAnimationFrame(updateNumber);
        observerInstance.unobserve(el);
      }
    });
  }, {
    threshold: 0.3
  });

  statNumbers.forEach(num => observer.observe(num));
}

/**
 * 5. FAQアコーディオン開閉制御
 * 質問部分をクリックした際に回答を開閉します。
 */
function initAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // 他のFAQを閉じる（1つだけ開く動作にする場合）
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // クリックされた項目の開閉を反転
      if (isOpen) {
        item.classList.remove('is-open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 6. お問い合わせフォーム送信体験
 * フォーム入力のバリデーション（入力チェック）と、送信完了モーダルの表示を行います。
 */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  const modal = document.querySelector('#successModal');
  const closeModalBtn = document.querySelector('#closeModalBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // 実際の画面リロードを防止

    // 簡易バリデーションチェック
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '送信する';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '送信中...';
    }

    // 擬似的な非同期通信（API送信完了）のシミュレーション
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      // モーダルを開く
      if (modal) {
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }

      form.reset(); // フォーム内容をリセット
    }, 800);
  });

  // モーダルを閉じる処理
  if (closeModalBtn && modal) {
    const closeModal = () => {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}
