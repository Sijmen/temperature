LiveNumberTile = Class.create(NumberTile,{
	initialize : function($super,a_sSelector, observable,options){
		var $this = this;
		$super(a_sSelector,0,options);
		this.vInit();
		this.sSelector = a_sSelector;
		//defaults
		this.sPostText = "";
		this.sPreText = "";
		this.oStyle = {"font-size":"80px","text-align":"center","width":"100%"};
		this.iFadeSpeed = 500;
		this.disposable = observable.subscribe(function(value){
			$this.vUpdate(value);
		});
	},
});