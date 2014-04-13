/*
 * Tile to authenticate to the system
 * Possible options:
 * welcomeText (string):    text to show when user is loged in,
 *                          %name% in this string will be
 *                          replaced by the username
 * logoutButton (boolean):  display a button to logout
 */
LoginTile= Class.create(Tile,{
	initialize : function($super,selector,options) {
		var $this = this;

		$super(selector,options);
		this.options = $.extend(true,{
      welcomeText: 'Welkom %name%',
      logoutButton: true
    },options);
		this.selector = selector;

    $(this.selector).html(
      '<div style="min-height:290px;padding-top:25px;position:relative;margin:0px 25px" id="loginWrapper">'+
      '</div>'
    );

    // check session
    $this.checkSession();

	},
  checkSession : function() {
    var $this = this;
    $.couch.session({
      success: function(data) {
        if (data.userCtx.name) {
          $this.renderWelcomeText(data);
        } else {
          $this.renderLoginForm();
        }
      }
    });
  },
	renderWelcomeText : function(data){
		var $this = this;
    welcomeText =
      $this.options.welcomeText.replace('%name%',data.userCtx.name);
    $(this.selector).find('#loginWrapper').html('<p style="padding:10px;font-size: x-large;color: rgba(255,255,255,0.4)">'+welcomeText+'</p>');

    // logout button?
    if ($this.options.logoutButton) {
      $this.renderLogoutForm();
    }
	},
  renderLoginForm : function() {
    var $this = this;
    $(this.selector).find('#loginWrapper').html(
    '<form id="loginForm" action="/" method="post" role="form">' +
        '<fieldset>' +
          '<div class="form-group">' +
            '<input style="border:0;border-radius:0;" class="form-control" id="user" type="text" name="user" placeholder="Username">' +
          '</div>' +
          '<div class="form-group">' +
            '<input style="border:0;border-radius:0;" class="form-control" id="pw" type="password" name="password" placeholder="Password">' +
          '</div>' +
          '<div class="form-group">' +
            '<button style="position: absolute;bottom: 25px;left: 0px;border-radius: 0;background: rgba(255,255,255,0.4);border: 0;width: 100%;padding: 20px;" id="signin" class="btn btn-primary btn-lg" type="submit">Login</button>' +
          '</div>' +
          '<div class="form-group">' +
            '<div id="error" style="display:none;border-radius:0;border:0;" class="alert alert-danger"></div>' +
          '</div>' +
        '</fieldset>' +
      '</form>'
    );
    $('form#loginForm').submit(function (e) {
      $this.login($('#loginForm #user').val(),$('#loginForm #pw').val());
      e.preventDefault();
    });
  },
	login : function(name, pw) {
    var $this = this;
    $.couch.login({
      name: name,
      password: pw,
      success: function(data) {
        $this.checkSession();
        // @TODO check if we have write acces to this db?

      },
      error: function(status, error, reason) {
        $this.showError('<strong>('+status+')</strong>: '+reason);
      }
    });
  },
  showError : function(error) {
    $("#loginForm #error").hide();
    $("#loginForm #error").fadeIn("slow", function() {});
    $("#loginForm #error").html(error);
  },
  renderLogoutForm : function() {
    var $this = this;
    $(this.selector).find('#loginWrapper').append(
      '<form id="logoutForm" action="/" method="post" role="form">' +
        '<fieldset>' +
          '<div class="form-group">' +
            '<button style="position: absolute;bottom: 25px;left: 0px;border-radius: 0;background: rgba(255,255,255,0.4);border: 0;width: 100%;padding: 20px;" id="logout" class="btn btn-primary btn-lg" type="submit">Logout</button>' +
          '</div>' +
        '</fieldset>' +
      '</form>'
    );
    $('form#logoutForm').submit(function (e) {
      $this.logout();
      e.preventDefault();
    });
  },
  logout : function() {
    var $this = this;
    $.couch.logout({
        success: function(data) {
            $this.renderLoginForm();
        }
    });
  }
});
