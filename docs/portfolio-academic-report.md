# Akateeminen raportti: Interaktiivinen verkkotopologiaan perustuva portfolioverkkosivu

**Tekijä:** Roope Aaltonen  
**Kohde:** roopeaaltonen.fi / Interactive Network Topology Portfolio Website  
**Raportin tyyppi:** tekninen ja akateemisesti dokumentoitu toteutusraportti  
**Päivämäärä:** 7.5.2026

## Tiivistelmä

Tämä raportti käsittelee interaktiivisen portfolioverkkosivun suunnittelua, toteutusta ja arviointia. Toteutuksen tavoitteena oli rakentaa työnhakua tukeva tekninen portfolio, joka ei toimi ainoastaan staattisena esittelysivuna vaan myös itsessään näyttönä frontend-osaamisesta, käyttöliittymäsuunnittelusta, responsiivisesta toteutuksesta, URL-tilanhallinnasta ja staattisesta julkaisuputkesta.

Sivuston keskeinen idea on Packet Tracer -henkinen verkkotopologia, jossa eri verkkolaitteet avaavat sisältöikkunoita: About Me, Projects, LinkedIn ja Contact Me. Toteutus on rakennettu Next.js App Router -sovelluksena, React-komponenteilla, TypeScriptillä, Tailwind CSS:llä ja Framer Motion -animaatioilla. Sivusto julkaistaan staattisena sivustona GitHub Pagesiin ja toimii omalla verkkotunnuksella `roopeaaltonen.fi`.

Raportti osoittaa, että sivusto yhdistää persoonallisen visuaalisen konseptin käytännöllisiin teknisiin ratkaisuihin. Erityisen keskeisiä ratkaisuja ovat URL-parametreihin sidottu popup-tila, erilliset sisältötiedostot profiili- ja projektidatalle, uudelleenkäytettävä ikkunakomponentti, responsiivinen mobiilitopologia sekä tuotantokelpoinen build- ja deploy-prosessi. Samalla raportti tunnistaa toteutuksen rajoitteita, kuten animaatiologiikan kasvavan monimutkaisuuden, jatkuvan saavutettavuustestauksen tarpeen ja sen, että voimakas visuaalinen konsepti vaatii tarkkaa tasapainoa käytettävyyden kanssa.

**Avainsanat:** portfolio, frontend, Next.js, React, TypeScript, responsiivinen suunnittelu, käyttöliittymäarkkitehtuuri, staattinen julkaisu, GitHub Pages, tekninen dokumentaatio

## 1. Johdanto

Tekninen portfolio on erityisesti trainee- ja junioritason ICT-tehtävissä enemmän kuin ansioluettelon lisäosa. Hyvin toteutettu portfolio voi osoittaa käytännön toteutuskykyä, teknistä ajattelua, dokumentointia, visuaalista harkintaa ja kykyä viimeistellä kokonaisuus julkaistavaan kuntoon. Tämän projektin tarkoituksena oli rakentaa verkkosivu, joka toimii samanaikaisesti henkilökohtaisena portfoliona ja frontend-projektina.

Perinteisen portfolioasettelun sijasta sivusto hyödyntää verkkotopologiaa käyttöliittymämetaforana. Käyttäjä ei siirry ensisijaisesti tavallisessa navigaatiovalikossa sivulta toiselle, vaan avaa sisältöjä verkon laitteiden kautta. Reititin esittää About Me -sisällön, switchi projektit, tietokone LinkedIn-näkymän ja älypuhelin yhteydenoton. Ratkaisu tukee tekijän ICT-profiilia, koska käyttöliittymän visuaalinen kieli liittyy suoraan verkkoihin, laitteisiin ja järjestelmäajatteluun.

Raportin tavoitteena on dokumentoida sivuston tarkoitus, tekninen rakenne, toteutusvalinnat, laadunvarmistus ja jatkokehityskohteet akateemisesti jäsennellyssä muodossa.

## 2. Tavoitteet ja rajaus

