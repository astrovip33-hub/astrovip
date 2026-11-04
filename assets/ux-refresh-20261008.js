(() => {
  'use strict';
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('hamb');
  const close = menu?.querySelector('.av-pro-menu-close');
  const backdrop = document.querySelector('.av-pro-backdrop');
  const picker = document.querySelector('.av-language-picker');
  const language = document.documentElement.lang.split('-')[0];
  const labels = {
    ro: ['Deschide meniul', 'Închide meniul'], en: ['Open menu', 'Close menu'],
    es: ['Abrir menú', 'Cerrar menú'], it: ['Apri menu', 'Chiudi menu'],
    zh: ['打开菜单', '关闭菜单'], ar: ['افتح القائمة', 'أغلق القائمة'], ru: ['Открыть меню', 'Закрыть меню']
  }[language] || ['Open menu', 'Close menu'];

  const installPremiumMenuGroups = () => {
    if (!menu || menu.dataset.avAccordionReady === '1') return;
    menu.dataset.avAccordionReady = '1';

    const style = document.createElement('style');
    style.id = 'av-menu-accordion-chat-clean-20261009';
    style.textContent = `
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group{display:block!important;width:100%!important;margin:0!important;border:0!important;background:transparent!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary{position:relative!important;justify-content:space-between!important;gap:14px!important;cursor:pointer!important;list-style:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary::-webkit-details-marker,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary::-webkit-details-marker{display:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary::after,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary::after{content:'+'!important;display:grid!important;place-items:center!important;flex:0 0 28px!important;width:28px!important;height:28px!important;margin-left:auto!important;border:1px solid rgba(106,198,93,.45)!important;border-radius:8px!important;background:rgba(106,198,93,.06)!important;color:#6ac65d!important;text-shadow:0 0 6px rgba(106,198,93,.2)!important;box-shadow:none!important;font:800 20px/1 Arial,sans-serif!important;transform:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group[open]>summary::after,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-more[open]>summary::after{content:'−'!important;color:#d36a6a!important;border-color:rgba(211,106,106,.45)!important;background:rgba(211,106,106,.06)!important;text-shadow:0 0 6px rgba(211,106,106,.2)!important;box-shadow:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links{display:grid!important;grid-template-columns:1fr!important;gap:2px!important;width:100%!important;margin:2px 0 7px!important;padding:7px 9px!important;border:1px solid rgba(227,189,97,.13)!important;border-radius:12px!important;background:#0d1610!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group:not([open]) .av-menu-group-links{display:none!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a{display:flex!important;align-items:center!important;min-height:42px!important;padding:9px 10px!important;border-radius:9px!important;color:#d8dfda!important;font-size:14px!important;font-weight:600!important;line-height:1.35!important;text-decoration:none!important;white-space:normal!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a:hover,
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a:focus-visible{background:#17241b!important;color:#f8f3e8!important}
      html body.av-ux-refresh header.top nav#menu.menu .av-menu-group-links a:first-child{color:#e3bd61!important;font-weight:700!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot,
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot:hover,
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot:focus{width:auto!important;min-width:0!important;max-width:none!important;min-height:44px!important;height:44px!important;padding:8px 7px!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;background-image:none!important;box-shadow:none!important;filter:none!important;transform:none!important;color:#f8f3e8!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot::before,
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot::after{content:none!important;display:none!important;border:0!important;box-shadow:none!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot .avchat-launcher-label{color:#f8f3e8!important;font-size:12px!important;font-weight:800!important;letter-spacing:.06em!important}
      html body.av-ux-refresh:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot .avchat-launcher-dot{flex:0 0 8px!important;width:8px!important;height:8px!important;background:#39ff14!important;box-shadow:0 0 8px rgba(57,255,20,.72)!important}
      @media(max-width:820px){
        html body.av-ux-refresh header.top nav#menu.menu{padding:14px!important}
        html body.av-ux-refresh header.top nav#menu.menu .av-menu-group>summary,
        html body.av-ux-refresh header.top nav#menu.menu .av-menu-more>summary{min-height:48px!important;padding:10px 11px!important}
        html body.av-ux-refresh:not(.guide-page) header.top .nav-actions button.avchat-launcher.avchat-header-slot{min-height:40px!important;height:40px!important;padding:7px 5px!important}
        html body.av-ux-refresh:not(.guide-page) header.top .nav-actions .avchat-launcher.avchat-header-slot .avchat-launcher-label{font-size:11px!important}
      }
    `;
    document.head.appendChild(style);

    let numerologyAnchor = [...menu.children].find(el => el.matches?.('a[href="/numerologie/"]'));
    if (!numerologyAnchor) {
      numerologyAnchor = document.createElement('a');
      numerologyAnchor.href = '/numerologie/';
      numerologyAnchor.textContent = 'Numerologie';
      const instrumenteAnchor = [...menu.children].find(el => el.matches?.('a[href="/instrumente-astrologie/"]'));
      menu.insertBefore(numerologyAnchor, instrumenteAnchor || menu.querySelector('.av-menu-more') || null);
    }

    const groups = [
      {
        selector: 'a[href="#servicii"]',
        title: 'Servicii',
        links: [
          ['Toate serviciile', '#servicii'], ['Oferte și tarife', '#oferte'],
          ['Hartă natală', '/harta-natala/'], ['Previziuni & Timing', '/astrologie-predictiva/'],
          ['Dragoste & Sinastrie', '/sinastrie/'], ['Relocare & Local Space', '/astrocartografie-local-space/']
        ]
      },
      {
        selector: 'a[href="/astrologie/"]',
        title: 'Astrologie',
        links: [
          ['Astrologie — ghid principal', '/astrologie/'], ['Arce Solare', '/arce-solare/'],
          ['Tranzite astrologice', '/tranzite-astrologice/'], ['Progresii secundare', '/progresii-secundare/'],
          ['Puncte Mijlocii', '/puncte-mijlocii/'], ['Astrologie Orară', '/astrologie-orara/']
        ]
      },
      {
        selector: 'a[href="/numerologie/"]',
        title: 'Numerologie',
        links: [
          ['Numerologie — ghid principal', '/numerologie/'],
          ['Calculator numerologie', '/calculator-numerologie/'],
          ['Numerologie după data nașterii', '/numerologie-data-nasterii/'],
          ['Calea vieții', '/calea-vietii/'],
          ['Numărul destinului', '/numarul-destinului/'],
          ['Numerologia numelui', '/numerologia-numelui/'],
          ['Numărul expresiei', '/numarul-expresiei/'],
          ['Numărul sufletului', '/numarul-sufletului/'],
          ['Vibrația numelui', '/vibratia-numelui/'],
          ['Anul personal', '/an-personal/'],
          ['Compatibilitate numerologică', '/compatibilitate-numerologica/'],
          ['Matrice numerologică', '/matrice-numerologica/'],
          ['Numere maestru', '/numere-maestru/'],
          ['Numerologia casei', '/numerologia-casei/'],
          ['Numerologie tantrică', '/numerologie-tantrica/']
        ]
      },
      {
        selector: 'a[href="/instrumente-astrologie/"]',
        title: 'Instrumente',
        links: [
          ['Toate instrumentele', '/instrumente-astrologie/'], ['Calculator Ascendent', '/calculator-ascendent/'],
          ['Pozițiile planetelor live', '/pozitii-planete-live/'], ['Ore planetare', '/ore-planetare/'],
          ['Efemeride astrologice', '/efemeride-astrologice/'], ['Harta mea', '/harta-mea/'],
          ['Calculator numerologie', '/calculator-numerologie/']
        ]
      },
      {
        selector: 'a[href="/studii-de-caz/"]',
        title: 'Studii de caz',
        links: [
          ["Toate studiile de caz","/studii-de-caz/"],
          ["31.01.1906 · Ecuador–Colombia","/studii-de-caz/cutremure/ecuador-colombia-1906/"],
          ["11.11.1922 · Atacama, Chile","/studii-de-caz/cutremure/atacama-chile-1922/"],
          ["03.02.1923 · Kamchatka, Rusia","/studii-de-caz/cutremure/kamchatka-rusia-1923/"],
          ["04.03.1933 · Franklin D. Roosevelt","/studii-de-caz/presedinti/franklin-d-roosevelt-inaugurare-1933/"],
          ["01.02.1938 · Marea Banda","/studii-de-caz/cutremure/banda-sea-1938/"],
          ["12.04.1945 · Harry S. Truman","/studii-de-caz/presedinti/harry-truman-presedinte-1945/"],
          ["01.04.1946 · Unimak Island, Alaska","/studii-de-caz/cutremure/unimak-alaska-1946/"],
          ["04.06.1946 · Juan Perón","/studii-de-caz/presedinti/juan-peron-investitura-1946/"],
          ["15.08.1950 · Assam–Tibet","/studii-de-caz/cutremure/assam-tibet-1950/"],
          ["04.11.1952 · Kamchatka, Rusia","/studii-de-caz/cutremure/kamchatka-rusia-1952/"],
          ["29.06.1956 · Marilyn Monroe","/studii-de-caz/persoane-publice/marilyn-monroe-casatorie-1956/"],
          ["09.03.1957 · Andreanof Islands, Alaska","/studii-de-caz/cutremure/andreanof-alaska-1957/"],
          ["Hartă 24.06.1958 · George Becali — Jupiter/Pluto","/studii-de-caz/george-becali-jupiter-pluto/"],
          ["08.01.1959 · Charles de Gaulle","/studii-de-caz/presedinti/charles-de-gaulle-investitura-1959/"],
          ["22.05.1960 · Valdivia, Chile","/studii-de-caz/cutremure/valdivia-chile-1960/"],
          ["20.01.1961 · John F. Kennedy","/studii-de-caz/presedinti/john-f-kennedy-inaugurare-1961/"],
          ["13.10.1963 · Insulele Kurile","/studii-de-caz/cutremure/kuril-islands-1963/"],
          ["25.02.1964 · Muhammad Ali","/studii-de-caz/persoane-publice/muhammad-ali-titlu-mondial-1964/"],
          ["28.03.1964 · Prince William Sound, Alaska","/studii-de-caz/cutremure/alaska-prince-william-1964/"],
          ["04.02.1965 · Rat Islands, Alaska","/studii-de-caz/cutremure/rat-islands-alaska-1965/"],
          ["01.05.1967 · Elvis Presley","/studii-de-caz/persoane-publice/elvis-presley-casatorie-1967/"],
          ["04.01.1969 · Dolly Parton","/studii-de-caz/persoane-publice/dolly-parton-opry-1969/"],
          ["20.01.1969 · Richard Nixon","/studii-de-caz/presedinti/richard-nixon-inaugurare-1969/"],
          ["03.11.1970 · Salvador Allende","/studii-de-caz/presedinti/salvador-allende-investitura-1970/"],
          ["30.10.1971 · Bruce Lee","/studii-de-caz/persoane-publice/bruce-lee-big-boss-1971/"],
          ["Hartă 17.05.1972 · Vocație profesională — Învățător","/studii-de-caz/vocatie-invatator-17-mai-1972/"],
          ["27.05.1974 · Valéry Giscard d'Estaing","/studii-de-caz/presedinti/valery-giscard-destaing-investitura-1974/"],
          ["04.04.1975 · Bill Gates","/studii-de-caz/persoane-publice/bill-gates-microsoft-1975/"],
          ["21.11.1976 · Sylvester Stallone","/studii-de-caz/persoane-publice/sylvester-stallone-rocky-1976/"],
          ["21.05.1981 · François Mitterrand","/studii-de-caz/presedinti/francois-mitterrand-investitura-1981/"],
          ["Hartă 18.07.1982 · Vocație profesională — IT, marketing online și comunicare","/studii-de-caz/vocatie-it-marketing-online-comunicare/"],
          ["17.09.1984 · Începerea clasei I — București 1984","/studii-de-caz/inceput-clasa-i-1984/"],
          ["17.09.1984 · Începutul clasei I — analiză prin Arce Solare","/studii-de-caz/inceput-clasa-1-17-septembrie-1984/"],
          ["17.09.1986 · Mutare la Școala 89 — 1986","/studii-de-caz/mutare-scoala-89-1986/"],
          ["11.04.1988 · Cher","/studii-de-caz/persoane-publice/cher-oscar-1988/"],
          ["30.10.1988 · Ayrton Senna","/studii-de-caz/persoane-publice/ayrton-senna-japonia-1988/"],
          ["29.03.1989 · Jodie Foster","/studii-de-caz/persoane-publice/jodie-foster-oscar-1989/"],
          ["08.07.1989 · Carlos Menem","/studii-de-caz/presedinti/carlos-menem-investitura-1989/"],
          ["22.12.1990 · Lech Wałęsa","/studii-de-caz/presedinti/lech-walesa-presedinte-1990/"],
          ["12.06.1991 · Michael Jordan","/studii-de-caz/persoane-publice/michael-jordan-primul-titlu-nba-1991/"],
          ["24.09.1991 · Kurt Cobain","/studii-de-caz/persoane-publice/kurt-cobain-nevermind-1991/"],
          ["15.09.1992 · Începerea liceului — 1992","/studii-de-caz/incepere-liceu-1992/"],
          ["25.11.1992 · Whitney Houston","/studii-de-caz/persoane-publice/whitney-houston-bodyguard-1992/"],
          ["20.01.1993 · Bill Clinton","/studii-de-caz/presedinti/bill-clinton-inaugurare-1993/"],
          ["02.02.1993 · Václav Havel","/studii-de-caz/presedinti/vaclav-havel-juramant-1993/"],
          ["29.03.1993 · Al Pacino","/studii-de-caz/persoane-publice/al-pacino-oscar-1993/"],
          ["21.03.1994 · Tom Hanks","/studii-de-caz/persoane-publice/tom-hanks-oscar-1994/"],
          ["21.03.1994 · Steven Spielberg","/studii-de-caz/persoane-publice/steven-spielberg-oscar-1994/"],
          ["04.07.1994 · Începutul studiului numerologiei — 1994","/studii-de-caz/inceput-numerologie-1994/"],
          ["15.06.1996 · Bacalaureat — 1996","/studii-de-caz/bacalaureat-1996/"],
          ["10.08.1996 · Schimbare de nume — 1996","/studii-de-caz/schimbare-nume-1996/"],
          ["11.08.1996 · Job — august 1996","/studii-de-caz/angajare-11-august-1996/"],
          ["11.09.1996 · Început de relație — septembrie 1996","/studii-de-caz/relatie-septembrie-1996/"],
          ["10.02.1997 · Job — februarie 1997","/studii-de-caz/angajare-vanzator-1997/"],
          ["13.04.1997 · Tiger Woods","/studii-de-caz/persoane-publice/tiger-woods-masters-1997/"],
          ["01.12.1997 · Job — decembrie 1997","/studii-de-caz/angajare-barman-1997/"],
          ["23.03.1998 · Robin Williams","/studii-de-caz/persoane-publice/robin-williams-oscar-1998/"],
          ["25.06.1998 · Plecare în armată — 1998","/studii-de-caz/plecare-armata-1998/"],
          ["06.08.1998 · Intervenție chirurgicală — Pitești 1998","/studii-de-caz/interventie-chirurgicala-pitesti-1998/"],
          ["01.12.1998 · Job — decembrie 1998","/studii-de-caz/functie-armata-1998/"],
          ["07.07.1999 · Job — iulie 1999","/studii-de-caz/angajare-paza-banca-1999/"],
          ["01.10.1999 · Job — octombrie 1999","/studii-de-caz/carte-munca-1999/"],
          ["01.03.2000 · Job — martie 2000","/studii-de-caz/incepere-job-1-martie-2000/"],
          ["26.03.2000 · Angelina Jolie","/studii-de-caz/persoane-publice/angelina-jolie-oscar-2000/"],
          ["01.04.2000 · Început de relație — aprilie 2000","/studii-de-caz/relatie-aprilie-2000/"],
          ["23.05.2000 · Job — mai 2000","/studii-de-caz/paza-pipera-23-mai-2000/"],
          ["20.01.2001 · George W. Bush","/studii-de-caz/presedinti/george-w-bush-inaugurare-2001/"],
          ["30.01.2001 · Întâlnire sentimentală — București 2001","/studii-de-caz/intalnire-dragoste-arce-solare-2001/"],
          ["25.03.2001 · Julia Roberts","/studii-de-caz/persoane-publice/julia-roberts-oscar-2001/"],
          ["23.06.2001 · Sudul Peru / Arequipa","/studii-de-caz/cutremure/arequipa-peru-2001/"],
          ["03.06.2002 · Job — iunie 2002","/studii-de-caz/final-contract-cpi-pipera-2002/"],
          ["01.08.2002 · Job — august 2002","/studii-de-caz/incepere-coca-2002/"],
          ["11.01.2003 · Relocare geografică — Spania 2003","/studii-de-caz/relocare-geografica-spania-2003/"],
          ["09.07.2003 · Johnny Depp","/studii-de-caz/persoane-publice/johnny-depp-pirates-2003/"],
          ["09.09.2004 · Obținerea permisului categoria B — 2004","/studii-de-caz/permis-categoria-b-2004/"],
          ["14.09.2004 · Moștenire — 14 septembrie 2004","/studii-de-caz/acte-casa-septembrie-2004/"],
          ["01.10.2004 · O nouă plecare în Spania — 2004","/studii-de-caz/plecare-spania-octombrie-2004/"],
          ["26.12.2004 · Sumatra–Andaman","/studii-de-caz/cutremure/sumatra-andaman-2004/"],
          ["28.03.2005 · Nias, Sumatra","/studii-de-caz/cutremure/nias-sumatra-2005/"],
          ["05.03.2006 · George Clooney","/studii-de-caz/persoane-publice/george-clooney-oscar-2006/"],
          ["11.03.2006 · Michelle Bachelet","/studii-de-caz/presedinti/michelle-bachelet-investitura-2006/"],
          ["23.08.2006 · Căsătorie — august 2006","/studii-de-caz/casatorie-23-august-2006/"],
          ["16.10.2006 · Revenire în România — 2006","/studii-de-caz/revenire-romania-2006/"],
          ["16.05.2007 · Nicolas Sarkozy","/studii-de-caz/presedinti/nicolas-sarkozy-investitura-2007/"],
          ["12.09.2007 · Sudul Sumatrei","/studii-de-caz/cutremure/sumatra-sud-2007/"],
          ["28.08.2008 · Începerea facultății — 2008","/studii-de-caz/incepere-facultate-2008/"],
          ["26.11.2008 · Job — noiembrie 2008","/studii-de-caz/angajare-noiembrie-2008/"],
          ["20.01.2009 · Barack Obama","/studii-de-caz/presedinti/barack-obama-inaugurare-2009/"],
          ["27.02.2010 · Maule / Biobío, Chile","/studii-de-caz/cutremure/maule-chile-2010/"],
          ["20.12.2010 · Job — decembrie 2010","/studii-de-caz/angajare-decembrie-2010/"],
          ["11.03.2011 · Tōhoku, Japonia","/studii-de-caz/cutremure/tohoku-japonia-2011/"],
          ["29.04.2011 · Prince William","/studii-de-caz/persoane-publice/prince-william-nunta-2011/"],
          ["02.07.2011 · Licență în Psihologie — 2011","/studii-de-caz/licenta-psihologie-2011/"],
          ["26.02.2012 · Meryl Streep","/studii-de-caz/persoane-publice/meryl-streep-oscar-2012/"],
          ["11.04.2012 · Nordul Sumatrei","/studii-de-caz/cutremure/sumatra-2012/"],
          ["15.05.2012 · François Hollande","/studii-de-caz/presedinti/francois-hollande-investitura-2012/"],
          ["01.03.2014 · Diplomă de Astrologie — 2014","/studii-de-caz/diploma-astrologie-2014/"],
          ["13.02.2015 · Dakota Johnson","/studii-de-caz/persoane-publice/dakota-johnson-fifty-shades-2015/"],
          ["25.11.2015 · Michael B. Jordan","/studii-de-caz/persoane-publice/michael-b-jordan-creed-2015/"],
          ["28.02.2016 · Leonardo DiCaprio","/studii-de-caz/persoane-publice/leonardo-dicaprio-oscar-2016/"],
          ["22.04.2016 · Job — aprilie 2016","/studii-de-caz/job-nou-aprilie-2016/"],
          ["22.08.2016 · Intervenție medicală — august 2016","/studii-de-caz/interventie-medicala-august-2016/"],
          ["22.08.2016 · Intervenție chirurgicală — analiză prin Arce Solare","/studii-de-caz/interventie-chirurgicala-22-august-2016/"],
          ["07.12.2016 · Afaceri — decembrie 2016","/studii-de-caz/infiintare-firma-decembrie-2016/"],
          ["07.12.2016 · Înființarea firmei — Arcul Solar MC la Jupiter/Pluto","/studii-de-caz/infiintare-firma-7-decembrie-2016/"],
          ["20.01.2017 · Donald Trump","/studii-de-caz/presedinti/donald-trump-inaugurare-2017/"],
          ["14.05.2017 · Emmanuel Macron","/studii-de-caz/presedinti/emmanuel-macron-investitura-2017/"],
          ["09.02.2020 · Brad Pitt","/studii-de-caz/persoane-publice/brad-pitt-oscar-2020/"],
          ["14.02.2020 · Câștig la Loto — Roma 2020","/studii-de-caz/castig-loto-roma-2020/"],
          ["08.09.2022 · King Charles III","/studii-de-caz/persoane-publice/king-charles-accesiune-2022/"],
          ["10.03.2024 · Robert Downey Jr.","/studii-de-caz/persoane-publice/robert-downey-jr-oscar-2024/"],
          ["29.07.2025 · Kamchatka, Rusia","/studii-de-caz/cutremure/kamchatka-rusia-2025/"],
          ["Fără dată · Soare → Călărași · reper Ferma Baciu","/local-space/studii-de-caz/soare-calarasi-108/"],
          ["Fără dată · Luna → Sulina · Delta Dunării","/local-space/studii-de-caz/luna-sulina-73/"],
          ["Fără dată · Mercur → Medgidia · Dobrogea","/local-space/studii-de-caz/mercur-medgidia-97/"],
          ["Fără dată · Venus → Constanța · litoral","/local-space/studii-de-caz/venus-constanta-98/"],
          ["Fără dată · Marte → Ploiești · Prahova","/local-space/studii-de-caz/marte-ploiesti-349/"],
          ["Fără dată · Jupiter → Iași · Moldova","/local-space/studii-de-caz/jupiter-iasi-17/"],
          ["Fără dată · Saturn → Târgoviște · Dâmbovița","/local-space/studii-de-caz/saturn-targoviste-315/"],
          ["Fără dată · Uranus → Vratsa · Bulgaria","/local-space/studii-de-caz/uranus-vratsa-237/"],
          ["Fără dată · Neptun → Plovdiv · Bulgaria","/local-space/studii-de-caz/neptun-plovdiv-206/"],
          ["Fără dată · Pluto → Slatina · Olt","/local-space/studii-de-caz/pluto-slatina-272/"],
          ["Fără dată · Phuket — Local Space și relocare","/research/phuket-local-space-relocare/"],
          ["Fără dată · Nordul Spaniei — Venus și Uranus/Pluto","/research/nord-spania-venus-uranus-pluto/"]
        ]
      },
      {
        selector: 'a[href="/despre-astrovip/"]',
        title: 'Despre mine',
        links: [
          ['Despre AstroVip', '/despre-astrovip/'], ['Certificare astrolog', '/studii-de-caz/diploma-astrologie-2014/'],
          ['Recenzii', '/recenzii/'], ['Presă', '/presa/']
        ]
      }
    ];

    const detailsNodes = [];
    groups.forEach(group => {
      const anchor = [...menu.children].find(el => el.matches?.(group.selector));
      if (!anchor) return;
      const details = document.createElement('details');
      details.className = 'av-menu-group';
      const summary = document.createElement('summary');
      summary.textContent = group.title;
      const links = document.createElement('div');
      links.className = 'av-menu-group-links';
      group.links.forEach(([label, href]) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        links.appendChild(a);
      });
      details.append(summary, links);
      anchor.replaceWith(details);
      detailsNodes.push(details);
    });

    const existingMore = menu.querySelector('.av-menu-more');
    if (existingMore) detailsNodes.push(existingMore);
    detailsNodes.forEach(details => {
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        detailsNodes.forEach(other => { if (other !== details) other.open = false; });
      });
    });
  };

  installPremiumMenuGroups();

  if (menu && toggle && backdrop) {
    const setOpen = (open, restoreFocus = false) => {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', labels[open ? 1 : 0]);
      toggle.dataset.iconState = open ? 'open' : 'closed';
      document.body.classList.toggle('av-menu-open', open);
      backdrop.hidden = !open;
      menu.inert = !open;
      if (open) { if (picker) picker.open = false; close?.focus(); }
      else if (restoreFocus) toggle.focus();
    };
    setOpen(false);
    toggle.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!menu.classList.contains('open'));
    }, true);
    close?.addEventListener('click', () => setOpen(false, true));
    backdrop.addEventListener('click', () => setOpen(false, true));
    document.addEventListener('click', event => {
      if (event.target.closest?.('#menu a[href]')) setOpen(false);
    }, true);
    document.addEventListener('keydown', event => {
      if (!menu.classList.contains('open')) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); setOpen(false, true); }
      if (event.key === 'Tab') {
        const controls = [...menu.querySelectorAll('a,button,summary')].filter(el => el.getClientRects().length);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }, true);
    picker?.addEventListener('toggle', () => { if (picker.open) setOpen(false); });
    new MutationObserver(() => {
      if (!menu.classList.contains('open') && !backdrop.hidden) setOpen(false);
    }).observe(menu, {attributes: true, attributeFilter: ['class']});
  }
  document.addEventListener('click', event => {
    if (picker?.open && !picker.contains(event.target)) picker.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && picker?.open) { picker.open = false; picker.querySelector('summary')?.focus(); }
  });
  // Keep the selected step available to assistive technology.
  document.querySelectorAll('[data-checkout-panel]').forEach(panel => {
    const update = () => {
      const current = document.querySelector('[data-step-indicator].is-active');
      document.querySelectorAll('[data-step-indicator]').forEach(step => {
        if (step === current) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    };
    new MutationObserver(update).observe(panel, {attributes: true, attributeFilter: ['class']});
    update();
  });
})();
