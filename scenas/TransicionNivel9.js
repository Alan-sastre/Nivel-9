class TransicionNivel9 extends Phaser.Scene {
  constructor() {
    super({ key: "TransicionNivel9" });
  }

  preload() {
    // Load video with better configuration to avoid range request issues
    this.load.video("video2", "assets/video2/video2.mp4", "canplaythrough");

    // Set loader configuration to avoid range requests
    this.load.xhr.responseType = 'blob';

    // Add error handling for video loading
    this.load.on('loaderror', (file) => {
      if (file.key === 'video2') {
        console.error('Error loading video2:', file);
        // Try alternative loading method
        console.log('Attempting alternative video loading...');
        this.load.video("video2_retry", "assets/video2/video2.mp4", "loadedmetadata");
      }
    });
  }

  create() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Pausar la música usando el AudioManager
    const audioManager = this.scene.get("AudioManager");
    if (audioManager) {
      audioManager.pauseMusic();
    }

    this.add.rectangle(
      screenWidth / 2,
      screenHeight / 2,
      screenWidth,
      screenHeight,
      0x000000
    );

    const video = this.add.video(screenWidth / 2, screenHeight / 2, "video2");

    const videoElement = video.video;

    // Set video properties to handle decode issues
    videoElement.muted = false;
    videoElement.preload = 'metadata'; // Load only metadata initially
    videoElement.crossOrigin = 'anonymous'; // Handle CORS issues

    // Add video format fallback handling
    videoElement.addEventListener('loadstart', () => {
      console.log('Video loading started');
    });

    // Add comprehensive error handling for video playback
    videoElement.addEventListener('error', (e) => {
      console.error('Video playback error:', e);
      console.error('Video error code:', videoElement.error?.code);
      console.error('Video error message:', videoElement.error?.message);

      // Try to recover from decode errors
      if (videoElement.error?.code === 3) { // MEDIA_ERR_DECODE
        console.log('Attempting to recover from decode error...');
        videoElement.load(); // Reload the video
        setTimeout(() => {
          try {
            const recoveryPromise = video.play();
            if (recoveryPromise && typeof recoveryPromise.catch === 'function') {
              recoveryPromise.catch(recoveryError => {
                console.error('Recovery play failed:', recoveryError);
              });
            }
          } catch (recoveryError) {
            console.error('Recovery play exception:', recoveryError);
          }
        }, 500);
      }
    });

    videoElement.addEventListener('stalled', () => {
      console.warn('Video playback stalled - attempting to resume');
      // Try to resume playback when stalled
      setTimeout(() => {
        if (videoElement.paused) {
          try {
            const resumePromise = video.play();
            if (resumePromise && typeof resumePromise.catch === 'function') {
              resumePromise.catch(resumeError => {
                console.error('Resume play failed:', resumeError);
              });
            }
          } catch (resumeError) {
            console.error('Resume play exception:', resumeError);
          }
        }
      }, 100);
    });

    let waitingCount = 0;
    videoElement.addEventListener('waiting', () => {
      waitingCount++;
      if (waitingCount <= 3) { // Only log first few waiting events to reduce console spam
        console.warn(`Video is waiting for data (${waitingCount})`);
      }
      
      // If video is waiting too long, try to help it along
      if (waitingCount > 5) {
        console.log('Video waiting too long, attempting to reload...');
        videoElement.load();
        waitingCount = 0; // Reset counter
      }
    });

    // Add comprehensive video event logging
    videoElement.addEventListener('loadstart', () => {
      console.log('🎬 Video: loadstart event fired');
    });

    videoElement.addEventListener('loadedmetadata', () => {
      const videoDuration = videoElement.duration;
      console.log(`🎬 Video: loadedmetadata event fired - Duration: ${videoDuration} seconds`);
      if (videoDuration && !isNaN(videoDuration)) {
        console.log(`🎬 Video: Setting fallback timeout for ${(videoDuration + 2)} seconds`);
        // Set a timeout slightly longer than video duration as fallback
        setTimeout(() => {
          if (this.scene.isActive('TransicionNivel9')) {
            console.log('⏰ Fallback timeout triggered - transitioning to next scene');
            if (audioManager) {
              audioManager.resumeMusic();
            }
            if (sliderContainer && sliderContainer.parentNode) {
              sliderContainer.parentNode.removeChild(sliderContainer);
            }
            this.scene.start("PuzzleElectronico");
          }
        }, (videoDuration + 2) * 1000); // Add 2 seconds buffer
      }
    });

    videoElement.addEventListener('loadeddata', () => {
      console.log('🎬 Video: loadeddata event fired');
    });

    videoElement.addEventListener('canplay', () => {
      console.log('🎬 Video: canplay event fired');
    });

    videoElement.addEventListener('canplaythrough', () => {
      console.log('🎬 Video: canplaythrough event fired');
    });

    videoElement.addEventListener('play', () => {
      console.log('🎬 Video: play event fired');
    });

    videoElement.addEventListener('playing', () => {
      console.log('🎬 Video: playing event fired');
    });

    videoElement.addEventListener('timeupdate', () => {
      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration;
      if (duration && currentTime) {
        const progress = (currentTime / duration * 100).toFixed(1);
        if (currentTime % 5 < 0.1) { // Log every 5 seconds
          console.log(`🎬 Video progress: ${progress}% (${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s)`);
        }
        
        // Check if we're near the end
        if (duration - currentTime < 1) {
          console.log('🎬 Video: Near end detected, preparing for transition...');
        }
      }
    });

    videoElement.addEventListener('ended', () => {
      console.log('🎬 Video: ENDED event fired - transitioning to next scene');
      // Reanudar la música antes de cambiar de escena
      if (audioManager) {
        audioManager.resumeMusic();
      }
      if (sliderContainer && sliderContainer.parentNode) {
        sliderContainer.parentNode.removeChild(sliderContainer);
      }
      this.scene.start("PuzzleElectronico");
    });

    videoElement.addEventListener('pause', () => {
      console.log('🎬 Video: pause event fired');
    });

    videoElement.addEventListener('error', (e) => {
      console.error('🎬 Video: error event fired', e);
    });

    videoElement.addEventListener('loadstart', () => {
      console.log('Video loading started');
    });

    videoElement.addEventListener('loadeddata', () => {
      console.log('Video data loaded');
    });

    video.on("play", () => {
      console.log('Video play event triggered');
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      if (videoWidth && videoHeight) {
        const videoAspectRatio = videoWidth / videoHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        if (videoAspectRatio > screenAspectRatio) {
          video.setDisplaySize(screenWidth, screenWidth / videoAspectRatio);
        } else {
          video.setDisplaySize(screenHeight * videoAspectRatio, screenHeight);
        }
      }
    });

    // Try to play the video with proper error handling
    try {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(error => {
          console.error('Video play failed:', error);
          // Try to play again after a short delay
          setTimeout(() => {
            console.log('Retrying video play...');
            try {
              const retryPromise = video.play();
              if (retryPromise && typeof retryPromise.catch === 'function') {
                retryPromise.catch(retryError => {
                  console.error('Video retry failed:', retryError);
                });
              }
            } catch (retryError) {
              console.error('Video retry exception:', retryError);
            }
          }, 1000);
        });
      }
    } catch (error) {
      console.error('Video play exception:', error);
    }

    // --- Barra de volumen interactiva ---
    const sliderContainer = document.createElement('div');
    sliderContainer.style.position = 'absolute';
    sliderContainer.style.right = '20px';
    sliderContainer.style.top = '50%';
    sliderContainer.style.transform = 'translateY(-50%)';
    sliderContainer.style.zIndex = 1000;
    sliderContainer.style.background = 'rgba(30,30,30,0.85)';
    sliderContainer.style.borderRadius = '16px';
    sliderContainer.style.padding = '20px 15px';
    sliderContainer.style.display = 'flex';
    sliderContainer.style.flexDirection = 'column';
    sliderContainer.style.alignItems = 'center';
    sliderContainer.style.justifyContent = 'space-between'; // Pushes label to bottom
    sliderContainer.style.width = '50px';
    sliderContainer.style.height = '220px'; // Altura ajustada
    sliderContainer.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 100; // Start at max volume (top)
    slider.style.writingMode = 'vertical-lr'; // Standard property for vertical elements
    slider.style.direction = 'rtl'; // Modern approach for vertical sliders
    slider.style.width = '8px'; // This is the thickness
    slider.style.height = '150px'; // This is the length
    slider.style.accentColor = '#1abc9c';
    slider.title = 'Volumen general';
    sliderContainer.appendChild(slider);

    const valueLabel = document.createElement('span');
    valueLabel.innerText = '100';
    valueLabel.style.fontSize = '1.2em';
    valueLabel.style.color = '#1abc9c';
    valueLabel.style.fontWeight = 'bold';
    sliderContainer.appendChild(valueLabel);

    document.body.appendChild(sliderContainer);

    // Acceso al MusicManager
    let musicManager = null;
    if (window.MusicManager && typeof window.MusicManager.getInstance === 'function') {
      musicManager = window.MusicManager.getInstance();
    } else if (typeof MusicManager !== 'undefined' && typeof MusicManager.getInstance === 'function') {
      musicManager = MusicManager.getInstance();
    }

    // Inicializar volumen
    videoElement.volume = 1;
    if (musicManager && musicManager.music) {
      musicManager.music.setVolume(0.15); // Ambiente bajo desde el inicio
    }

    slider.addEventListener('input', function() {
      const vol = slider.value / 100;
      videoElement.volume = vol;
      videoElement.muted = vol === 0;
      valueLabel.innerText = slider.value;
      if (musicManager && musicManager.music) {
        musicManager.music.setVolume(vol * 0.15);
      }
    });

    video.on("complete", () => {
      console.log('🎬 Phaser Video: complete event triggered - transitioning to next scene');
      // Reanudar la música antes de cambiar de escena
      if (audioManager) {
        audioManager.resumeMusic();
      }
      if (sliderContainer && sliderContainer.parentNode) {
        sliderContainer.parentNode.removeChild(sliderContainer);
      }
      this.scene.start("Rompecabezas"); // Changed from PuzzleElectronico to Rompecabezas
    });

    // Add additional event listeners to catch video end
    videoElement.addEventListener('ended', () => {
      console.log('🎬 Video: ENDED event fired - transitioning to next scene');
      // Reanudar la música antes de cambiar de escena
      if (audioManager) {
        audioManager.resumeMusic();
      }
      if (sliderContainer && sliderContainer.parentNode) {
        sliderContainer.parentNode.removeChild(sliderContainer);
      }
      this.scene.start("Rompecabezas"); // Changed from PuzzleElectronico to Rompecabezas
    });

    // Add timeout as fallback in case video events don't fire
    videoElement.addEventListener('loadedmetadata', () => {
      const videoDuration = videoElement.duration;
      if (videoDuration && !isNaN(videoDuration)) {
        console.log(`🎬 Video: Setting fallback timeout for ${(videoDuration + 2)} seconds`);
        // Set a timeout slightly longer than video duration as fallback
        setTimeout(() => {
          if (this.scene.isActive('TransicionNivel9')) {
            console.log('⏰ Fallback timeout triggered - transitioning to next scene');
            if (audioManager) {
              audioManager.resumeMusic();
            }
            if (sliderContainer && sliderContainer.parentNode) {
              sliderContainer.parentNode.removeChild(sliderContainer);
            }
            this.scene.start("Rompecabezas"); // Changed from PuzzleElectronico to Rompecabezas
          }
        }, (videoDuration + 2) * 1000); // Add 2 seconds buffer
      }
    });
  }
}

window.TransicionNivel9 = TransicionNivel9;
