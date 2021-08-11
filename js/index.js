//获取dom元素
var arrowEl = document.querySelector("#head .headMain > .arrow");
var liNodes = document.querySelectorAll("#head .headMain > .nav > .list > li");
var upNodes = document.querySelectorAll("#head .headMain > .nav > .list > li .up");
var firstLiNode  = liNodes[0];
var firstUpNode  = firstLiNode.querySelector(".up");
 
var head = document.querySelector("#head") ;
var content = document.querySelector("#content") ;
var cLiNodes = document.querySelectorAll("#content .list > li");
var cList =  document.querySelector("#content .list");

// about
var home2LiNodes = document.querySelectorAll("#content > .list > .about .about2 > li");
var home1LiNodes = document.querySelectorAll("#content > .list > .about .about1 > li");
var home1 = document.querySelector("#content > .list > .about .about1");

// 第三页图片
var imgList=document.querySelectorAll(".about1 .item img")
// 第四页视频
var videoList=document.querySelectorAll(".videoList video")

//同步当前屏的索引   this.index---同步---now   now----不同步---  this.index
var now =0;
var timer = 0;

var paomoTimer1=null
var paomoTimer2=null

var qipaoTimer1=null
var qipaoTimer2=null

var ulMoveTimer=null

var timer3D =null;
var oldIndex = 0;

var autoIndex =0;

var ulMove=0
//内容区

//内容区交互
window.onresize=function(){
    /*
     调整分辨率
        1.没有点击的时候视口只能出现一屏  contentBind();
        2.点击后视口只能出现一屏  在1的基础上对每一屏的偏移量进行重新调整
        3.小箭头的位置也需要头部
    */
    contentBind();
    cList.style.top = -now*(document.documentElement.clientHeight - head.offsetHeight)+"px";
    arrowEl.style.left = liNodes[now].offsetLeft + liNodes[now].offsetWidth/2 - arrowEl.offsetWidth/2+"px";
}
contentBind();
function contentBind(){
    content.style.height = document.documentElement.clientHeight - head.offsetHeight+'px';
    for(var i=0;i<cLiNodes.length;i++){
        cLiNodes[i].style.height = document.documentElement.clientHeight - head.offsetHeight+'px';
    }
}
if(content.addEventListener){
    content.addEventListener("DOMMouseScroll",function(ev){
        ev=ev||event;
        
        //让fn的逻辑在DOMMouseScroll事件被频繁触发的时候只执行一次
        clearTimeout(timer);
        timer = setTimeout(function(){
            fn(ev)
        },200)
        
    });
}

content.onmousewheel=function(ev){
        ev=ev||event;
        clearTimeout(timer);
        timer = setTimeout(function(){
            fn(ev)
        },200)
};
function fn(ev){
    ev=ev||event;
    
    var dir="";
    if(ev.wheelDelta){
        dir = ev.wheelDelta>0?"up":"down";
    }else if(ev.detail){
        dir = ev.wheelDelta<0?"up":"down";
    }
    
    switch (dir){
        case "up":
            if(now>0){
                now--;
                move(now);
            }
            break;
        case "down":
            if(now<cLiNodes.length-1){
                now++;
                move(now);
            }
            break;
    }
}



 
 
//头部交互
headBind();
function headBind(){
    firstUpNode.style.width = "100%";
    arrowEl.style.left = firstLiNode.offsetLeft + firstLiNode.offsetWidth/2 - arrowEl.offsetWidth/2+"px";
    for(var i=0;i<liNodes.length;i++){
        //转绑很重要
        liNodes[i].index = i;
        liNodes[i].onclick=function(){
            //i:liNodes.length 5
            move(this.index);
            now = this.index;
        }
    }
}
            
