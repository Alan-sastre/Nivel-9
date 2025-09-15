class DiagnosticoSistemas extends Phaser.Scene {
  constructor() {
    super({ key: "DiagnosticoSistemas" });
    this.gameStarted = false;
    this.questionAnswered = false;
    this.scanningComplete = false;
    this.particles = [];
  }

  createTerminalWindow() {
    // Crear contenedor para la ventana de terminal (más pequeña y posicionada abajo)
    this.terminalContainer = this.add.container(500, 380);

    // Fondo de la ventana de terminal (más pequeña) - color azul
    this.terminalBackground = this.add.graphics();
    this.terminalBackground.fillStyle(0x001133, 0.95);
    this.terminalBackground.fillRoundedRect(-250, -100, 500, 200, 8);
    this.terminalBackground.lineStyle(2, 0x0066ff, 0.8);
    this.terminalBackground.strokeRoundedRect(-250, -100, 500, 200, 8);
    this.terminalContainer.add(this.terminalBackground);

    // Barra de título de la terminal (más pequeña) - color azul
    this.terminalTitleBar = this.add.graphics();
    this.terminalTitleBar.fillStyle(0x003366, 0.9);
    this.terminalTitleBar.fillRoundedRect(-250, -100, 500, 25, 8);
    this.terminalTitleBar.lineStyle(1, 0x0066ff, 0.6);
    this.terminalTitleBar.strokeRoundedRect(-250, -100, 500, 25, 8);
    this.terminalContainer.add(this.terminalTitleBar);

    // Título de la terminal (más pequeño) - color azul
    this.terminalTitle = this.add.text(-240, -92, "DIAGNÓSTICO v2.1", {
      fontSize: "12px",
      fontFamily: "Courier New, monospace",
      fill: "#0099ff",
      fontWeight: "bold"
    });
    this.terminalContainer.add(this.terminalTitle);

    // Área de texto de la terminal (más pequeña) - color azul
    this.terminalText = this.add.text(-240, -70, "", {
      fontSize: "10px",
      fontFamily: "Courier New, monospace",
      fill: "#0099ff",
      lineSpacing: 2,
      wordWrap: { width: 480 }
    });
    this.terminalContainer.add(this.terminalText);

    // Cursor parpadeante (más pequeño) - color azul
    this.terminalCursor = this.add.text(-240, -70, "█", {
      fontSize: "10px",
      fontFamily: "Courier New, monospace",
      fill: "#0099ff"
    });
    this.terminalContainer.add(this.terminalCursor);

    // Animación del cursor
    this.tweens.add({
      targets: this.terminalCursor,
      alpha: { from: 1, to: 0 },
      duration: 500,
      repeat: -1,
      yoyo: true
    });

    // Inicializar variables de terminal
    this.terminalLines = [];
    this.currentTerminalLine = 0;
  }

  startTerminalSimulation() {
    const commands = [
      { delay: 500, text: "root@diagnostic-system:~$ systemctl start neural-scanner", type: "command" },
      { delay: 1000, text: "[INFO] Iniciando módulo de escaneo neuronal...", type: "output" },
      { delay: 1500, text: "[INFO] Cargando drivers de interfaz cerebral...", type: "output" },
      { delay: 2200, text: "[OK] Drivers cargados correctamente", type: "success" },
      { delay: 3000, text: "", type: "blank" },
      { delay: 3200, text: "root@diagnostic-system:~$ ./scan --target=cortex --mode=deep", type: "command" },
      { delay: 4000, text: "Escaneando patrones neuronales...", type: "output" },
      { delay: 5000, text: "████████████████████████████████████████ 100%", type: "progress" },
      { delay: 6000, text: "[OK] Patrones neuronales detectados: 2,847 conexiones", type: "success" },
      { delay: 7000, text: "", type: "blank" },
      { delay: 7200, text: "root@diagnostic-system:~$ bioelectric-detector --scan", type: "command" },
      { delay: 8000, text: "Detectando señales bioeléctricas...", type: "output" },
      { delay: 9000, text: "Frecuencia detectada: 8.2 Hz (Alpha)", type: "output" },
      { delay: 10000, text: "Amplitud promedio: 45.7 μV", type: "output" },
      { delay: 11000, text: "[OK] Señales bioeléctricas estables", type: "success" },
      { delay: 12000, text: "", type: "blank" },
      { delay: 12200, text: "root@diagnostic-system:~$ interface-calibrator --auto", type: "command" },
      { delay: 13000, text: "Calibrando sensores de interfaz cerebral...", type: "output" },
      { delay: 14000, text: "Sensor 1: [████████████████████████████████] OK", type: "progress" },
      { delay: 15000, text: "Sensor 2: [████████████████████████████████] OK", type: "progress" },
      { delay: 16000, text: "Sensor 3: [████████████████████████████████] OK", type: "progress" },
      { delay: 17000, text: "[OK] Calibración completada", type: "success" },
      { delay: 18000, text: "", type: "blank" },
      { delay: 18200, text: "root@diagnostic-system:~$ cortex-connector --establish", type: "command" },
      { delay: 19000, text: "Estableciendo conexión con corteza motora...", type: "output" },
      { delay: 20000, text: "Conectando a región M1...", type: "output" },
      { delay: 21000, text: "Sincronizando protocolos de comunicación...", type: "output" },
      { delay: 22000, text: "[OK] Conexión establecida con corteza motora", type: "success" },
      { delay: 23000, text: "Latencia: 2.3ms | Ancho de banda: 1.2 Gbps", type: "output" },
      { delay: 24000, text: "", type: "blank" },
      { delay: 24200, text: "root@diagnostic-system:~$ system-status --full", type: "command" },
      { delay: 25000, text: "Estado del sistema:", type: "output" },
      { delay: 25500, text: "├── Escáner neuronal: [ACTIVO]", type: "output" },
      { delay: 26000, text: "├── Detector bioeléctrico: [ACTIVO]", type: "output" },
      { delay: 26500, text: "├── Interfaz cerebral: [CALIBRADA]", type: "output" },
      { delay: 27000, text: "└── Conexión cortical: [ESTABLECIDA]", type: "output" },
      { delay: 28000, text: "", type: "blank" },
      { delay: 28500, text: "[INFO] Sistema listo para evaluación técnica", type: "success" },
      { delay: 29500, text: "[INFO] Iniciando protocolo de preguntas...", type: "output" },
      { delay: 30500, text: "root@diagnostic-system:~$ exit", type: "command" },
      { delay: 31000, text: "Cerrando sesión de diagnóstico...", type: "output" },
      { delay: 32000, text: "[INFO] Sesión cerrada correctamente", type: "success" }
    ];

    commands.forEach(cmd => {
      this.time.delayedCall(cmd.delay, () => {
        this.addTerminalLine(cmd.text, cmd.type);
      });
    });
  }

  addTerminalLine(text, type = "output") {
    let color = "#0099ff";
    let prefix = "";

    switch(type) {
      case "command":
        color = "#ffffff";
        break;
      case "success":
        color = "#0099ff";
        break;
      case "output":
        color = "#66ccff";
        break;
      case "progress":
        color = "#ffff99";
        break;
      case "blank":
        text = "";
        break;
    }

    this.terminalLines.push({ text: text, color: color });
    
    // Mantener solo las últimas 10 líneas visibles (menos líneas para ventana pequeña)
     if (this.terminalLines.length > 10) {
       this.terminalLines.shift();
     }

     // Actualizar el texto de la terminal
     let displayText = this.terminalLines.map(line => line.text).join('\n');
     this.terminalText.setText(displayText);

     // Actualizar colores (simplificado - usar el color de la última línea)
     if (this.terminalLines.length > 0) {
       this.terminalText.setColor(this.terminalLines[this.terminalLines.length - 1].color);
     }

     // Posicionar cursor al final
     const textHeight = this.terminalText.height;
     this.terminalCursor.setPosition(-240, -70 + textHeight);
  }

  hideTerminalWindow() {
    if (this.terminalContainer) {
      this.tweens.add({
        targets: this.terminalContainer,
        alpha: { from: 1, to: 0 },
        scaleX: { from: 1, to: 0.8 },
        scaleY: { from: 1, to: 0.8 },
        duration: 800,
        ease: "Power2.easeIn",
        onComplete: () => {
          this.terminalContainer.setVisible(false);
        }
      });
    }
  }

  preload() {
    // No necesitamos precargar nada, crearemos los gráficos directamente
  }

  create() {
    // Crear fondo con gradiente más realista
    const graphics = this.add.graphics();

    // Fondo base oscuro
    graphics.fillStyle(0x0a0a0a);
    graphics.fillRect(0, 0, 1000, 500);

    // Crear mensajes de diagnóstico
    this.diagnosticMessages = [
      "Iniciando diagnóstico del sistema...",
      "Verificando integridad de los datos...",
      "Analizando patrones de comportamiento...",
      "Detectando anomalías en el sistema...",
      "Generando reporte de diagnóstico...",
      "Diagnóstico completado exitosamente."
    ];

    this.currentMessageIndex = 0;
    this.diagnosticText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, "", {
      fontSize: "28px",
      fontFamily: "Arial, sans-serif",
      fill: "#ffffff",
      align: "center",
      stroke: "#333333",
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 4,
        fill: true
      },
      resolution: 2 // Mejora la resolución del texto para evitar pixelado
    }).setOrigin(0.5);

    // Crear efecto de escaneo de fondo
    this.createScanEffect();

    // Iniciar secuencia de diagnóstico solo cuando se presione el botón
    // this.startDiagnosticSequence(); // Se ejecutará desde startDiagnosis()

    // Gradiente radial desde el centro
    for (let radius = 0; radius < 400; radius += 2) {
      const alpha = 1 - radius / 400;
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        { r: 0, g: 40, b: 80 }, // Azul más intenso
        { r: 0, g: 10, b: 20 }, // Casi negro
        400,
        radius
      );
      const hexColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
      graphics.fillStyle(hexColor, alpha * 0.3);
      graphics.fillCircle(500, 250, radius);
    }

    // Crear partículas de fondo flotantes
    this.createBackgroundParticles();

    // Grid de líneas tecnológicas
    this.createTechGrid();

    // Título con efecto holográfico
    this.titleText = this.add
      .text(500, 40, "DIAGNÓSTICO DE RED CIBERNÉTICA", {
        fontSize: "32px",
        fill: "#00ffff",
        fontFamily: "Courier New",
        stroke: "#004466",
        strokeThickness: 3,
        resolution: 2,
        padding: { x: 8, y: 4 },
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#00aaaa",
          blur: 5,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Subtítulo con efecto de parpadeo
    this.subtitleText = this.add
      .text(500, 75, "Análisis de Interfaces Cerebro-Máquina", {
        fontSize: "18px",
        fill: "#88ffff",
        fontFamily: "Courier New",
        alpha: 0.8,
        resolution: 2,
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5);

    // Efecto de parpadeo en subtítulo
    this.tweens.add({
      targets: this.subtitleText,
      alpha: 0.4,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Escáner neuronal mejorado con múltiples capas
    this.scannerContainer = this.add.container(500, 160);

    // Círculo base con gradiente
    this.scannerBase = this.add.graphics();
    for (let r = 70; r > 0; r -= 2) {
      const alpha = ((70 - r) / 70) * 0.4;
      const color = r < 35 ? 0x00ffff : 0x0088ff;
      this.scannerBase.fillStyle(color, alpha);
      this.scannerBase.fillCircle(0, 0, r);
    }
    this.scannerContainer.add(this.scannerBase);

    // Anillos concéntricos
    this.scannerRings = [];
    for (let i = 0; i < 3; i++) {
      const ring = this.add
        .circle(0, 0, 30 + i * 15, 0x00ffff, 0)
        .setStrokeStyle(2, 0x00ffff, 0.6 - i * 0.2);
      this.scannerContainer.add(ring);
      this.scannerRings.push(ring);
    }

    // Elementos del escáner sin líneas verdes
    this.scanLines = [];
    this.neuralPoints = [];

    // Texto de estado del escáner con efecto de máquina de escribir
    this.scannerStatus = this.add
      .text(500, 250, "", {
        fontSize: "16px",
        fill: "#00ff88",
        fontFamily: "Courier New",
        stroke: "#003322",
        strokeThickness: 1,
        resolution: 2, // Mayor resolución para evitar pixelado
        padding: { x: 4, y: 4 }, // Padding para evitar recortes
        wordWrap: { width: 800, useAdvancedWrap: true }, // Evitar desbordamiento
        align: "center",
      })
      .setOrigin(0.5);

    // Botón holográfico para iniciar
    this.startButton = this.add.graphics();
    this.startButton.fillStyle(0x004488, 0.3);
    this.startButton.fillRoundedRect(410, 285, 180, 45, 10);
    this.startButton.lineStyle(2, 0x0088ff, 0.8);
    this.startButton.strokeRoundedRect(410, 285, 180, 45, 10);
    this.startButton
      .setInteractive(
        new Phaser.Geom.Rectangle(410, 285, 180, 45),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerdown", () => this.startDiagnosis())
      .on("pointerover", () => {
        this.startButton.clear();
        this.startButton.fillStyle(0x0066aa, 0.5);
        this.startButton.fillRoundedRect(410, 285, 180, 45, 10);
        this.startButton.lineStyle(3, 0x00aaff, 1);
        this.startButton.strokeRoundedRect(410, 285, 180, 45, 10);
      })
      .on("pointerout", () => {
        this.startButton.clear();
        this.startButton.fillStyle(0x004488, 0.3);
        this.startButton.fillRoundedRect(410, 285, 180, 45, 10);
        this.startButton.lineStyle(2, 0x0088ff, 0.8);
        this.startButton.strokeRoundedRect(410, 285, 180, 45, 10);
      });

    this.startButtonText = this.add
      .text(500, 307, "INICIAR DIAGNÓSTICO", {
        fontSize: "16px",
        fill: "#00ffff",
        fontFamily: "Courier New",
        stroke: "#004466",
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    // Contenedor de pregunta (inicialmente oculto)
    this.questionContainer = this.add.container(500, 380);
    this.questionContainer.setVisible(false);

    // Crear pregunta
    this.createQuestion();

    // Inicializar animaciones
    this.initAnimations();
  }

  createScanEffect() {
    // Crear líneas de escaneo que se mueven verticalmente con más dinamismo
    for (let i = 0; i < 8; i++) {
      const scanLine = this.add.rectangle(
        Math.random() * 1000,
        -10,
        Math.random() * 3 + 1, // Ancho variable
        500,
        0x0099ff, // Azul en lugar de verde
        0.4 + Math.random() * 0.3 // Opacidad variable
      );

      this.tweens.add({
        targets: scanLine,
        y: 510,
        duration: 2000 + Math.random() * 1500, // Velocidad más rápida
        delay: Math.random() * 1000,
        repeat: -1,
        ease: "Linear",
        onRepeat: () => {
          scanLine.x = Math.random() * 1000;
          scanLine.width = Math.random() * 3 + 1;
          scanLine.alpha = 0.4 + Math.random() * 0.3;
        }
      });
    }

    // Agregar pulsos de energía horizontales
    for (let i = 0; i < 4; i++) {
      const energyPulse = this.add.rectangle(
        -50,
        Math.random() * 500,
        100,
        2,
        0x00ffff,
        0.6
      );

      this.tweens.add({
        targets: energyPulse,
        x: 1050,
        duration: 1500 + Math.random() * 1000,
        delay: Math.random() * 2000,
        repeat: -1,
        ease: "Power2.easeInOut",
        onRepeat: () => {
          energyPulse.y = Math.random() * 500;
        }
      });
    }

    // Crear partículas flotantes de datos con colores más neutros
    for (let i = 0; i < 15; i++) {
      const dataParticle = this.add.circle(
        Math.random() * 1000,
        Math.random() * 500,
        Math.random() * 2 + 1,
        0x66aaff, // Azul claro en lugar de verde
        0.7
      );

      this.tweens.add({
        targets: dataParticle,
        x: dataParticle.x + (Math.random() - 0.5) * 200,
        y: dataParticle.y + (Math.random() - 0.5) * 200,
        alpha: 0.3,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }
  }

  startDiagnosticSequence() {
    if (this.currentMessageIndex < this.diagnosticMessages.length) {
      const message = this.diagnosticMessages[this.currentMessageIndex];

      // Efecto de entrada para cada mensaje
      this.diagnosticText.setAlpha(0);
      this.diagnosticText.setScale(0.8);

      this.tweens.add({
        targets: this.diagnosticText,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        ease: "Back.easeOut"
      });

      // Mostrar mensaje con efecto de escritura mejorado
      this.typewriterText(message, this.diagnosticText, () => {
        // Efecto de pulso al completar el mensaje
        this.tweens.add({
          targets: this.diagnosticText,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          yoyo: true,
          ease: "Power2"
        });

        this.currentMessageIndex++;

        // Continuar con el siguiente mensaje después de una pausa más corta
        this.time.delayedCall(800, () => {
          this.startDiagnosticSequence();
        });
      });
    } else {
      // Diagnóstico completado, efecto de salida
      this.tweens.add({
        targets: this.diagnosticText,
        alpha: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 600,
        ease: "Back.easeIn"
      });
    }
  }

  initAnimations() {
    // Animación de rotación de anillos
    this.scannerRings.forEach((ring, index) => {
      this.tweens.add({
        targets: ring,
        rotation: Math.PI * 2,
        duration: 3000 + index * 500,
        repeat: -1,
        ease: "Linear",
      });
    });

    // Animación de pulsación de líneas de escaneo
    this.scanLines.forEach((line, index) => {
      this.tweens.add({
        targets: line,
        alpha: { from: 0.8, to: 0.3 },
        scaleX: { from: 1, to: 1.2 },
        scaleY: { from: 1, to: 1.2 },
        duration: 1500,
        delay: index * 250,
        repeat: -1,
        yoyo: true,
        ease: "Sine.easeInOut",
      });
    });

    // Animación de puntos neuronales
    this.neuralPoints.forEach((point, index) => {
      this.tweens.add({
        targets: point,
        alpha: { from: 0.7, to: 0.2 },
        scale: { from: 1, to: 1.5 },
        duration: 2000 + index * 100,
        delay: Math.random() * 1000,
        repeat: -1,
        yoyo: true,
        ease: "Power2",
      });
    });

    // Efecto de escritura para el estado del escáner
    this.typewriterText("Iniciando escaneo neuronal...", this.scannerStatus);
  }

  typewriterText(text, textObject, onComplete) {
    // Detener cualquier animación previa en este objeto de texto
    if (textObject.typewriterTimer) {
      textObject.typewriterTimer.remove();
      textObject.typewriterTimer = null;
    }

    // Limpiar texto inicial
    textObject.setText("");

    // Asegurar que el objeto de texto sea visible y estable
    textObject.setVisible(true);
    textObject.setAlpha(1);

    // Efecto de entrada con animación
    textObject.setScale(0.8);
    this.tweens.add({
      targets: textObject,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: "Back.easeOut"
    });

    let currentIndex = 0;
    const totalLength = text.length;

    const timer = this.time.addEvent({
      delay: 35, // Velocidad mucho más rápida (era 120, ahora 35)
      callback: () => {
        if (currentIndex <= totalLength) {
          // Usar substring en lugar de substr (más moderno y estable)
          const displayText = text.substring(0, currentIndex);
          textObject.setText(displayText);

          // Efecto de cursor parpadeante durante la escritura
          if (currentIndex < totalLength) {
            textObject.setText(displayText + "_");
          }

          // Efecto de partículas en cada carácter
          if (currentIndex > 0 && currentIndex <= totalLength) {
            this.createTypewriterParticle(textObject.x + (currentIndex * 8), textObject.y);
          }

          currentIndex++;
        } else {
          // Remover cursor al finalizar
          textObject.setText(text);

          // Efecto de finalización
          this.tweens.add({
            targets: textObject,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 200,
            yoyo: true,
            ease: "Power2"
          });

          // Limpiar referencia del timer al completarse
          textObject.typewriterTimer = null;
          timer.remove();

          // Ejecutar callback si existe
          if (onComplete) onComplete();
        }
      },
      repeat: totalLength,
    });

    // Guardar referencia del timer en el objeto de texto
    textObject.typewriterTimer = timer;
  }

  createTypewriterParticle(x, y) {
    // Crear pequeña partícula brillante en cada carácter
    const particle = this.add.circle(
      x + (Math.random() - 0.5) * 10,
      y + (Math.random() - 0.5) * 10,
      Math.random() * 2 + 1,
      0x00ffff,
      0.8
    );

    this.tweens.add({
      targets: particle,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      y: particle.y - 15,
      duration: 600,
      ease: "Power2.easeOut",
      onComplete: () => {
        particle.destroy();
      }
    });
  }

  createBackgroundParticles() {
    // Método eliminado para mantener un fondo limpio
    // Las partículas de fondo han sido removidas para una interfaz más limpia
  }

  createTechGrid() {
    // Crear solo una capa de cuadrícula estática y sutil
    this.gridLayers = [];

    // Capa base estática - solo líneas sutiles sin movimiento
    const baseGrid = this.add.graphics();
    baseGrid.lineStyle(1, 0x004466, 0.15); // Más sutil
    this.drawGridLines(baseGrid);
    this.gridLayers.push(baseGrid);

    // Líneas de energía ocasionales (sin movimiento constante)
    this.createEnergyLines();
  }

  drawGridLines(graphics) {
    // Líneas verticales
    for (let x = 0; x <= 1000; x += 50) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, 500);
    }

    // Líneas horizontales
    for (let y = 0; y <= 500; y += 50) {
      graphics.moveTo(0, y);
      graphics.lineTo(1000, y);
    }

    graphics.strokePath();
  }

  createEnergyLines() {
    // Crear líneas de energía ocasionales y sutiles (sin movimiento constante)
    this.time.addEvent({
      delay: 4000, // Menos frecuente para ser más sutil
      callback: () => {
        const energyLine = this.add.graphics();
        
        // Colores más sutiles
        const colors = [0x004488, 0x0066aa];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        energyLine.lineStyle(1, randomColor, 0.4); // Más sutil

        // Solo líneas horizontales ocasionales
        const y = Math.floor(Math.random() * 10) * 50;
        energyLine.moveTo(0, y);
        energyLine.lineTo(1000, y);
        energyLine.strokePath();

        // Animación sutil de aparición y desaparición
        this.tweens.add({
          targets: energyLine,
          alpha: { from: 0, to: 0.4 },
          duration: 800,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            energyLine.destroy();
          },
        });
      },
      repeat: -1,
    });
  }

  startDiagnosis() {
    if (this.gameStarted) return;

    this.gameStarted = true;
    this.startButton.setVisible(false);
    this.startButtonText.setVisible(false);

    // Crear ventana de terminal
    this.createTerminalWindow();

    // Animación intensiva del escáner
    this.tweens.add({
      targets: this.scannerContainer,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 2000,
      ease: "Power2.easeInOut",
      yoyo: true,
      repeat: 1,
    });

    // Efecto de pulso en el escáner base
    this.tweens.add({
      targets: this.scannerBase,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      repeat: 4,
      yoyo: true,
      ease: "Sine.easeInOut",
    });

    // Acelerar rotación de anillos durante el escaneo
    this.scannerRings.forEach((ring, index) => {
      this.tweens.add({
        targets: ring,
        rotation: ring.rotation + Math.PI * 4,
        duration: 3000,
        ease: "Power2.easeOut",
      });
    });

    // Iniciar simulación de terminal
    this.startTerminalSimulation();

    // Intensificar la animación de la red durante el escaneo
    this.intensifyGridAnimation();

    // Mostrar primera pregunta después de la animación y ocultar terminal
    this.time.delayedCall(35000, () => {
      this.hideTerminalWindow();
      this.questionContainer.setVisible(true);
      this.showQuestion();
    });
  }

  intensifyGridAnimation() {
    // Método simplificado - solo crear efectos de escaneo sutiles
    // Ya no hay capas adicionales de grid que intensificar
    
    // Crear efectos sutiles de escaneo
    this.createScanningEffects();
  }

  createScanningEffects() {
    // Efectos de escaneo simplificados - solo ondas sutiles sin círculos de fondo
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 200, () => {
        // Crear línea de escaneo horizontal sutil
        const scanLine = this.add.graphics();
        scanLine.lineStyle(1, [0x0099ff, 0x66aaff, 0x00ccff, 0x3399ff, 0x0066cc][Math.floor(Math.random() * 5)], 0.6);
        scanLine.moveTo(0, 250 + (i * 50));
        scanLine.lineTo(1000, 250 + (i * 50));
        scanLine.strokePath();

        // Animación de la línea
        this.tweens.add({
          targets: scanLine,
          alpha: { from: 0.6, to: 0 },
          duration: 1000,
          ease: 'Power2',
          onComplete: () => {
            scanLine.destroy();
          }
        });
      });
    }
  }

  createQuestion() {
    // Reiniciar variables de intentos para nueva pregunta
    this.incorrectAttempts = [];
    this.questionAnswered = false;

    // Panel de fondo para las preguntas
    this.questionPanel = this.add.graphics();
    this.questionPanel.fillStyle(0x001122, 0.8);
    this.questionPanel.fillRoundedRect(-350, -100, 700, 200, 15);
    this.questionPanel.lineStyle(2, 0x0088ff, 0.6);
    this.questionPanel.strokeRoundedRect(-350, -100, 700, 200, 15);
    this.questionContainer.add(this.questionPanel);

    // Pregunta principal con estilo futurista
    const questionText = this.add
      .text(
        0,
        -60,
        "¿Qué tecnología permite que una prótesis robótica\nresponda a señales cerebrales?",
        {
          fontSize: "20px",
          fill: "#00ffff",
          fontFamily: "Courier New",
          align: "center",
          stroke: "#004466",
          strokeThickness: 1,
          resolution: 2,
          padding: { x: 6, y: 4 },
          wordWrap: { width: 650, useAdvancedWrap: true },
          shadow: {
            offsetX: 1,
            offsetY: 1,
            color: "#00aaaa",
            blur: 3,
            fill: true,
          },
        }
      )
      .setOrigin(0.5);

    // Opciones de respuesta
    const options = [
      { text: "A) Sensores de temperatura", correct: false },
      { text: "B) Electromiografía (EMG)", correct: true },
      { text: "C) Diodos emisores de luz (LEDs)", correct: false },
      { text: "D) Giroscopios de navegación", correct: false },
    ];

    this.optionButtons = [];
    options.forEach((option, index) => {
      const y = -10 + index * 30;

      // Crear botón con gráficos personalizados
      const buttonGraphics = this.add.graphics();
      buttonGraphics.fillStyle(0x003366, 0.7);
      buttonGraphics.fillRoundedRect(-175, -12, 350, 24, 8);
      buttonGraphics.lineStyle(1, 0x0066aa, 0.8);
      buttonGraphics.strokeRoundedRect(-175, -12, 350, 24, 8);
      buttonGraphics.x = 0;
      buttonGraphics.y = y;

      buttonGraphics
        .setInteractive(
          new Phaser.Geom.Rectangle(-175, -12, 350, 24),
          Phaser.Geom.Rectangle.Contains
        )
        .on("pointerdown", () => this.selectAnswer(option.correct, index))
        .on("pointerover", () => {
          // Solo cambiar color si no está deshabilitado o marcado como incorrecto
          if (
            buttonGraphics.input &&
            buttonGraphics.input.enabled &&
            !this.incorrectAttempts?.includes(index)
          ) {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x0055aa, 0.9);
            buttonGraphics.fillRoundedRect(-175, -12, 350, 24, 8);
            buttonGraphics.lineStyle(2, 0x00aaff, 1);
            buttonGraphics.strokeRoundedRect(-175, -12, 350, 24, 8);
          }
        })
        .on("pointerout", () => {
          // Solo restaurar color si no está deshabilitado o marcado como incorrecto
          if (
            buttonGraphics.input &&
            buttonGraphics.input.enabled &&
            !this.incorrectAttempts?.includes(index)
          ) {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x003366, 0.7);
            buttonGraphics.fillRoundedRect(-175, -12, 350, 24, 8);
            buttonGraphics.lineStyle(1, 0x0066aa, 0.8);
            buttonGraphics.strokeRoundedRect(-175, -12, 350, 24, 8);
          }
        });

      const buttonText = this.add
        .text(0, y, option.text, {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Courier New",
          stroke: "#000044",
          strokeThickness: 2,
          resolution: 2,
          padding: { x: 6, y: 4 },
          wordWrap: { width: 340, useAdvancedWrap: true },
          shadow: {
            offsetX: 1,
            offsetY: 1,
            color: "#00aaff",
            blur: 2,
            fill: true,
          },
        })
        .setOrigin(0.5);

      this.optionButtons.push({
        button: buttonGraphics,
        text: buttonText,
        correct: option.correct,
      });
    });

    // Añadir elementos al contenedor
    this.questionContainer.add([
      questionText,
      ...this.optionButtons.map((opt) => [opt.button, opt.text]).flat(),
    ]);
  }

  showQuestion() {
    this.scannerStatus.setText("Responde para continuar el diagnóstico:");
    this.scannerStatus.setColor("#ffff00");
    this.questionContainer.setVisible(true);

    // Animación de aparición
    this.questionContainer.setAlpha(0);
    this.tweens.add({
      targets: this.questionContainer,
      alpha: 1,
      duration: 500,
    });
  }

  selectAnswer(isCorrect, selectedIndex) {
    // Inicializar array de intentos incorrectos si no existe
    if (!this.incorrectAttempts) {
      this.incorrectAttempts = [];
    }

    const selectedButton = this.optionButtons[selectedIndex].button;

    if (isCorrect) {
      // Respuesta correcta - finalizar pregunta
      this.questionAnswered = true;

      selectedButton.clear();
      selectedButton.fillStyle(0x0066aa, 0.9); // Azul en lugar de verde
      selectedButton.fillRoundedRect(-175, -12, 350, 24, 8);
      selectedButton.lineStyle(3, 0x0099ff, 1); // Azul claro en lugar de verde
      selectedButton.strokeRoundedRect(-175, -12, 350, 24, 8);

      // Efectos especiales para respuesta correcta
      this.createSuccessEffects(selectedButton);

      // Deshabilitar todos los botones
      this.optionButtons.forEach((opt) => {
        opt.button.disableInteractive();
      });

      // Mostrar retroalimentación final
      this.time.delayedCall(1000, () => {
        this.showFeedback(isCorrect);
      });
    } else {
      // Respuesta incorrecta - marcar en rojo y permitir reintentar

      // Marcar esta opción como incorrecta si no está ya marcada
      if (!this.incorrectAttempts.includes(selectedIndex)) {
        this.incorrectAttempts.push(selectedIndex);

        selectedButton.clear();
        selectedButton.fillStyle(0xaa0000, 0.9);
        selectedButton.fillRoundedRect(-175, -12, 350, 24, 8);
        selectedButton.lineStyle(3, 0xff0000, 1);
        selectedButton.strokeRoundedRect(-175, -12, 350, 24, 8);

        // Deshabilitar solo este botón
        selectedButton.disableInteractive();

        // Efecto de vibración para respuesta incorrecta
        this.tweens.add({
          targets: selectedButton,
          x: selectedButton.x + 5,
          duration: 50,
          yoyo: true,
          repeat: 5,
          ease: "Power2",
        });
      }

      // Mostrar mensaje de "Inténtalo de nuevo"
      this.showRetryMessage();
    }
  }

  showRetryMessage() {
    // Eliminar mensaje anterior si existe
    if (this.retryMessage) {
      this.retryMessage.destroy();
    }
    if (this.retryMessageBg) {
      this.retryMessageBg.destroy();
    }

    // Crear fondo para el mensaje
    this.retryMessageBg = this.add.graphics();
    this.retryMessageBg.fillStyle(0x331100, 0.9);
    this.retryMessageBg.fillRoundedRect(350, 280, 300, 50, 10);
    this.retryMessageBg.lineStyle(2, 0xff8800, 0.8);
    this.retryMessageBg.strokeRoundedRect(350, 280, 300, 50, 10);

    // Crear mensaje de texto
    this.retryMessage = this.add
      .text(500, 305, "¡Inténtalo de nuevo!", {
        fontSize: "16px",
        fill: "#ff8800",
        fontFamily: "Courier New",
        stroke: "#331100",
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: "#221100",
          blur: 2,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Animación de aparición
    this.retryMessageBg.setAlpha(0);
    this.retryMessage.setAlpha(0);

    this.tweens.add({
      targets: [this.retryMessageBg, this.retryMessage],
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });

    // Desaparecer después de 2 segundos
    this.time.delayedCall(2000, () => {
      if (this.retryMessage && this.retryMessageBg) {
        this.tweens.add({
          targets: [this.retryMessageBg, this.retryMessage],
          alpha: 0,
          duration: 300,
          ease: "Power2",
          onComplete: () => {
            if (this.retryMessage) this.retryMessage.destroy();
            if (this.retryMessageBg) this.retryMessageBg.destroy();
          },
        });
      }
    });
  }

  createSuccessEffects(selectedButton) {
    // Crear partículas de celebración
    const buttonX = selectedButton.x + 500; // Ajustar posición relativa
    const buttonY = selectedButton.y + 350;

    for (let i = 0; i < 15; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0x00ff88, 0.8);
      particle.fillCircle(0, 0, Math.random() * 3 + 2);
      particle.x = buttonX + (Math.random() - 0.5) * 100;
      particle.y = buttonY + (Math.random() - 0.5) * 30;

      // Animación de las partículas
      this.tweens.add({
        targets: particle,
        y: particle.y - Math.random() * 100 - 50,
        x: particle.x + (Math.random() - 0.5) * 150,
        alpha: { from: 0.8, to: 0 },
        scaleX: { from: 1, to: 0 },
        scaleY: { from: 1, to: 0 },
        duration: Math.random() * 1000 + 1000,
        ease: "Power2",
        onComplete: () => {
          particle.destroy();
        },
      });
    }

    // Efecto de ondas de energía (sin animación de escala)
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 200, () => {
        const energyRing = this.add.graphics();
        energyRing.lineStyle(3, 0x00ff88, 0.7);
        energyRing.strokeCircle(buttonX, buttonY, 20 + i * 15);

        this.tweens.add({
          targets: energyRing,
          alpha: { from: 0.7, to: 0 },
          duration: 800,
          ease: "Power2",
          onComplete: () => {
            energyRing.destroy();
          },
        });
      });
    }

    // Mensaje de éxito en el centro de la pantalla (sin animaciones)
    const successMsg = this.add
      .text(500, 300, "¡EXCELENTE!", {
        fontSize: "28px",
        fill: "#00ff88",
        fontFamily: "Courier New",
        stroke: "#003322",
        strokeThickness: 3,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#003322",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Eliminar el mensaje después de 2 segundos sin animaciones
    this.time.delayedCall(2000, () => {
      if (successMsg) {
        successMsg.destroy();
      }
    });
  }

  showFeedback(isCorrect) {
    let feedbackText;
    let feedbackColor;
    let backgroundColor;

    if (isCorrect) {
      feedbackText =
        "¡Correcto! Los sensores EMG detectan las señales eléctricas\nde los músculos y las convierten en movimientos\nen las prótesis robóticas.";
      feedbackColor = "#00ff88";
      backgroundColor = 0x003322;
    } else {
      feedbackText =
        "Revisa cómo funcionan las interfaces cerebro-máquina\ny su relación con la biomecatrónica.";
      feedbackColor = "#ff8800";
      backgroundColor = 0x332200;
    }

    // Crear fondo semi-transparente para el mensaje en el centro (más grande)
    const feedbackBg = this.add.graphics();
    feedbackBg.fillStyle(backgroundColor, 0.8);
    feedbackBg.fillRoundedRect(250, 250, 500, 120, 15);
    feedbackBg.lineStyle(3, isCorrect ? 0x00ff88 : 0xff8800, 0.9);
    feedbackBg.strokeRoundedRect(250, 250, 500, 120, 15);

    const feedback = this.add
      .text(500, 320, feedbackText, {
        fontSize: "18px", // Aumentado de 14px a 18px
        fill: feedbackColor,
        fontFamily: "Courier New",
        align: "center",
        stroke: "#000000",
        strokeThickness: 2, // Aumentado para mejor contraste
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: isCorrect ? "#003322" : "#332200",
          blur: 3,
          fill: true,
        },
        wordWrap: { width: 480, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    // Cambiar automáticamente a la siguiente escena después de 5 segundos
    this.time.delayedCall(5000, () => {
      this.scene.start("ReparacionDrones");
    });
  }
}

window.DiagnosticoSistemas = DiagnosticoSistemas;
