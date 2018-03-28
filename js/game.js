
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMode: "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        
        // add "#debug" to the URL to enable the debug Panel
        if ( me.game.HASH.debug === true) {
            window.onReady(function() {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V)
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        console.log("[DEBUG] game.resources = ", game.resources);
        
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    /**
     * callback when everything is loaded
     */
    loaded : function () {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());
    
        // register our player entity in the object pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("CoinEntity", game.CoinEntity);
    
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.UP, "jump", true);
    
        // start the game
        me.state.change(me.state.PLAY);
    }
};
