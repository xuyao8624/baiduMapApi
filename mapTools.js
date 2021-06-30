class Map {
  constructor(container, option) {
    this.map = new BMapGL.Map(container, { // container为地图容器，传入div的id即可
      coordsType: 5
    }) // coordsType指定输入输出的坐标类型，3为gcj02坐标，5为bd0ll坐标，默认为5。
  }

  init(options) {
    const {
      center,
      zoom,
    } = options

    center && this.centerPoint(center, zoom)
    this.map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放
    this.map.addControl(new BMapGL.ScaleControl()); //比例尺 默认左下方
    this.map.addControl(new BMapGL.MapTypeControl()); //地图类型切换控件 默认右上方
    
  }
  centerPoint(center, zoom) {
    let point = new BMapGL.Point(...center); // 创建点坐标  
    this.map.centerAndZoom(point, zoom); // 初始化地图，设置中心点坐标和地图级别
  }

  // 左键点击地图事件，参数需传入一个回调函数
  clickMap(callBack) {  
    if(callBack instanceof Function) {
      this.map.addEventListener("click", callBack)
    }
  }

  // 右键点击地图事件，参数需传入一个回调函数
  rightClickMap(callBack) {  
    if(callBack instanceof Function) {
      this.map.addEventListener("rightclick", callBack)
    }
  }

  // 左键点击地图标记事件，参数需传入一个回调函数
  clickMaker(marker, callBack) {  
    if(callBack instanceof Function) {
      marker.addEventListener("click", callBack)
    }
  }

  // 右键点击地图标记事件，参数需传入一个回调函数
  rightClickMaker(marker, callBack) {  
    if(callBack instanceof Function) {
      marker.addEventListener("rightclick", callBack)
    }
  }

  // 添加地图标记方法，coordinate为经纬度例如 [116.404, 39.915] 形式，callBack为回调函数
  addMarker(coordinate, leftCallBack, rightCallBack) {  
    let point = new BMapGL.Point(...coordinate);
    let marker = new BMapGL.Marker(point);    
    this.map.addOverlay(marker);
    if(leftCallBack && leftCallBack instanceof Function) {
      this.clickMaker(marker, leftCallBack)
    }
    if(rightCallBack && rightCallBack instanceof Function) {
      this.rightClickMaker(marker, rightCallBack)
    }
  }
  // 清除单个marker
  removeMarker(marker) {
    this.map.removeOverlay(marker)
  }
  // 创建信息窗口，content为窗口字符串内容或者HTMLElement，options为对象{}配置项
  createInfoWindow(content, options) { 
    let infoWindow = new BMapGL.InfoWindow(content, options)
    return infoWindow
  }

  // 打开信息窗口，infoWindow为创建的BMap.InfoWindow，coordinate为经纬度例如 [116.404, 39.915] 形式
  openInfoWindow(infoWindow, coordinate) { 
    let point = new BMapGL.Point(...coordinate);
    this.map.openInfoWindow(infoWindow, point);
  }

  /**
   信息窗口调用例子：
   1.信息窗口配置项
   let InfoWindowOption = {
      width: 200,
      height: 0,
      title: "信息窗口"
    }
   2.创建信息窗口
   let infoWindow = map.createInfoWindow("这是一个信息窗口", InfoWindowOption)
   3.打开信息窗口
   marker.openInfoWindow(infoWindow)
  */

  // 创建文本标注方法，参数说明同信息窗口
  createLabel(content, options, coordinate) {
    let point = new BMapGL.Point(...coordinate);
    let offsetSize = new BMapGL.Size(0, -20);
    options.position = point
    options.offset = offsetSize
    let label = new BMapGL.Label(content, options)
    return label
  }
  /**
   文本标注调用例子：
   1.文本标注配置项
   let labelOptions = {}
   2.创建文本标注
   let label = map.createLabel("这是一个文本标注", labelOptions, markerCoordinate)
   3.打开文本标注
   marker.setLabel(label)
  */

  // 出行路线查询（结果面板）,开始、结束都为中文地点字符串，出行方式为，公交、骑行、步行、不填默认驾车
  // 注意：骑行方式为v3.0所有，需修改引入百度地图链接版本号，但3.0版本驾驶和公交方法有不显示的问题
  queryTravel(start, end, method) {
    let opt = {
      renderOptions: {
        map: this.map,
        panel: "results",
        autoViewport: true
      }
    }
    let travelMethod
    switch (method) {
      case '公交':
        travelMethod = new BMapGL.TransitRoute(this.map, opt);
        break;
      case '骑行':
        travelMethod = new BMapGL.RidingRoute(this.map, opt);
        break;
      case '步行':
        travelMethod = new BMapGL.WalkingRoute(this.map, opt);
        break;
      // 默认'驾车'
      default:
        travelMethod = new BMapGL.DrivingRoute(this.map, opt);
    }
    travelMethod.search(start, end);
  }

  // 本地搜索功能,address为中文字符串地点
  localSearch(address, fn) {
    let local = new BMapGL.LocalSearch(this.map,{
      renderOptions: {
        map: this.map,
        panel: "results",
        selectFirstResult: false
      },
      onSearchComplete(ret) {
        console.log(ret);
        if(fn && fn instanceof Function) {
          fn(ret)
        }
      },
    });
    local.search(address);
  }
}

export default Map