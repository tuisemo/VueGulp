define(["jquery","app"], function($) {
    var slide = function() {
        this.count = 0;
        this.run = false;
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
            self.baseWidth = $(self.banner).width();
            $(self.bannerUL).width(self.bannerLI.length * 100 + '%');
            $(self.bannerLI).width((1 / self.bannerLI.length * 100) + '%');

        },
        timmer: function() {
            var self = this;
            var timmer = setInterval(function() {
                if (!self.run) {
                    self.count++;
                    $(self.bannerUL).animate({
                        left: -self.count * 100 + '%'
                    }, 1000, 'swing');
                    if (self.count >= self.bannerLI.length - 1) {
                        self.count = self.bannerLI.length - 1;
                        self.run = true;
                    }
                } else {
                    self.count--;
                    $(self.bannerUL).animate({
                        left: -self.count * 100 + '%'
                    }, 1000, 'swing');
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