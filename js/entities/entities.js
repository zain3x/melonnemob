/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
    
    /**
     * constructor
     */
    init : function (x, y, settings) {
      // call the constructor
      this._super(me.Entity, 'init', [x, y, settings]);
  
      // set the default horizontal & vertical speed (accel vector)
      this.body.setVelocity(4, 9);
      this.body.gravity = 0.4;
      this.body.oneJump = false;
  
      // set the display to follow our position on both axis
      me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
  
      // ensure the player is updated even when outside of the viewport
      this.alwaysUpdate = true;
  
      // define a basic walking animation (using all frames)
      this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);
  
      // define a standing animation (using the first frame)
      this.renderable.addAnimation("stand",  [0]);
  
      // set the standing animation as default
      this.renderable.setCurrentAnimation("stand");
    },
  
    /*
     * update the player pos
     */
    update : function (dt) {
      if (me.input.isKeyPressed('left')) {
        // flip the sprite on horizontal axis
        this.renderable.flipX(true);
  
        // update the entity velocity
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
  
        // change to the walking animation
        if (!this.renderable.isCurrentAnimation("walk")) {
          this.renderable.setCurrentAnimation("walk");
        }
      }
      else if (me.input.isKeyPressed('right')) {
        // unflip the sprite
        this.renderable.flipX(false);
  
        // update the entity velocity
        this.body.vel.x += this.body.accel.x * me.timer.tick;
  
        // change to the walking animation
        if (!this.renderable.isCurrentAnimation("walk")) {
          this.renderable.setCurrentAnimation("walk");
        }
      }
      else {
        this.body.vel.x = 0;
  
        // change to the standing animation
        this.renderable.setCurrentAnimation("stand");
      }
  
      if (me.input.isKeyPressed('jump')) {
        // make sure we are not already jumping or falling
        if ((!this.body.jumping || this.body.oneJump) && !this.body.falling) {
          // set current vel to the maximum defined value
          // gravity will then do the rest
          this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
  
          // set the jumping flag
          this.body.jumping = true;
          if (this.body.oneJump) this.body.oneJump = false;
          else this.body.oneJump = true;
        }
      }
  
      // apply physics to the body (this moves the entity)
      this.body.update(dt);
  
      // handle collisions against other shapes
      me.collision.check(this);
  
      // return true if we moved or if the renderable was updated
      return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
  
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
      // Make all other objects solid
      this.body.oneJump = false;
      return true;
    }
});

/**
 * a Coin entity
 */
game.CoinEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);

  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected

    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // remove it
    me.game.world.removeChild(this);

    return false
  }
});