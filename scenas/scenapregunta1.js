class ScenaPregunta1 extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaPregunta1' });
        this.timeLeft = 180; // 3 minutos en segundos
        this.gameStarted = false;
        this.gameWon = false;
        this.completedCircuits = 0;
        this.totalCircuits = 5;
        this.isDragging = false;
        this.draggedObject = null;
        this.circuits = [];
        this.connections = [];
        this.sparks = [];
    }

    preload() {
        // No necesitamos precargar imágenes, crearemos todo con gráficos
    }

    create() {
        // Crear fondo con gradiente
        this.createBackground();
        
        // Título
        this.add.text(this.scale.width/2, 30, '🧠 NEUTRALIZACIÓN DE IA DEFECTUOSA - CYBERA-9', {
            fontSize: '24px',
            fill: '#ff4444',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Subtítulo
        this.add.text(this.scale.width/2, 60, 'Repara los circuitos neuronales arrastrando los cables a sus conexiones correctas', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // Temporizador
        this.timerText = this.add.text(this.scale.width/2, 90, 'Tiempo: 03:00', {
            fontSize: '18px',
            fill: '#ff6b6b',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Progreso
        this.progressText = this.add.text(this.scale.width - 250, 90, 'Cables: 0/5 | Componentes: 0/5', {
            fontSize: '16px',
            fill: '#4CAF50',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });

        // Crear circuitos interactivos
        this.createCircuits();
        
        // Crear panel de componentes
        this.createComponentPanel();
        
        // Iniciar temporizador
        this.startTimer();
        
        // Instrucciones
        this.add.text(50, 120, '🔹 Arrastra los cables de colores a sus conexiones correspondientes', {
            fontSize: '14px',
            fill: '#00ffaa',
            fontFamily: 'Arial, sans-serif'
        });
        
        this.add.text(50, 140, '🔹 Completa todos los circuitos antes de que se agote el tiempo', {
            fontSize: '14px',
            fill: '#00ffaa',
            fontFamily: 'Arial, sans-serif'
        });
    }

    createBackground() {
        // Crear fondo con gradiente oscuro tecnológico
        const graphics = this.add.graphics();
        
        // Gradiente principal
        graphics.fillGradientStyle(0x0a0a0a, 0x0a0a0a, 0x1a1a2e, 0x16213e, 1);
        graphics.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Líneas de circuito de fondo
        graphics.lineStyle(1, 0x333333, 0.3);
        for (let i = 0; i < 20; i++) {
            const x = (this.scale.width / 20) * i;
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.scale.height);
        }
        for (let i = 0; i < 15; i++) {
            const y = (this.scale.height / 15) * i;
            graphics.moveTo(0, y);
            graphics.lineTo(this.scale.width, y);
        }
        graphics.strokePath();
    }

    createCircuits() {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        const colorNames = ['ROJO', 'VERDE', 'AZUL', 'AMARILLO', 'MAGENTA'];
        
        const startY = 180;
        const spacing = (this.scale.height - 300) / 5;
        
        for (let i = 0; i < 5; i++) {
            const y = startY + (i * spacing);
            
            // Crear circuito
            const circuit = {
                id: i,
                color: colors[i],
                colorName: colorNames[i],
                startX: 100,
                startY: y,
                endX: this.scale.width - 200,
                endY: y,
                connected: false,
                cable: null,
                startPoint: null,
                endPoint: null
            };
            
            // Punto de inicio (izquierda)
            circuit.startPoint = this.add.graphics();
            circuit.startPoint.fillStyle(colors[i]);
            circuit.startPoint.lineStyle(2, 0xffffff);
            circuit.startPoint.fillCircle(circuit.startX, circuit.startY, 15);
            circuit.startPoint.strokeCircle(circuit.startX, circuit.startY, 15);
            
            // Punto de destino (derecha)
            circuit.endPoint = this.add.graphics();
            circuit.endPoint.fillStyle(0x333333);
            circuit.endPoint.lineStyle(3, colors[i]);
            circuit.endPoint.fillCircle(circuit.endX, circuit.endY, 15);
            circuit.endPoint.strokeCircle(circuit.endX, circuit.endY, 15);
            
            // Etiqueta del color
            this.add.text(circuit.startX - 80, circuit.startY, colorNames[i], {
                fontSize: '12px',
                fill: '#ffffff',
                fontFamily: 'Arial, sans-serif'
            }).setOrigin(0, 0.5);
            
            // Cable arrastrable visible
            circuit.cable = this.add.graphics();
            circuit.cable.lineStyle(8, colors[i], 1);
            circuit.cable.strokePoints([
                new Phaser.Geom.Point(circuit.startX, circuit.startY),
                new Phaser.Geom.Point(circuit.startX + 80, circuit.startY)
            ]);
            
            // Crear conector visible en el extremo del cable
            circuit.connector = this.add.circle(circuit.startX + 80, circuit.startY, 12, colors[i]);
            circuit.connector.setStrokeStyle(3, 0xffffff);
            circuit.connector.setInteractive({ draggable: true });
            circuit.connector.circuitId = i;
            
            // Texto indicativo
            this.add.text(circuit.startX + 80, circuit.startY - 25, '🔌', {
                fontSize: '16px',
                fill: '#ffffff'
            }).setOrigin(0.5);
            
            // Eventos de arrastre del conector
            circuit.connector.on('dragstart', (pointer, dragX, dragY) => {
                this.isDragging = true;
                this.draggedObject = circuit;
                circuit.connector.setScale(1.2);
                circuit.connector.setAlpha(0.8);
                this.playClickSound();
            });
            
            circuit.connector.on('drag', (pointer, dragX, dragY) => {
                if (this.isDragging && this.draggedObject === circuit) {
                    // Actualizar cable
                    circuit.cable.clear();
                    circuit.cable.lineStyle(8, colors[i], 1);
                    circuit.cable.strokePoints([
                        new Phaser.Geom.Point(circuit.startX, circuit.startY),
                        new Phaser.Geom.Point(dragX, dragY)
                    ]);
                    
                    // Actualizar posición del conector
                    circuit.connector.x = dragX;
                    circuit.connector.y = dragY;
                }
            });
            
            circuit.connector.on('dragend', (pointer) => {
                if (this.isDragging && this.draggedObject === circuit) {
                    this.checkConnection(circuit, pointer.x, pointer.y);
                    circuit.connector.setScale(1);
                    circuit.connector.setAlpha(1);
                    this.isDragging = false;
                    this.draggedObject = null;
                }
            });
            
            // Efectos hover para el conector
            circuit.connector.on('pointerover', () => {
                if (!this.isDragging) {
                    circuit.connector.setScale(1.1);
                }
            });
            
            circuit.connector.on('pointerout', () => {
                if (!this.isDragging) {
                    circuit.connector.setScale(1);
                }
            });
            
            this.circuits.push(circuit);
        }
    }
    
    createComponentPanel() {
        // Panel de componentes en la parte inferior
        const panelY = this.scale.height - 100;
        
        // Fondo del panel
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 0.8);
        panel.lineStyle(2, 0x00ffaa);
        panel.fillRect(20, panelY - 40, this.scale.width - 40, 80);
        panel.strokeRect(20, panelY - 40, this.scale.width - 40, 80);
        
        // Título del panel
        this.add.text(this.scale.width/2, panelY - 30, '🔧 COMPONENTES NEURONALES', {
            fontSize: '14px',
            fill: '#00ffaa',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Crear componentes interactivos
        const components = ['PROCESADOR', 'MEMORIA', 'SENSOR', 'AMPLIFICADOR'];
        const componentColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4];
        
        for (let i = 0; i < components.length; i++) {
            const x = (this.scale.width / 5) * (i + 1);
            
            // Componente
            const component = this.add.graphics();
            component.fillStyle(componentColors[i]);
            component.lineStyle(1, 0xffffff);
            component.fillRect(x - 40, panelY - 20, 80, 40);
            component.strokeRect(x - 40, panelY - 20, 80, 40);
            component.setInteractive(new Phaser.Geom.Rectangle(x - 40, panelY - 20, 80, 40), Phaser.Geom.Rectangle.Contains);
            component.input.draggable = true;
            
            // Texto del componente
            this.add.text(x, panelY, components[i], {
                fontSize: '10px',
                fill: '#000000',
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Funcionalidad de arrastre de componentes
            component.componentType = components[i];
            component.componentId = i;
            
            component.on('dragstart', (pointer) => {
                component.setScale(1.2);
                component.setAlpha(0.7);
                this.playClickSound();
            });
            
            component.on('drag', (pointer, dragX, dragY) => {
                component.x = dragX;
                component.y = dragY;
            });
            
            component.on('dragend', (pointer) => {
                // Verificar si se soltó sobre un circuito
                let droppedOnCircuit = false;
                
                for (let circuit of this.circuits) {
                    const distance = Phaser.Math.Distance.Between(
                        pointer.x, pointer.y, 
                        circuit.endX, circuit.endY
                    );
                    
                    if (distance < 50 && !circuit.hasComponent) {
                        // Agregar componente al circuito
                        circuit.hasComponent = true;
                        circuit.componentType = component.componentType;
                        
                        // Crear indicador visual del componente en el circuito
                        const componentIndicator = this.add.text(
                            circuit.endX + 30, circuit.endY, 
                            `[${component.componentType}]`, {
                            fontSize: '10px',
                            fill: '#00ffaa',
                            fontFamily: 'Arial, sans-serif'
                        });
                        
                        circuit.componentIndicator = componentIndicator;
                         droppedOnCircuit = true;
                         this.playSuccessSound();
                         
                         // Actualizar progreso
                         const circuitsWithComponents = this.circuits.filter(c => c.hasComponent).length;
                         this.progressText.setText(`Cables: ${this.completedCircuits}/5 | Componentes: ${circuitsWithComponents}/5`);
                         
                         // Verificar victoria completa
                         if (this.completedCircuits >= this.totalCircuits && connectedCircuitsWithComponents >= this.totalCircuits) {
                             this.gameWon = true;
                             this.showVictory();
                         }
                         
                         // Ocultar el componente original
                         component.setVisible(false);
                         break;
                    }
                }
                
                if (!droppedOnCircuit) {
                    // Regresar a posición original
                    component.x = x;
                    component.y = panelY;
                    this.playErrorSound();
                }
                
                component.setScale(1);
                component.setAlpha(1);
            });
            
            // Efectos hover
            component.on('pointerover', () => {
                if (component.visible) {
                    component.setScale(1.1);
                }
            });
            
            component.on('pointerout', () => {
                if (component.visible) {
                    component.setScale(1);
                }
            });
        }
    }
    
    checkConnection(circuit, x, y) {
        const distance = Phaser.Math.Distance.Between(x, y, circuit.endX, circuit.endY);
        
        if (distance < 30 && !circuit.connected) {
            // Conexión exitosa
            circuit.connected = true;
            this.completedCircuits++;
            
            // Actualizar cable para conectar completamente
            circuit.cable.clear();
            circuit.cable.lineStyle(8, circuit.color, 1);
            circuit.cable.strokePoints([
                new Phaser.Geom.Point(circuit.startX, circuit.startY),
                new Phaser.Geom.Point(circuit.endX, circuit.endY)
            ]);
            
            // Llenar el punto de destino
            circuit.endPoint.clear();
            circuit.endPoint.fillStyle(circuit.color);
            circuit.endPoint.lineStyle(3, circuit.color);
            circuit.endPoint.fillCircle(circuit.endX, circuit.endY, 15);
            circuit.endPoint.strokeCircle(circuit.endX, circuit.endY, 15);
            
            // Efectos visuales
            this.createSparkEffect(circuit.endX, circuit.endY, circuit.color);
            this.playSuccessSound();
            
            // Actualizar progreso
            const circuitsWithComponents = this.circuits.filter(c => c.hasComponent).length;
            this.progressText.setText(`Cables: ${this.completedCircuits}/5 | Componentes: ${circuitsWithComponents}/5`);
            
            // Verificar victoria (cables conectados + componentes colocados)
            const connectedCircuitsWithComponents = this.circuits.filter(c => c.connected && c.hasComponent).length;
            
            if (this.completedCircuits >= this.totalCircuits && connectedCircuitsWithComponents >= this.totalCircuits) {
                this.gameWon = true;
                this.showVictory();
            } else if (this.completedCircuits >= this.totalCircuits) {
                // Mostrar mensaje de que faltan componentes
                const hintText = this.add.text(this.scale.width/2, this.scale.height/2, 
                    '¡Cables conectados! Ahora arrastra los COMPONENTES\na los circuitos para completar la reparación', {
                    fontSize: '16px',
                    fill: '#ffaa00',
                    fontFamily: 'Arial, sans-serif',
                    align: 'center',
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 10 }
                }).setOrigin(0.5);
                
                this.time.delayedCall(3000, () => {
                    hintText.destroy();
                });
            }
        } else {
            // Conexión fallida - resetear cable y conector
            circuit.cable.clear();
            circuit.cable.lineStyle(8, circuit.color, 1);
            circuit.cable.strokePoints([
                new Phaser.Geom.Point(circuit.startX, circuit.startY),
                new Phaser.Geom.Point(circuit.startX + 80, circuit.startY)
            ]);
            
            // Resetear posición del conector
            circuit.connector.x = circuit.startX + 80;
            circuit.connector.y = circuit.startY;
            
            this.playErrorSound();
        }
    }
    
    createSparkEffect(x, y, color) {
        // Crear efecto de chispas
        for (let i = 0; i < 8; i++) {
            const spark = this.add.circle(x, y, 3, color);
            const angle = (Math.PI * 2 / 8) * i;
            const distance = 50 + Math.random() * 30;
            
            this.tweens.add({
                targets: spark,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0,
                duration: 500 + Math.random() * 300,
                onComplete: () => spark.destroy()
            });
        }
        
        // Texto flotante
        const successText = this.add.text(x, y - 30, '✓ CONECTADO', {
            fontSize: '12px',
            fill: '#00ff00',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: successText,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            onComplete: () => successText.destroy()
        });
    }
    
    playClickSound() {
        // Efecto visual de sonido
        const soundEffect = this.add.circle(100, 100, 20, 0x00ffff, 0.5);
        this.tweens.add({
            targets: soundEffect,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => soundEffect.destroy()
        });
    }
    
    playSuccessSound() {
        // Efecto visual de éxito
        const soundEffect = this.add.circle(this.scale.width/2, 100, 30, 0x00ff00, 0.7);
        this.tweens.add({
            targets: soundEffect,
            scale: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => soundEffect.destroy()
        });
    }
    
    playErrorSound() {
        // Efecto visual de error
        const soundEffect = this.add.circle(this.scale.width/2, 100, 25, 0xff0000, 0.6);
        this.tweens.add({
            targets: soundEffect,
            scale: 2.5,
            alpha: 0,
            duration: 400,
            onComplete: () => soundEffect.destroy()
        });
    }
    
    startTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
    
    updateTimer() {
        if (!this.gameWon) {
            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.timerText.setText(`Tiempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            
            if (this.timeLeft <= 0) {
                this.showGameOver();
            }
        }
    }
    
    showVictory() {
        if (this.timer) {
            this.timer.remove();
        }
        
        // Overlay de victoria
        const overlay = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000000, 0.8);
        
        this.add.text(this.scale.width/2, this.scale.height/2 - 100, '🧠 ¡IA DE CYBERA-9 RESTAURADA!', {
            fontSize: '32px',
            fill: '#00ff88',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width/2, this.scale.height/2 - 40, '✔️ ¡Has restaurado la IA de Cybera-9 y los habitantes pueden\nrecuperar el control de sus sistemas cibernéticos!\n\n🔹 Todos los circuitos neuronales reparados\n🔹 Conexiones biomecatrónicas optimizadas\n🔹 IA procesando señales correctamente', {
            fontSize: '18px',
            fill: '#4CAF50',
            fontFamily: 'Arial, sans-serif',
            align: 'center'
        }).setOrigin(0.5);
        
        // Botón para continuar
        const continueButton = this.add.rectangle(this.scale.width/2, this.scale.height/2 + 80, 200, 50, 0x00ff00)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('ScenaPrincipal');
            })
            .on('pointerover', () => continueButton.setFillStyle(0x00cc00))
            .on('pointerout', () => continueButton.setFillStyle(0x00ff00));
        
        this.add.text(this.scale.width/2, this.scale.height/2 + 80, 'CONTINUAR', {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
    
    showGameOver() {
        if (this.timer) {
            this.timer.remove();
        }
        
        // Overlay de derrota
        const overlay = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000000, 0.8);
        
        this.add.text(this.scale.width/2, this.scale.height/2 - 80, '⚠️ TIEMPO AGOTADO', {
            fontSize: '32px',
            fill: '#ff4444',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width/2, this.scale.height/2 - 20, `La IA defectuosa ha tomado control de Cybera-9\nCircuitos reparados: ${this.completedCircuits}/5`, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            align: 'center'
        }).setOrigin(0.5);
        
        // Botón para reintentar
        const retryButton = this.add.rectangle(this.scale.width/2, this.scale.height/2 + 50, 200, 50, 0xff6b6b)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.restart();
            })
            .on('pointerover', () => retryButton.setFillStyle(0xff5252))
            .on('pointerout', () => retryButton.setFillStyle(0xff6b6b));
        
        this.add.text(this.scale.width/2, this.scale.height/2 + 50, 'REINTENTAR', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
    
    update() {
        // Actualizar efectos visuales si es necesario
    }
}