function loco(){
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(".main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector(".main").style.transform ? "transform" : "fixed"
});


// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

}

var timeout=0;

function circleMovementPressed(){
  //define default scale value
  var xScale = 1;
  var yScale = 1;

  var xPrev = 0;
  var yPrev = 0;

  window.addEventListener("mousemove",function(dets){

    clearTimeout(timeout);

    xScale = gsap.utils.clamp(.8,1.2, dets.clientX - xPrev);
    yPrev = gsap.utils.clamp(.8,1.2, dets.clientY - yPrev);

    xPrev = dets.clientX;
    yPrev = dets.clientY;

    circleMovement(xScale, yScale);

    timeout = setTimeout(function(){
      document.querySelector(".mini-circle").style.transform = `translate(${dets.x}px , ${dets.y}px) scale(1,1)`;
    }, 100);
  })
}

function circleMovement(xScale, yScale){
  window.addEventListener("mousemove",function(dets){
    document.querySelector(".mini-circle").style.transform = `translate(${dets.x}px , ${dets.y}px) scale(${xScale}, ${yScale})`;
  })
}

function firstPageAnim(){
  var tl = gsap.timeline()
  tl.from(".nav",{
    y:'-10',
    opacity: 0,
    duration:1.5,
    ease: Expo.easeInOut
  })
  .to(".bounding-elem",{
    y:0,
    ease: Expo.easeInOut,
    duration:1.5,
    delay:-1,
    stagger:.2
  })
  .from(".heading-bottom",{
    y:'-10',
    opacity: 0,
    duration:1.5,
    delay:-1,
    ease: Expo.easeInOut
  })
}

document.querySelectorAll(".elem").forEach(function(elem){

  var rotate = 0;
  var diffRot =0;

  elem.addEventListener("mouseleave",function(){
    gsap.to(elem.querySelector("img"),{
      opacity:0,
      ease: Power3,
      duration:.5,
    });
  })

  elem.addEventListener("mousemove",function(dets){
    var diff = dets.clientY - elem.getBoundingClientRect().top;

    diffRot = dets.clientX - rotate;
    rotate = dets.clientX;

    gsap.to(elem.querySelector("img"),{
      opacity:1,
      ease: Power3,
      top: diff,
      left: dets.clientX,
      rotate : gsap.utils.clamp(-20,20, diffRot)
    });
  });
});

circleMovementPressed()
loco()
circleMovement()
firstPageAnim()