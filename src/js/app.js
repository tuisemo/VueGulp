define(["jquery", "vue"], function($, Vue) {
    var app = new Vue({
        el: '.wrap',
        created: function() {
            this.movielist();
        },
        data: {
            banners: [{
                imgSrc: 'https://unsplash.it/600/300/?random=' + Math.random(),
                title: Math.random()
            }, {
                imgSrc: 'https://unsplash.it/600/300/?random=' + Math.random(),
                title: Math.random()
            }, {
                imgSrc: 'https://unsplash.it/600/300/?random=' + Math.random(),
                title: Math.random()
            }],
            in_theaters: []
        },
        methods: {
            // 电影-正在热映
            movielist: function() {
                var self = this;
                $.ajax({
                        url: 'https://api.douban.com/v2/movie/in_theaters',
                        type: 'GET',
                        dataType: 'jsonp',
                        data: { count: 6 }
                    })
                    .done(function(data) {
                        $.each(data.subjects, function(index, el) {
                            self.in_theaters.push({
                                id: el.id,
                                alt: el.alt,
                                imgsrc: el.images.medium,
                                title: el.title,
                                year: el.year
                            });
                        });
                    })
                    .fail(function() {
                        console.log("error");
                    });
            }
        }
    });
    // 由于Vue的值绑定会影响css的溢出省略，所以采用过滤器处理
    Vue.filter('ellipsis', function(value) { 
        return value.length > 7 ? value.substring(0, 5) + "..." : value;
    });
})