// 出入场
// 出入场配置数组
var anArr=[
    {//1屏
        inAn:function(){
            var left = document.querySelector("#content > .list > .home .left");
            var right = document.querySelector("#content > .list > .home .right");
            var imgMain = document.querySelector("#content > .list > .home>img");
            console.log("ininin")
            left.classList.remove("out")
            left.classList.add("in")
            imgMain.classList.remove("out")
            imgMain.classList.add("in")
            right.classList.remove("out")
            right.classList.add("in")
        },
        outAn:function(){
            var left = document.querySelector("#content > .list > .home .left");
            var right = document.querySelector("#content > .list > .home .right");
            var imgMain = document.querySelector("#content > .list > .home>img");
            left.classList.remove("in")
            left.classList.add("out")
            imgMain.classList.remove("in")
            imgMain.classList.add("out")
            right.classList.remove("in")
            right.classList.add("out")
        }
    },
    {//2屏
        inAn:function(){
            var liList = document.querySelectorAll("#content  .course>.wrap>.left>.inner>ul>li");
            var img=document.querySelector(".course>.wrap>.right>img")
            for (let i = 0; i < liList.length; i++) {
                liList[i].classList.remove("out")
                liList[i].classList.add("in")

            }
            img.classList.remove("out")
            img.classList.add("in")
            // 开启泡沫动画
            canvasPaomo()
            
        },
        outAn:function(){
            var liList = document.querySelectorAll("#content  .course>.wrap>.left>.inner>ul>li");
            var img=document.querySelector(".course>.wrap>.right>img")
            for (let i = 0; i < liList.length; i++) {
                liList[i].classList.remove("in")
                liList[i].classList.add("out")
            }
            img.classList.remove("in")
            img.classList.add("out")
            // 清除泡沫计时器
            clearInterval(paomoTimer1)
            clearInterval(paomoTimer2)
            
        }
    },
    {//3屏
        inAn:function(){
            var sec = document.querySelector("#content > .list > .about section");
            sec.style.top="0px"
            canvasQipao()
            console.log(imgList[0].src)
            if(imgList[0].src=="http://127.0.0.1:5500/%E5%8A%A8%E6%80%81%E6%A8%A1%E5%8D%A1ym/img/loading.png"){
                for (let i = 0; i < imgList.length; i++) {
                    imgList[i].src= imgList[i].getAttribute("data-src")
                }
            }
            // 开启轮播
            home3D()
        },
        outAn:function(){
            var sec = document.querySelector("#content > .list > .about section");
            sec.style.top="-900px"
            clearInterval(qipaoTimer1)
            clearInterval(qipaoTimer2)
            // 清除轮播定时器
            clearInterval(timer3D)
            // oldIndex = 0;
            // autoIndex =0;
        }
    },
    {//4屏视频播放
        inAn:function(){
            if(!videoList[0].src){
                for (let i = 0; i < videoList.length; i++) {
                    videoList[i].src= videoList[i].getAttribute("data-src")
                }
                videoList[videoList.length-1].addEventListener("canplaythrough",function(){
                    setTimeout(()=>{
                        // alert("视频加载完成！！")
                        vdieoPlayer()
                    },300)
                })
            }
        },
        outAn:function(){
            clearInterval(ulMoveTimer)
        }
    },
]
// 初始化所有屏幕为out状态
anArr.forEach(el=>{
    el.outAn()
})
// 初始化首屏
setTimeout(()=>{
    anArr[0].inAn()
},500)
//动画的核心函数
function move(index){
    for(var i=0;i<upNodes.length;i++){
        //upNodes[i].style.width="0";
        upNodes[i].style.width="";
        anArr[i].outAn()
    }
    upNodes[index].style.width="100%";
    
    arrowEl.style.left = liNodes[index].offsetLeft + liNodes[index].offsetWidth/2 - arrowEl.offsetWidth/2+"px";
    cList.style.top = -index*(document.documentElement.clientHeight - head.offsetHeight)+"px";
    anArr[index].inAn()
}

// canvas 泡沫
function canvasPaomo(){
    var inner=document.querySelector(".course>.wrap>.left")
    var oc = document.querySelector(".course>.wrap>.left>canvas");
    oc.width=inner.clientWidth
    oc.height=inner.clientHeight
    if(oc.getContext){
        var ctx = oc.getContext("2d");
        var arr=[];
        //将数组中的圆绘制到画布上
        paomoTimer1=setInterval(function(){
            ctx.clearRect(0,0,oc.width,oc.height);
            //动画
            for(var i=0;i<arr.length;i++){
                
                if(arr[i].alp<=0){
                    arr.splice(i,1);
                }
                
                arr[i].r++;
                arr[i].alp-=0.01;
            }
            //绘制
            for(var i=0;i<arr.length;i++){
                ctx.save();
                ctx.fillStyle="rgba("+arr[i].red+","+arr[i].green+","+arr[i].blue+","+arr[i].alp+")";
                ctx.beginPath();
                ctx.arc(arr[i].x,arr[i].y,arr[i].r,0,2*Math.PI);
                ctx.fill();
                ctx.restore();
            }
        },1000/60)
        //往arr中注入随机圆的信息
        paomoTimer2=setInterval(function(){
            var x = Math.random()*oc.width;
            var y = Math.random()*oc.height;
            var r =10;
            // var red =   Math.round(Math.random()*255);
            // var green = Math.round(Math.random()*255);
            // var blue =  Math.round(Math.random()*255);
            var alp = 1;
            
            arr.push({
                x:x,
                y:y,
                r:r,
                red:255,
                green:255,
                blue:255,
                alp:alp
            })
        },400)
    }
}
// canvasPaomo()

