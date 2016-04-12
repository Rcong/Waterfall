# 瀑布流学习笔记
[在线链接请戳这里！！！](http://book.jirengu.com/Rcong/my-practical-code/waterfall/waterfal.html)


## demo说明
本demo中的瀑布流的实现方式采用通过绝对定位来计算位置,相比另一种float浮动定位,这种方式对浏览器兼容性较好。demo依赖于jQuery,初始化时传入一个jQuery节点,waterfall对象会自动在内部进行绑定和事件监听,然后在外部进行ajax请求数据,调用render方法传入符合格式的数据,就会在页面渲染,在touchBottom函数中传入一个回调函数,当滚动到当前批次的图片浏览完的位置,就会使用懒加载的方式去异步加载图片数据。

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