Projektin päätavoitteena oli toteuttaa portfolio, joka on työnantajalle nopeasti ymmärrettävä, teknisesti uskottava ja visuaalisesti erottuva. Tavoite ei ollut rakentaa mahdollisimman monimutkaista sovellusta, vaan sellainen kokonaisuus, jossa toteutuksen tekniset ratkaisut palvelevat selkeää viestinnällistä päämäärää.

Toteutukselle asetettiin seuraavat tavoitteet:

1. Sivuston on toimittava henkilökohtaisena työnhakuportfoliona.
2. Sivuston on itsessään osoitettava frontend-toteutuskykyä.
3. Sisältöjen on oltava työnantajalle helposti luettavia ja nopeasti avattavia.
4. Projektien on oltava dokumentoituja case study -muodossa.
5. Sivuston on toimittava suorilla linkeillä, myös yksittäisiin popup-näkymiin ja projektisivuihin.
6. Sivuston on oltava responsiivinen työpöydällä, puolikkaalla ruudulla ja mobiilissa.
7. Sivuston julkaisuputken on oltava toistettava ja tuotantokelpoinen.

Rajauksen ulkopuolelle jäävät varsinaiset backend-toiminnot, käyttäjätilit, tietokantayhteydet ja palvelinpuolen dynaaminen sisältö. Sivusto on tarkoituksella staattinen, jotta se on kevyt, helposti julkaistava ja toimintavarma GitHub Pages -ympäristössä.

## 3. Tutkimus- ja kehityskysymykset

Raportissa tarkastellaan toteutusta seuraavien kysymysten kautta:

1. Miten tekninen portfolio voidaan suunnitella niin, että visuaalinen konsepti tukee tekijän ICT-profiilia?
2. Miten popup-pohjainen käyttöliittymä voidaan toteuttaa siten, että se säilyttää suorat linkit ja selaimen URL-tilan?
3. Miten sisältö ja käyttöliittymä voidaan erottaa toisistaan ylläpidettävällä tavalla?
4. Miten vahvasti animoitu visuaalinen käyttöliittymä voidaan sovittaa responsiiviseen ja käytettävään toteutukseen?
5. Miten staattinen frontend-sovellus voidaan julkaista luotettavasti GitHub Pages -ympäristöön?

## 4. Menetelmä

Raportti perustuu projektin lähdekoodin, sisällön, konfiguraation ja dokumentaation tarkasteluun. Tarkastellut keskeiset tiedostot ovat:

| Osa-alue | Tiedosto |
| --- | --- |
| Projektin yleiskuvaus | `README.md` |
| Pääkäyttöliittymä ja topologia | `components/topology-hero.tsx` |
| Popup-ikkunoiden runko | `components/packet-window.tsx` |
| Portfolio- ja projektisisältö | `components/portfolio-panel-content.tsx` |
| URL-tilanhallinta | `hooks/use-portfolio-panel-state.ts` |
| Projektidata | `content/projects.ts` |
| Profiilidata | `content/profile.ts` |
| Next.js-konfiguraatio | `next.config.mjs` |
| Metadata ja viewport | `app/layout.tsx` |
| GitHub Pages -julkaisu | `.github/workflows/deploy.yml` |
| Oma verkkotunnus | `public/CNAME` |

Menetelmä on laadullinen tekninen analyysi. Sivustoa arvioidaan suhteessa sen tavoitteisiin, lähdekoodissa näkyviin ratkaisuihin, käytettyihin teknologioihin ja tuotantokelpoisuuden tarkistuksiin. Lisäksi raportissa käytetään virallista teknologiadokumentaatiota lähteenä, jotta toteutusvalintoja voidaan suhteuttaa käytettyjen työkalujen suositeltuihin käyttötapoihin.

## 5. Teknologiavalinnat

Sivusto on toteutettu Next.js 16 App Router -pohjalla. Next.js mahdollistaa React-pohjaisen sovellusrakenteen, reitityksen ja staattisen exportin. Projektin `next.config.mjs` määrittää `output: 'export'`, mikä tuottaa staattisen sivuston GitHub Pages -julkaisua varten. Staattinen export sopii tähän käyttötapaukseen hyvin, koska sivusto ei tarvitse palvelinpuolen ajonaikaista laskentaa.

