class Rompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "Rompecabezas" });
    this.fuerza = 50;
    this.velocidad = 50;
    this.sensibilidad = 50;
    this.gameCompleted = false;
    this.questionAnswered = false;
  }

  preload() {
    // No necesitamos precargar nada, usaremos gráficos dinámicos
  }

  create() {
    // Crear fondo con gradiente usando gráficos
    this.createBackground();

    // Título
    this.add
      .text(500, 25, "Optimización del Exoesqueleto Cibernético", {
        fontSize: "28px",
        fill: "#00ff88",
        fontFamily: "Arial",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Descripción
    this.add
      .text(500, 50, "", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Panel de código Arduino (ahora a la izquierda)
    this.createCodePanel();

    // Visualización del exoesqueleto (centro)
    this.createExoskeletonDisplay();

    // Panel de controles (ahora a la derecha)
    this.createControlPanel();

    // Botón de continuar (inicialmente oculto)
    this.continueButton = this.add
      .text(400, 500, "CONTINUAR", {
        fontSize: "20px",
        fill: "#ffffff",
        backgroundColor: "#00aa44",
        padding: { x: 20, y: 10 },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.continueButton.on("pointerdown", () => {
      this.scene.start("scenaPrincipal");
    });

    // Fondo para mensaje de felicitaciones - centrado para 1000x500
    this.congratulationsBackground = this.add.graphics();
    this.congratulationsBackground.fillStyle(0x000000, 0.85);
    this.congratulationsBackground.fillRoundedRect(200, 170, 600, 160, 15);
    this.congratulationsBackground.lineStyle(4, 0x00ff88, 1);
    this.congratulationsBackground.strokeRoundedRect(200, 170, 600, 160, 15);
    this.congratulationsBackground.setVisible(false);

    // Mensaje de felicitaciones (inicialmente oculto)
    this.congratulationsMessage = this.add
      .text(500, 250, "", {
        fontSize: "28px",
        fill: "#00ff88",
        fontFamily: "Arial Black",
        fontStyle: "bold",
        align: "center",
        wordWrap: { width: 600 },
        stroke: "#000000",
        strokeThickness: 3,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 4,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Botón de pista
    this.hintButton = this.add
      .text(900, 25, "💡 PISTA", {
        fontSize: "18px",
        fill: "#ffffff",
        backgroundColor: "#ff6600",
        padding: { x: 15, y: 8 },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.hintButton.on("pointerdown", () => {
      this.showHintMessage();
    });

    // Mensaje de pista (inicialmente oculto)
    this.hintMessage = null;
    this.hintBackground = null;

    // Crear panel de pregunta
    this.createQuestionPanel();
  }

  createBackground() {
    // Crear fondo oscuro con gradiente dinámico y animaciones
    this.backgroundGraphics = this.add.graphics();

    // Gradiente base más oscuro
    for (let i = 0; i < 500; i += 8) {
      const ratio = i / 500;
      const color1 = { r: 8, g: 15, b: 20 }; // Negro azulado muy oscuro
      const color2 = { r: 18, g: 25, b: 35 }; // Azul muy oscuro
      const color3 = { r: 25, g: 20, b: 45 }; // Púrpura muy oscuro

      let r, g, b;
      if (ratio < 0.5) {
        const localRatio = ratio * 2;
        r = Math.round(color1.r + (color2.r - color1.r) * localRatio);
        g = Math.round(color1.g + (color2.g - color1.g) * localRatio);
        b = Math.round(color1.b + (color2.b - color1.b) * localRatio);
      } else {
        const localRatio = (ratio - 0.5) * 2;
        r = Math.round(color2.r + (color3.r - color2.r) * localRatio);
        g = Math.round(color2.g + (color3.g - color2.g) * localRatio);
        b = Math.round(color2.b + (color3.b - color2.b) * localRatio);
      }

      const color = (r << 16) | (g << 8) | b;
      this.backgroundGraphics.fillStyle(color);
      this.backgroundGraphics.fillRect(0, i, 1000, 8);
    }

    // Crear puntos animados
    this.animatedDots = [];
    for (let i = 0; i < 40; i++) {
      const dot = {
        x: Math.random() * 1000,
        y: Math.random() * 500,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      };
      this.animatedDots.push(dot);
    }

    // Crear líneas animadas
    this.animatedLines = [];
    for (let i = 0; i < 6; i++) {
      const line = {
        startX: Math.random() * 1000,
        startY: Math.random() * 500,
        endX: Math.random() * 1000,
        endY: Math.random() * 500,
        alpha: Math.random() * 0.2 + 0.05,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        fadeDirection: Math.random() > 0.5 ? 1 : -1,
      };
      this.animatedLines.push(line);
    }
  }

  createControlPanel() {
    // Panel de controles (derecha, pantalla completa 1000x500)
    const controlPanel = this.add.graphics();
    controlPanel.fillStyle(0x2a2a4a, 0.9);
    controlPanel.fillRoundedRect(610, 75, 380, 320, 15);
    controlPanel.lineStyle(3, 0x00ff88);
    controlPanel.strokeRoundedRect(610, 75, 380, 320, 15);

    // Título del panel
    this.add
      .text(800, 95, "Parámetros del Exoesqueleto", {
        fontSize: "20px",
        fill: "#00ff88",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Control de Fuerza
    this.add.text(630, 130, "Fuerza:", {
      fontSize: "16px",
      fill: "#ffffff",
      fontStyle: "bold",
    });
    this.fuerzaText = this.add
      .text(970, 130, this.fuerza + "%", {
        fontSize: "16px",
        fill: "#00ff88",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.createSlider(630, 150, 320, (value) => {
      this.fuerza = value;
      this.fuerzaText.setText(value + "%");
      this.updateExoskeleton();
      this.updateCode();
    });

    // Control de Velocidad
    this.add.text(630, 190, "Velocidad:", {
      fontSize: "16px",
      fill: "#ffffff",
      fontStyle: "bold",
    });
    this.velocidadText = this.add
      .text(970, 190, this.velocidad + "%", {
        fontSize: "16px",
        fill: "#00ff88",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.createSlider(630, 210, 320, (value) => {
      this.velocidad = value;
      this.velocidadText.setText(value + "%");
      this.updateExoskeleton();
      this.updateCode();
    });

    // Control de Sensibilidad
    this.add.text(630, 250, "Sensibilidad:", {
      fontSize: "16px",
      fill: "#ffffff",
      fontStyle: "bold",
    });
    this.sensibilidadText = this.add
      .text(970, 250, this.sensibilidad + "%", {
        fontSize: "16px",
        fill: "#00ff88",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.createSlider(630, 270, 320, (value) => {
      this.sensibilidad = value;
      this.sensibilidadText.setText(value + "%");
      this.updateExoskeleton();
      this.updateCode();
    });

    // Indicador de estado
    this.statusText = this.add
      .text(800, 320, "Estado: Configurando...", {
        fontSize: "16px",
        fill: "#ffaa00",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Información adicional
    this.add
      .text(800, 350, "Valores Óptimos:", {
        fontSize: "14px",
        fill: "#888888",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
    this.add
      .text(800, 365, "Fuerza: ≥75% | Velocidad: ≥70% | Sensibilidad: 55-65%", {
        fontSize: "11px",
        fill: "#666666",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 350 },
      })
      .setOrigin(0.5);
  }

  createSlider(x, y, width, callback) {
    // Barra del slider
    const sliderBg = this.add.graphics();
    sliderBg.fillStyle(0x444444);
    sliderBg.fillRect(x, y, width, 8);

    // Handle del slider
    const handle = this.add.graphics();
    handle.fillStyle(0x00ff88);
    handle.fillCircle(0, 0, 8);
    handle.x = x + width * 0.5; // Posición inicial al 50%
    handle.y = y + 4;
    handle.setInteractive(
      new Phaser.Geom.Circle(0, 0, 8),
      Phaser.Geom.Circle.Contains
    );

    this.input.setDraggable(handle);

    handle.on("drag", (pointer, dragX) => {
      const clampedX = Phaser.Math.Clamp(dragX, x, x + width);
      handle.x = clampedX;
      const value = Math.round(((clampedX - x) / width) * 100);
      callback(value);
    });
  }

  createExoskeletonDisplay() {
    // Panel para visualización del exoesqueleto (centro, pantalla 1000x500)
    const displayPanel = this.add.graphics();
    displayPanel.fillStyle(0x1a1a2e, 0.9);
    displayPanel.fillRoundedRect(320, 75, 280, 320, 15);
    displayPanel.lineStyle(3, 0x00ff88);
    displayPanel.strokeRoundedRect(320, 75, 280, 320, 15);

    this.add
      .text(460, 95, "Exoesqueleto Cibernético", {
        fontSize: "18px",
        fill: "#00ff88",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Texto de estado del exoesqueleto
    this.statusText = this.add
      .text(460, 370, "Estado: Configurando...", {
        fontSize: "12px",
        fill: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Representación visual realista del exoesqueleto
    this.exoskeletonGraphics = this.add.graphics();
    this.updateExoskeleton();
  }

  updateExoskeleton() {
    this.exoskeletonGraphics.clear();

    // Coordenadas base del exoesqueleto (centrado en el panel de 1000x500)
    const centerX = 460;
    const centerY = 200; // Subido para mejor visibilidad

    // Calcular intensidad y colores basados en parámetros
    const intensity = (this.fuerza + this.velocidad + this.sensibilidad) / 300;
    const baseColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      { r: 60, g: 70, b: 90 },
      { r: 0, g: 200, b: 255 },
      100,
      intensity * 100
    );
    const mainColor = Phaser.Display.Color.GetColor(
      baseColor.r,
      baseColor.g,
      baseColor.b
    );
    const jointColor = 0xff4400;
    const wireColor = 0x00ccff;
    const ledColor = intensity > 0.5 ? 0x00ff00 : 0xff0000;
    const metalColor = 0x888899;

    // === CABEZA Y CASCO CON EFECTOS DE ILUMINACIÓN ===
    // Sombra del casco (efecto de profundidad)
    this.exoskeletonGraphics.fillStyle(0x1a1a2e, 0.6);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 20,
      centerY - 93,
      44,
      35,
      8
    );

    // Casco principal con gradiente metálico
    this.exoskeletonGraphics.fillStyle(mainColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 22,
      centerY - 95,
      44,
      35,
      8
    );

    // Highlight superior del casco (simulando luz)
    this.exoskeletonGraphics.fillStyle(
      Phaser.Display.Color.GetColor(
        baseColor.r + 40,
        baseColor.g + 40,
        baseColor.b + 40
      ),
      0.7
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 20,
      centerY - 93,
      40,
      8,
      4
    );

    // Contorno metálico con bisel
    this.exoskeletonGraphics.lineStyle(3, metalColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 22,
      centerY - 95,
      44,
      35,
      8
    );
    this.exoskeletonGraphics.lineStyle(1, 0xaaaacc, 0.8);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 21,
      centerY - 94,
      42,
      33,
      7
    );

    // Visor frontal con reflexiones
    this.exoskeletonGraphics.fillStyle(0x001133, 0.9);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 18,
      centerY - 85,
      36,
      15,
      3
    );

    // Reflexión en el visor
    this.exoskeletonGraphics.fillStyle(0x0088ff, 0.3);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 16,
      centerY - 83,
      15,
      6,
      2
    );

    // Contorno del visor con efecto holográfico
    this.exoskeletonGraphics.lineStyle(2, 0x00aaff, 0.8);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 18,
      centerY - 85,
      36,
      15,
      3
    );

    // LEDs del casco con halo de luz
    this.exoskeletonGraphics.fillStyle(ledColor, 0.3);
    this.exoskeletonGraphics.fillCircle(centerX - 15, centerY - 90, 5); // Halo
    this.exoskeletonGraphics.fillCircle(centerX + 15, centerY - 90, 5); // Halo
    this.exoskeletonGraphics.fillStyle(ledColor, 1.0);
    this.exoskeletonGraphics.fillCircle(centerX - 15, centerY - 90, 2); // LED central
    this.exoskeletonGraphics.fillCircle(centerX + 15, centerY - 90, 2); // LED central

    // Antenas/sensores con detalles mecánicos
    this.exoskeletonGraphics.fillStyle(metalColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 25,
      centerY - 89,
      8,
      4,
      1
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 17,
      centerY - 89,
      8,
      4,
      1
    );

    // Detalles de las antenas
    this.exoskeletonGraphics.lineStyle(1, 0xccccdd);
    this.exoskeletonGraphics.strokeRect(centerX - 24, centerY - 88, 6, 1);
    this.exoskeletonGraphics.strokeRect(centerX + 18, centerY - 88, 6, 1);

    // === TORSO PRINCIPAL CON EFECTOS AVANZADOS ===
    // Sombra del torso
    this.exoskeletonGraphics.fillStyle(0x1a1a2e, 0.5);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 28,
      centerY - 48,
      60,
      90,
      10
    );

    // Estructura principal del torso con gradiente
    this.exoskeletonGraphics.fillStyle(mainColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 30,
      centerY - 50,
      60,
      90,
      10
    );

    // Highlight superior del torso
    this.exoskeletonGraphics.fillStyle(
      Phaser.Display.Color.GetColor(
        baseColor.r + 30,
        baseColor.g + 30,
        baseColor.b + 30
      ),
      0.6
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 28,
      centerY - 48,
      56,
      15,
      8
    );

    // Contorno principal con bisel
    this.exoskeletonGraphics.lineStyle(4, metalColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 30,
      centerY - 50,
      60,
      90,
      10
    );
    this.exoskeletonGraphics.lineStyle(2, 0xaaaacc, 0.7);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 29,
      centerY - 49,
      58,
      88,
      9
    );

    // Placa pectoral central con textura metálica
    this.exoskeletonGraphics.fillStyle(0x2a2a3a);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 25,
      centerY - 45,
      50,
      30,
      6
    );

    // Textura de la placa pectoral
    this.exoskeletonGraphics.fillStyle(0x3a3a4a, 0.8);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 23,
      centerY - 43,
      46,
      5,
      2
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 23,
      centerY - 35,
      46,
      5,
      2
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 23,
      centerY - 27,
      46,
      5,
      2
    );

    // Contorno de la placa con efecto de profundidad
    this.exoskeletonGraphics.lineStyle(3, jointColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 25,
      centerY - 45,
      50,
      30,
      6
    );
    this.exoskeletonGraphics.lineStyle(1, 0xff6600, 0.6);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 24,
      centerY - 44,
      48,
      28,
      5
    );

    // Reactor/núcleo de energía central mejorado
    // Anillo exterior con brillo sutil
    const pulseSize = 15 + Math.sin(Date.now() * 0.003) * 1;
    this.exoskeletonGraphics.lineStyle(2, wireColor, 0.4);
    this.exoskeletonGraphics.strokeCircle(centerX, centerY - 30, pulseSize);

    // Núcleo principal
    this.exoskeletonGraphics.fillStyle(ledColor, 0.9);
    this.exoskeletonGraphics.fillCircle(centerX, centerY - 30, 10);

    // Anillos concéntricos del reactor
    this.exoskeletonGraphics.lineStyle(2, wireColor, 0.8);
    this.exoskeletonGraphics.strokeCircle(centerX, centerY - 30, 8);
    this.exoskeletonGraphics.strokeCircle(centerX, centerY - 30, 12);

    // Detalles internos del reactor
    this.exoskeletonGraphics.fillStyle(0xffffff, 0.7);
    this.exoskeletonGraphics.fillCircle(centerX - 2, centerY - 32, 2);

    // Paneles laterales del torso con detalles mecánicos
    this.exoskeletonGraphics.fillStyle(metalColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 35,
      centerY - 20,
      8,
      40,
      3
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 27,
      centerY - 20,
      8,
      40,
      3
    );

    // Detalles de ventilación en paneles laterales
    this.exoskeletonGraphics.lineStyle(1, 0x555566);
    for (let i = 0; i < 6; i++) {
      this.exoskeletonGraphics.strokeRect(
        centerX - 34,
        centerY - 15 + i * 6,
        6,
        1
      );
      this.exoskeletonGraphics.strokeRect(
        centerX + 28,
        centerY - 15 + i * 6,
        6,
        1
      );
    }

    // Servomotores en los hombros
    this.exoskeletonGraphics.fillStyle(0x444455);
    this.exoskeletonGraphics.fillCircle(centerX - 32, centerY - 35, 6);
    this.exoskeletonGraphics.fillCircle(centerX + 32, centerY - 35, 6);
    this.exoskeletonGraphics.lineStyle(2, metalColor);
    this.exoskeletonGraphics.strokeCircle(centerX - 32, centerY - 35, 6);
    this.exoskeletonGraphics.strokeCircle(centerX + 32, centerY - 35, 6);

    // === SISTEMA DE BRAZOS CON EFECTOS AVANZADOS ===
    // Sombras de los hombros
    this.exoskeletonGraphics.fillStyle(0x1a1a2e, 0.4);
    this.exoskeletonGraphics.fillCircle(centerX - 38, centerY - 33, 12);
    this.exoskeletonGraphics.fillCircle(centerX + 42, centerY - 33, 12);

    // Hombros (articulaciones principales) con efectos metálicos
    this.exoskeletonGraphics.fillStyle(jointColor);
    this.exoskeletonGraphics.fillCircle(centerX - 40, centerY - 35, 12);
    this.exoskeletonGraphics.fillCircle(centerX + 40, centerY - 35, 12);

    // Highlights en los hombros
    this.exoskeletonGraphics.fillStyle(
      Phaser.Display.Color.GetColor(
        baseColor.r + 40,
        baseColor.g + 40,
        baseColor.b + 40
      ),
      0.7
    );
    this.exoskeletonGraphics.fillCircle(centerX - 42, centerY - 37, 4);
    this.exoskeletonGraphics.fillCircle(centerX + 38, centerY - 37, 4);

    // Contornos de hombros con bisel
    this.exoskeletonGraphics.lineStyle(3, metalColor);
    this.exoskeletonGraphics.strokeCircle(centerX - 40, centerY - 35, 12);
    this.exoskeletonGraphics.strokeCircle(centerX + 40, centerY - 35, 12);
    this.exoskeletonGraphics.lineStyle(1, 0xaaaacc, 0.8);
    this.exoskeletonGraphics.strokeCircle(centerX - 40, centerY - 35, 10);
    this.exoskeletonGraphics.strokeCircle(centerX + 40, centerY - 35, 10);

    // Actuadores de hombro
    this.exoskeletonGraphics.fillStyle(0x333344);
    this.exoskeletonGraphics.fillRect(centerX - 45, centerY - 40, 4, 10);
    this.exoskeletonGraphics.fillRect(centerX + 41, centerY - 40, 4, 10);
    this.exoskeletonGraphics.lineStyle(1, wireColor);
    this.exoskeletonGraphics.strokeRect(centerX - 45, centerY - 40, 4, 10);
    this.exoskeletonGraphics.strokeRect(centerX + 41, centerY - 40, 4, 10);

    // Sombras de brazos superiores
    this.exoskeletonGraphics.fillStyle(0x1a1a2e, 0.3);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 53,
      centerY - 23,
      22,
      40,
      8
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 35,
      centerY - 23,
      22,
      40,
      8
    );

    // Brazos superiores (más detallados) con textura
    this.exoskeletonGraphics.fillStyle(mainColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 55,
      centerY - 25,
      22,
      40,
      8
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 33,
      centerY - 25,
      22,
      40,
      8
    );

    // Texturas metálicas en brazos superiores
    this.exoskeletonGraphics.fillStyle(
      Phaser.Display.Color.GetColor(
        baseColor.r + 20,
        baseColor.g + 20,
        baseColor.b + 20
      ),
      0.6
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 54,
      centerY - 24,
      20,
      8,
      6
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 34,
      centerY - 24,
      20,
      8,
      6
    );

    // Líneas de refuerzo en brazos
    this.exoskeletonGraphics.lineStyle(1, 0x555566);
    this.exoskeletonGraphics.strokeRect(centerX - 53, centerY - 20, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX - 53, centerY - 10, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX - 53, centerY, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX + 35, centerY - 20, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX + 35, centerY - 10, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX + 35, centerY, 18, 1);

    // Contornos principales de brazos con bisel
    this.exoskeletonGraphics.lineStyle(3, metalColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 55,
      centerY - 25,
      22,
      40,
      8
    );
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX + 33,
      centerY - 25,
      22,
      40,
      8
    );
    this.exoskeletonGraphics.lineStyle(1, 0xaaaacc, 0.6);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 54,
      centerY - 24,
      20,
      38,
      7
    );
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX + 34,
      centerY - 24,
      20,
      38,
      7
    );

    // === ANTEBRAZOS Y CODOS ===
    // Articulaciones de codos (más prominentes)
    this.exoskeletonGraphics.fillStyle(jointColor);
    this.exoskeletonGraphics.fillCircle(centerX - 44, centerY + 15, 10);
    this.exoskeletonGraphics.fillCircle(centerX + 44, centerY + 15, 10);
    this.exoskeletonGraphics.lineStyle(2, metalColor);
    this.exoskeletonGraphics.strokeCircle(centerX - 44, centerY + 15, 10);
    this.exoskeletonGraphics.strokeCircle(centerX + 44, centerY + 15, 10);

    // Antebrazos con detalles tecnológicos
    this.exoskeletonGraphics.fillStyle(mainColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 55,
      centerY + 25,
      20,
      35,
      6
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 35,
      centerY + 25,
      20,
      35,
      6
    );
    this.exoskeletonGraphics.lineStyle(2, metalColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 55,
      centerY + 25,
      20,
      35,
      6
    );
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX + 35,
      centerY + 25,
      20,
      35,
      6
    );

    // Pantallas/interfaces en antebrazos
    this.exoskeletonGraphics.fillStyle(0x001122, 0.9);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 52,
      centerY + 30,
      14,
      8,
      2
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 38,
      centerY + 30,
      14,
      8,
      2
    );

    // Puños/guantes mecánicos
    this.exoskeletonGraphics.fillStyle(metalColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 52,
      centerY + 60,
      16,
      12,
      4
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX + 36,
      centerY + 60,
      16,
      12,
      4
    );

    // === SISTEMA DE PIERNAS CON EFECTOS AVANZADOS ===
    // Sombras de articulaciones de cadera
    this.exoskeletonGraphics.fillStyle(0x1a1a2e, 0.4);
    this.exoskeletonGraphics.fillCircle(centerX - 10, centerY + 47, 10);
    this.exoskeletonGraphics.fillCircle(centerX + 14, centerY + 47, 10);

    // Articulaciones de cadera con efectos metálicos (más robustas)
    this.exoskeletonGraphics.fillStyle(jointColor);
    this.exoskeletonGraphics.fillCircle(centerX - 12, centerY + 45, 10);
    this.exoskeletonGraphics.fillCircle(centerX + 12, centerY + 45, 10);

    // Highlights en articulaciones de cadera
    this.exoskeletonGraphics.fillStyle(
      Phaser.Display.Color.GetColor(
        baseColor.r + 35,
        baseColor.g + 35,
        baseColor.b + 35
      ),
      0.7
    );
    this.exoskeletonGraphics.fillCircle(centerX - 14, centerY + 43, 3);
    this.exoskeletonGraphics.fillCircle(centerX + 10, centerY + 43, 3);

    // Contornos de cadera con bisel
    this.exoskeletonGraphics.lineStyle(3, metalColor);
    this.exoskeletonGraphics.strokeCircle(centerX - 12, centerY + 45, 10);
    this.exoskeletonGraphics.strokeCircle(centerX + 12, centerY + 45, 10);
    this.exoskeletonGraphics.lineStyle(1, 0xaaaacc, 0.8);
    this.exoskeletonGraphics.strokeCircle(centerX - 12, centerY + 45, 8);
    this.exoskeletonGraphics.strokeCircle(centerX + 12, centerY + 45, 8);

    // Actuadores hidráulicos de cadera
    this.exoskeletonGraphics.fillStyle(0x333344);
    this.exoskeletonGraphics.fillRect(centerX - 8, centerY + 40, 3, 12);
    this.exoskeletonGraphics.fillRect(centerX + 5, centerY + 40, 3, 12);
    this.exoskeletonGraphics.lineStyle(1, wireColor);
    this.exoskeletonGraphics.strokeRect(centerX - 8, centerY + 40, 3, 12);
    this.exoskeletonGraphics.strokeRect(centerX + 5, centerY + 40, 3, 12);

    // Sombras de muslos
    this.exoskeletonGraphics.fillStyle(0x1a1a2e, 0.3);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 18,
      centerY + 57,
      22,
      45,
      8
    );
    this.exoskeletonGraphics.fillRoundedRect(centerX, centerY + 57, 22, 45, 8);

    // Muslos (más anchos y detallados) con textura avanzada
    this.exoskeletonGraphics.fillStyle(mainColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 20,
      centerY + 55,
      22,
      45,
      8
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 2,
      centerY + 55,
      22,
      45,
      8
    );

    // Texturas metálicas en muslos
    this.exoskeletonGraphics.fillStyle(
      Phaser.Display.Color.GetColor(
        baseColor.r + 25,
        baseColor.g + 25,
        baseColor.b + 25
      ),
      0.6
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 19,
      centerY + 56,
      20,
      8,
      6
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 1,
      centerY + 56,
      20,
      8,
      6
    );

    // Amortiguadores laterales en muslos
    this.exoskeletonGraphics.fillStyle(0x444455);
    this.exoskeletonGraphics.fillRect(centerX - 23, centerY + 65, 3, 20);
    this.exoskeletonGraphics.fillRect(centerX + 20, centerY + 65, 3, 20);
    this.exoskeletonGraphics.lineStyle(1, metalColor);
    this.exoskeletonGraphics.strokeRect(centerX - 23, centerY + 65, 3, 20);
    this.exoskeletonGraphics.strokeRect(centerX + 20, centerY + 65, 3, 20);

    // Líneas de refuerzo en muslos
    this.exoskeletonGraphics.lineStyle(1, 0x555566);
    this.exoskeletonGraphics.strokeRect(centerX - 18, centerY + 60, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX - 18, centerY + 70, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX - 18, centerY + 80, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX, centerY + 60, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX, centerY + 70, 18, 1);
    this.exoskeletonGraphics.strokeRect(centerX, centerY + 80, 18, 1);

    // Contornos principales de muslos con bisel
    this.exoskeletonGraphics.lineStyle(3, metalColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 20,
      centerY + 55,
      22,
      45,
      8
    );
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 2,
      centerY + 55,
      22,
      45,
      8
    );
    this.exoskeletonGraphics.lineStyle(1, 0xaaaacc, 0.6);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 19,
      centerY + 56,
      20,
      43,
      7
    );
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 1,
      centerY + 56,
      20,
      43,
      7
    );

    // Articulaciones de rodillas (más complejas)
    this.exoskeletonGraphics.fillStyle(jointColor);
    this.exoskeletonGraphics.fillCircle(centerX - 9, centerY + 100, 8);
    this.exoskeletonGraphics.fillCircle(centerX + 9, centerY + 100, 8);
    this.exoskeletonGraphics.lineStyle(2, metalColor);
    this.exoskeletonGraphics.strokeCircle(centerX - 9, centerY + 100, 8);
    this.exoskeletonGraphics.strokeCircle(centerX + 9, centerY + 100, 8);

    // Pantorrillas con amortiguadores
    this.exoskeletonGraphics.fillStyle(mainColor);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 18,
      centerY + 108,
      20,
      40,
      6
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 2,
      centerY + 108,
      20,
      40,
      6
    );
    this.exoskeletonGraphics.lineStyle(2, metalColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 18,
      centerY + 108,
      20,
      40,
      6
    );
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 2,
      centerY + 108,
      20,
      40,
      6
    );

    // Amortiguadores hidráulicos
    this.exoskeletonGraphics.lineStyle(3, 0x666677);
    this.exoskeletonGraphics.strokeRect(centerX - 15, centerY + 115, 3, 20);
    this.exoskeletonGraphics.strokeRect(centerX + 12, centerY + 115, 3, 20);

    // Botas/pies mecánicos (más grandes y detalladas)
    this.exoskeletonGraphics.fillStyle(0x333344);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 22,
      centerY + 148,
      28,
      15,
      5
    );
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 6,
      centerY + 148,
      28,
      15,
      5
    );
    this.exoskeletonGraphics.lineStyle(2, metalColor);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 22,
      centerY + 148,
      28,
      15,
      5
    );
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 6,
      centerY + 148,
      28,
      15,
      5
    );

    // === SISTEMA DE CABLES Y CONEXIONES ===
    this.exoskeletonGraphics.lineStyle(3, wireColor, 0.8);
    // Red de cables principales del torso
    this.exoskeletonGraphics.strokeRect(centerX - 20, centerY - 35, 40, 2);
    this.exoskeletonGraphics.strokeRect(centerX - 20, centerY - 25, 40, 2);
    this.exoskeletonGraphics.strokeRect(centerX - 20, centerY - 15, 40, 2);

    // Cables de alimentación a brazos
    this.exoskeletonGraphics.lineStyle(2, wireColor);
    this.exoskeletonGraphics.strokeRect(centerX - 45, centerY - 30, 20, 2);
    this.exoskeletonGraphics.strokeRect(centerX + 25, centerY - 30, 20, 2);

    // Cables a las piernas
    this.exoskeletonGraphics.strokeRect(centerX - 15, centerY + 40, 2, 25);
    this.exoskeletonGraphics.strokeRect(centerX + 13, centerY + 40, 2, 25);

    // === INDICADORES DE ESTADO AVANZADOS ===
    // Barras de energía en el pecho (basadas en fuerza)
    if (this.fuerza > 30) {
      const powerBars = Math.floor(this.fuerza / 15);
      for (let i = 0; i < Math.min(powerBars, 6); i++) {
        const barColor = i < 2 ? 0xff0000 : i < 4 ? 0xffaa00 : 0x00ff00;
        this.exoskeletonGraphics.fillStyle(barColor, 0.9);
        this.exoskeletonGraphics.fillRect(
          centerX - 20 + i * 7,
          centerY - 40,
          5,
          12
        );
      }
    }

    // Efectos de velocidad mejorados (estelas de movimiento) con animaciones fluidas
    if (this.velocidad > 50) {
      const speedTime = Date.now() * 0.008;
      const speedIntensity = (this.velocidad - 50) / 50; // Normalizar intensidad

      // Estelas principales con transición suave
      for (let i = 0; i < 12; i++) {
        const offset = Math.sin(speedTime + i * 0.3) * (6 * speedIntensity);
        const alpha = Math.max(0, 0.9 - i * 0.08) * speedIntensity;
        const trailColor = Phaser.Display.Color.GetColor(
          Math.floor(0 + i * 10),
          Math.floor(255 - i * 15),
          Math.floor(204 + i * 5)
        );

        this.exoskeletonGraphics.lineStyle(3 - i * 0.2, trailColor, alpha);
        this.exoskeletonGraphics.strokeRect(
          centerX - 90 + offset,
          centerY - 100 + i * 25,
          180 - Math.abs(offset) * 1.5,
          2
        );
      }

      // Partículas de velocidad en las extremidades
      for (let i = 0; i < 6; i++) {
        const particleAlpha = Math.sin(speedTime * 2 + i) * 0.3 + 0.4;
        this.exoskeletonGraphics.fillStyle(
          0x00ffcc,
          particleAlpha * speedIntensity
        );

        // Partículas en brazos
        this.exoskeletonGraphics.fillCircle(
          centerX - 60 + Math.sin(speedTime + i) * 8,
          centerY - 20 + i * 8,
          2 + Math.sin(speedTime * 3 + i) * 1
        );
        this.exoskeletonGraphics.fillCircle(
          centerX + 60 + Math.sin(speedTime + i + 1) * 8,
          centerY - 20 + i * 8,
          2 + Math.sin(speedTime * 3 + i + 1) * 1
        );

        // Partículas en piernas
        this.exoskeletonGraphics.fillCircle(
          centerX - 25 + Math.sin(speedTime * 1.5 + i) * 5,
          centerY + 80 + i * 10,
          1.5 + Math.sin(speedTime * 4 + i) * 0.5
        );
        this.exoskeletonGraphics.fillCircle(
          centerX + 25 + Math.sin(speedTime * 1.5 + i + 2) * 5,
          centerY + 80 + i * 10,
          1.5 + Math.sin(speedTime * 4 + i + 2) * 0.5
        );
      }
    }

    // Sistema de sensores avanzado
    if (this.sensibilidad > 20) {
      const sensorIntensity = this.sensibilidad / 100;
      const sensorColor =
        sensorIntensity > 0.7
          ? 0x00ff00
          : sensorIntensity > 0.4
          ? 0xffaa00
          : 0xff0000;

      // Sensores principales
      this.exoskeletonGraphics.fillStyle(sensorColor, 0.9);
      this.exoskeletonGraphics.fillCircle(centerX - 25, centerY - 40, 4); // Hombro izq
      this.exoskeletonGraphics.fillCircle(centerX + 25, centerY - 40, 4); // Hombro der
      this.exoskeletonGraphics.fillCircle(centerX - 15, centerY + 50, 4); // Cadera izq
      this.exoskeletonGraphics.fillCircle(centerX + 15, centerY + 50, 4); // Cadera der
      this.exoskeletonGraphics.fillCircle(centerX - 12, centerY + 105, 3); // Rodilla izq
      this.exoskeletonGraphics.fillCircle(centerX + 12, centerY + 105, 3); // Rodilla der

      // Anillos de brillo suave alrededor de sensores
      this.exoskeletonGraphics.lineStyle(1, sensorColor, 0.6);
      const pulseRadius = 6 + Math.sin(Date.now() * 0.004) * 0.5;
      this.exoskeletonGraphics.strokeCircle(
        centerX - 25,
        centerY - 40,
        pulseRadius
      );
      this.exoskeletonGraphics.strokeCircle(
        centerX + 25,
        centerY - 40,
        pulseRadius
      );
    }

    // === EFECTOS DE PARTÍCULAS Y EMISIONES DE ENERGÍA ===
    // Partículas de energía del reactor central
    const time = Date.now() * 0.01;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 0.5;
      const radius = 18 + Math.sin(time + i) * 3;
      const particleX = centerX + Math.cos(angle) * radius;
      const particleY = centerY - 30 + Math.sin(angle) * radius * 0.3;
      const alpha = 0.3 + Math.sin(time * 2 + i) * 0.2;

      this.exoskeletonGraphics.fillStyle(ledColor, alpha);
      this.exoskeletonGraphics.fillCircle(particleX, particleY, 1.5);
    }

    // Emisiones de vapor de los amortiguadores
    for (let i = 0; i < 3; i++) {
      const steamAlpha = 0.1 + Math.sin(time * 0.8 + i) * 0.05;
      this.exoskeletonGraphics.fillStyle(0xaaaaff, steamAlpha);
      this.exoskeletonGraphics.fillCircle(
        centerX - 22 + Math.sin(time + i) * 2,
        centerY + 75 - i * 3,
        2 + i
      );
      this.exoskeletonGraphics.fillCircle(
        centerX + 21 + Math.sin(time + i + 1) * 2,
        centerY + 75 - i * 3,
        2 + i
      );
    }

    // Efectos de energía suaves en articulaciones principales
    if (this.fuerza > 40) {
      const electricPulse = Math.sin(time * 1.5) * 0.2 + 0.8;
      this.exoskeletonGraphics.lineStyle(1, 0x66ffff, electricPulse * 0.2);

      // Brillo suave en hombros
      this.exoskeletonGraphics.strokeCircle(
        centerX - 40,
        centerY - 35,
        14 + electricPulse * 0.5
      );
      this.exoskeletonGraphics.strokeCircle(
        centerX + 40,
        centerY - 35,
        14 + electricPulse * 0.5
      );

      // Brillo suave en caderas
      this.exoskeletonGraphics.strokeCircle(
        centerX - 12,
        centerY + 45,
        12 + electricPulse * 0.3
      );
      this.exoskeletonGraphics.strokeCircle(
        centerX + 12,
        centerY + 45,
        12 + electricPulse * 0.3
      );
    }

    // Efectos de energía en el núcleo del reactor
    const coreEnergy = Math.sin(time * 2) * 0.3 + 0.7;
    this.exoskeletonGraphics.fillStyle(0xffffff, coreEnergy * 0.5);
    this.exoskeletonGraphics.fillCircle(
      centerX,
      centerY - 30,
      3 + coreEnergy * 2
    );

    // Ondas de energía expandiéndose desde el reactor
    for (let i = 0; i < 3; i++) {
      const waveRadius = 20 + ((time * 30 + i * 10) % 40);
      const waveAlpha = Math.max(0, 0.3 - ((waveRadius - 20) / 40) * 0.3);
      this.exoskeletonGraphics.lineStyle(1, ledColor, waveAlpha);
      this.exoskeletonGraphics.strokeCircle(centerX, centerY - 30, waveRadius);
    }

    // === DETALLES TECNOLÓGICOS ULTRA-REALISTAS ===
    // Paneles de control en el antebrazo izquierdo
    this.exoskeletonGraphics.fillStyle(0x1a1a2e);
    this.exoskeletonGraphics.fillRoundedRect(
      centerX - 70,
      centerY + 25,
      12,
      20,
      2
    );
    this.exoskeletonGraphics.lineStyle(1, 0x4444aa);
    this.exoskeletonGraphics.strokeRoundedRect(
      centerX - 70,
      centerY + 25,
      12,
      20,
      2
    );

    // LEDs de estado en el panel de control
    const ledStates = [0x00ff00, 0x00ff00, 0xffaa00, 0xff0000];
    for (let i = 0; i < 4; i++) {
      this.exoskeletonGraphics.fillStyle(
        ledStates[i],
        0.8 + Math.sin(time * 2 + i) * 0.2
      );
      this.exoskeletonGraphics.fillCircle(
        centerX - 67,
        centerY + 28 + i * 4,
        1
      );
    }

    // Pantalla holográfica en el antebrazo
    this.exoskeletonGraphics.fillStyle(0x0066ff, 0.3);
    this.exoskeletonGraphics.fillRect(centerX - 68, centerY + 27, 8, 6);
    this.exoskeletonGraphics.lineStyle(1, 0x00aaff, 0.6);
    for (let i = 0; i < 3; i++) {
      this.exoskeletonGraphics.strokeRect(
        centerX - 67,
        centerY + 28 + i * 1.5,
        6,
        0.5
      );
    }

    // Sistemas de refrigeración avanzados
    this.exoskeletonGraphics.fillStyle(0x333344);
    // Ventiladores en la espalda
    this.exoskeletonGraphics.fillCircle(centerX - 15, centerY - 25, 6);
    this.exoskeletonGraphics.fillCircle(centerX + 15, centerY - 25, 6);
    this.exoskeletonGraphics.lineStyle(1, metalColor);
    this.exoskeletonGraphics.strokeCircle(centerX - 15, centerY - 25, 6);
    this.exoskeletonGraphics.strokeCircle(centerX + 15, centerY - 25, 6);

    // Aspas de ventilador rotatorias
    const fanRotation = time * 5;
    for (let fan = 0; fan < 2; fan++) {
      const fanX = fan === 0 ? centerX - 15 : centerX + 15;
      for (let blade = 0; blade < 4; blade++) {
        const angle = fanRotation + (blade * Math.PI) / 2;
        const x1 = fanX + Math.cos(angle) * 2;
        const y1 = centerY - 25 + Math.sin(angle) * 2;
        const x2 = fanX + Math.cos(angle) * 5;
        const y2 = centerY - 25 + Math.sin(angle) * 5;
        this.exoskeletonGraphics.lineStyle(1, 0x666677, 0.7);
        this.exoskeletonGraphics.strokeRect(x1, y1, x2 - x1, 1);
      }
    }

    // Conductos de refrigeración
    this.exoskeletonGraphics.lineStyle(2, 0x4444aa, 0.6);
    this.exoskeletonGraphics.strokeRect(centerX - 20, centerY - 15, 40, 2);
    this.exoskeletonGraphics.strokeRect(centerX - 2, centerY - 13, 4, 15);

    // Indicadores de temperatura
    const tempLevel = 0.3 + Math.sin(time * 0.5) * 0.2;
    const tempColor = tempLevel > 0.4 ? 0x00ff00 : 0xffaa00;
    this.exoskeletonGraphics.fillStyle(tempColor, 0.8);
    this.exoskeletonGraphics.fillRect(
      centerX - 40,
      centerY - 70,
      2,
      8 * tempLevel
    );
    this.exoskeletonGraphics.fillRect(
      centerX + 38,
      centerY - 70,
      2,
      8 * tempLevel
    );

    // Tornillos y remaches mejorados
    this.exoskeletonGraphics.fillStyle(0x666677);
    const screwPositions = [
      [centerX - 28, centerY - 48],
      [centerX + 28, centerY - 48], // Torso superior
      [centerX - 28, centerY + 35],
      [centerX + 28, centerY + 35], // Torso inferior
      [centerX - 50, centerY - 20],
      [centerX + 50, centerY - 20], // Brazos
      [centerX - 18, centerY + 60],
      [centerX + 18, centerY + 60], // Piernas
    ];

    screwPositions.forEach(([x, y]) => {
      // Sombra del tornillo
      this.exoskeletonGraphics.fillStyle(0x1a1a2e, 0.4);
      this.exoskeletonGraphics.fillCircle(x + 1, y + 1, 2);

      // Tornillo principal
      this.exoskeletonGraphics.fillStyle(0x666677);
      this.exoskeletonGraphics.fillCircle(x, y, 2);

      // Highlight del tornillo
      this.exoskeletonGraphics.fillStyle(0x999999, 0.8);
      this.exoskeletonGraphics.fillCircle(x - 0.5, y - 0.5, 0.8);

      // Ranura del tornillo
      this.exoskeletonGraphics.lineStyle(1, 0x333333);
      this.exoskeletonGraphics.strokeRect(x - 1, y, 2, 0.5);

      this.exoskeletonGraphics.lineStyle(1, 0x999999);
      this.exoskeletonGraphics.strokeCircle(x, y, 2);
    });

    // Cables de fibra óptica
    this.exoskeletonGraphics.lineStyle(
      1,
      0x00ffaa,
      0.6 + Math.sin(time * 3) * 0.2
    );
    this.exoskeletonGraphics.strokeRect(centerX - 25, centerY - 5, 50, 1);
    this.exoskeletonGraphics.strokeRect(centerX - 10, centerY + 15, 20, 1);

    // Conectores y puertos
    this.exoskeletonGraphics.fillStyle(0x222233);
    this.exoskeletonGraphics.fillRect(centerX + 25, centerY + 20, 4, 8);
    this.exoskeletonGraphics.fillRect(centerX - 29, centerY + 20, 4, 8);
    this.exoskeletonGraphics.lineStyle(1, 0x4444aa);
    this.exoskeletonGraphics.strokeRect(centerX + 25, centerY + 20, 4, 8);
    this.exoskeletonGraphics.strokeRect(centerX - 29, centerY + 20, 4, 8);

    // Texto de estado mejorado
    const statusText = `FUERZA: ${this.fuerza}% | VEL: ${this.velocidad}% | SENS: ${this.sensibilidad}%`;
    const systemStatus =
      intensity > 0.7 ? "ÓPTIMO" : intensity > 0.4 ? "ESTABLE" : "CRÍTICO";
    const statusColor =
      intensity > 0.7 ? "#00ff00" : intensity > 0.4 ? "#ffaa00" : "#ff0000";

    this.statusText.setText(`${statusText}\nESTADO: ${systemStatus}`);
    this.statusText.setStyle({ color: statusColor });

    // Texto instructivo eliminado por solicitud del usuario

    // Actualizar estado
    if (
      this.fuerza >= 75 &&
      this.velocidad >= 70 &&
      this.sensibilidad >= 55 &&
      this.sensibilidad <= 65
    ) {
      this.statusText.setText("Estado: ¡Óptimo!");
      this.statusText.setColor("#00ff88");
      if (!this.gameCompleted) {
        this.gameCompleted = true;
        this.showQuestion();
      }
    } else {
      this.statusText.setText("Estado: Necesita ajustes");
      this.statusText.setColor("#ffaa00");
    }
  }

  createCodePanel() {
    // Panel de código Arduino (izquierda, usando pantalla completa 1000x500)
    const codePanel = this.add.graphics();
    codePanel.fillStyle(0x0a0a0a, 0.95);
    codePanel.fillRoundedRect(10, 75, 300, 320, 15);
    codePanel.lineStyle(3, 0x00ff88);
    codePanel.strokeRoundedRect(10, 75, 300, 320, 15);

    this.add
      .text(160, 95, "Código Arduino Generado", {
        fontSize: "16px",
        fill: "#00ff88",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Barra de título del editor
    const titleBar = this.add.graphics();
    titleBar.fillStyle(0x333333);
    titleBar.fillRoundedRect(15, 115, 290, 25, 5);

    this.add
      .text(25, 127, "📄 exoskeleton.ino", {
        fontSize: "12px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);

    // Números de línea
    this.lineNumbers = this.add.text(20, 150, "", {
      fontSize: "10px",
      fill: "#666666",
      fontFamily: "Courier New",
      lineSpacing: 2,
    });

    this.codeText = this.add.text(50, 150, "", {
      fontSize: "10px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      lineSpacing: 2,
      wordWrap: { width: 250 },
    });

    this.updateCode();
  }

  updateCode() {
    const codeLines = [
      "// Configuración del Exoesqueleto",
      `int fuerza = ${this.fuerza};`,
      `int velocidad = ${this.velocidad};`,
      `int sensibilidad = ${this.sensibilidad};`,
      "",
      "void setup() {",
      "  Serial.begin(9600);",
      "  configurarMotores();",
      "  inicializarSensores();",
      "}",
      "",
      "void loop() {",
      "  leerSensores();",
      "  ajustarPotencia(fuerza);",
      "  controlarVelocidad(velocidad);",
      "  procesarEntrada(sensibilidad);",
      "  actualizarDisplay();",
      "  delay(100);",
      "}",
    ];

    // Generar números de línea
    const lineNumbers = codeLines
      .map((_, index) => (index + 1).toString().padStart(2, " "))
      .join("\n");
    this.lineNumbers.setText(lineNumbers);

    // Actualizar código con colores sintácticos básicos
    const code = codeLines.join("\n");
    this.codeText.setText(code);
  }

  createQuestionPanel() {
    // Panel de pregunta con diseño mejorado - centrado para 1000x500
    this.questionPanel = this.add.graphics();

    // Fondo con gradiente simulado
    this.questionPanel.fillStyle(0x1a1a2e, 0.95);
    this.questionPanel.fillRoundedRect(200, 80, 600, 340, 20);

    // Borde brillante
    this.questionPanel.lineStyle(3, 0x00d4ff, 1);
    this.questionPanel.strokeRoundedRect(200, 80, 600, 340, 20);

    // Efecto de sombra
    this.questionShadow = this.add.graphics();
    this.questionShadow.fillStyle(0x000000, 0.3);
    this.questionShadow.fillRoundedRect(205, 85, 600, 340, 20);

    this.questionPanel.setVisible(false);
    this.questionShadow.setVisible(false);

    // Título de la evaluación - centrado para 1000x500
    this.evaluationTitle = this.add
      .text(500, 120, "🧠 EVALUACIÓN DE CONOCIMIENTOS", {
        fontSize: "20px",
        fill: "#00d4ff",
        fontFamily: "Arial Black",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Pregunta principal
    this.questionText = this.add
      .text(
        500,
        170,
        "¿Cuál es la principal ventaja de los\nexoesqueletos robóticos?",
        {
          fontSize: "20px",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 500 },
          stroke: "#000000",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
      .setVisible(false);

    // Opciones con diseño mejorado - centradas para 1000x500
    this.optionA = this.add
      .text(500, 240, "🔸 A) Reducir el peso corporal", {
        fontSize: "18px",
        fill: "#e0e0e0",
        fontFamily: "Arial",
        backgroundColor: "#2d2d44",
        padding: { x: 15, y: 8 },
        stroke: "#555555",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.optionB = this.add
      .text(500, 290, "🔸 B) Aumentar la fuerza y resistencia humana", {
        fontSize: "18px",
        fill: "#e0e0e0",
        fontFamily: "Arial",
        backgroundColor: "#2d2d44",
        padding: { x: 15, y: 8 },
        stroke: "#555555",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.optionC = this.add
      .text(500, 340, "🔸 C) Reemplazar completamente al humano", {
        fontSize: "18px",
        fill: "#e0e0e0",
        fontFamily: "Arial",
        backgroundColor: "#2d2d44",
        padding: { x: 15, y: 8 },
        stroke: "#555555",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    // Eventos de interacción con efectos hover
    this.setupOptionEvents(this.optionA, "A");
    this.setupOptionEvents(this.optionB, "B");
    this.setupOptionEvents(this.optionC, "C");
  }

  setupOptionEvents(option, letter) {
    // Efecto hover
    option.on("pointerover", () => {
      if (!option.selected) {
        option.setStyle({
          fill: "#ffffff",
          backgroundColor: "#4a4a6a",
        });
        this.tweens.add({
          targets: option,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
          ease: "Power2",
        });
      }
    });

    option.on("pointerout", () => {
      if (!option.selected) {
        option.setStyle({
          fill: "#e0e0e0",
          backgroundColor: "#2d2d44",
        });
        this.tweens.add({
          targets: option,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: "Power2",
        });
      }
    });

    // Evento de clic
    option.on("pointerdown", () => this.selectOption(letter));
  }

  showQuestion() {
    // Mostrar elementos
    this.questionShadow.setVisible(true);
    this.questionPanel.setVisible(true);
    this.evaluationTitle.setVisible(true);
    this.questionText.setVisible(true);
    this.optionA.setVisible(true);
    this.optionB.setVisible(true);
    this.optionC.setVisible(true);

    // Resetear estados de selección
    this.optionA.selected = false;
    this.optionB.selected = false;
    this.optionC.selected = false;

    // Animación de aparición escalonada
    const elements = [this.questionShadow, this.questionPanel];
    const textElements = [this.evaluationTitle, this.questionText];
    const optionElements = [this.optionA, this.optionB, this.optionC];

    // Animar fondo primero
    this.tweens.add({
      targets: elements,
      alpha: { from: 0, to: 1 },
      scaleX: { from: 0.8, to: 1 },
      scaleY: { from: 0.8, to: 1 },
      duration: 400,
      ease: "Back.easeOut",
    });

    // Animar texto después
    this.tweens.add({
      targets: textElements,
      alpha: { from: 0, to: 1 },
      y: { from: "-=20", to: "+=20" },
      duration: 500,
      delay: 200,
      ease: "Power2",
    });

    // Animar opciones al final
    optionElements.forEach((option, index) => {
      this.tweens.add({
        targets: option,
        alpha: { from: 0, to: 1 },
        x: { from: "-=50", to: "+=50" },
        duration: 400,
        delay: 400 + index * 100,
        ease: "Power2",
      });
    });
  }

  selectOption(option) {
    // Solo marcar la opción seleccionada, permitir seguir seleccionando
    const selectedOption =
      option === "A"
        ? this.optionA
        : option === "B"
        ? this.optionB
        : this.optionC;

    // Efecto de pulso en la opción seleccionada
    this.tweens.add({
      targets: selectedOption,
      scaleX: { from: 1, to: 1.1, to: 1 },
      scaleY: { from: 1, to: 1.1, to: 1 },
      duration: 300,
      ease: "Power2",
    });

    // Verificar si es la respuesta correcta
    if (option === "B") {
      // Respuesta correcta - marcar todas como seleccionadas para evitar más clics
      this.optionA.selected = true;
      this.optionB.selected = true;
      this.optionC.selected = true;

      // Resaltar la opción correcta
      this.optionB.setStyle({
        fill: "#00ff88",
        backgroundColor: "#004400",
      });

      // Atenuar las otras opciones
      this.optionA.setStyle({
        fill: "#888888",
        backgroundColor: "#1a1a1a",
      });
      this.optionC.setStyle({
        fill: "#888888",
        backgroundColor: "#1a1a1a",
      });

      this.evaluationTitle.setText("✅ ¡RESPUESTA CORRECTA!");
      this.evaluationTitle.setStyle({ fill: "#00ff88" });

      this.questionText.setText(
        "¡Excelente! Los exoesqueletos robóticos\naumenta la fuerza y resistencia humana,\npermitiendo realizar tareas más pesadas."
      );
      this.questionText.setStyle({
        fill: "#00ff88",
        fontSize: "18px",
      });

      // Efecto de celebración
      this.tweens.add({
        targets: [this.evaluationTitle, this.questionText],
        scaleX: { from: 1, to: 1.1, to: 1 },
        scaleY: { from: 1, to: 1.1, to: 1 },
        duration: 600,
        ease: "Bounce.easeOut",
      });

      // Mostrar mensaje de felicitaciones y transición automática
      this.time.delayedCall(3000, () => {
        this.showCongratulations();
      });
    } else {
      // Respuesta incorrecta - solo mostrar feedback temporal sin revelar la correcta
      selectedOption.setStyle({
        fill: "#ff4444",
        backgroundColor: "#440000",
      });

      this.evaluationTitle.setText("❌ INTENTA DE NUEVO");
      this.evaluationTitle.setStyle({ fill: "#ff4444" });

      this.questionText.setText(
        "Esa no es la respuesta correcta.\n¡Sigue intentando!"
      );
      this.questionText.setStyle({
        fill: "#ff4444",
        fontSize: "18px",
      });

      // Efecto de vibración
      this.tweens.add({
        targets: [this.evaluationTitle, this.questionText],
        x: { from: "+=5", to: "-=5", to: "+=5", to: "-=5", to: "+=0" },
        duration: 400,
        ease: "Power2",
      });

      // Restaurar estilos después de 1.5 segundos para permitir nuevo intento
      this.time.delayedCall(1500, () => {
        selectedOption.setStyle({
          fill: "#e0e0e0",
          backgroundColor: "#2d2d44",
        });

        this.evaluationTitle.setText("🧠 EVALUACIÓN DE CONOCIMIENTOS");
        this.evaluationTitle.setStyle({ fill: "#00d4ff" });

        this.questionText.setText(
          "¿Cuál es la principal ventaja de los\nexoesqueletos robóticos?"
        );
        this.questionText.setStyle({
          fill: "#ffffff",
          fontSize: "20px",
        });
      });
    }
  }

  showCongratulations() {
    if (this.congratulationsShown) return;

    this.congratulationsShown = true;

    // Ocultar panel de pregunta completo
    if (this.questionPanel) {
      this.questionShadow.setVisible(false);
      this.questionPanel.setVisible(false);
      this.evaluationTitle.setVisible(false);
      this.questionText.setVisible(false);
      this.optionA.setVisible(false);
      this.optionB.setVisible(false);
      this.optionC.setVisible(false);
    }

    // Mostrar fondo y mensaje de felicitaciones
    this.congratulationsBackground.setVisible(true);
    this.congratulationsMessage.setText(
      "🎉 ¡FELICITACIONES! 🎉\n\nHas configurado exitosamente\nel exoesqueleto robótico\ncon parámetros óptimos"
    );
    this.congratulationsMessage.setVisible(true);

    // Animar la aparición del fondo y mensaje
    this.congratulationsBackground.setAlpha(0);
    this.congratulationsBackground.setScale(0.8);
    this.congratulationsMessage.setAlpha(0);
    this.congratulationsMessage.setScale(0.8);

    this.tweens.add({
      targets: this.congratulationsBackground,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: "Back.easeOut",
    });

    this.tweens.add({
      targets: this.congratulationsMessage,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 800,
      delay: 200,
      ease: "Bounce.easeOut",
    });

    // Transición automática a ConclusionNivel9 después de 5 segundos
        this.time.delayedCall(5000, () => {
          this.scene.start("ConclusionNivel9");
    });
  }

  showHintMessage() {
    // Si ya existe un mensaje, lo ocultamos
    if (this.hintMessage) {
      this.hintMessage.destroy();
      this.hintBackground.destroy();
    }

    // Crear fondo semi-transparente para el mensaje
    this.hintBackground = this.add.graphics();
    this.hintBackground.fillStyle(0x000000, 0.8);
    this.hintBackground.fillRect(0, 0, 1000, 500);
    this.hintBackground.setInteractive();

    // Crear panel del mensaje
    const messagePanel = this.add.graphics();
    messagePanel.fillStyle(0x1a1a2e, 0.95);
    messagePanel.fillRoundedRect(150, 150, 700, 200, 20);
    messagePanel.lineStyle(4, 0x00ff88);
    messagePanel.strokeRoundedRect(150, 150, 700, 200, 20);

    // Título de la pista
    const hintTitle = this.add
      .text(500, 180, "💡 PISTA DEL EXOESQUELETO", {
        fontSize: "24px",
        fill: "#00ff88",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Mensaje de la pista
    const hintText = this.add
      .text(
        500,
        230,
        "Para optimizar el exoesqueleto necesitas:\n\n🔋 FUERZA: Entre 75% - 85% (Potencia de servomotores)\n🚀 VELOCIDAD: Entre 70% - 80% (Velocidad de respuesta)\n🎯 SENSIBILIDAD: Entre 55% - 65% (Precisión de sensores)\n\n",
        {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Arial",
          align: "center",
          lineSpacing: 5,
        }
      )
      .setOrigin(0.5);

    // Botón para cerrar
    const closeButton = this.add
      .text(500, 310, "✖ CERRAR", {
        fontSize: "18px",
        fill: "#ffffff",
        backgroundColor: "#ff4444",
        padding: { x: 20, y: 10 },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    closeButton.on("pointerdown", () => {
      this.hintMessage.destroy();
      this.hintBackground.destroy();
      this.hintMessage = null;
      this.hintBackground = null;
    });

    // Agrupar todos los elementos del mensaje
    this.hintMessage = this.add.container(0, 0, [
      messagePanel,
      hintTitle,
      hintText,
      closeButton,
    ]);

    // Cerrar al hacer clic en el fondo
    this.hintBackground.on("pointerdown", () => {
      this.hintMessage.destroy();
      this.hintBackground.destroy();
      this.hintMessage = null;
      this.hintBackground = null;
    });
  }

  update() {
    // Brillo muy sutil del exoesqueleto cuando está en estado óptimo
    if (this.gameCompleted && this.exoskeletonGraphics) {
      const pulse = Math.sin(this.time.now * 0.002) * 0.02 + 1;
      this.exoskeletonGraphics.setScale(pulse);
    }

    // Animar puntos de fondo
    if (this.animatedDots && this.backgroundGraphics) {
      this.backgroundGraphics.clear();

      // Redibujar gradiente base
      for (let i = 0; i < 500; i += 8) {
        const ratio = i / 500;
        const color1 = { r: 8, g: 15, b: 20 };
        const color2 = { r: 18, g: 25, b: 35 };
        const color3 = { r: 25, g: 20, b: 45 };

        let r, g, b;
        if (ratio < 0.5) {
          const localRatio = ratio * 2;
          r = Math.round(color1.r + (color2.r - color1.r) * localRatio);
          g = Math.round(color1.g + (color2.g - color1.g) * localRatio);
          b = Math.round(color1.b + (color2.b - color1.b) * localRatio);
        } else {
          const localRatio = (ratio - 0.5) * 2;
          r = Math.round(color2.r + (color3.r - color2.r) * localRatio);
          g = Math.round(color2.g + (color3.g - color2.g) * localRatio);
          b = Math.round(color2.b + (color3.b - color2.b) * localRatio);
        }

        const color = (r << 16) | (g << 8) | b;
        this.backgroundGraphics.fillStyle(color);
        this.backgroundGraphics.fillRect(0, i, 1000, 8);
      }

      // Animar y dibujar puntos
      this.animatedDots.forEach((dot) => {
        // Movimiento
        dot.x += dot.speedX;
        dot.y += dot.speedY;

        // Rebote en bordes
        if (dot.x < 0 || dot.x > 1000) dot.speedX *= -1;
        if (dot.y < 0 || dot.y > 500) dot.speedY *= -1;

        // Mantener dentro de límites
        dot.x = Math.max(0, Math.min(1000, dot.x));
        dot.y = Math.max(0, Math.min(500, dot.y));

        // Pulso de brillo
        dot.pulsePhase += dot.pulseSpeed;
        const pulseAlpha = dot.alpha + Math.sin(dot.pulsePhase) * 0.2;

        // Dibujar punto
        this.backgroundGraphics.fillStyle(0x00d4ff, Math.max(0.05, pulseAlpha));
        this.backgroundGraphics.fillCircle(dot.x, dot.y, dot.size);
      });

      // Animar y dibujar líneas
      this.animatedLines.forEach((line) => {
        // Fade in/out
        line.alpha += line.fadeSpeed * line.fadeDirection;
        if (line.alpha <= 0.02 || line.alpha >= 0.25) {
          line.fadeDirection *= -1;
        }
        line.alpha = Math.max(0.02, Math.min(0.25, line.alpha));

        // Dibujar línea
        this.backgroundGraphics.lineStyle(1, 0x00d4ff, line.alpha);
        this.backgroundGraphics.lineBetween(
          line.startX,
          line.startY,
          line.endX,
          line.endY
        );
      });
    }
  }
}

window.PuzzleElectronico = Rompecabezas;
