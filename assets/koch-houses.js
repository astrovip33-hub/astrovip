(function(global){
  'use strict';
  const EPS=1e-10;
  const norm=x=>((x%360)+360)%360;
  const rad=d=>d*Math.PI/180;
  const deg=r=>r*180/Math.PI;
  const sind=d=>Math.sin(rad(d));
  const cosd=d=>Math.cos(rad(d));
  const tand=d=>Math.tan(rad(d));
  const asind=x=>deg(Math.asin(Math.max(-1,Math.min(1,x))));
  const atand=x=>deg(Math.atan(x));

  function asc2(x,f,sine,cose){
    let ass=-tand(f)*sine+cose*cosd(x);
    if(Math.abs(ass)<EPS)ass=0;
    let sinx=sind(x);
    if(Math.abs(sinx)<EPS)sinx=0;
    if(sinx===0)ass=ass<0?-EPS:EPS;
    else if(ass===0)ass=sinx<0?-90:90;
    else ass=atand(sinx/ass);
    if(ass<0)ass=180+ass;
    return ass;
  }

  function asc1(x1,f,sine,cose){
    x1=norm(x1);
    const n=Math.floor(x1/90+1);
    let ass;
    if(n===1)ass=asc2(x1,f,sine,cose);
    else if(n===2)ass=180-asc2(180-x1,-f,sine,cose);
    else if(n===3)ass=180+asc2(x1-180,-f,sine,cose);
    else ass=360-asc2(360-x1,f,sine,cose);
    ass=norm(ass);
    if(Math.abs(ass-90)<EPS)ass=90;
    if(Math.abs(ass-180)<EPS)ass=180;
    if(Math.abs(ass-270)<EPS)ass=270;
    if(Math.abs(ass-360)<EPS)ass=0;
    return ass;
  }

  function calculate(date,lat,lon){
    if(!global.Astronomy||typeof Astronomy.SiderealTime!=='function'||typeof Astronomy.e_tilt!=='function'||typeof Astronomy.MakeTime!=='function'){
      throw new Error('Astronomy Engine nu este disponibil.');
    }
    const t=Astronomy.MakeTime(date);
    const eps=Astronomy.e_tilt(t).tobl;
    if(Math.abs(lat)>=90-eps)throw new Error('Sistemul Koch nu este definit la această latitudine polară.');
    const th=norm(Astronomy.SiderealTime(date)*15+lon);
    const sine=sind(eps),cose=cosd(eps),tanfi=tand(lat);
    let mc;
    if(Math.abs(th-90)>EPS&&Math.abs(th-270)>EPS){
      mc=atand(tand(th)/cose);
      if(th>90&&th<=270)mc=norm(mc+180);
    }else mc=Math.abs(th-90)<=EPS?90:270;
    mc=norm(mc);
    const ac=asc1(th+90,lat,sine,cose);
    let sina=sind(mc)*sine/cosd(lat);
    sina=Math.max(-1,Math.min(1,sina));
    const cosa=Math.sqrt(Math.max(0,1-sina*sina));
    const c=atand(tanfi/cosa);
    const ad3=asind(sind(c)*sina)/3;
    const cusps=new Array(13);
    cusps[1]=ac;
    cusps[10]=mc;
    cusps[11]=asc1(th+30-2*ad3,lat,sine,cose);
    cusps[12]=asc1(th+60-ad3,lat,sine,cose);
    cusps[2]=asc1(th+120+ad3,lat,sine,cose);
    cusps[3]=asc1(th+150+2*ad3,lat,sine,cose);
    cusps[4]=norm(cusps[10]+180);
    cusps[5]=norm(cusps[11]+180);
    cusps[6]=norm(cusps[12]+180);
    cusps[7]=norm(cusps[1]+180);
    cusps[8]=norm(cusps[2]+180);
    cusps[9]=norm(cusps[3]+180);
    return {system:'Koch',lat,lon,armc:th,obliquity:eps,asc:ac,mc,cusps};
  }

  function houseOfLongitude(lon,cusps){
    lon=norm(lon);
    for(let h=1;h<=12;h++){
      const next=h===12?1:h+1;
      const span=norm(cusps[next]-cusps[h]);
      const offset=norm(lon-cusps[h]);
      if(offset<span||Math.abs(offset)<1e-9)return h;
    }
    return null;
  }

  global.AstroVipKoch={calculate,houseOfLongitude,norm};
})(window);