React toimii käyttöliittymän komponenttimallina. Sivuston interaktiivisuus rakentuu Reactin tilanhallinnan ja hookien, kuten `useState`, `useEffect`, `useMemo` ja `useCallback`, ympärille. Näitä käytetään esimerkiksi popup-tilan, animaatioiden, mobiilin automaattisten laiteanimaatioiden, simulointikellon ja käyttäjän vuorovaikutuksen hallintaan.

TypeScript tuo projektiin tyyppiturvaa. Se on erityisen hyödyllinen projektidatan ja paneelitilojen yhteydessä, koska virheellinen projektin tunniste tai popup-tila voisi muuten aiheuttaa käyttöliittymän rikkoutumisen. Tyyppien avulla esimerkiksi `Project`-sisältömalli ja `PortfolioPanel`-tila ovat eksplisiittisiä.

Tailwind CSS vastaa suurimmasta osasta tyylien toteutusta. Tailwindin vahvuus tässä projektissa on nopea responsiivinen säätö ja komponenttikohtainen visuaalinen hienosäätö ilman laajaa erillistä CSS-tiedostojen kerrosta. Projektissa Tailwindia käytetään kuitenkin myös hyvin yksityiskohtaiseen visuaaliseen asetteluun, mikä edellyttää kurinalaisuutta, jotta luokkien määrä ei tee komponenteista vaikeasti ylläpidettäviä.

Framer Motion vastaa merkittävästä osasta animaatioita. Sen avulla toteutetaan popup-siirtymiä, hover-reaktioita, laiteanimaatioita ja topology-interaktion tuntumaa. Animaatiot tukevat sivuston Packet Tracer -henkistä käyttöliittymämetaforaa, mutta ne lisäävät samalla kompleksisuutta, jota täytyy hallita testauksella ja selkeällä komponenttirakenteella.

## 6. Käyttöliittymäkonsepti

Sivuston käyttöliittymä perustuu verkkotopologiaan. Topologia on tässä sekä visuaalinen metafora että käyttölogiikka. Neljä laitetta toimivat ensisijaisina navigaatiopisteinä:

| Laite | Sisältö | Käyttöliittymärooli |
| --- | --- | --- |
| Wireless Router1 | About Me | Henkilökuva ja osaamisprofiili |
| Switch0 | Projects | Projektit ja case study -sisällöt |
| PC1 | LinkedIn | LinkedIn-profiilin selainmainen esitys |
| Smartphone0 | Contact Me | Yhteystiedot ja yhteydenottolomake |

Ratkaisu sopii tekijän profiiliin, koska se yhdistää verkkoihin liittyvän visuaalisen maailman portfolion sisältöön. Käyttöliittymä ei ole satunnainen koriste, vaan se liittyy suoraan tekijän osaamisalueisiin: verkot, Linux, IoT, pilvi, kyberturvallisuus ja järjestelmät.

Sivustolla on kaksi päällekkäistä käyttötasoa. Ensimmäinen taso on topologia, joka herättää huomion ja tarjoaa ensivaikutelman. Toinen taso on popup-ikkunoihin sijoitettu sisältö, jonka tarkoitus on olla mahdollisimman selkeä ja työnantajalle hyödyllinen. Tämä erottelu on tärkeä, koska visuaalinen konsepti ei saa häiritä itse sisältöä.

## 7. Sovellusarkkitehtuuri

Sovelluksen arkkitehtuuri voidaan jäsentää neljään pääkerrokseen.

Ensimmäinen kerros on reititys ja staattinen julkaisu. `app/page.tsx` lataa `TopologyHero`-pääkomponentin, ja erilliset `/about`, `/projects` ja `/contact`-reitit ohjaavat käyttäjän takaisin etusivulle oikean popup-tilan kanssa. Tämä ratkaisu säilyttää yhtenäisen käyttöliittymäkokemuksen mutta mahdollistaa silti suorien URL-osoitteiden käytön.

Toinen kerros on tila ja navigaatio. `hooks/use-portfolio-panel-state.ts` lukee ja päivittää `panel`- ja `project`-hakukyselyparametreja. Tämä tekee popup-tilasta ja projektinäkymästä linkitettävän. Esimerkiksi osoite `/?panel=projects&project=portfolio-site` avaa suoraan Projects-popupin ja oikean projektin.

