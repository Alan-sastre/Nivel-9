class scenaVideo3 extends Phaser.Scene {
  constructor() {
    super({ key: "scenaVideo3" });
  }

  preload() {
    // Cargar video con configuración para evitar errores de rango
    this.load.video("video3", "assets/video3/3.mp4", "canplay");
    
    // Configurar el loader para manejar mejor los videos
    this.load.crossOrigin = 'anonymous';

    // Agregar manejo de errores para la carga del video
    this.load.on("loaderror", (file) => {
      if (file.key === "video3") {
        console.error("Error al cargar el video:", file.url);
        // Cambiar a la siguiente escena si el video no se puede cargar
        this.scene.start("ConclusionNivel9");
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
      "video3"
    );

    // Verificar que el video se haya cargado correctamente
    if (!video) {
      console.error("Error: Video no se pudo cargar correctamente");
      // Cambiar a la siguiente escena si el video no se puede cargar
      this.scene.start("ConclusionNivel9");
      return;
    }

    // Configurar el video para que se ajuste a la pantalla
    const scaleX = screenWidth / video.width;
    const scaleY = screenHeight / video.height;
    const scale = Math.max(scaleX, scaleY);
    
    video.setScale(scale);

    // Configurar eventos del video
    video.on("complete", () => {
      console.log("Video completado");
      // Reanudar la música
      if (audioManager) {
        audioManager.resumeMusic();
      }
      // Cambiar a la siguiente escena
      this.scene.start("ConclusionNivel9");
    });

    video.on("error", (event) => {
      console.error("Error en la reproducción del video:", event);
      // Reanudar la música
      if (audioManager) {
        audioManager.resumeMusic();
      }
      // Cambiar a la siguiente escena
      this.scene.start("ConclusionNivel9");
    });

    // Reproducir el video
    try {
      video.play();
    } catch (error) {
      console.error("Error al reproducir el video:", error);
      // Reanudar la música
      if (audioManager) {
        audioManager.resumeMusic();
      }
      // Cambiar a la siguiente escena
      this.scene.start("ConclusionNivel9");
    }

    // Permitir saltar el video con clic o toque
    this.input.on("pointerdown", () => {
      video.stop();
      // Reanudar la música
      if (audioManager) {
        audioManager.resumeMusic();
      }
      // Cambiar a la siguiente escena
      this.scene.start("ConclusionNivel9");
    });

    // Permitir saltar el video con tecla ESC o SPACE
    this.input.keyboard.on("keydown-ESC", () => {
      video.stop();
      // Reanudar la música
      if (audioManager) {
        audioManager.resumeMusic();
      }
      // Cambiar a la siguiente escena
      this.scene.start("ConclusionNivel9");
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      video.stop();
      // Reanudar la música
      if (audioManager) {
        audioManager.resumeMusic();
      }
      // Cambiar a la siguiente escena
      this.scene.start("ConclusionNivel9");
    });
  }
}

window.scenaVideo3 = scenaVideo3;