//canvas 气泡
function canvasQipao(){
    var oc = document.querySelector(".about canvas");
    var inner=document.querySelector(".about")
    oc.width=inner.clientWidth
    oc.height=inner.clientHeight
    if(oc.getContext){
        var ctx = oc.getContext("2d");
        var arr=[];
        
        //将数组中的圆绘制到画布上
        qipaoTimer1= setInterval(function(){
            // console.log(arr)
            ctx.clearRect(0,0,oc.width,oc.height);
            //动画
            for(var i=0;i<arr.length;i++){
                arr[i].deg+=5;
                arr[i].x = arr[i].startX +  Math.sin( arr[i].deg*Math.PI/180 )*arr[i].step*2;
                arr[i].y = arr[i].startY - (arr[i].deg*Math.PI/180)*arr[i].step ;
                
                if(arr[i].y <=50||arr[i].alp<=0){
                    arr.splice(i,1)
                }
            }
            //绘制
            for(var i=0;i<arr.length;i++){
                ctx.save();
                ctx.fillStyle="rgba("+arr[i].red+","+arr[i].green+","+arr[i].blue+","+arr[i].alp+")";
                ctx.beginPath();
                ctx.arc(arr[i].x,arr[i].y,arr[i].r,0,2*Math.PI);
                ctx.fill();
                ctx.restore();
                arr[i].alp-=0.0015
            }
        },1000/60)
        
        
        
        
        
        //往arr中注入随机圆的信息
        qipaoTimer2= setInterval(function(){
            var r =Math.random()*6+5;
            var x = Math.random()*oc.width;
            var y = oc.height - r;
            // var red =   Math.round(Math.random()*255);
            // var green = Math.round(Math.random()*50);
            // var blue =  Math.round(Math.random()*255);
            var alp = 0.6;

            var deg =0;
            var startX = x;
            var startY = y;
            //曲线的运动形式
            var step =Math.random()*20+10;
            // 5, 65, 121
            arr.push({
                x:x,
                y:y,
                r:r,
                red:5,
                green:65,
                blue:121,
                alp:alp,
                deg:deg,
                startX:startX,
                startY:startY,
                step:step
            })
        },100)
    }
}
// canvasQipao()


// photoView()开始
function photoView(){
    var btns=document.querySelectorAll(".cover h1")
    var photoList=document.querySelectorAll(".photoView>.photoWrap>ul>li>img")
    var viewWrap=document.querySelector(".photoView")
    var next=document.querySelector(".photoView .next")
    var pre=document.querySelector(".photoView .pre")
    var close=document.querySelector(".photoView .close")
    var type="gf"
    var count=4
    var photoIndex=0
    // var reader=new FileReader("./img/gf")
    // reader.readAsDataURL(this.files[0]);
    // 	// 监听onload事件
    // 	reader.onload = function() {
    // 		console.log(reader.result,"file");
    // 		// 将读取的结果显示在页面中
    // 		preview.src = reader.result;
    // 	}
    for (let index = 0; index < btns.length; index++) {
        btns[index].onclick=function(){
            photoIndex=0
            switch (index) {
                case 0://gf
                    type="gf"
                    count=4
                    break;
                case 1:
                    type="mg"
                    count=5
                    break;
                case 2:
                    type="lf"
                    count=7
                    break;
                default:
                    type="rc"
                    count=5
                    break;
            }
            viewWrap.style.height="100%"
            viewWrap.style.width="100%"
            photoList[0].setAttribute("src",`./img/${type}/${++photoIndex}.jpg`)
        }
        
    }
    next.onclick=function(e){
        // var e=e|window.event
        // if(e.preventDefault){
        // 	e.preventDefault();
        // 	e.stopPropagation();
        // }else{
        // 	e.returnValue == false;
        // 	e.cancelBubble = true
        // }
        photoIndex++
        if(photoIndex >= count){
            photoIndex=0
        }
        photoList[0].setAttribute("src",`./img/${type}/${photoIndex+1}.jpg`)
        
    }
    pre.onclick=function(e){
        // var e=e|window.event
        // if(e.preventDefault){
        // 	e.preventDefault();
        // 	e.stopPropagation();
        // }else{
        // 	e.returnValue == false;
        // 	r.cancelBubble = true
        // }
        photoIndex--
        if(photoIndex<0){
            photoIndex=count-1
        }
        photoList[0].setAttribute("src",`./img/${type}/${photoIndex+1}.jpg`)
    }
    close.onclick=function(){
        viewWrap.style.height="0px"
        viewWrap.style.width="0px"
    }

}
photoView()