Kolmas kerros on käyttöliittymäkomponentit. `components/topology-hero.tsx` sisältää verkkotopologian, laitteet, johdot, animaatiot ja popupien avaamisen. `components/packet-window.tsx` tarjoaa ikkunakuoren ja ylävälilehdet. `components/portfolio-panel-content.tsx` tuottaa varsinaiset About-, Projects-, LinkedIn- ja Contact-sisällöt.

Neljäs kerros on data. `content/profile.ts` ja `content/projects.ts` sisältävät varsinaisen henkilö- ja projektidatan. Tämä on ylläpidon kannalta merkittävä ratkaisu, koska sisällön päivittäminen ei vaadi suoraa topologiakomponentin muokkaamista.

## 8. URL-tilanhallinta ja suorien linkkien toiminta

Popup-pohjaiset käyttöliittymät voivat helposti rikkoa selaimen perusodotuksia. Jos tila on vain Reactin muistissa, sivua ei voi jakaa suoraan tiettyyn näkymään, selainpäivitys voi palauttaa käyttäjän väärään kohtaan ja navigaation historia voi tuntua epäluotettavalta. Tässä toteutuksessa ongelma ratkaistaan sitomalla paneelitila URL-parametreihin.

`usePortfolioPanelState`-hook määrittää sallitut paneelit ja projektit. Se validoi `panel`- ja `project`-parametrit ennen niiden käyttöä. Tämä on tärkeää, koska käyttäjä voi avata sivuston suoraan mielivaltaisella URL-parametrilla. Virheellinen projektin slug ei saa kaataa sivustoa, vaan se palautetaan turvallisesti overview-tilaan.

Ratkaisu tukee seuraavia käyttötapauksia:

1. Käyttäjä avaa etusivun ilman parametreja.
2. Käyttäjä avaa suoraan About-popupin osoitteella `/?panel=about`.
3. Käyttäjä avaa Projects-popupin osoitteella `/?panel=projects`.
4. Käyttäjä avaa yksittäisen projektin osoitteella `/?panel=projects&project=portfolio-site`.
5. Käyttäjä siirtyy välilehdestä toiseen popupin yläpalkissa ilman sovelluksen kaatumista.
6. Käyttäjä sulkee popupin X-painikkeesta, jolloin URL palautuu etusivun tilaan.

Tämä tekee sivusta sekä visuaalisesti kokeellisen että teknisesti käytännöllisen.

## 9. Sisältöarkkitehtuuri

Projektin sisältö on erotettu käyttöliittymästä. `content/profile.ts` sisältää tekijän henkilötiedot, profiilin, osaamisalueet, yhteystiedot ja urasuuntautumisen. `content/projects.ts` sisältää projektien otsikot, tiivistelmät, kuvaukset, tekniset kohokohdat, tulokset, opitut asiat, teknologiat, rekrytoijan avainsanat ja työnantajalle olennaisimmat pisteet.

Tämä rakenne tukee akateemista ja ammatillista dokumentointia, koska jokainen projekti voidaan esittää samalla loogisella rakenteella:

1. Otsikko
2. Yhden virkkeen yhteenveto
3. Yleiskuvaus
4. Mitä tekijä teki
5. Tekniset kohokohdat
6. Tulos
7. Osoitetut taidot
8. Teknologiapino
9. Työnantajalle tärkeimmät huomiot

Yhdenmukainen rakenne auttaa lukijaa vertaamaan projekteja nopeasti. Samalla se ehkäisee sitä, että portfolio jää pelkäksi kuvagalleriaksi ilman näyttöä teknisestä ymmärryksestä.

## 10. Responsiivinen suunnittelu

Sivuston responsiivisuus on erityisen tärkeää, koska verkkotopologia on lähtökohtaisesti leveä visuaalinen rakenne. Työpöydällä laitteet voidaan sijoittaa vapaammin topologian muotoon. Mobiilissa sama ratkaisu ei toimi sellaisenaan, koska ruudun leveys ei riitä vaakasuuntaiseen verkkokaavioon.

