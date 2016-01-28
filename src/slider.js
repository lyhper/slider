;(function($){
	'use strict';

	if(!$){
		return console.warn('no jQuery');
	}
	var Slide = function(elem,options){
		// slider container outside ul element
		this.$container = elem;
		this.options = options;
		this.settings = {
			delay:3000
		};
		this.$slideList = elem.find('ul:first');
		this.$slideItems = this.$slideList.find('li');
		this.$next = elem.children('a:first');
		this.$prev = elem.children('a:last');
		this.$navList = elem.find('ol');
		this.$navItems = this.$navList.find('li');
		this.total = this.$slideItems.length;
		this.containerWidth = this.$container.width();
		this.containerHeight = this.$container.height();
		this.slideItemWidth = null;
		this.slideListWidth = null;
		this.interval = null;
		// current slider item's index
		this.currentIndex = 0;
		
	}
	Slide.prototype = {
		run:function(){
			this.init();
			this.startPlay();
		},
		init:function(){
			this.initEvent();
			this.initStyle();
			this.initVariable();
		},
		initEvent:function(){
			var self = this;
			this.$container.on('click',function(event){
				self.click(event);
			})
			this.$container.on('mouseenter',function(){
				self.mouseenter();
			})
			this.$container.on('mouseleave',function(){
				self.mouseleave();
			})
			this.$navList.on('mouseover',function(){
				self.mouseover(event);
			})
		},
		initStyle:function(){
			this.$container.css({
				overflow:'hidden',
				position:'relative',
			})
			this.$slideList.css({
				listStyle:'none',
				width:this.containerWidth*this.total,
				position:'absolute',
				left:0,
				marginTop:0,
				marginBottom:0,
				paddingLeft:0
			});
			this.$slideItems.css({
				width:this.containerWidth,
				float:'left'
			});
			this.$next.css({
				position:'absolute',
				right:0,
				top:this.containerHeight/2,
				display:'none'
			});
			this.$prev.css({
				position:'absolute',
				left:0,
				top:this.containerHeight/2,
				display:'none'
			});
			this.$navList.css({
				position:'absolute',
				listStyle:'none',
				bottom: 0,
				display:'none'
			})
		},
		initVariable:function(){
			this.slideItemWidth = this.$slideItems.eq(0).width();
			this.slideListWidth = this.$slideList.width();
			$.extend(this.settings,this.options);
		},
		// click next or prev button to change slide item
		click:function(event){
			switch(event.target){
				case this.$prev[0]:
					this.prev();
					break;
				case this.$next[0]:
					this.next();
					break;
			}
		},
		// stop autoplay when mouse enter
		mouseenter:function(){
			this.stopPlay();	
			this.toggleBtn(1);
		},
		// start autoplay when mouse leave
		mouseleave:function(){
			this.startPlay();
			this.toggleBtn(0);
		},
		mouseover:function(event){
			var $target = $(event.target);
			
			if($target.prop('tagName') === 'LI'){
				var targetIndex = +($target.text())-1;
				var offset = - (targetIndex - this.currentIndex);
				this.moveItem(offset);
				this.currentIndex = targetIndex;
			}
			
		},
		// display or hide prev/next button
		toggleBtn:function(flag){
			if( flag === 1 ){
				//display button
				this.$prev.show();
				this.$next.show();
				this.$navList.show();
			}else if(flag === 0){
				// hide button
				this.$prev.hide();
				this.$next.hide();
				this.$navList.hide();
			}
		},
		// move slide item
		// move slide item to prev when offset is positive 
		// move slide item to next when offset is negative 
		moveItem:function(offset){
			this.$slideList.stop(true,true);
			var distance = offset*this.slideItemWidth;
			var currentLeft = this.$slideList.position().left;
			this.$slideList.animate({
				left : currentLeft+distance
			});	
		},
		startPlay:function(){
			var self = this;
			//  recursively call setTimeout to simulate setInterval
			this.interval = setTimeout(function(){
				self.next();
				self.startPlay();
			},this.settings.delay);
		},
		stopPlay:function(){
			clearTimeout(this.interval);
		},
		// change to next slide item
		next:function(){
			if(this.currentIndex+1<this.total){
				this.moveItem(-1);
				this.currentIndex++;
			}else{
				this.moveItem(this.total-1);
				this.currentIndex = 0;
			}
		},
		prev:function(){
			if(this.currentIndex-1>-1){
				this.moveItem(1);
				this.currentIndex--;
			}else{
				this.moveItem(-(this.total-1));
				this.currentIndex = this.total-1;
			}
		}

	}

	$.fn.slider = function(options){
		var slide = new Slide(this,options);
		slide.run();
		return this;
	}
})(window.jQuery);