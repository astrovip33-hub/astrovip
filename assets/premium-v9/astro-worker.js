let swissPromise;
function swiss(){
  if(!swissPromise) swissPromise=import('/assets/vendor/astrovip-swiss-koch.js');
  return swissPromise;
}

self.onmessage=async event=>{
  const {id,date,time,utcOffset,lat,lon}=event.data||{};
  try{
    if(!date||!time||!/^[-+]\d{2}:\d{2}$/.test(String(utcOffset||''))) throw new Error('Date, time and UTC offset are required.');
    const iso=`${date}T${time}:00${utcOffset}`;
    const moment=new Date(iso);
    if(Number.isNaN(moment.getTime())) throw new Error('Invalid birth date/time.');
    const latitude=Number(lat), longitude=Number(lon);
    if(!Number.isFinite(latitude)||latitude<-90||latitude>90) throw new Error('Latitude must be between -90 and 90.');
    if(!Number.isFinite(longitude)||longitude<-180||longitude>180) throw new Error('Longitude must be between -180 and 180.');
    const engine=await swiss();
    const chart=await engine.calculateSwissChart(moment,latitude,longitude);
    self.postMessage({id,ok:true,chart});
  }catch(error){
    self.postMessage({id,ok:false,error:String(error?.message||error)});
  }
};