Toteutus ratkaisee tämän jakamalla mobiilin etusivun neljään selkeään alueeseen, joissa jokainen laite saa oman tilansa. Näin käyttöliittymä säilyy tunnistettavana, mutta se ei vaadi käyttäjältä vaakasuuntaista zoomaamista. Lisäksi mobiilissa laitteiden animaatiot aktivoituvat automaattisesti yksi kerrallaan, jotta sivu tuntuu elävältä myös ilman hover-toimintoa.

Mobiiliratkaisuissa on otettu huomioon seuraavat asiat:

1. Laitteiden ja tekstien kohdistus on sovitettu visuaalisen laitteen keskikohtaan.
2. Johtojen paksuus säilyy mobiilissa yhtenäisenä eikä litisty liittimien kohdalla.
3. Yhteyskolmiot on pienennetty, jotta ne eivät hallitse näkymää liikaa.
4. Popupien sisällöt mukautuvat kapeaan ruutuun.
5. Projektikuvat voidaan selata mobiilissa sivusuunnassa.
6. LinkedIn-näkymässä pyritään näyttämään profiilin vasen reuna, jossa nimi ja kuva ovat olennaisimmat tiedot.
7. Contact-näkymässä sisältö pinoutuu loogisesti kapealla ruudulla.

Responsiivisuus ei tässä projektissa tarkoita vain elementtien kutistamista, vaan koko käyttölogiikan sovittamista eri näyttökokoihin.

## 11. Animaatiot ja vuorovaikutus

Animaatioilla on sivustossa kaksi tehtävää. Ensinnäkin ne tukevat käyttöliittymän teemaa: johdot, liittimet, laitteet, hiirikursorit ja dataliikenteen merkit tekevät topologiasta elävän. Toiseksi ne antavat käyttäjälle palautetta siitä, mikä elementti on aktiivinen tai vuorovaikutteinen.

Työpöydällä hover-tilat voivat käynnistää laitekohtaisia animaatioita. Mobiilissa hoveria ei ole samalla tavalla, joten animaatioita pyöritetään automaattisesti yksi laite kerrallaan pienillä tauoilla. Tämä on hyvä esimerkki siitä, että responsiivinen toteutus ei koske vain layoutia vaan myös vuorovaikutusmallia.

Animaatioiden tekninen riski on monimutkaisuus. Jos animaatioiden tila, timeoutit ja komponenttien elinkaari eivät ole hallittuja, nopea välilehtien vaihtaminen tai popupien avaaminen voi aiheuttaa virhetiloja. Siksi animaatiot on toteutettava niin, että cleanup-toiminnot poistavat ajastimet ja tila palautuu hallitusti.

## 12. Projektiosio

Projects-popup on sivuston ammatillisesti tärkein osa. Sen tehtävänä on näyttää konkreettisia projekteja työnantajalle. Portfolio sisältää muun muassa seuraavat projektit:

| Projekti | Osaamisalue |
| --- | --- |
| Multi-Platform IoT Security Lab Comparison | IoT, verkot, tietoturvalaboratoriot |
| Interactive Network Topology Portfolio Website | Frontend, UI-arkkitehtuuri, deploy |
| Christopher Columbus Country Guessing Game | Flask, MySQL, geospatiaalinen logiikka |
| PulseMaster Embedded Heart Rate and HRV Monitor | Sulautetut järjestelmät, sensorit, MicroPython |
| Safe CAS Login Phishing Simulation | Web-tietoturva, sosiaalinen manipulointi, turvallinen testaus |

Projektiosio yhdistää visuaaliset projektikuvat ja tekstimuotoiset case study -sisällöt. Etusivumainen projektien overview pyrkii pitämään huomion projektikuvissa ja otsikossa, kun taas yksittäisen projektin näkymä on tietoisesti yksinkertaisempi ja luettavampi. Tämä jako on onnistunut, koska työnantaja voi ensin hahmottaa projektit visuaalisesti ja sen jälkeen avata tarkemman teknisen kuvauksen.

## 13. Saavutettavuus ja käytettävyys

Sivusto on visuaalisesti vahva, joten saavutettavuuden kannalta keskeinen riski on, että koristeellisuus alkaa kilpailla luettavuuden kanssa. Toteutuksessa tätä on hallittu useilla ratkaisuilla:

