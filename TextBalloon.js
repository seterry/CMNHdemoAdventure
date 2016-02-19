//
// Text Balloon
// CMNH 
//

var TextBalloon = function () {
	// Constructor
	this.dialogColor = "#ffff44";
	this.dialogFont = "18px Arial";
	this.normalColor = "#ff0044";
	this.highlightColor = "#00ff44";
	this.choiceFont = "18px Arial";
	this.balloonColor = 0xffd900;
	this.dialog = ""
	this.choices = [];
	this.arrowPosition = 1;
	this.wordWrapWidth = 200;
};

TextBalloon.prototype.LOWER_LEFT = 1;
TextBalloon.prototype.LOWER_RIGHT = 2;

TextBalloon.prototype.addChoice = function(textChoice) {
	this.choices.push(textChoice);
};

TextBalloon.prototype.addToGame = function(game, graphics, xc, yc) {
	var x = 0;
	var y = 0;
	var textRectangle = new Phaser.Rectangle(x, y, 0, 0);
	
	var dialogText = game.add.text(x, y, this.dialog, { align: "left", wordWrap: "true" });
	dialogText.cssFont = this.dialogFont;
	dialogText.wordWrapWidth = this.wordWrapWidth;
    dialogText.fill = this.dialogColor;
	y += dialogText.height + 5;
	if (dialogText.width > textRectangle.width) textRectangle.width = dialogText.width;
    textRectangle.height = (dialogText.y + dialogText.height) - textRectangle.y;

	var textChoices = [];
	for (var i = 0; i< this.choices.length; i++) {
    	var text = game.add.text(x, y, this.choices[i], { align: "left", wordWrap: "true" });
		text.cssFont = this.choiceFont;
		text.wordWrapWidth = this.wordWrapWidth;
    	text.fill = this.normalColor;
    	text.balloonIndex = i;
	    text.inputEnabled = true;
	    text.events.onInputDown.add(this.down, this);
	    text.events.onInputUp.add(this.up, this);
    	y += text.height + 5;
    	if (text.width > textRectangle.width) textRectangle.width = text.width;
    	textRectangle.height = (text.y + text.height) - textRectangle.y;
    	textChoices.push(text);
    }
    
    // Reposition Based on arrow position
    var deltax = 0;
    var deltay = 0;
    if (this.arrowPosition == TextBalloon.prototype.LOWER_LEFT) {
    	deltax = xc;
    	deltay = yc - textRectangle.height;
    } else if (this.arrowPosition == TextBalloon.prototype.LOWER_RIGHT) {
    	deltax = xc - textRectangle.width;
    	deltay = yc - textRectangle.height;
	}
	
	dialogText.x += deltax;
	dialogText.y += deltay;
	for (var i = 0; i<textChoices.length; i++) {
		textChoices[i].x += deltax;
		textChoices[i].y += deltay;
	}	
	
	textRectangle.x += deltax;
	textRectangle.y += deltay;	
    textRectangle = textRectangle.inflate(10, 10);

	graphics.lineStyle(6, this.balloonColor, 1);    
    graphics.drawRoundedRect(textRectangle.x, textRectangle.y, textRectangle.width, textRectangle.height, 9);
    
	graphics.lineStyle(1, this.balloonColor, 1);  
    graphics.beginFill(this.balloonColor);	  
    if (this.arrowPosition == TextBalloon.prototype.LOWER_LEFT) {
		graphics.moveTo(textRectangle.x, textRectangle.y + textRectangle.height - 10);
		graphics.lineTo(textRectangle.x - 10, textRectangle.y + textRectangle.height + 10);
		graphics.lineTo(textRectangle.x + 10, textRectangle.y + textRectangle.height);    
    } else if (this.arrowPosition == TextBalloon.prototype.LOWER_RIGHT) {
		graphics.moveTo(textRectangle.x + textRectangle.width, textRectangle.y + textRectangle.height - 10);
		graphics.lineTo(textRectangle.x + textRectangle.width + 10, textRectangle.y + textRectangle.height + 10);
		graphics.lineTo(textRectangle.x + textRectangle.width -10, textRectangle.y + textRectangle.height);    
    }
    graphics.endFill();
};

TextBalloon.prototype.down = function(item) {
	item.fill = this.highlightColor;
	this.selectedIndex = item.balloonIndex;
	this.selectedItem = item;
};

TextBalloon.prototype.up = function(item) {
	this.selectedItem.fill = this.normalColor;
	if (this.chosen) {
		this.chosen(this.selectedIndex);
	}
};