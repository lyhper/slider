;(function($){
	'use strict';

	if(!$){
		return console.warn('no jQuery');
	}
	var Slide = function(elem){
		this.$elem = elem;
		this.$container = elem.find('ul:first');
		this.$slides = this.$container.find('li');
		this.$next = elem.find('#next');
		this.$prev = elem.find('#prev');
		this.total = this.$slides.length;
		this.slideHeight = this.$elem.height();
		this.slideWidth = null;
		this.containerWidth = null;
		this.currentIndex = 0;
		this.interval = null;
	}
	Slide.prototype = {
		run:function(){
			this.init();
		},
		init:function(){
			this.initEvent();
			this.initStyle();
			this.calculate();
			this.startPlay();
		},
		initEvent:function(){
			var self = this;
			self.$elem.on('click',function(event){
				self.click(event);
			})
			self.$elem.on('mouseenter',function(){
				self.mouseenter();
			})
			self.$elem.on('mouseleave',function(){
				self.mouseleave();
			})
		},
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
		mouseenter:function(){
			this.stopPlay();	
			this.toggleBtn(1);
		},
		mouseleave:function(){
			this.startPlay();
			this.toggleBtn(0);
		},
		toggleBtn:function(flag){
			if( flag === 1 ){
				this.$prev.css('visibility','visible');
				this.$next.css('visibility','visible');
			}else if(flag === 0){
				this.$prev.css('visibility','hidden');
				this.$next.css('visibility','hidden');
			}
		},
		calculate:function(){
			this.slideWidth = this.$slides.eq(0).width();
			this.containerWidth = this.$container.width();
		},
		initStyle:function(){
			this.$elem.css({
				overflow:'hidden',
				position:'relative',
			})
			this.$container.css({
				listStyle:'none',
				width:(this.total*100)+'%',
				position:'absolute',
				left:0,
				marginTop:0,
				marginBottom:0,
				paddingLeft:0
			});
			this.$slides.css({
				width:(100/this.total)+'%',
				float:'left'
			});
			this.$next.css({
				position:'absolute',
				right:0,
				top:this.slideHeight/2,
				visibility:'hidden'
			});
			this.$prev.css({
				position:'absolute',
				left:0,
				top:this.slideHeight/2,
				visibility:'hidden'
			});
		},
		moveItem:function(offset){
			var distance = offset*this.slideWidth;
			var currentLeft = this.$container.position().left;
			this.$container.animate({
				left : currentLeft+distance
			});	
		},
		startPlay:function(){
			var self = this;
			this.interval = setInterval(function(){
				self.next();
			},1000);
		},
		stopPlay:function(){
			if(this.interval){
				clearInterval(this.interval);
			}
		},
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

	$.fn.slider = function(){
		var slide = new Slide(this);
		slide.run();
	}
})(window.jQuery);