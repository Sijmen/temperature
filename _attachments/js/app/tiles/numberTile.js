NumberTile = Class.create(Tile,{
	initialize : function(a_sSelector,a_iNumber){
		this.vInit();
		if(typeof a_iNumber !== "number")
			throw "NumberTile and subclasses must be created with a valid number," + typeof a_iNumber + " given.";
		this.iNumber = a_iNumber;
		this.sPostText = "";
		this.sPreText = "";
		this.sSelector = a_sSelector;
		this.oStyle = {"font-size":"80px","text-align":"center"};
		this.iFadeSpeed = 500;
	},

	vRender : function(){
		$(this.sSelector+" .number").fadeOut(this.iFadeSpeed);
		$(this.sSelector).html('<div class="number" style="display:none">'+this.sPreText+this.iNumber+this.sPostText+'</div>');
		$(this.sSelector+" .number").css(this.oStyle).fadeIn(this.iFadeSpeed);
		return this;
	},

	vUpdate : function(a_iNumber){
		this.vSetNumber(a_iNumber);
		this.vRender();
		return this;
	},
	//style as jquery would use it. I.E. {height:"100px","font-size":"10px"}
	vSetStyle : function(a_oStyle){
		this.oStyle = $.extend(this.oStyle,a_oStyle);
		return this;
	},

	vSetNumber : function(a_iNumber){
		this.iNumber = Math.round(a_iNumber * 10) / 10;
		return this;
	},

	vSetPreText : function(a_sText){
		this.sPreText = a_sText;
		return this;
	},

	vSetPostText : function(a_sText){
		this.sPostText = a_sText;
		return this;
	}

});