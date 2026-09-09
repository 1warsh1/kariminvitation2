/* ==========================================================================
   LUXURY WEDDING INVITATION INTERACTIVE SCRIPT - KARIM GHARBA
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. URL QUERY PARAMETERS PARSER (SUPPORT PUBLIC & PERSONALIZED MODES)
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

  // 2. COVER OVERLAY & AUDIO AUTOPLAY
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
        console.log("Audio autoplay restricted:", err);
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

  // 3. COUNTDOWN TIMER
  const targetDate = new Date('2026-09-26T19:00:00+07:00').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. COPY TO CLIPBOARD TOAST NOTIFICATION
  const btnCopyBca = document.getElementById('btn-copy-bca');
  const toastNotif = document.getElementById('toast-notif');
  const toastText = document.getElementById('toast-text');

  const showToast = (message) => {
    if (toastNotif && toastText) {
      toastText.textContent = message;
      toastNotif.classList.add('show');
      setTimeout(() => {
        toastNotif.classList.remove('show');
      }, 3000);
    }
  };

  if (btnCopyBca) {
    btnCopyBca.addEventListener('click', () => {
      const acctNum = btnCopyBca.getAttribute('data-account') || '7180411857';
      navigator.clipboard.writeText(acctNum).then(() => {
        showToast('Account number successfully copied!');
      }).catch(() => {
        showToast('Failed to copy account number.');
      });
    });
  }

  // 5. RSVP & WISHES FEED WITH PERSISTENT DATABASE INTEGRATION
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesWall = document.getElementById('wishes-wall');
  const statHadir = document.getElementById('stat-count-hadir');
  const statTidak = document.getElementById('stat-count-tidak');

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

    if (statHadir) statHadir.textContent = countHadir;
    if (statTidak) statTidak.textContent = countTidak;
  };

  const fetchWishesFromDb = () => {
    fetch('/api/wishes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          renderWishesData(data);
          localStorage.setItem('wedding_wishes_karim', JSON.stringify(data));
        }
      })
      .catch(err => {
        console.log("Using cached offline wishes:", err);
        const cached = localStorage.getItem('wedding_wishes_karim');
        if (cached) {
          try { renderWishesData(JSON.parse(cached)); } catch (e) {}
        }
      });
  };

  const escapeHtml = (str) => {
    return String(str).replace(/[&<>"']/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  };

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-name').value.trim();
      const statusInput = document.getElementById('rsvp-status').value;
      const wishesInput = document.getElementById('guest-wishes').value.trim();

      if (!nameInput || !statusInput || !wishesInput) return;

      const payload = {
        name: nameInput,
        status: statusInput,
        wishes: wishesInput
      };

      fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(resData => {
          if (resData.success && Array.isArray(resData.wishes)) {
            renderWishesData(resData.wishes);
            localStorage.setItem('wedding_wishes_karim', JSON.stringify(resData.wishes));
          } else {
            fetchWishesFromDb();
          }
          showToast('Wishes & attendance saved to database!');
        })
        .catch(err => {
          console.error("Database save fallback:", err);
          const newWish = {
            name: nameInput,
            status: statusInput,
            wishes: wishesInput,
            time: new Date().toISOString()
          };
          const cached = JSON.parse(localStorage.getItem('wedding_wishes_karim') || '[]');
          cached.unshift(newWish);
          localStorage.setItem('wedding_wishes_karim', JSON.stringify(cached));
          renderWishesData(cached);
          showToast('Wishes & attendance saved!');
        });

      document.getElementById('guest-wishes').value = '';
    });
  }

  fetchWishesFromDb();
  // Auto-refresh wishes every 10 seconds so comments from any user appear live
  setInterval(fetchWishesFromDb, 10000);

  // 6. SCROLL TO TOP INDICATOR
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
