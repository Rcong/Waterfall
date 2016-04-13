# 瀑布流学习笔记
[传送门 戳这里！！！](http://book.jirengu.com/Rcong/my-practical-code/waterfall/waterfal.html)


## 瀑布流实现原理

瀑布流本身原理不难, 用了最常用的使用绝对定位来计算位置的方法, 这种方式对浏览器兼容性较好. 给定每一个item的宽度, 给一个外层容器, 根据数据拼接字符串然后插入到容器当中, 初始化这些item的样式都是在页面左上角并且opacity为0, 所以此时看不见这些item, 这其中img加载是一个耗时过程, 刚拼接完添加到页面上时img是没有高度的, 这就需要等所有img都加载完再后续计算, 在这个例子中使用了$.when(deferreds)与$.Deferred(),
```
var defereds = [];
$items.each(function() {
    var defer = $.Deferred();//定义一个$.Deferred()对象
    $(this).find('img').on('load', function() {
        defer.resolve();//加载完之后resolve
    });
    defereds.push(defer);
});

var self = this;
$.when.apply(null, defereds).done(function() {
    //do something
});
```
 遍历每一个item, 设置对应的一个$.Deferred()对象, 当这个item中的img加载完之后, 调用$.Deferred()的resolve()方法, 再把该对象存入到一个事先定义的数组中并把该数组对象传入$.when(), 在$.when()上使用链式调用done(), 在回调中调用后续操作的逻辑函数, 当img都加载完了自然会去执行.

 在img都加载之后每个item就有了高度, 此时根据容器的宽度和每一个item的宽度可以确定每一行的item数量, 使用一个数组类型的变量colHeight, 去记录每一行的每一个item的高度, 初始化给定长度为每一行的item数并且都赋值0, 再使用一个index变量初始化为0, 去记录colHeight变量中最小高度的下标值, 然后遍历所有item,
```
$items.each(function() {
    $(this).css({
        top: getMinInt(colHeight),
        left: index * (itemWidth + margin),
        opacity: 1
    });//设置每个item的样式
    colHeight[index] += $(this).height() + margin;//叠加高度
    wrap.css('height', getMaxInt(colHeight));
});
```
设置样式top为colHeight中最小的值, left为index * (每一个item宽度 + item间距), opacity为1, 每设置好一个item就在colHeight中对应的index的位置加上这个item的高度和item间距, 这样就相当于从容器左上角去一个个的布局到每个item所计算出来的位置, 最后布局完item之后再把colHeight中最大值取出设置为瀑布流容器的高度, 至此一个初步的瀑布流就完成了.

此外, 我增加了重新布局和图片懒加载的功能, 响应式设置瀑布流容器的宽度, 监听window的resize事件, 在回调中调用获取所有item并布局的方法, 当页面收缩变化时就会重新计算布局并调整位置, 根据当页面收缩和当前图片浏览完, 而图片的懒加载, 监听window的scroll, 取瀑布流容器的高度和window的scrollTop以及height来做一个比较 当"瀑布流容器的高度 <= window的scrollTop + window的Height" 就说明当前图片已经浏览完, 此时再去加载新的数据并渲染再布局, 以此来达到懒加载的功能, 在这里需要注意的一点是滚动期间每时每刻都去做判断并调用数据这样太耗性能, 在scroll的回调中使用setTimeout做一个延迟
```
var time = null;
time && clearTimeout(time);
time = setTimeout(function() {
    //判断是非需要加载数据的逻辑操作
}, 100);

```
只有当滚动停止了才会去判断是否需要加载新的数据。


## 封装思路

封装采用了
```
var waterfall = (function($){
    return {

    }
})($)
```
的模式


```
waterfall.init($node)
```

```$node```是一个作为瀑布流容器的节点, 因demo依赖于jQuery, 在此是个jQuery对象, 这个对象需要设置class为waterfall.
在这个方法当中把传入的容器对象赋值给一个内部的wrap变量, 然后调用了内部的bind方法.

```
waterfall.bind()
```
这个bind()方法内部进行了resize和scroll两个事件的监听

```
waterfall.render(options)
```
```options```是一个对象, 有data、content、desc三个属性, 三个都是必填项, data是渲染的数据, content是data中图片的字段, desc是data中描述图片的字段。使用时比如
```
waterfall.render({
    data: data,
    content: 'img_url',
    desc: 'name'
});
```
这个方法内部进行了字符串拼接添加到页面的过程, 并监听每一个img是否加载完, 这个具体在上一段落实现原理中有说明, 当加载完之后调用了```waterfall.layout($items)```并传入当前渲染的所有item对象.

```
waterfall.layout($items)
```
这是传入的items是jQuery类数组对象, 布局原理在上一段落实现原理中也有说明, 根据传入的对象进行布局, 之所以在这里把拼接字符串添加到页面和计算布局这个过程拆成render和layout两个方法, 是因为在页面resize的过程中还会调用layout()并传入页面所有item, 所以这里拆开了这整个过程.

```
waterfall.touchBottom(callback)
```
此方法当滚动到当前批次的图片浏览完的位置时就会调用, 传入一个请求数据的回调, 当图片浏览完再去请求数据然后渲染, 以此来实现一个懒加载的方法。


## gulp构建部分

＋ 使用了gulp-rename、gulp-uglify将js压缩并重新以*.min.js的命名方式存放在lib文件夹下
＋ 样式部分使用less编写, 之后使用了gulp-autoprefixer、gulp-less、gulp-minify-css等, 将样式添加前缀, 编译成css后并压缩存放在lib文件夹下
