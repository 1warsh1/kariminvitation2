/* ==========================================================================
   LUXURY WEDDING INVITATION INTERACTIVE SCRIPT - KARIM GHARBA
   Features:
   - Dynamic URL Guest Personalization
   - Cover Gate & Audio Player with Autoplay Policy Handling
   - Realtime Countdown Timer to 26 September 2026
   - 1-Click Copy to Clipboard & Toast Notifications
   - Realtime Cloud Database (Firebase Realtime Database) for Wishes & RSVP
   - Anti-XSS Sanitization & Loading State Handling
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================
  // 1. URL QUERY PARAMETERS PARSER (PERSONALIZED & PUBLIC MODES)
  // ==========================================================================
  const parseUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const guestName = urlParams.get('to') || urlParams.get('name');
    const salutation = urlParams.get('p') || urlParams.get('prefix') || 'Bapak & Ibu';
    const guestCode = urlParams.get('c') || urlParams.get('guest');
    
    const recipientLabelEl = document.getElementById('recipient-label-text');
    const recipientNameEl = document.getElementById('cover-recipient-name');
    const guestCodeEl = document.getElementById('cover-guest-code');
    const formGuestNameEl = document.getElementById('guest-name');

    if (guestName && guestName.trim() !== '') {
      // PERSONALIZED INVITATION MODE
      if (recipientLabelEl) {
        recipientLabelEl.style.display = 'block';
        recipientLabelEl.textContent = `To Our Honored Guest ${salutation}:`;
      }
      if (recipientNameEl) recipientNameEl.textContent = guestName;
      if (formGuestNameEl) formGuestNameEl.value = guestName;

      if (guestCode) {
        const formattedCode = guestCode.toString().padStart(4, '0');
        if (guestCodeEl) {
          guestCodeEl.textContent = `Guest: ${formattedCode}`;
          guestCodeEl.style.display = 'inline-block';
        }
      } else {
        if (guestCodeEl) guestCodeEl.style.display = 'none';
      }
    } else {
      // PUBLIC INVITATION MODE
      if (recipientLabelEl) recipientLabelEl.style.display = 'none';
      if (recipientNameEl) recipientNameEl.textContent = 'To Our Honored Guest';
      if (guestCodeEl) guestCodeEl.style.display = 'none';
      if (formGuestNameEl) formGuestNameEl.value = '';
    }
  };

  parseUrlParams();

  // ==========================================================================
  // 2. COVER OVERLAY & AUDIO AUTOPLAY CONTROLLER
  // ==========================================================================
  const coverModal = document.getElementById('cover-modal');
  const btnOpen = document.getElementById('btn-open-invitation');
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  let isPlaying = false;

  const playMusic = () => {
    if (bgMusic) {
      bgMusic.play().then(() => {
        isPlaying = true;
        if (musicToggleBtn) musicToggleBtn.classList.add('playing');
        if (musicIcon) musicIcon.className = 'fa-solid fa-music';
      }).catch(err => {
        console.log("Audio autoplay restricted by browser policy:", err);
      });
    }
  };

  const pauseMusic = () => {
    if (bgMusic) {
      bgMusic.pause();
      isPlaying = false;
      if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
      if (musicIcon) musicIcon.className = 'fa-solid fa-volume-xmark';
    }
  };

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      if (coverModal) coverModal.classList.add('hide');
      playMusic();
    });
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // ==========================================================================
  // 3. COUNTDOWN TIMER TO 26 SEPTEMBER 2026, 19:00 WIB
  // ==========================================================================
  const targetDate = new Date('2026-09-26T19:00:00+07:00').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================================================
  // 4. TOAST NOTIFICATION & COPY TO CLIPBOARD
  // ==========================================================================
  const btnCopyBca = document.getElementById('btn-copy-bca');
  const toastNotif = document.getElementById('toast-notif');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');

  const showToast = (message, type = 'success') => {
    if (toastNotif && toastText) {
      toastText.textContent = message;
      if (toastIcon) {
        if (type === 'error') {
          toastIcon.className = 'fa-solid fa-circle-exclamation';
          toastIcon.style.color = '#fc8181';
        } else {
          toastIcon.className = 'fa-solid fa-circle-check';
          toastIcon.style.color = 'var(--gold-primary)';
        }
      }
      toastNotif.classList.add('show');
      setTimeout(() => {
        toastNotif.classList.remove('show');
      }, 3500);
    }
  };

  if (btnCopyBca) {
    btnCopyBca.addEventListener('click', () => {
      const acctNum = btnCopyBca.getAttribute('data-account') || '7180411857';
      navigator.clipboard.writeText(acctNum).then(() => {
        showToast('Account number successfully copied!', 'success');
      }).catch(() => {
        showToast('Failed to copy account number.', 'error');
      });
    });
  }

  // ==========================================================================
  // 5. CLOUD DATABASE (FIREBASE REALTIME DATABASE) INTEGRATION
  // ==========================================================================
  
  /**
   * FIREBASE CONFIGURATION
   * To use your own Firebase project:
   * 1. Go to Firebase Console (https://console.firebase.google.com/)
   * 2. Create/select a project, create Realtime Database
   * 3. Set rules: { "rules": { "wishes": { ".read": true, ".write": true } } }
   * 4. Paste your project credentials below:
   */
  const firebaseConfig = {
    apiKey: "AIzaSyAkFoIu29DNUnLxF9q1gwbmgJMDErAxnoE",
    authDomain: "kariminvitation-48553.firebaseapp.com",
    databaseURL: "https://kariminvitation-48553-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kariminvitation-48553",
    storageBucket: "kariminvitation-48553.firebasestorage.app",
    messagingSenderId: "668946095869",
    appId: "1:668946095869:web:7a3ddb821dbbcfac796894",
    measurementId: "G-T0GVKRR3K8"
  };

  let db = null;
  let isFirebaseReady = false;

  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.database();
      isFirebaseReady = true;
      console.log("Firebase Realtime Database initialized successfully.");
    } else {
      console.warn("Firebase SDK script not detected.");
    }
  } catch (err) {
    console.warn("Firebase initialization error:", err);
  }

  const rsvpForm = document.getElementById('rsvp-form');
  const btnSubmitRsvp = document.getElementById('btn-submit-rsvp');
  const btnText = btnSubmitRsvp ? btnSubmitRsvp.querySelector('.btn-text') : null;
  const btnLoading = btnSubmitRsvp ? btnSubmitRsvp.querySelector('.btn-loading') : null;
  const wishesWall = document.getElementById('wishes-wall');
  const statHadir = document.getElementById('stat-count-hadir');
  const statTidak = document.getElementById('stat-count-tidak');

  // Anti-XSS Sanitizer
  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === 'Just now' || timeStr === 'Baru saja') return 'Just now';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  const renderWishesData = (wishes) => {
    let countHadir = 0;
    let countTidak = 0;

    if (!wishesWall) return;
    wishesWall.innerHTML = '';

    if (!wishes || wishes.length === 0) {
      wishesWall.innerHTML = `
        <div style="text-align: center; padding: 25px 15px; color: var(--text-muted); font-size: 0.95rem;">
          <i class="fa-regular fa-comments" style="font-size: 1.8rem; color: var(--gold-primary); margin-bottom: 8px; display: block;"></i>
          Be the first to send warm wishes & prayers!
        </div>
      `;
      if (statHadir) statHadir.textContent = '0';
      if (statTidak) statTidak.textContent = '0';
      return;
    }

    wishes.forEach(item => {
      const isHadir = item.status === 'Attending' || item.status === 'Hadir';
      if (isHadir) countHadir++;
      else countTidak++;

      const badgeClass = isHadir ? 'badge-hadir' : 'badge-tidak';
      const badgeText = isHadir ? 'Attending' : 'Unable';

      const wishEl = document.createElement('div');
      wishEl.className = 'wish-item';
      wishEl.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(item.name)}</span>
          <span class="wish-badge ${badgeClass}">${badgeText}</span>
        </div>
        <p class="wish-text">${escapeHtml(item.wishes)}</p>
        <span class="wish-time"><i class="fa-regular fa-clock"></i> ${escapeHtml(formatTime(item.time))}</span>
      `;
      wishesWall.appendChild(wishEl);
    });

    if (statHadir) statHadir.textContent = String(countHadir);
    if (statTidak) statTidak.textContent = String(countTidak);
  };

  const setSubmittingState = (isSubmitting) => {
    if (btnSubmitRsvp) {
      btnSubmitRsvp.disabled = isSubmitting;
    }
    if (btnText && btnLoading) {
      btnText.style.display = isSubmitting ? 'none' : 'inline-block';
      btnLoading.style.display = isSubmitting ? 'inline-block' : 'none';
    }
  };

  // Real-time Database Listener
  const listenToCloudWishes = () => {
    if (!isFirebaseReady || !db) {
      console.warn("Cloud Database not active. Using initial demo feed.");
      renderWishesData([
        {
          name: "Honored Guest",
          status: "Attending",
          wishes: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Heartfelt congratulations to Karim Gharba!",
          time: new Date().toISOString()
        }
      ]);
      return;
    }

    const wishesRef = db.ref('wishes');
    wishesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const wishesList = [];
      if (data) {
        Object.keys(data).forEach(key => {
          wishesList.push({
            id: key,
            ...data[key]
          });
        });
        // Sort newest first (descending by timestamp or time)
        wishesList.sort((a, b) => {
          const timeA = a.createdAt || (new Date(a.time).getTime()) || 0;
          const timeB = b.createdAt || (new Date(b.time).getTime()) || 0;
          return timeB - timeA;
        });
      }
      renderWishesData(wishesList);
    }, (error) => {
      console.error("Firebase read listener error:", error);
      showToast('Could not sync wishes from cloud database.', 'error');
    });
  };

  listenToCloudWishes();

  // Form Submit Handler
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-name').value.trim();
      const statusInput = document.getElementById('rsvp-status').value;
      const wishesInput = document.getElementById('guest-wishes').value.trim();

      if (!nameInput || !statusInput || !wishesInput) return;

      if (!isFirebaseReady || !db) {
        showToast('Please set your Firebase Database credentials in script.js.', 'error');
        return;
      }

      setSubmittingState(true);

      const now = new Date();
      const payload = {
        name: nameInput,
        status: statusInput,
        wishes: wishesInput,
        time: now.toISOString(),
        createdAt: Date.now()
      };

      try {
        const wishesRef = db.ref('wishes');
        await wishesRef.push(payload);

        showToast('Thank you! Your wishes & RSVP have been saved.', 'success');
        document.getElementById('guest-wishes').value = '';
      } catch (err) {
        console.error("Firebase write error:", err);
        showToast('Failed to save to cloud database: ' + (err.message || 'Connection error'), 'error');
      } finally {
        setSubmittingState(false);
      }
    });
  }

  // ==========================================================================
  // 6. FLOATING SCROLL TO TOP INDICATOR
  // ==========================================================================
  const scrollIndicator = document.getElementById('floatingScrollIndicator');
  window.addEventListener('scroll', () => {
    if (scrollIndicator) {
      if (window.scrollY > 300) {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      } else {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      }
    }
  });
});
