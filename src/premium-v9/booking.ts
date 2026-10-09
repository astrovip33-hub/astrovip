import { createBooking, loadTakenBookingSlots, track } from './data';

const times = ['10:00','12:00','14:00','16:00','18:00'];
let taken = new Set<string>();

function roToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone:'Europe/Bucharest', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
}
function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate()+days); return d.toISOString().slice(0,10);
}
function key(date: string, time: string) { return `${date}|${time.slice(0,5)}`; }
function status(text: string, tone: 'ok'|'warn'|'error'='ok') {
  const node=document.querySelector<HTMLElement>('#booking-status');
  if(node){node.textContent=text;node.dataset.tone=tone;}
}
function selectedDate() { return String((document.querySelector<HTMLInputElement>('#booking-date'))?.value || ''); }
function selectedTime() { return String((document.querySelector<HTMLInputElement>('input[name="booking_time"]:checked'))?.value || ''); }

function renderTimes() {
  const date=selectedDate();
  const target=document.querySelector<HTMLElement>('#booking-times');
  if(!target)return;
  target.innerHTML=times.map(time=>{
    const busy=taken.has(key(date,time));
    return `<label class="slot${busy?' busy':''}"><input type="radio" name="booking_time" value="${time}" ${busy?'disabled':''} required><span>${time}${busy?' · ocupat':''}</span></label>`;
  }).join('');
}

async function refreshSlots() {
  status('Verific disponibilitatea…','warn');
  try {
    const rows=await loadTakenBookingSlots(roToday(),60);
    taken=new Set(rows.map((row:any)=>key(String(row.booking_date),String(row.booking_time))));
    renderTimes();
    status('Disponibilitatea este actualizată.');
  } catch {
    renderTimes();
    status('Nu am putut actualiza disponibilitatea. Reîncearcă înainte de trimitere.','error');
  }
}

async function boot() {
  const date=document.querySelector<HTMLInputElement>('#booking-date');
  const form=document.querySelector<HTMLFormElement>('#booking-form');
  if(!date||!form)return;
  const today=roToday();
  date.min=today; date.max=addDays(today,60); if(!date.value)date.value=today;
  date.addEventListener('change',renderTimes);
  await refreshSlots();

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const fd=new FormData(form);
    const bookingDate=String(fd.get('booking_date')||'');
    const bookingTime=selectedTime();
    if(!bookingTime){status('Alege o oră disponibilă.','error');return;}
    if(taken.has(key(bookingDate,bookingTime))){status('Acest interval tocmai a fost rezervat. Alege altă oră.','error');await refreshSlots();return;}
    const submit=form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if(submit)submit.disabled=true;
    status('Înregistrez programarea…','warn');
    try{
      const result=await createBooking({
        bookingDate,
        bookingTime,
        name:String(fd.get('name')||'').trim(),
        phone:String(fd.get('phone')||'').trim(),
        service:String(fd.get('service')||''),
        mode:String(fd.get('mode')||''),
        note:String(fd.get('note')||'').trim()
      });
      track('booking_completed',{service:result?.service||fd.get('service'),mode:result?.mode||fd.get('mode'),date:bookingDate,time:bookingTime});
      form.reset();date.value=bookingDate;taken.add(key(bookingDate,bookingTime));renderTimes();
      status(`Programarea pentru ${bookingDate}, ora ${bookingTime}, a fost înregistrată.`, 'ok');
      document.querySelector('#booking-success')?.removeAttribute('hidden');
    }catch(error:any){
      const message=String(error?.message||error||'');
      if(/slot_already_booked|duplicate|23505/i.test(message)){status('Intervalul a fost rezervat între timp. Alege altă oră.','error');await refreshSlots();}
      else status('Programarea nu a putut fi înregistrată. Verifică datele și încearcă din nou.','error');
      track('booking_error',{message:message.slice(0,120)});
    }finally{if(submit)submit.disabled=false;}
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
