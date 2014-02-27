Class = Rickshaw.Class;
Tile = Class.create();
Tile.prototype = {
	initialize : function(a_sSelector,a_oOptions){
		this.sSelector = a_sSelector;
		this.oOptions = $.extend(true,{
			name:"",
			info_text:"",
			last_updated:""
		},a_oOptions);
		$(this.sSelector).parent().prepend("<h2 class=\"block_title\">"+this.oOptions.name+"</h2>");
		$(this.sSelector).parent().append("<div class=\"info_text\">"+this.oOptions.info_text+"</div>");
		$(this.sSelector).parent().append("<div class=\"last_update\">"+this.oOptions.last_updated+"</div>");
		this.vInit();
	},

	vInit : function(){
		var $this = this;
		$(window).resize(function(){
			if(typeof $this.resizeHandler === "undefined"){
				$this.resizeHandler = setTimeout(function(){$this.vResize();},300);
			}else{
				clearInterval($this.resizeHandler);
				$this.resizeHandler = setTimeout(function(){$this.vResize();},300);
			}

		});
	},

	/**
	* To override.
	*/
	vResize : function(){},

	/**
	* To override
	*/
	vRender : function(){},

	/**
	* To override
	*/
	vUpdate : function(){
		$(this.sSelector +' .last_update').html('Laatste update: '+(new Date()).toLocaleTimeString());
	}
};