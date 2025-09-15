class IntroduccionNivel9 extends Phaser.Scene {
  constructor() {
    super({ key: "IntroduccionNivel9" });
  }

  preload() {
    // Cargar video con configuración para evitar errores de rango
    this.load.video("introVideo", "assets/video1/video.mp4", "canplay");
    
    // Configurar el loader para manejar mejor los videos
    this.load.crossOrigin = 'anonymous';

    // Agregar manejo de errores para la carga del video
    this.load.on("loaderror", (file) => {
      if (file.key === "introVideo") {
        console.error("Error al cargar el video:", file.url);
        // Cambiar a la siguiente escena si el video no se puede cargar
        this.scene.start("DiagnosticoSistemas");
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

    const video = this.add.video(
      screenWidth / 2,
      screenHeight / 2,
      "introVideo"
    );

    // Verificar que el video se haya cargado correctamente
    if (!video) {
      console.error("Error: Video no se pudo cargar correctamente");
      // Cambiar a la siguiente escena si el video no se puede cargar
      this.scene.start("DiagnosticoSistemas");
      return;
    }

    // Esperar a que el video esté listo antes de acceder a sus propiedades
    let retryCount = 0;
    const maxRetries = 50; // Máximo 5 segundos de intentos

    const checkVideoReady = () => {
      if (video.video) {
        const videoElement = video.video;
        videoElement.muted = false;
        videoElement.volume = 1;

        // Continuar con el resto de la configuración
        setupVideoControls();
      } else {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error(
            "Error: Video no se pudo cargar después de múltiples intentos"
          );
          // Cambiar a la siguiente escena si el video no se puede cargar
          this.scene.start("DiagnosticoSistemas");
          return;
        }
        // Reintentar después de un breve delay
        setTimeout(checkVideoReady, 100);
      }
    };

    const setupVideoControls = () => {
      const videoElement = video.video;
      
      // Configurar el elemento de video para evitar errores de rango
      if (videoElement) {
        videoElement.preload = 'metadata';
        videoElement.crossOrigin = 'anonymous';
      }

      video.on("play", () => {
        if (videoElement) {
          // Configurar el video para que ocupe toda la pantalla completa
          video.setDisplaySize(screenWidth, screenHeight);
        }
      });

      video.play();

      // --- Barra de volumen interactiva ---
      const sliderContainer = document.createElement("div");
      sliderContainer.style.position = "absolute";
      sliderContainer.style.right = "20px";
      sliderContainer.style.top = "50%";
      sliderContainer.style.transform = "translateY(-50%)";
      sliderContainer.style.zIndex = 1000;
      sliderContainer.style.background = "rgba(30,30,30,0.85)";
      sliderContainer.style.borderRadius = "16px";
      sliderContainer.style.padding = "20px 15px";
      sliderContainer.style.display = "flex";
      sliderContainer.style.flexDirection = "column";
      sliderContainer.style.alignItems = "center";
      sliderContainer.style.justifyContent = "space-between"; // Pushes label to bottom
      sliderContainer.style.width = "50px";
      sliderContainer.style.height = "220px"; // Altura ajustada
      sliderContainer.style.boxShadow = "0 4px 16px rgba(0,0,0,0.35)";

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = 0;
      slider.max = 100;
      slider.value = 100; // Start at max volume (top)
      slider.style.writingMode = "vertical-lr"; // Standard property for vertical elements
      slider.style.direction = "rtl"; // Right-to-left direction for proper orientation
      slider.style.transform = "rotate(180deg)"; // Invert the visual direction
      slider.style.width = "8px"; // This is the thickness
      slider.style.height = "150px"; // This is the length
      slider.style.accentColor = "#1abc9c";
      slider.title = "Volumen general";
      sliderContainer.appendChild(slider);

      const valueLabel = document.createElement("span");
      valueLabel.innerText = "100";
      valueLabel.style.fontSize = "1.2em";
      valueLabel.style.color = "#1abc9c";
      valueLabel.style.fontWeight = "bold";
      sliderContainer.appendChild(valueLabel);

      document.body.appendChild(sliderContainer);

      // Acceso al MusicManager
      let musicManager = null;
      if (
        window.MusicManager &&
        typeof window.MusicManager.getInstance === "function"
      ) {
        musicManager = window.MusicManager.getInstance();
      } else if (
        typeof MusicManager !== "undefined" &&
        typeof MusicManager.getInstance === "function"
      ) {
        musicManager = MusicManager.getInstance();
      }

      // Inicializar volumen
      if (videoElement) {
        videoElement.volume = 1;
      }
      if (musicManager && musicManager.music) {
        musicManager.music.setVolume(0.15); // Ambiente bajo desde el inicio
      }

      slider.addEventListener("input", function () {
        const vol = slider.value / 100;
        if (videoElement) {
          videoElement.volume = vol;
          videoElement.muted = vol === 0;
        }
        valueLabel.innerText = slider.value;
        if (musicManager && musicManager.music) {
          musicManager.music.setVolume(vol * 0.15);
        }
      });

      video.on("complete", () => {
        // Reanudar la música antes de cambiar de escena
        if (audioManager) {
          audioManager.resumeMusic();
        }
        if (sliderContainer && sliderContainer.parentNode) {
          sliderContainer.parentNode.removeChild(sliderContainer);
        }
        this.scene.start("DiagnosticoSistemas");
      });
    };

    // Iniciar la verificación del video
    checkVideoReady();
  }
}

window.IntroduccionNivel9 = IntroduccionNivel9;
