;
(function (w, $) {
    /**
     * 轮播图处理模块
     * @constructor
     */
    function Slider(opts) {
        var defaultOpts = {
            slider: null,
            index: 0,
            auto: false,
            node: "ul",
            rank: 1,
            point: true,
            loop: false,
            width: null
        };
        /**
         * 事件处理
         * @type {{MOUSE_START: string, MOUSE_MOVE: string, MOUSE_END: string}}
         */
        this.EVENTS = {
            "MOUSE_START": "touchstart",
            "MOUSE_MOVE": "touchmove",
            "MOUSE_END": "touchend",
            "MOVE_STOP": "movestop"
        };

        /**
         * 记录手势放下的坐标
         * @type {{X: number, Y: number}}
         */
        this.START_POSITION = {
            X: 0,
            Y: 0
        };
        /**
         * 记录手势弹起的坐标
         * @type {{X: number, Y: number}}
         */
        this.END_POSITION = {
            X: 0,
            Y: 0
        };
        /**
         * 每帧运动持续的时间
         * @type {number}
         */
        this.duration = 3000;
        /**
         * 验证是否移动的间距
         * @type {number}
         */
        this.DELTA = {
            X: 0,
            Y: 0
        };
        this.current = 0;
        /**
         * 主要验证是否运动
         * @type {number}
         */
        this.deltaValue = 20;

        this.$win = $(window);

        this.$body = $(document.body);
        /**
         * 存放滚动的节点
         * @type {null}
         */
        this.sliderNode = null;
        this.MOVE_STEP = 320;
        this.total = 0;
        this.timeId = null;
        this.direction = "left";
        this.MAX_WIDTH = 0;
        this.WIN_WIDTH = 0;
        /**
         * 所有轮播图片是否都已完成加载标识
         * @type {boolean}
         */
        this.flag = false;
        /**
         * 参数合并
         */
        this.options = $.extend(defaultOpts, opts);

        this.init();
    }

    /**
     * 初始化
     */
    Slider.prototype.init = function () {
        this.sliderWrap = $(this.options.slider);
        this.WIN_WIDTH = this.options.width ? this.options.width : this.$win.width();
        if (this.sliderWrap.attr("data-size")) {
            /**
             * arraySize格式--["宽度,高度"]
             * @type {number}
             */
            var arraySize = this.sliderWrap.attr("data-size").split(",");
            var sliderWrapHeight = Math.round(arraySize[1] * this.WIN_WIDTH / arraySize[0]);

            this.sliderWrap.css("height", sliderWrapHeight);
        }
        if (this.options.point) {
            this.pointWrap = this.sliderWrap.find(".banner_point");
        }
        this.sliderNode = this.sliderWrap.find(this.options.node);
        this.MOVE_STEP = this.WIN_WIDTH / this.options.rank;
        this.total = this.sliderNode.find("li").size() || 0;
        this.updateSlideCSS();
        this.addEvent();

        this.setPoint();
        if (this.options.auto) {
            this.autoMatic();
        }
    };
    /**
     * 运行
     */
    Slider.prototype.restart = function () {
        if (this.options.auto) {
            this.autoMatic();
        }
    };

    /**
     * 设置轮播图点
     */
    Slider.prototype.setPoint = function () {
        if (this.pointWrap == null) {
            return;
        }
        var item = "";
        if (this.total <= 1) {
            return;
        }
        for (var i = 0; i < this.total; i++) {
            item += '<span></span>';
        }

        this.pointWrap.html(item);
        this.updatePointStatus(this.options.index);
    };
    /**
     * 更新轮播图的点
     */
    Slider.prototype.updatePointStatus = function (index) {
        if (!this.pointWrap) {
            return;
        }
        var points = this.pointWrap.find("span");
        points.removeClass("active");
        points.eq(index).addClass("active");

        points.parent().css({
            "width": this.total *28 + 'px',
            "margin-left": -this.total*28 / 2 + 'px'
        });
    };
    Slider.prototype.autoMatic = function () {
        var self = this;
        /**
         * 首屏加载完成后触发轮播自动滚动事件
         */
        $(window).on("load", function () {
            self.autoMove();
        });
        self.autoMove();
    };
    Slider.prototype.autoMove = function(){
        var self = this;
        if (!self.timeId) {
            self.timeId = window.setInterval(function () {
                self.index = self.current;
                switch (self.direction.toLocaleUpperCase()) {
                    case "LEFT":
                        self.current++;
                        if (self.current > self.total - 1) {
                            self.current = self.total - 1;
                            self.direction = "RIGHT";
                        }
                        break;
                    case "RIGHT":
                        self.current--;
                        if (self.current < 0) {
                            self.current = 0;
                            self.direction = "LEFT";
                        }
                        break;

                    default:
                        break;

                }
                self.move(self.current);
            }, self.duration);
        }
    };
    Slider.prototype.updateSlideCSS = function () {
        this.MAX_WIDTH = this.MOVE_STEP * this.total;
        this.sliderNode.css({
            "width": this.MAX_WIDTH,
            "-webkit-transform": "translate3d(0px, 0px, 0px)",
            "transform": "translate3d(0px, 0px, 0px)",
            "-webkit-transition": "all 0.5s ease",
            "transition": "all 0.5s ease",
            "position": "relative"
        });

        this.sliderNode.find("li").css({
            "width": this.MOVE_STEP
        });
    };
    /**
     * 注册事件
     */
    Slider.prototype.addEvent = function () {
        var self = this;
        this.sliderWrap.bind(this.EVENTS.MOUSE_START, function (evt) {
            self.startHandler(evt);
            self.stop();
        });

        this.sliderWrap.bind(this.EVENTS.MOUSE_MOVE, function (evt) {
            self.moveHandler(evt);
            if (Math.abs(evt.touches[0].pageX - self.START_POSITION.X) / Math.abs(evt.touches[0].pageY - self.START_POSITION.Y) > 1) {
                evt.preventDefault();
            }
        });

        this.sliderWrap.bind(this.EVENTS.MOUSE_END, function (evt) {
            self.endHandler(evt);
            self.restart();
        });

        this.sliderWrap.delegate('span', 'click', function(event) {
            var index = $(this).index();
            self.move(index);
        });

        this.$win.bind("scroll", function () {
            if (self.options.auto) {
                if (self.inviewport(self.sliderWrap)) {
                    self.restart();
                } else {
                    self.stop();
                }
            }
        });
    };
    Slider.prototype.inviewport = function (element) {
        var ele = element;
        if (ele.offset().top + ele.height() < this.$body.scrollTop()) {
            return false;
        } else {
            return true;
        }
    };
    Slider.prototype.startHandler = function (evt) {
        this.START_POSITION.X = evt.touches[0].pageX;
        this.START_POSITION.Y = evt.touches[0].pageY;
    };
    Slider.prototype.moveHandler = function (evt) {
        this.DELTA.X = evt.touches[0].pageX - this.START_POSITION.X;
        this.DELTA.Y = evt.touches[0].pageY - this.START_POSITION.Y;

        if (Math.abs(this.DELTA.Y) < Math.abs(this.DELTA.X)) {
            this.sliderNode.css({
                left: this.DELTA.X - this.current * this.MOVE_STEP,
                "transition": "left 0ms ease;"
            });
        }
    };
    Slider.prototype.endHandler = function () {
        if (Math.abs(this.DELTA.X) >= this.deltaValue) {
            if (this.DELTA.X > 0) {
                this.current--;
            } else {
                this.current++;
            }
            if (this.current < 0) {
                this.current = 0;
            } else if (this.current >= this.total) {
                this.current = this.total - 1;
            }
            this.move(this.current);
        }

        this.DELTA.X = 0;
    };
    /**
     * 移动
     */
    Slider.prototype.move = function (index) {
        var self = this;
        var position = -(index * this.MOVE_STEP);
        if (Math.abs(position) > this.MAX_WIDTH - this.WIN_WIDTH) {
            if (this.MAX_WIDTH < this.WIN_WIDTH) {
                position = 0;
            } else {
                position = this.WIN_WIDTH - this.MAX_WIDTH;
            }
        }
        this.sliderNode.css({
            left: position,
            "transition": "left 500ms ease;"
        });

        if (this.sliderNode.find("img").filter("[lazy-img='jd-app']").length > 0) {
            imageLazyload.reload();
        }

        window.setTimeout(function () {
            self.updatePointStatus(index);
        }, 300);

        $(this).trigger(this.EVENTS.MOVE_STOP, index);
    };
    Slider.prototype.effect = function () {
    };
    /**
     * 停止
     */
    Slider.prototype.stop = function () {
        clearInterval(this.timeId);
        this.timeId = null;
    };
    /**
     * 下一帧
     */
    Slider.prototype.next = function () {

    };
    /**
     * 上一帧
     */
    Slider.prototype.prev = function () {
    };

    if (!(this.Slider instanceof  Slider)) {
        this.Slider = Slider;
    }

    if (!this.slider) {
        this.slider = function (opts) {

            $(".jsSlider").each(function () {
                var thisWidth = $(this).width();
                if ($(this).attr("slider-init-status")) {
                    return;
                }

                var defaultOpts = {
                    slider: this,
                    auto: true,
                    point: true,
                    loop: true,
                    width: thisWidth
                };
                new Slider($.extend(defaultOpts, opts));
                $(this).attr("slider-init-status", true);
            });

            $(".J_brand_slider").each(function () {
                if ($(this).attr("slider-init-status")) {
                    return;
                }

                var defaultOpts = {
                    slider: this,
                    auto: false,
                    rank: 2.5
                };
                new Slider($.extend(defaultOpts, opts));
                $(this).attr("slider-init-status", true);
            });
        };
    }


    $(function () {
        window.slider();
    });
})(this, jQuery);