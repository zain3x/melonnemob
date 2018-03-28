(function() {
  spine.Bone.yDown = true;
  function initAtlas(settings) {
    var atlasText = me.loader.getBinary(settings['atlas']);
    var imagePath = settings.imagePath;
    return new spine.Atlas(atlasText, {
      load: function (page, path, atlas) {
        var texture = me.loader.getImage(imagePath);
        page.image = texture;
        page.width = texture.width;
        page.height = texture.height;
        atlas.updateUVs(page);
      }
    });
  }
  me.Spine = {};
  me.Spine.Entity = me.Entity.extend({
    init : function(x, y, settings) {
      this.debugged = false;
      if(isNullOrUndefined(settings) || isNullOrUndefined(settings['atlas']) || isNullOrUndefined(settings['imagePath']) || isNullOrUndefined(settings['spineData'])) {
        throw "Ensure atlas, imagePath and spineData are specified in the settings hash";
      }
      this.settings = settings;
      this.time = me.timer.getTime();
      this.initSpineObjects(x, y);
      this._super(me.Entity, "init", [x, y, this.settings]);
      this.body.addShape(new me.Rect(0, 0, this.width, this.height));
      this.vertices = Array(8);
    },

    draw : function(renderer) {
      this._super(me.Entity, "draw", [renderer]);
      var drawOrder = this.skeleton.drawOrder;
      for (var i = 0, n = drawOrder.length; i < n; i++) {
        var slot = drawOrder[i];
        var attachment = slot.attachment;
        if (!(attachment instanceof spine.RegionAttachment)) continue;
        attachment.computeVertices(this.skeleton.x, this.skeleton.y, slot.bone, this.vertices);

        var x = this.vertices[2];
        var y = this.vertices[3];

        var w = attachment.rendererObject.width;
        var h = attachment.rendererObject.height;
        var px = attachment.rendererObject.x;
        var py = attachment.rendererObject.y;

        var scaleX = attachment.scaleX;
        var scaleY = attachment.scaleY;
        var angle = -(slot.bone.worldRotation + attachment.rotation) * Math.PI/180;
        if(this.skeleton.flipX) {
          scaleX *= -1;
          angle *= -1;
        }
        if(this.skeleton.flipY) {
          scaleY *= -1;
          angle *= -1;
        }
        renderer.save();
        renderer.translate(x, y);
        renderer.rotate(angle);
        renderer.scale(scaleX, scaleY);

        renderer.drawImage(attachment.rendererObject.page.image, px, py, w, h, 0, 0, w, h);
        renderer.restore();
      }
    },

    initSpineObjects : function(x, y) {
      console.log("[DEBUG] this.settings", this.settings);
      
      var atlas = initAtlas(this.settings);
      console.log("[DEBUG] atlas: ", atlas);
      var skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas));
      var skeletonData = skeletonJson.readSkeletonData(me.loader.getJSON(this.settings['spineData']));
      this.skeleton = new spine.Skeleton(skeletonData);

      this.skeleton.getRootBone().x = x;
      this.skeleton.getRootBone().y = y;
      this.skeleton.updateWorldTransform();

      this.stateData = new spine.AnimationStateData(skeletonData);
      this.state = new spine.AnimationState(this.stateData);
      var initialRect = new me.Rect(x, y, 0, 0);
      var tempRect = new me.Rect(0, 0, 0, 0);
      for(var i = 0; i < atlas.regions.length; i++) {
        var region = atlas.regions[i];
        tempRect.width = region.width;
        tempRect.height = region.height;
        tempRect.x = region.x;
        tempRect.y = region.y;
        initialRect.union(tempRect);
      }
      this.settings.width = initialRect.width;
      this.settings.height = initialRect.height;
    },

    update : function(delta) {
      this._super(me.Entity, "update", [delta]);
      var rootBone = this.skeleton.getRootBone();
      if(rootBone.x !== this.pos.x) {
        rootBone.x = this.pos.x
      }
      if(rootBone.y !== this.pos.y) {
        rootBone.y = this.pos.y
      }
      this.state.update((me.timer.getTime() - this.time) / 1000);
      this.state.apply(this.skeleton);
      this.skeleton.updateWorldTransform();

      this.time = me.timer.getTime();

      return true;
    },

    updateColRectToAnchorPoint : function() {
      var shape = this.body.getShape(0);
      shape.translate(-(this.width * this.anchorPoint.x), -this.height*this.anchorPoint.y);
      this.body.updateBounds();
    }
  });

  var isNullOrUndefined = function(object) {
    return object === null || typeof object === 'undefined';
  }
}).call(this);