// photoView()结束

//视频播放器开始
ulMove=0
function vdieoPlayer(){
    var videoLi=document.querySelectorAll(".videoList>ul>li")
    var videoList=document.querySelector(".videoList")
    var videoUl=document.querySelector(".videoView>.videoList>ul")
    var videoEl=document.querySelectorAll("video")
    var videoTitles=document.querySelectorAll(".videoShow>ul>li")
    ulMoveTimer=null
    var videoCount=videoLi.length
    var titleNum=0

    // 移动方向
    var key=-1

    // 是否播放中
    var play=0
    reset()
    function pauseALl(num){
        for (let index = 0; index < videoEl.length; index++) {
            if(index!=num){
                videoEl[index].pause()
            }
            
        }
    }
function reset(){
        for (let index = 0; index < videoLi.length; index++) {
            
            videoLi[index].style.height=videoLi[index].clientWidth/620*470+"px"
            videoLi[index].onclick=function(){
                ulMove=-(videoLi[0].clientHeight+10)*(index+1)+videoList.clientHeight
                videoUl.style.marginTop=ulMove+"px"
                videoUl.style.transition=" all 1s"
                pauseALl(index)
                
            }
            videoTitles[index].onclick=function(){
                ulMove=-(videoLi[0].clientHeight+10)*(index+1)+videoList.clientHeight
                videoUl.style.marginTop=ulMove+"px"
                videoUl.style.transition=" all 1s"
                pauseALl(index)
                clearInterval(ulMoveTimer)
                for (let index = 0; index < videoTitles.length; index++) {
                            videoTitles[index].className="leave"
                }
                this.className="come"
            }
            videoEl[index].addEventListener("pause",function(){
                play=0
                console.log("暂停了")
                
            })
            videoEl[index].addEventListener("play",function(){
                pauseALl(index)
                videoUl.style.transition=" all 1s"
                ulMove=-(videoLi[0].clientHeight+10)*(index+1)+videoList.clientHeight
                videoUl.style.marginTop=ulMove+"px"
                play=1
                for (let index = 0; index < videoTitles.length; index++) {
                            videoTitles[index].className="leave"
                }
                videoTitles[index].className="come"
                clearInterval(ulMoveTimer)
            })
        }
}
function move(){
            var ulHeight=-(videoLi[0].getBoundingClientRect().top-videoLi[videoCount-1].getBoundingClientRect().top)+videoLi[0].clientHeight+20
            
            if(-ulMove+videoList.clientHeight<ulHeight){
                clearInterval(ulMoveTimer)
                ulMoveTimer=setInterval(function(){
                    if(!play){
                        if(-ulMove+videoList.clientHeight>=ulHeight){
                        key=1
                    }else if(ulMove>=0){
                        key=-1
                    }
                        titleNum=Math.round(-(ulMove)/(videoLi[0].clientHeight+10))
                        if(titleNum>videoCount-1){
                            titleNum=videoCount-1
                            ulMove=-(videoLi[0].clientHeight+10)*(titleNum+1)+videoList.clientHeight
                        }
                        if(titleNum<0){
                            titleNum=0
                            ulMove=20
                        }
                        for (let index = 0; index < videoTitles.length; index++) {
                            videoTitles[index].className="leave"
                        }
                        videoTitles[titleNum].className="come"
                        
                        ulMove+=2*key
                        videoUl.style.marginTop=ulMove+"px"
                        videoUl.style.transition=""
                    }
                    
                },1000/60)
            }else{
                clearInterval(ulMoveTimer)
            }  
}
move()
videoList.onmouseover =function(){
    clearInterval(ulMoveTimer)
}
videoList.onmouseout=function(){
        move()
    
}
    window.onresize=function(){
        reset()
    }
}
// vdieoPlayer()
//切屏3D效果
 oldIndex = 0;

