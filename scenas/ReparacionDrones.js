class ReparacionDrones extends Phaser.Scene {
  constructor() {
    super({ key: "ReparacionDrones" });
    this.gameState = "question"; // 'question', 'correct', 'incorrect', 'solution'
    this.selectedAnswer = null;
    this.incorrectAnswers = []; // Array para rastrear opciones incorrectas
  }

  preload() {
    // Los botones se crearán usando gráficos de Phaser en lugar de imágenes
  }

  create() {
    // Fondo estilo VSCode Dark Theme
    const bg = this.add.graphics();
    bg.fillStyle(0x1e1e1e); // Color de fondo principal VSCode
    bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Barra lateral simulada VSCode
    const sidebar = this.add.graphics();
    sidebar.fillStyle(0x252526);
    sidebar.fillRect(0, 0, 60, this.cameras.main.height);

    // Iconos de la barra lateral VSCode
    const icons = ["📁", "🔍", "🔧", "⚙️"];
    icons.forEach((icon, index) => {
      this.add
        .text(30, 50 + index * 60, icon, {
          fontSize: "20px",
          fill: "#858585",
        })
        .setOrigin(0.5);
    });

    // Líneas de código decorativas en el fondo
    for (let i = 0; i < 8; i++) {
      const y = 100 + i * 40;
      const lineGraphics = this.add.graphics();
      lineGraphics.lineStyle(1, 0x3c3c3c, 0.3);
      lineGraphics.lineBetween(80, y, this.cameras.main.width - 20, y);
    }

    this.createQuestionInterface();
  }

  createQuestionInterface() {
    // Limpiar pantalla
    this.children.removeAll();

    // Recrear fondo con patrón de circuito
    const graphics = this.add.graphics();
    graphics.fillStyle(0x0f172a); // Azul oscuro profundo
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Patrón de circuito decorativo
    const circuitGraphics = this.add.graphics();
    circuitGraphics.lineStyle(1, 0x1e3a8a, 0.4); // Azul semi-transparente

    // Líneas horizontales del circuito
    for (let i = 0; i < 15; i++) {
      let y = i * 50 + 25;
      circuitGraphics.lineBetween(0, y, this.cameras.main.width, y);
    }

    // Líneas verticales del circuito
    for (let i = 0; i < 20; i++) {
      let x = i * 60 + 30;
      circuitGraphics.lineBetween(x, 0, x, this.cameras.main.height);
    }

    // Nodos del circuito
    const nodeGraphics = this.add.graphics();
    nodeGraphics.fillStyle(0x3b82f6, 0.6); // Azul brillante semi-transparente
    for (let i = 0; i < 50; i++) {
      let x = (i % 10) * 120 + 60;
      let y = Math.floor(i / 10) * 100 + 50;
      nodeGraphics.fillCircle(x, y, 2);
    }

    // Efectos de brillo en algunos nodos
    const glowGraphics = this.add.graphics();
    glowGraphics.fillStyle(0x93c5fd, 0.8);
    for (let i = 0; i < 10; i++) {
      let x = Math.random() * this.cameras.main.width;
      let y = Math.random() * this.cameras.main.height;
      glowGraphics.fillCircle(x, y, 1);
    }

    // Obtener dimensiones de la pantalla para diseño responsivo
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;
    const maxWidth = Math.min(screenWidth - 40, 800); // Máximo 800px de ancho
    const leftMargin = (screenWidth - maxWidth) / 2;

    // Título principal
    this.add
      .text(
        this.cameras.main.centerX,
        30,
        "Restauración del Control en Prótesis Robóticas",
        {
          fontSize: screenWidth < 600 ? "20px" : "24px",
          fontFamily: "Arial, sans-serif",
          fill: "#ffffff",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: maxWidth - 40 },
        }
      )
      .setOrigin(0.5);

    // Subtítulo
    this.add
      .text(
        this.cameras.main.centerX,
        65,
        "🛠 Programar sistema de reconocimiento de señales musculares",
        {
          fontSize: screenWidth < 600 ? "14px" : "16px",
          fontFamily: "Arial, sans-serif",
          fill: "#a8d8ff",
          align: "center",
          wordWrap: { width: maxWidth - 40 },
        }
      )
      .setOrigin(0.5);

    // Layout de dos columnas
    const codeWidth =
      screenWidth < 800 ? screenWidth * 0.9 : screenWidth * 0.45;
    const codeX = screenWidth < 800 ? (screenWidth - codeWidth) / 2 : 20;
    const codeY = 120; // Posición subida

    // Contenedor del código con error (lado izquierdo) - Estilo VSCode
    const codeContainer = this.add.graphics();
    codeContainer.fillStyle(0x1e1e1e); // Fondo oscuro VSCode
    codeContainer.lineStyle(2, 0x3c3c3c); // Borde gris VSCode
    codeContainer.fillRoundedRect(codeX, codeY, codeWidth, 250, 8); // Más largo y esquinas menos redondeadas
    codeContainer.strokeRoundedRect(codeX, codeY, codeWidth, 250, 8);

    // Barra de título VSCode
    const titleBar = this.add.graphics();
    titleBar.fillStyle(0x2d2d30);
    titleBar.fillRoundedRect(codeX, codeY, codeWidth, 30, 8, 8, 0, 0);

    // Título del código estilo VSCode
    this.add.text(codeX + 15, codeY + 8, "🔧 drone_repair.ino", {
      fontSize: "13px",
      fontFamily: 'Consolas, "Courier New", monospace',
      fill: "#cccccc",
      fontStyle: "normal",
    });

    // Indicador de archivo modificado
    this.add
      .graphics()
      .fillStyle(0xff6b6b)
      .fillCircle(codeX + codeWidth - 20, codeY + 15, 4);

    // Código con error
    const errorCode = `int sensorEMG = A0;
int motorProtesis = 9;
void setup() {
  pinMode(motorProtesis, OUTPUT);
}
void loop() {
  int señal = analogRead(sensorEMG);
  if (señal > 500) {
    digitalWrite(motorProtesis, HIGH);
  }
}`;

    // Números de línea VSCode
    const lineNumbers = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    this.add.text(codeX + 10, codeY + 45, lineNumbers, {
      fontSize: screenWidth < 600 ? "10px" : "11px",
      fontFamily: 'Consolas, "Courier New", monospace',
      fill: "#858585",
      lineSpacing: 4,
    });

    // Código con sintaxis highlighting VSCode
    this.add.text(codeX + 45, codeY + 45, errorCode, {
      fontSize: screenWidth < 600 ? "11px" : "12px",
      fontFamily: 'Consolas, "Courier New", monospace',
      fill: "#d4d4d4", // Color de texto VSCode
      lineSpacing: 4,
    });

    // Pregunta - posicionada a la derecha encima de las opciones
    const questionX =
      screenWidth < 800 ? this.cameras.main.centerX : screenWidth * 0.695; // Centrada a la derecha
    this.add
      .text(questionX, 120, "📢 ¿Cuál es el error en este código?", {
        fontSize: screenWidth < 600 ? "16px" : "18px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        fill: "#ffffff",
        fontStyle: "bold",
        align: "center",
        wordWrap: { width: maxWidth - 40 },
      })
      .setOrigin(0.5);

    // Opciones de respuesta
    const options = [
      { text: "(A) Falta definir el sensorEMG como entrada.", correct: false },
      {
        text: "(B) El motor de la prótesis no se apaga después de activarse.",
        correct: true,
      },
      {
        text: "(C) Se necesita un delay() en el código para mayor precisión.",
        correct: false,
      },
      {
        text: "(D) El analogRead() debe reemplazarse con digitalRead().",
        correct: false,
      },
    ];

    this.optionButtons = [];

    // Configuración para layout de dos columnas
    const optionsWidth =
      screenWidth < 800 ? screenWidth * 0.9 : screenWidth * 0.45;
    const optionsX =
      screenWidth < 800 ? (screenWidth - optionsWidth) / 2 : screenWidth * 0.52;
    const buttonWidth = optionsWidth - 20;
    const buttonHeight = screenWidth < 600 ? 40 : 45;
    const startY = screenWidth < 800 ? 480 : 180; // Más bajado
    const buttonSpacing = 8;

    options.forEach((option, index) => {
      const y = startY + index * (buttonHeight + buttonSpacing);
      const buttonX = optionsX + 10;

      // Crear botón usando gráficos (más compacto)
      const button = this.add
        .graphics()
        .fillStyle(0x4a90e2)
        .lineStyle(2, 0x357abd)
        .fillRoundedRect(
          buttonX,
          y - buttonHeight / 2,
          buttonWidth,
          buttonHeight,
          6
        )
        .strokeRoundedRect(
          buttonX,
          y - buttonHeight / 2,
          buttonWidth,
          buttonHeight,
          6
        )
        .setInteractive(
          new Phaser.Geom.Rectangle(
            buttonX,
            y - buttonHeight / 2,
            buttonWidth,
            buttonHeight
          ),
          Phaser.Geom.Rectangle.Contains
        );

      const buttonText = this.add
        .text(buttonX + buttonWidth / 2, y, option.text, {
          fontSize: screenWidth < 600 ? "12px" : "13px", // Reducido el tamaño de fuente
          fontFamily: "Arial, sans-serif",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: buttonWidth - 30 },
        })
        .setOrigin(0.5);

      // Eventos del botón
      button.on("pointerover", () => {
        if (button.input && button.input.enabled) {
          button
            .clear()
            .fillStyle(0x5ba0f2)
            .lineStyle(2, 0x357abd)
            .fillRoundedRect(
              buttonX,
              y - buttonHeight / 2,
              buttonWidth,
              buttonHeight,
              6
            )
            .strokeRoundedRect(
              buttonX,
              y - buttonHeight / 2,
              buttonWidth,
              buttonHeight,
              6
            );
        }
      });
      button.on("pointerout", () => {
        if (button.input && button.input.enabled) {
          button
            .clear()
            .fillStyle(0x4a90e2)
            .lineStyle(2, 0x357abd)
            .fillRoundedRect(
              buttonX,
              y - buttonHeight / 2,
              buttonWidth,
              buttonHeight,
              6
            )
            .strokeRoundedRect(
              buttonX,
              y - buttonHeight / 2,
              buttonWidth,
              buttonHeight,
              6
            );
        }
      });

      button.on("pointerdown", () => {
        if (this.gameState === "question") {
          this.selectAnswer(index, option.correct, button, buttonText, y);
        }
      });

      this.optionButtons.push({ button, text: buttonText, option });
    });
  }

  selectAnswer(index, isCorrect, button, buttonText, y) {
    this.selectedAnswer = index;
    this.gameState = isCorrect ? "correct" : "incorrect";

    // Si es incorrecta, agregar al array de respuestas incorrectas
    if (!isCorrect && !this.incorrectAnswers.includes(index)) {
      this.incorrectAnswers.push(index);
    }

    // Obtener dimensiones responsivas
    const screenWidth = this.cameras.main.width;
    const optionsWidth =
      screenWidth < 800 ? screenWidth * 0.9 : screenWidth * 0.45;
    const optionsX =
      screenWidth < 800 ? (screenWidth - optionsWidth) / 2 : screenWidth * 0.52;
    const buttonWidth = optionsWidth - 20;
    const buttonHeight = screenWidth < 600 ? 40 : 45;
    const startY = screenWidth < 800 ? 480 : 180;
    const buttonSpacing = 8;

    // Actualizar apariencia de todos los botones
    this.optionButtons.forEach((item, i) => {
      const buttonY = startY + i * (buttonHeight + buttonSpacing);
      const buttonX = optionsX + 10;

      if (i === index) {
        // Marcar el botón seleccionado
        const color = isCorrect ? 0x28a745 : 0xdc3545;
        const strokeColor = isCorrect ? 0x1e7e34 : 0xc82333;
        item.button
          .disableInteractive()
          .clear()
          .fillStyle(color)
          .lineStyle(2, strokeColor)
          .fillRoundedRect(
            buttonX,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            6
          )
          .strokeRoundedRect(
            buttonX,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            6
          );
      } else if (this.incorrectAnswers.includes(i)) {
        // Mantener opciones incorrectas anteriores en rojo
        item.button
          .clear()
          .fillStyle(0xdc3545)
          .lineStyle(2, 0xc82333)
          .fillRoundedRect(
            buttonX,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            6
          )
          .strokeRoundedRect(
            buttonX,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            6
          )
          .setAlpha(isCorrect ? 0.7 : 1);
      } else {
        // Mantener otras opciones activas y con su apariencia original
        item.button
          .clear()
          .fillStyle(0x4a90e2)
          .lineStyle(2, 0x357abd)
          .fillRoundedRect(
            buttonX,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            6
          )
          .strokeRoundedRect(
            buttonX,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            6
          )
          .setAlpha(isCorrect ? 0.7 : 1);
      }
    });

    // Mostrar mensaje de resultado
    const resultY = screenWidth < 800 ? 600 : 400;
    if (isCorrect) {
      this.add
        .text(
          this.cameras.main.centerX,
          resultY,
          "✅ ¡Excelente! Has identificado correctamente el problema en el código.",
          {
            fontSize: "18px",
            fontFamily: "Arial, sans-serif",
            fill: "#28a745",
            fontStyle: "bold",
            align: "center",
          }
        )
        .setOrigin(0.5);

      // Botón para ver solución (responsivo)
      const buttonWidth = screenWidth < 600 ? 200 : 240;
      const solutionButton = this.add
        .graphics()
        .fillStyle(0x4a90e2)
        .lineStyle(2, 0x357abd)
        .fillRoundedRect(
          this.cameras.main.centerX - buttonWidth / 2,
          resultY + 25,
          buttonWidth,
          50,
          10
        )
        .strokeRoundedRect(
          this.cameras.main.centerX - buttonWidth / 2,
          resultY + 25,
          buttonWidth,
          50,
          10
        )
        .setInteractive(
          new Phaser.Geom.Rectangle(
            this.cameras.main.centerX - buttonWidth / 2,
            resultY + 25,
            buttonWidth,
            50
          ),
          Phaser.Geom.Rectangle.Contains
        );

      this.add
        .text(
          this.cameras.main.centerX,
          resultY + 50,
          "🔹 Ver Solución Correcta",
          {
            fontSize: screenWidth < 600 ? "14px" : "16px",
            fontFamily: "Arial, sans-serif",
            fill: "#ffffff",
            fontStyle: "bold",
            align: "center",
          }
        )
        .setOrigin(0.5);

      solutionButton.on("pointerover", () => {
        solutionButton
          .clear()
          .fillStyle(0x5ba0f2)
          .lineStyle(2, 0x357abd)
          .fillRoundedRect(
            this.cameras.main.centerX - buttonWidth / 2,
            resultY + 25,
            buttonWidth,
            50,
            10
          )
          .strokeRoundedRect(
            this.cameras.main.centerX - buttonWidth / 2,
            resultY + 25,
            buttonWidth,
            50,
            10
          );
      });
      solutionButton.on("pointerout", () => {
        solutionButton
          .clear()
          .fillStyle(0x4a90e2)
          .lineStyle(2, 0x357abd)
          .fillRoundedRect(
            this.cameras.main.centerX - buttonWidth / 2,
            resultY + 25,
            buttonWidth,
            50,
            10
          )
          .strokeRoundedRect(
            this.cameras.main.centerX - buttonWidth / 2,
            resultY + 25,
            buttonWidth,
            50,
            10
          );
      });
      solutionButton.on("pointerdown", () => this.showSolution());
    } else {
      this.add
        .text(
          this.cameras.main.centerX,
          resultY,
          "❌ Respuesta incorrecta. Revisa el código nuevamente e intenta otra opción.",
          {
            fontSize: "18px",
            fontFamily: "Arial, sans-serif",
            fill: "#dc3545",
            fontStyle: "bold",
            align: "center",
          }
        )
        .setOrigin(0.5);

      // Limpiar mensaje después de 2 segundos y reactivar opciones
      this.time.delayedCall(2000, () => {
        this.children.list.forEach((child) => {
          if (child.y >= resultY) {
            child.destroy();
          }
        });
        // Restaurar gameState para permitir nuevas selecciones
        this.gameState = "question";

        // Mantener todas las opciones incorrectas marcadas en rojo
        this.optionButtons.forEach((item, i) => {
          const buttonY = startY + i * (buttonHeight + buttonSpacing);
          const buttonX = optionsX + 10;

          if (this.incorrectAnswers.includes(i)) {
            // Mantener opciones incorrectas en rojo
            item.button
              .clear()
              .fillStyle(0xdc3545)
              .lineStyle(2, 0xc82333)
              .fillRoundedRect(
                buttonX,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                6
              )
              .strokeRoundedRect(
                buttonX,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                6
              );
          }
        });
      });
    }
  }

  showSolution() {
    this.gameState = "solution";

    // Limpiar pantalla
    this.children.removeAll();

    // Obtener dimensiones responsivas
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;
    const maxWidth = Math.min(screenWidth - 40, 800);
    const leftMargin = (screenWidth - maxWidth) / 2;

    // Recrear fondo con patrón de circuito
    const graphics = this.add.graphics();
    graphics.fillStyle(0x0f172a); // Azul oscuro profundo
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Patrón de circuito decorativo
    const circuitGraphics = this.add.graphics();
    circuitGraphics.lineStyle(1, 0x1e3a8a, 0.4); // Azul semi-transparente

    // Líneas horizontales del circuito
    for (let i = 0; i < 15; i++) {
      let y = i * 50 + 25;
      circuitGraphics.lineBetween(0, y, this.cameras.main.width, y);
    }

    // Líneas verticales del circuito
    for (let i = 0; i < 20; i++) {
      let x = i * 60 + 30;
      circuitGraphics.lineBetween(x, 0, x, this.cameras.main.height);
    }

    // Nodos del circuito
    const nodeGraphics = this.add.graphics();
    nodeGraphics.fillStyle(0x3b82f6, 0.6); // Azul brillante semi-transparente
    for (let i = 0; i < 50; i++) {
      let x = (i % 10) * 120 + 60;
      let y = Math.floor(i / 10) * 100 + 50;
      nodeGraphics.fillCircle(x, y, 2);
    }

    // Efectos de brillo en algunos nodos
    const glowGraphics = this.add.graphics();
    glowGraphics.fillStyle(0x93c5fd, 0.8);
    for (let i = 0; i < 10; i++) {
      let x = Math.random() * this.cameras.main.width;
      let y = Math.random() * this.cameras.main.height;
      glowGraphics.fillCircle(x, y, 1);
    }

    // Título
    this.add
      .text(this.cameras.main.centerX, 30, "🔹 Solución Correcta", {
        fontSize: screenWidth < 600 ? "20px" : "24px",
        fontFamily: "Arial, sans-serif",
        fill: "#28a745",
        fontStyle: "bold",
        align: "center",
        wordWrap: { width: maxWidth - 40 },
      })
      .setOrigin(0.5);

    // Layout de dos columnas para la solución
    const codeWidth =
      screenWidth < 800 ? screenWidth * 0.9 : screenWidth * 0.45;
    const codeX = screenWidth < 800 ? (screenWidth - codeWidth) / 2 : 20;
    const codeY = 60;

    // Contenedor del código corregido (lado izquierdo) - Estilo VSCode
    const codeContainer = this.add.graphics();
    codeContainer.fillStyle(0x1e1e1e); // Fondo oscuro VSCode
    codeContainer.lineStyle(2, 0x22863a); // Borde verde para código correcto
    codeContainer.fillRoundedRect(codeX, codeY, codeWidth, 270, 8);
    codeContainer.strokeRoundedRect(codeX, codeY, codeWidth, 270, 8);

    // Barra de título VSCode para código corregido
    const titleBar = this.add.graphics();
    titleBar.fillStyle(0x2d2d30);
    titleBar.fillRoundedRect(codeX, codeY, codeWidth, 30, 8, 8, 0, 0);

    // Título del código corregido estilo VSCode
    this.add.text(codeX + 15, codeY + 8, "✅ drone_repair_fixed.ino", {
      fontSize: "13px",
      fontFamily: 'Consolas, "Courier New", monospace',
      fill: "#22863a",
      fontStyle: "normal",
    });

    // Indicador de archivo guardado
    this.add
      .graphics()
      .fillStyle(0x22863a)
      .fillCircle(codeX + codeWidth - 20, codeY + 15, 4);

    // Código corregido
    const correctedCode = `int sensorEMG = A0;
int motorProtesis = 9;
void setup() {
  pinMode(motorProtesis, OUTPUT);
}
void loop() {
  int señal = analogRead(sensorEMG);
  if (señal > 500) {
    digitalWrite(motorProtesis, HIGH);
    delay(1000); // Activar por 1 segundo
    digitalWrite(motorProtesis, LOW); // Apagar motor
  }
}`;

    // Números de línea VSCode para código corregido
    const lineNumbersFixed = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14";
    this.add.text(codeX + 10, codeY + 45, lineNumbersFixed, {
      fontSize: screenWidth < 600 ? "10px" : "11px",
      fontFamily: 'Consolas, "Courier New", monospace',
      fill: "#858585",
      lineSpacing: 4,
    });

    // Código corregido con estilo VSCode
    this.add.text(codeX + 45, codeY + 45, correctedCode, {
      fontSize: screenWidth < 600 ? "11px" : "12px",
      fontFamily: 'Consolas, "Courier New", monospace',
      fill: "#d4d4d4",
      lineSpacing: 4,
    });

    // Explicación (lado derecho)
    const explanationWidth =
      screenWidth < 800 ? screenWidth * 0.9 : screenWidth * 0.45;
    const explanationX =
      screenWidth < 800
        ? (screenWidth - explanationWidth) / 2
        : screenWidth * 0.52;
    const explanationY = screenWidth < 800 ? 420 : 80;

    // Contenedor de explicación estilo VSCode
    const explanationContainer = this.add.graphics();
    explanationContainer.fillStyle(0x252526); // Fondo panel VSCode
    explanationContainer.lineStyle(2, 0x3c3c3c);
    explanationContainer.fillRoundedRect(
      explanationX,
      explanationY,
      explanationWidth,
      screenWidth < 600 ? 220 : 270,
      8
    );
    explanationContainer.strokeRoundedRect(
      explanationX,
      explanationY,
      explanationWidth,
      screenWidth < 600 ? 220 : 270,
      8
    );

    // Barra de título para explicación
    const explanationTitleBar = this.add.graphics();
    explanationTitleBar.fillStyle(0x2d2d30);
    explanationTitleBar.fillRoundedRect(
      explanationX,
      explanationY,
      explanationWidth,
      30,
      8,
      8,
      0,
      0
    );

    this.add.text(
      explanationX + 15,
      explanationY + 8,
      "📋 Análisis de Solución",
      {
        fontSize: "13px",
        fontFamily: 'Consolas, "Courier New", monospace',
        fill: "#cccccc",
        fontStyle: "normal",
      }
    );

    this.add.text(
      explanationX + 15,
      explanationY + 45,
      '✔️ "¡Bien hecho! Ahora las prótesis responden correctamente\na las señales musculares."',
      {
        fontSize: screenWidth < 600 ? "14px" : "15px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        fill: "#22863a",
        fontStyle: "bold",
        align: "left",
        wordWrap: { width: explanationWidth - 30 },
      }
    );

    // Explicación técnica
    this.add.text(
      explanationX + 15,
      explanationY + 105,
      "Cambios realizados:\n• Se agregó delay(1000) para activar por 1 segundo\n• Se añadió digitalWrite(LOW) para apagar el motor\n• Esto evita que el motor quede encendido permanentemente",
      {
        fontSize: screenWidth < 600 ? "12px" : "13px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        fill: "#d4d4d4",
        align: "left",
        lineSpacing: 6,
        wordWrap: { width: explanationWidth - 30 },
      }
    );

    // Mensaje interactivo para continuar
    const messageY = screenWidth < 600 ? 500 : screenWidth < 800 ? 550 : 380;

    // Crear texto con animación suave
    const continueMessage = this.add
      .text(this.cameras.main.centerX, messageY, "👆 Da click para seguir", {
        fontSize: screenWidth < 600 ? "18px" : "20px",
        fontFamily: "Arial, sans-serif",
        fill: "#4a90e2",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setAlpha(0.8);

    // Animación de pulsación suave
    this.tweens.add({
      targets: continueMessage,
      scaleX: 1.1,
      scaleY: 1.1,
      alpha: 1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Efecto hover
    continueMessage.on("pointerover", () => {
      continueMessage.setTint(0x5ba0f2);
      this.tweens.killTweensOf(continueMessage);
      this.tweens.add({
        targets: continueMessage,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        ease: "Back.easeOut",
      });
    });

    continueMessage.on("pointerout", () => {
      continueMessage.clearTint();
      this.tweens.killTweensOf(continueMessage);
      this.tweens.add({
        targets: continueMessage,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: "Back.easeOut",
        onComplete: () => {
          // Reiniciar animación de pulsación
          this.tweens.add({
            targets: continueMessage,
            scaleX: 1.1,
            scaleY: 1.1,
            alpha: 1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        },
      });
    });

    // Evento de click
    continueMessage.on("pointerdown", () => {
      // Animación de click
      this.tweens.killTweensOf(continueMessage);
      this.tweens.add({
        targets: continueMessage,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Navegar a la siguiente escena
          this.scene.start("TransicionNivel9");
        },
      });
    });

    // Área clickeable en la sección de solución
    const solutionClickArea = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0
    );
    solutionClickArea.setInteractive();
    solutionClickArea.on("pointerdown", () => {
      this.scene.start("TransicionNivel9");
    });
  }
}

window.ReparacionDrones = ReparacionDrones;
