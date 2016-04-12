# 瀑布流学习笔记
[在线链接请戳这里！！！](http://book.jirengu.com/Rcong/my-practical-code/waterfall/waterfal.html)


## demo说明
本demo中的瀑布流的实现方式采用通过绝对定位来计算位置, 相比另一种float浮动定位, 这种方式对浏览器兼容性较好. demo依赖于jQuery, 初始化时传入一个jQuery节点, waterfall对象会自动在内部进行绑定和事件监听, 然后在外部进行ajax请求数据, 调用render方法传入符合格式的数据, 就会在页面渲染, 在touchBottom函数中传入一个回调函数, 当滚动到当前批次的图片浏览完的位置, 就会使用懒加载的方式去异步加载图片数据.

## 瀑布流实现原理
瀑布流本身原理不难, 应用了最常用的使用绝对定位来计算位置的方法. 给定每一个item的宽度, 给一个外层容器, 根据数据拼接字符串然后插入到容器当中, 初始化这些item的样式都是在页面左上角并且opacity为0, 所以此时看不见这些item, 这其中img加载是一个耗时过程, 刚拼接完添加到页面上时img是没有高度的, 这就需要等所有img都加载完再后续计算, 在这个例子中使用了$.when(deferreds)与$.Deferred(),
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

根据当页面收缩和当前图片浏览完, 我对应的增加了重新布局和图片懒加载


## 相关API

```
waterfall.init($node)
```
```$node```是一个作为瀑布流容器的节点, 因demo依赖于jQuery,在此是个jQuery对象。


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

```
waterfall.touchBottom(callback)
```
此方法当滚动到当前批次的图片浏览完的位置时就会调用,传入一个请求数据的回调, 当图片浏览完再去请求数据然后渲染, 以此来实现一个懒加载的方法。
