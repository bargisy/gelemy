// --- PWA INSTALL PROMPT LOGIC ---
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome from showing the mini-infobar automatically
      e.preventDefault();
      deferredPrompt = e;
      
      // Show the button in Settings
      const installBtn = document.getElementById('install-app-btn');
      if (installBtn) installBtn.classList.remove('hidden');

      // Show the Global Banner at the top of the screen
      const banner = document.getElementById('install-banner');
      const bannerBtn = document.getElementById('banner-install-btn');
      if (banner) banner.classList.remove('hidden');

      // Handle Banner Click
      if (bannerBtn) {
        bannerBtn.addEventListener('click', async () => {
          banner.classList.add('hidden'); // Hide banner
          if (installBtn) installBtn.classList.add('hidden'); // Hide settings button
          
          deferredPrompt.prompt(); // Show the browser's native install dialog
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          deferredPrompt = null;
        });
      }

      // Handle Settings Button Click
      if (installBtn) {
        installBtn.addEventListener('click', async () => {
          banner.classList.add('hidden'); 
          installBtn.classList.add('hidden'); 
          
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          deferredPrompt = null;
        });
      }
    });