autoIndex =0;

//变量提升的坑！！！
// home3D();
function home3D(){
    for(var i=0;i<home2LiNodes.length;i++){
        home2LiNodes[i].index = i;
        //注册回调函数(同步)   执行回调函数(异步)
        home2LiNodes[i].onclick=function(){
            clearInterval(timer3D);
            for(var i=0;i<home2LiNodes.length;i++){
                home2LiNodes[i].classList.remove("active");
            }
            this.classList.add("active");
            
            
            //从左往右  当前索引大于上一次索引  rightShow
            if(this.index>oldIndex){
                home1LiNodes[this.index].classList.remove("leftShow");
                home1LiNodes[this.index].classList.remove("leftHide");
                home1LiNodes[this.index].classList.remove("rightHide");
                home1LiNodes[this.index].classList.add("rightShow");
                
                
                home1LiNodes[oldIndex].classList.remove("leftShow");
                home1LiNodes[oldIndex].classList.remove("rightShow");
                home1LiNodes[oldIndex].classList.remove("rightHide");
                home1LiNodes[oldIndex].classList.add("leftHide");
            }
            
            //从右往左  当前索引小于上一次索引 leftShow
            if(this.index<oldIndex){
                home1LiNodes[this.index].classList.remove("rightShow");
                home1LiNodes[this.index].classList.remove("leftHide");
                home1LiNodes[this.index].classList.remove("rightHide");
                home1LiNodes[this.index].classList.add("leftShow");
                
                
                home1LiNodes[oldIndex].classList.remove("leftShow");
                home1LiNodes[oldIndex].classList.remove("rightShow");
                home1LiNodes[oldIndex].classList.remove("leftHide");
                home1LiNodes[oldIndex].classList.add("rightHide");
            }
            
            oldIndex = this.index;
            
            //手动轮播  ---> 自动轮播的同步问题！！
            //手动点完是需要自动轮播的，自动轮播从哪个面开始播？--->手动点的这个面开始自动轮播
            //手动轮播的逻辑必须药告诉自动轮播 我刚刚点了哪一个面
            autoIndex = this.index;
            
            //重新开启自动轮播
            //move();
        }
    }
    


    
    //从左向右自动轮播
    move();
    function move(){
         clearInterval(timer3D);
         //定时器的调用(同步)  定时器回调函数的执行(异步)
         timer3D = setInterval(function(){
                 autoIndex ++;
             
                 //无缝
                 if(autoIndex == home1LiNodes.length ){
                     autoIndex =0;
                 }
             
             
                 for(var i=0;i<home2LiNodes.length;i++){
                    home2LiNodes[i].classList.remove("active");
                }
                home2LiNodes[autoIndex].classList.add("active");
             
                 home1LiNodes[autoIndex].classList.remove("leftShow");
                home1LiNodes[autoIndex].classList.remove("leftHide");
                home1LiNodes[autoIndex].classList.remove("rightHide");
                home1LiNodes[autoIndex].classList.add("rightShow");
                
                
                home1LiNodes[oldIndex].classList.remove("leftShow");
                home1LiNodes[oldIndex].classList.remove("rightShow");
                home1LiNodes[oldIndex].classList.remove("rightHide");
                home1LiNodes[oldIndex].classList.add("leftHide");
             
                 //自动轮播 --> 手动轮播的同步问题！！
                 //自动轮播一直运行...autoIndex一直在加加,自动轮播到一半时有可能触发手动轮播
                 //这个时候自动轮播的逻辑必须要告诉手动轮播  我播到哪一个面上了
                 oldIndex = autoIndex;
                 
         },2000);
    }
    
    
    home1.onmouseenter=function(){
        clearInterval(timer3D);
    }
    
    home1.onmouseleave=function(){
        move();
    }


}