1. Popupien sisältö on pääosin tekstipohjaista ja otsikoitu selkeästi.
2. Välilehdet ja X-painikkeet tarjoavat tutun ikkunamaisen navigaation.
3. Tekstit on pyritty pitämään erillään vilkkaimmista animaatioista.
4. Mobiilissa käyttöliittymä muuttuu yksinkertaisemmaksi.
5. Linkitettävät URL-tilat tukevat selaimen normaalia käyttöä.

Jatkokehityksessä saavutettavuutta kannattaa arvioida systemaattisemmin esimerkiksi näppäimistökäytön, ruudunlukijoiden, kontrastien ja vähennetyn liikkeen asetuksen näkökulmasta. WCAG 2.2 tarjoaa tähän hyvän arviointikehyksen.

## 14. Julkaisu ja tuotantokelpoisuus

Sivusto julkaistaan GitHub Pagesiin GitHub Actions -putken kautta. Workflow asentaa riippuvuudet, ajaa build-komennon ja julkaisee `out`-kansion Pages-artifactina. `public/CNAME` määrittää sivuston omaksi verkkotunnukseksi `roopeaaltonen.fi`.

Tuotantokelpoisuutta tukevat seuraavat tekijät:

1. `npm run lint` tarkistaa koodityylin ja yleisiä virheitä.
2. `npm run typecheck` tarkistaa TypeScript-tyypityksen.
3. `npm run build` varmistaa, että Next.js tuottaa staattisen tuotantoversion.
4. GitHub Actions tekee julkaisusta toistettavan.
5. Staattinen export vähentää palvelinpuolen toimintavirheiden riskiä.
6. Oma domain tekee sivustosta ammattimaisemman työnhakukäytössä.

## 15. Laadunvarmistus

Laadunvarmistus koostuu teknisistä tarkistuksista ja visuaalisesta testauksesta. Teknisiä tarkistuksia ovat linttaus, TypeScript-tarkistus ja production build. Visuaalinen testaus on tässä projektissa poikkeuksellisen tärkeää, koska sivuston arvo perustuu pitkälti käyttöliittymän viimeistelyyn.

Tämän raporttiversion yhteydessä projektin tekninen kunto tarkistettiin komennoilla `npm run lint`, `npm run typecheck` ja `npm run build`. Nämä tarkistukset varmistavat, että lähdekoodi läpäisee ESLint-tarkistuksen, TypeScript-tyypityksen ja Next.js-tuotantobuildin.

Projektissa on testattu erityisesti seuraavia toimintoja:

1. Etusivun laitteiden avaamat popupit.
2. Popupien yläpalkin välilehtien vaihtaminen.
3. X-painikkeen toiminta suorasta URL-avauksesta.
4. Projects-overview ja yksittäisten projektien avaaminen.
5. Suorat URL:t projektinäkymiin.
6. Responsiivisuus desktopissa, puolikkaalla ruudulla ja mobiilissa.
7. Animaatioiden toiminta ilman, että ne peittävät popupien sisältöä.
8. Simulointikellon säilyminen popupien välillä.
9. Projektikorttien linkkien toiminta myös silloin, kun hover-labelit ovat päällä.

## 16. Arviointi

Sivuston vahvuus on konseptin ja teknisen toteutuksen välinen yhteys. Verkkotopologia ei ole irrallinen teema, vaan se liittyy suoraan tekijän ICT-suuntautumiseen. Tämä tekee portfoliosta muistettavan ja erottaa sen tavallisista portfolioista.

Toinen vahvuus on sisältörakenne. Projektit eivät ole vain kuvia tai lyhyitä otsikoita, vaan niistä esitetään työnantajalle relevantti rakenne: mitä tehtiin, millä teknologioilla, mikä oli tulos ja mitä taitoja projekti osoittaa.

Kolmas vahvuus on tekninen käytännöllisyys. Vaikka käyttöliittymä on popup-pohjainen ja visuaalisesti kokeellinen, se säilyttää suorat linkit, staattisen julkaisun, responsiivisuuden ja tuotantokelpoisen build-prosessin.

