(() => {
  const CONSENT_KEY = 'cookie_consent_v2';
  const CONSENT_VERSION = '1.0';

  // Повторно спрашивать согласие через 180 дней
  const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

  /**
   * Получить сохранённое согласие
   */
  function getStoredConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Проверить валидность согласия
   */
  function isConsentValid(consent) {
    if (!consent) return false;
    if (consent.version !== CONSENT_VERSION) return false;
    if (
      typeof consent.createdAt !== 'number' ||
      Number.isNaN(consent.createdAt)
    )
      return false;
    if (Date.now() - consent.createdAt > CONSENT_MAX_AGE_MS) return false;

    return true;
  }

  /**
   * Глобальная функция проверки согласия (для Яндекс.Метрики / Google Analytics):
   * window.__hasCookieConsent('analytics')
   */
  window.__hasCookieConsent = function (category) {
    const consent = getStoredConsent();
    if (!isConsentValid(consent)) return false;

    if (category === 'technical') return true;
    if (category === 'analytics') return consent.analytics === true;

    return false;
  };

  /**
   * Получить текущее согласие
   */
  window.__getCookieConsent = function () {
    const consent = getStoredConsent();
    if (!isConsentValid(consent)) return null;
    return consent;
  };

  /**
   * Очистить аналитические cookie при отказе
   */
  function clearAnalyticsCookies() {
    const cookiesToClear = [
      '_ga',
      '_gid',
      '_ym_uid',
      '_ym_d',
      '_ym_isad',
      '_ym_visorc',
    ];
    const hostname = window.location.hostname;
    const mainDomain = hostname.replace(/^www\./, '');

    const domains = [hostname, '.' + hostname, '.' + mainDomain];

    cookiesToClear.forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      });
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
  }

  /**
   * Сохранить выбор пользователя
   */
  function saveConsent(analytics, status) {
    const isAnalyticsAllowed = Boolean(analytics);
    const consent = {
      version: CONSENT_VERSION,
      technical: true,
      analytics: isAnalyticsAllowed,
      status: status, // accepted / rejected / custom
      createdAt: Date.now(),
      acceptedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch {}

    if (!isAnalyticsAllowed) {
      clearAnalyticsCookies();
    }

    window.dispatchEvent(
      new CustomEvent('cookieConsentUpdated', {
        detail: consent,
      }),
    );
  }

  /**
   * Показать баннер
   */
  function showBanner(openSettings = false) {
    const banner = document.getElementById('cookie-banner');
    const settingsPanel = document.getElementById('cookie-settings-panel');
    const saveSettingsBtn = document.getElementById('cookie-save-settings');
    const toggleSettingsBtn = document.getElementById('cookie-toggle-settings');

    if (!banner) return;

    banner.style.display = 'block';

    if (openSettings && settingsPanel) {
      settingsPanel.style.display = 'flex';

      if (saveSettingsBtn) {
        saveSettingsBtn.style.display = 'inline-flex';
      }

      if (toggleSettingsBtn) {
        toggleSettingsBtn.textContent = 'Скрыть';
        toggleSettingsBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  /**
   * Скрыть баннер
   */
  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }

  /**
   * Синхронизировать чекбокс с сохраненным выбором
   */
  function syncSettings() {
    const analyticsCheck = document.getElementById('cookie-analytics-check');
    const consent = getStoredConsent();

    if (!analyticsCheck) return;

    analyticsCheck.checked =
      isConsentValid(consent) && consent.analytics === true;
  }

  /**
   * Инициализация
   */
  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const settingsPanel = document.getElementById('cookie-settings-panel');
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const rejectAllBtn = document.getElementById('cookie-reject-all');
    const saveSettingsBtn = document.getElementById('cookie-save-settings');
    const toggleSettingsBtn = document.getElementById('cookie-toggle-settings');
    const analyticsCheck = document.getElementById('cookie-analytics-check');

    const savedConsent = getStoredConsent();

    if (!isConsentValid(savedConsent)) {
      syncSettings();
      showBanner(false);
    } else {
      window.dispatchEvent(
        new CustomEvent('cookieConsentUpdated', {
          detail: savedConsent,
        }),
      );
    }

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', () => {
        saveConsent(true, 'accepted');
        hideBanner();
      });
    }

    if (rejectAllBtn) {
      rejectAllBtn.addEventListener('click', () => {
        saveConsent(false, 'rejected');
        hideBanner();
      });
    }

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        const analyticsAllowed = analyticsCheck
          ? analyticsCheck.checked
          : false;
        saveConsent(analyticsAllowed, 'custom');
        hideBanner();
      });
    }

    if (toggleSettingsBtn && settingsPanel) {
      toggleSettingsBtn.addEventListener('click', () => {
        const isHidden = settingsPanel.style.display === 'none';
        settingsPanel.style.display = isHidden ? 'flex' : 'none';

        if (saveSettingsBtn) {
          saveSettingsBtn.style.display = isHidden ? 'inline-flex' : 'none';
        }

        toggleSettingsBtn.textContent = isHidden ? 'Скрыть' : 'Настройки';
        toggleSettingsBtn.setAttribute('aria-expanded', String(isHidden));
      });
    }

    // Открытие настроек по клику на кнопку в футере
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest('[data-open-cookie-settings]');
      if (!trigger) return;

      event.preventDefault();
      syncSettings();
      showBanner(true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner, {
      once: true,
    });
  } else {
    initCookieBanner();
  }
})();
