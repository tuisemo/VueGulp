define(["zepto"], function($) {
    var slide = function() {
        this.count = 0;
        this.run = false;
        // this.banner = document.getElementsByClassName('banner')[0];
        // this.bannerUL = this.banner.getElementsByTagName('ul')[0];
        // this.bannerLI = this.bannerUL.getElementsByTagName('li');
        this.banner = $('.banner')[0];
        this.bannerUL = $('.banner ul')[0];
        this.bannerLI = $('.banner li');
        this.init();
    };
    slide.prototype = {
        init: function() {
            this.makebanner();
            this.timmer();
        },
        makebanner: function() {
            var self = this;
            // self.baseWidth = self.banner.offsetWidth;
            // self.bannerUL.style.width = self.baseWidth * self.bannerLI.length + 'px';
            // self.bannerUL.style.width = self.baseWidth * self.bannerLI.length + 'px';
            self.baseWidth = $(self.banner).width();
            $(self.bannerUL).width(self.baseWidth);

        },
        timmer: function() {
            var self = this;

            /*var timmer = setInterval(function(time) {
            	console.log(time);
                if (!self.run) {
                    self.count++;
                    self.bannerUL.style.transform = 'translate(' + -self.baseWidth * self.count + 'px)';
                    if (self.count >= self.bannerLI.length - 1) {
                        self.count = self.bannerLI.length - 1;
                        self.run = true;
                    }
                } else {
                    self.count--;
                    self.bannerUL.style.transform = 'translate(' + -self.baseWidth * self.count + 'px)';
                    if (self.count<=0) {
                    	self.count=0;
                    	self.run=false;
                    }
                }
            }, 2000);*/

            var timmer = setInterval(function(time) {
                if (!self.run) {
                    self.count++;
                    self.bannerUL.animate({
                        translate: -self.baseWidth * self.count
                    }, 2000);
                    if (self.count >= self.bannerLI.length - 1) {
                        self.count = self.bannerLI.length - 1;
                        self.run = true;
                    }
                } else {
                    self.count--;
                    self.bannerUL.style.transform = 'translate(' + -self.baseWidth * self.count + 'px)';
                    if (self.count <= 0) {
                        self.count = 0;
                        self.run = false;
                    }
                }
            }, 2000);
        }
    };

    window.slide = new slide();
});