Keskeinen kehitysriski on komponentin monimutkaisuus. `TopologyHero` sisältää paljon animaatio-, layout- ja vuorovaikutuslogiikkaa. Jatkossa tätä voisi jakaa pienempiin alikomponentteihin tai erillisiin hookeihin, jotta ylläpito olisi helpompaa.

Toinen riski liittyy saavutettavuuteen. Vaikka sivu on käytettävä ja visuaalisesti huoliteltu, vahvasti animoidun käyttöliittymän saavutettavuus pitäisi validoida systemaattisesti.

## 17. Jatkokehitys

Sivuston jatkokehityksessä suositellaan seuraavia toimenpiteitä:

1. Jaetaan `TopologyHero` pienempiin osiin, kuten `TopologyCables`, `TopologyDevice`, `TopologyAnimationController` ja `TopologyStatusIndicators`.
2. Lisätään automaattisia testejä URL-tilanhallinnalle ja popup-navigaatiolle.
3. Otetaan käyttöön saavutettavuustarkistus osaksi testausprosessia.
4. Lisätään `prefers-reduced-motion`-tuki käyttäjille, jotka haluavat vähemmän animaatioita.
5. Dokumentoidaan projektidatan rakenne erillisessä kehittäjädokumentissa.
6. Lisätään kevyet kuvien optimointikäytännöt, koska portfolio käyttää paljon visuaalisia assetteja.
7. Laaditaan lyhyt ylläpito-ohje siitä, miten uusi projekti lisätään `content/projects.ts`-tiedostoon.

## 18. Johtopäätökset

Interaktiivinen verkkotopologiaan perustuva portfolioverkkosivu täyttää päätavoitteensa: se esittelee tekijän osaamista, toimii julkaistuna verkkosivuna ja osoittaa frontend-toteutuskykyä käytännössä. Sivusto yhdistää teknisen teeman, käyttöliittymäanimaatiot, projektidokumentaation ja staattisen julkaisun tavalla, joka tukee työnhakua ICT-alan trainee- ja juniorirooleihin.

Toteutus on vahvimmillaan silloin, kun visuaalinen konsepti ja sisältö tukevat toisiaan. Portfolio ei ainoastaan kerro, että tekijä on kiinnostunut verkoista ja järjestelmistä, vaan rakentaa koko käyttöliittymän tämän ajatuksen ympärille. Tämä tekee sivustosta erottuvan, mutta samalla se asettaa korkean vaatimuksen viimeistelylle. Jatkuva responsiivisuuden, saavutettavuuden ja animaatioiden hallinnan parantaminen on tärkeää, jotta konsepti pysyy ammattimaisena myös eri laitteilla.

Kokonaisuutena sivusto on perusteltu tekninen portfolio: se on visuaalisesti tunnistettava, sisällöllisesti työnantajalähtöinen, teknisesti linkitettävä ja tuotantoon julkaistu.

## Lähteet

[1] Projektin README: `README.md`.  
[2] Projektin pääkomponentti: `components/topology-hero.tsx`.  
[3] Popup-ikkunakomponentti: `components/packet-window.tsx`.  
[4] Portfolio- ja projektisisältö: `components/portfolio-panel-content.tsx`.  
[5] URL-tilanhallinta: `hooks/use-portfolio-panel-state.ts`.  
[6] Projektidata: `content/projects.ts`.  
[7] Profiilidata: `content/profile.ts`.  
[8] Next.js-konfiguraatio: `next.config.mjs`.  
[9] GitHub Pages -julkaisuputki: `.github/workflows/deploy.yml`.  
[10] Next.js Documentation. Static Exports. https://nextjs.org/docs/app/guides/static-exports  
[11] Next.js Documentation. `useSearchParams`. https://nextjs.org/docs/app/api-reference/functions/use-search-params  
[12] React Documentation. `useEffect`. https://react.dev/reference/react/useEffect  
[13] React Documentation. `useCallback`. https://react.dev/reference/react/useCallback  
[14] Tailwind CSS Documentation. Responsive Design. https://tailwindcss.com/docs/responsive-design  
[15] Motion Documentation. Motion for React. https://motion.dev/docs/react  
[16] W3C. Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/
