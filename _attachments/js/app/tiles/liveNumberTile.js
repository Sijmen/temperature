LiveNumberTile = Class.create(NumberTile,{
	initialize : function($super,a_sSelector, a_oDataProvider){
		var $this = this;
		this.vInit();
		this.oDataProvider = a_oDataProvider;
		this.sSelector = a_sSelector;
		//defaults
		this.sPostText = "";
		this.sPreText = "";
		this.oStyle = {"font-size":"80px","text-align":"center","width":"100%"};
		this.iFadeSpeed = 500;
		this.oDataProvider.vRegisterNewNumbers(function(a_iValue){
			$this.vUpdate(a_iValue);
		});
	},
});