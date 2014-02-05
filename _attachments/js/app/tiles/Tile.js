Class = Rickshaw.Class;
Tile = Class.create();
Tile.prototype = {
	initizalize : function(){
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
	vUpdate : function(){}
};