NumberTile = Class.create(Tile,{
	initialize : function($super,a_sSelector,a_iNumber,a_oOptions){
		oOptions = $.extend(true,{precision:1},a_oOptions);
		$super(a_sSelector,oOptions);
		this.vInit();
		if(typeof a_iNumber !== "number")
			throw "NumberTile and subclasses must be created with a valid number," + typeof a_iNumber + " given.";
		this.vSetNumber(a_iNumber);
		this.sPostText = "";
		this.sPreText = "";
		this.sSelector = a_sSelector;
		this.oStyle = {"font-size":"80px","text-align":"center"};
		this.iFadeSpeed = 500;
		this.bRendered = false;
	},

	vRender : function(){
		// $(this.sSelector+" .number").fadeOut(this.iFadeSpeed);
		if(this.bRendered){
			return this;
		}
		$(this.sSelector).html(
			'<div class="number" style="display:none">'+this.sGetDisplayText()+'</div><input class="animate_number" style="display:none" value="'+this.iNumber+'"/>');
		$(this.sSelector+" .number").css(this.oStyle).fadeIn(this.iFadeSpeed);
		this.bRendered = true;
		return this;
	},

	sGetDisplayText : function(){
		return this.sPreText+this.iNumber+this.sPostText;
	},

	vUpdate : function(a_iNumber){
		var $this = this;
		this.vSetNumber(a_iNumber);
		if(!this.bRendered){
			this.vRender();
			return this;
		}
		$(this.sSelector+' .animate_number').animate({value:a_iNumber},{
			duration: 1000,
			easing: 'swing',
			progress: function (a_oAnimation, a_iProgress, a_remainingMs) {
				value = this.value;
				if(typeof value === "string"){
					value = parseFloat(value);
				}
				value = parseFloat(value.toFixed($this.oOptions.precision));
				$(this).val(value).trigger('change');
				$this.vSetNumber(this.value);
				$($this.sSelector + ' .number').html($this.sGetDisplayText());
			},
			done: function(a_oAnimation,a_bJumpedToEnd){
				$(this).val(value).trigger('change');
				$this.vSetNumber(this.value);
				$($this.sSelector + ' .number').html($this.sGetDisplayText());
			}
		});
		// this.vRender();
		return this;
	},
	//style as jquery would use it. I.E. {height:"100px","font-size":"10px"}
	vSetStyle : function(a_oStyle){
		this.oStyle = $.extend(this.oStyle,a_oStyle);
		return this;
	},

	vSetNumber : function(a_iNumber){
		if(typeof a_iNumber === "string")
			a_iNumber = parseFloat(a_iNumber);
		this.iNumber = parseFloat(a_iNumber.toFixed(this.oOptions.precision));
		// this.iNumber = Math.round(a_iNumber * 10) / 10;
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