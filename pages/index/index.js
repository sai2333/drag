/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-09 14:09:42
 * @LastEditTime: 2019-09-10 11:58:17
 * @LastEditors: Please set LastEditors
 */
let index = 0,
    items = [], 
    flag=true,
    stack = [],
    itemId=1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemList: [],
    stackLength: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    items= this.data.itemList;
  },
  //添加文本
  addText() {
    this.setTarget({
      text: '我是文本我是文本我是文本我是文本',
      top: 10,
      left: 200
    });
  },
  //添加图片
  addImage() {
    this.setTarget({
      url: '/images/1.png',
      top: 10,
      left: 200
    });
  },
  setFlag() {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 100)
    }
  },
  initImageData(res,imgData) {
    let data = {};
    // 初始化数据
    data.width = res.width;//宽度
    data.height = res.height;//高度
    data.image = imgData.url;//地址
    data.id = ++itemId;//id
    data.top = Number(imgData.top) ? Number(imgData.top) : 0;//top定位
    data.left = Number(imgData.left) ? Number(imgData.left) : 0;//left定位
    //圆心坐标
    data.x = data.left + data.width / 2;
    data.y = data.top + data.height/2;
    data.scale = 1;//scale缩放
    data.oScale = 1;//方向缩放
    data.rotate = 0;//旋转角度
    data.active = false;//选中状态
    return data;
  },
  initTextData(){
    let data = {};
    // 初始化数据
    data.width = res.width;//宽度
    data.height = res.height;//高度
    data.id = ++itemId;//id
    data.top = Number(imgData.top) ? Number(imgData.top) : 0;//top定位
    data.left = Number(imgData.left) ? Number(imgData.left) : 0;//left定位
    //圆心坐标
    data.x = data.left + data.width / 2;
    data.y = data.top + data.height/2;
    data.scale = 1;//scale缩放
    data.oScale = 1;//方向缩放
    data.rotate = 0;//旋转角度
    data.active = false;//选中状态
    return data;
  },
  //设置需要拖动对象
  setTarget(obj) { 
    let _this = this;
    if(obj.url){//图片
      wx.getImageInfo({
        src: obj.url,
        success: res => {
          items[items.length] = _this.initImageData(res,obj);
          _this.setData({
            itemList: items
          })
        }
      })
    }else{//文本
      let data = {};
      data.width = 100;
      data.height = 30;
      data.text = obj.text;
      data.id = ++itemId;//id
      data.top = Number(obj.top) ? Number(obj.top) : 0;//top定位
      data.left = Number(obj.left) ? Number(obj.left) : 0;//left定位
      data.x = data.left + data.width / 2;
      data.y = data.top + data.height/2;
      // data.scale = 1;//scale缩放
      // data.oScale = 1;//方向缩放
      data.rotate = 0;//旋转角度
      data.active = false;//选中状态
      items[items.length] = data;
      _this.setData({
        itemList: items
      })
    }
  },
  WraptouchStart: function (e) {
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) { //选中的对象
        index = i;
        items[index].active = true;
        stack.push({
          i: i,
          left: items[i].left,
          top: items[i].top
        })
      }
    }
    this.setData({
      stackLength: true,
      itemList: items
    })
    items[index].lx = e.touches[0].clientX;
    items[index].ly = e.touches[0].clientY;
  },
  WraptouchMove: function(e) {
    this.setFlag();
    items[index]._lx = e.touches[0].clientX;
    items[index]._ly = e.touches[0].clientY;

    items[index].left += items[index]._lx - items[index].lx;
    items[index].top += items[index]._ly - items[index].ly;
    items[index].x += items[index]._lx - items[index].lx;
    items[index].y += items[index]._ly - items[index].ly;

    items[index].lx = e.touches[0].clientX;
    items[index].ly = e.touches[0].clientY;
    this.setData({
      itemList: items
    })
  },
  WraptouchEnd: function (e) {  
    // console.log(e);
  },
  oTouchStart: function (e) {
    //找到点击的那个图片对象，并记录
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) {
        index = i;
        items[index].active = true;
        stack.push({
          i: i,
          _tx: items[index]._tx,
          _ty: items[index]._ty,
          disPtoO: items[index].disPtoO,
          scale: items[index].image ? items[index].scale : 1,
          oScale: items[index].image ? items[index].oScale : 1,
          angleNext: items[index].angleNext,
          new_rotate: items[index].new_rotate,
          rotate: items[index].rotate,
          angle: items[index].angle,
          tx: items[index].tx,
          ty: items[index].ty,
          anglePre: items[index].anglePre
        })
      }
    }
    //获取作为移动前角度的坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    //移动前的角度
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
    //获取图片半径
    items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top);
  },
  oTouchTest: function (e) {
    this.setFlag();
    //记录移动后的位置
    items[index]._tx = e.touches[0].clientX;
    items[index]._ty = e.touches[0].clientY;
    //移动的点到圆心的距离
    items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx , items[index]._ty - 10);

    //移动后位置的角度
    items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
    //角度差
    items[index].new_rotate = items[index].angleNext - items[index].anglePre;

    //叠加的角度差
    items[index].rotate += items[index].new_rotate;
    items[index].angle = items[index].rotate; //赋值

    //用过移动后的坐标赋值为移动前坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)

    //赋值setData渲染
    this.setData({
      itemList: items
    })
  },
  oTouchMove: function (e) {
    this.setFlag();
    //记录移动后的位置
    items[index]._tx = e.touches[0].clientX;
    items[index]._ty = e.touches[0].clientY;
    //移动的点到圆心的距离
    items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx , items[index]._ty - 10)

    if(items[index].image){
      items[index].scale = items[index].image ? (items[index].disPtoO / items[index].r) : 1; 
      items[index].oScale = items[index].image ? (1 / items[index].scale) : 1;
      //移动后位置的角度
      items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
      //角度差
      items[index].new_rotate = items[index].angleNext - items[index].anglePre;

      //叠加的角度差
      items[index].rotate += items[index].new_rotate;
      items[index].angle = items[index].rotate; //赋值

      //用过移动后的坐标赋值为移动前坐标
      items[index].tx = e.touches[0].clientX;
      items[index].ty = e.touches[0].clientY;
      items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
    }else{
      items[index].width = this.getDistance(items[index].x,items[index]._tx);
    }


    //赋值setData渲染
    this.setData({
      itemList: items
    })

  },
  getDistance(cx, pointer_x){
    let distance = pointer_x - cx;
    if(Number(distance) > 24){
      return distance ;
    }
    return 24;
  },
  getDistancs(cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    return Math.sqrt(
      ox * ox + oy * oy
    );
  },
  /*
     *参数1和2为图片圆心坐标
     *参数3和4为手点击的坐标
     *返回值为手点击的坐标到圆心的角度
     */
  countDeg: function (cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    var to = Math.abs(ox / oy);
    var angle = Math.atan(to) / (2 * Math.PI) * 360;
    if (ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系  
    {
      angle = -angle;
    } else if (ox <= 0 && oy >= 0)//左下角,3象限  
    {
      angle = -(180 - angle)
    } else if (ox > 0 && oy < 0)//右上角，1象限  
    {
      angle = angle;
    } else if (ox > 0 && oy > 0)//右下角，2象限  
    {
      angle = 180 - angle;
    }
    return angle;
  },
  deleteItem: function (e) {
    let newList = [];
    for (let i = 0; i < items.length; i++) {
      if (e.currentTarget.dataset.id != items[i].id) {
        newList.push(items[i])
      }
    }
    if (newList.length > 0) {
      newList[newList.length - 1].active = true;
    }
    items = newList;
    this.setData({
      itemList: items
    })
  },
  //撤销
  back: function () {    
    if(stack.length){
      let recordObj = stack.pop();
      let index = recordObj.i;
      for (let key in recordObj) {
        if (recordObj.hasOwnProperty(key)) {
          let element = recordObj[key];
          if(element !== undefined){
            items[index][key] = element;
          }
        }
      }    
      this.setData({
        itemList: items
      })
    }else{
      this.setData({
        stackLength: false
      })
    }
  }
})