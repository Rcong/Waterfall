var waterfall = (function($) {

    var wrap = null,
        index = 0,
        colHeight = [],
        touchBottomHandler = null;

    function getMinInt(arr) {
        var min = Math.min.apply(Math, arr);
        for (var i = 0, max = arr.length; i < max; i++) {
            if (min === arr[i]) {
                index = i;
            }
        }
        return min;
    }

    function getMaxInt(arr) {
        return Math.max.apply(Math, arr);
    }

    function isTouchBottom() {
        var wrapHeight = parseInt(wrap.css('height').replace('px', '')),
            scrollTop = $(window).scrollTop(),
            windowHeight = $(window).height();
        return wrapHeight <= scrollTop + windowHeight;
    }

    return {
        init: function($wrap) {
            wrap = $wrap;
            this.bind();
        },
        bind: function() {
            var self = this;
            $(window).on('resize', function() {
                self.layout();
            });
            var time = null;
            $(window).on('scroll', function() {
                time && clearTimeout(time);
                time = setTimeout(function() {
                    isTouchBottom() && touchBottomHandler && touchBottomHandler();
                }, 100);
            });
        },
        touchBottom: function(handler) {
            touchBottomHandler = handler;
        },
        render: function(opts) {
            if (opts.data && opts.content && opts.desc) {
                var itemHTML = '',
                    data = opts.data,
                    $items,
                    defereds = []; //创建存储 defered 对象的数组
                for (var i = 0, max = opts.data.length; i < max; i++) {
                    itemHTML += '<div class="item">';
                    itemHTML += '<a href="' + data[i][opts.content] + '">';
                    itemHTML += '<img src="' + data[i][opts.content] + '" width="236">';
                    itemHTML += '</a>';
                    itemHTML += '<p class="description">' + data[i][opts.desc] + '</p>';
                    itemHTML += '</div>';
                }
                $items = $(itemHTML);
                wrap.append($items);

                $items.each(function() {
                    var defer = $.Deferred();
                    $(this).find('img').on('load', function() {
                        defer.resolve();
                    });
                    defereds.push(defer);
                });

                var self = this;
                $.when.apply(null, defereds).done(function() {
                    self.layout($items);
                });
            }
        },
        layout: function($items) {
            //如果没有$items传入则是页面所有item全部重新布局
            if (!$items) {
                $items = $('.item');
                colHeight = [];
            }
            var itemWidth = $items.outerWidth(true);
            var colNum = parseInt(wrap.width() / itemWidth);
            var margin = (wrap.width() - itemWidth * colNum) / (colNum - 1);

            if (colHeight.length === 0) {
                for (var i = 0; i < colNum; i++) {
                    colHeight.push(0);
                }
            }

            $items.each(function() {
                $(this).css({
                    top: getMinInt(colHeight),
                    left: index * (itemWidth + margin),
                    opacity: 1
                });
                colHeight[index] += $(this).height() + margin;
                wrap.css('height', getMaxInt(colHeight));
            });
        }
    }
})($)
