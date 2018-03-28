/**
 * Player Entity
 */
var change = 'aisha';
game.SpineBoy = me.Spine.Entity.extend({
  init : function() {
    var settings = {
      atlas : 'aisha_atlas',
      imagePath : 'aisha_atlas',
      spineData : 'aisha',
      name : 'aisha'
    };
    this._super(me.Spine.Entity, "init", [320, 0, settings]);
    this.anchorPoint = new me.Vector2d(0.5, 1.0);
    this.updateColRectToAnchorPoint();
    this.skeleton.setSkinByName('default');
    // this.skeleton.setSkinByName('goblingirl');
    this.skeleton.setSlotsToSetupPose();
    this.state.setAnimationByName(0, "run", true);
    // this.state.setAnimationByName(0, "walk", true);
    this.body.setVelocity(5, 10);
    this.body.gravity = 0.01;
    this.z = 2;
    this.jumping = false;
  },

  moveLeft : function() {
    this.skeleton.flipX = false;
    this.body.vel.x -= this.body.accel.x;
  },

  moveRight : function() {
    this.skeleton.flipX = true;
    this.body.vel.x += this.body.accel.x;
  },

  onCollision: function (response, other) {
    return true;
  },

  update : function() {
    if(me.input.isKeyPressed('left')) {
      console.log('[DEBUG] move left.');
      
      this.moveLeft();
    }
    else if(me.input.isKeyPressed('right')) {
      console.log('[DEBUG] move right.');
      
      this.moveRight();
    }
    // else if(me.input.isKeyPressed('move')) {
    //   if(me.input.mouse.pos.x > me.game.viewport.width / 2) {
    //     this.moveRight();
    //   }
    //   else {
    //     this.moveLeft();
    //   }
    // }
    else {
      this.body.vel.x = 0;
    }
    // if(me.input.isKeyPressed('change')) {
    //   this.skeleton.setSkinByName(change);
    //   this.updateChangeSkin();
    //   this.skeleton.setSlotsToSetupPose();
    //   this.state.setAnimationByName(0, "walk", true);
    // }
    this.body.update();

    me.collision.check(this);

    this._super(me.Spine.Entity, "update");
    if(this.body.vel.x !== 0 || this.body.vel.y !== 0) {
      return true;
    }
    else {
      return false;
    }
  },

  // updateChangeSkin : function() {
  //   if(change == 'aisha') {
  //     change = 'aisha';
  //   }
  //   else {
  //     change = 'aisha';
  //   }
  // }
});

game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
    },

    /**
     * update the entity
     */
    update : function (dt) {

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
        
        return true;
    }
});
