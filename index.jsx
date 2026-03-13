import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Cloud,
  ExternalLink,
  Github,
  Laptop,
  LayoutGrid,
  Mail,
  MapPin,
  Network,
  Shield,
  Server,
  Sparkles,
} from "lucide-react";

const skills = [
  "IoT & Networks",
  "Cybersecurity labs",
  "Linux servers",
  "Docker",
  "AWS basics",
  "Python",
  "React",
  "GitHub",
  "Containerlab",
  "GNS3",
  "EVE-NG",
  "Rocky Linux",
];

const categories = ["Kaikki", "Kyberturva", "Verkot", "Linux", "Pilvi"];

const projects = [
  {
    title: "Multi-Platform Network Simulation Lab",
    category: "Verkot",
    status: "Valmis / jatkuva kehitys",
    year: "2026",
    summary:
      "Vertailu- ja testilabra, jossa rakensin samoja verkkotopologioita CML:llä, GNS3:lla, EVE-NG:llä ja Containerlabilla. Tavoite oli näyttää käytännössä, miten eri ympäristöt soveltuvat opetukseen, testaukseen ja IoT-verkkoskenaarioihin.",
    stack: ["CML", "GNS3", "EVE-NG", "Containerlab", "VPCS", "Linux"],
    impact: [
      "Selkeä vertailu eri simulaattorien vahvuuksista ja rajoista",
      "Toimivat topologiat ja dokumentoidut testit",
      "Hyvä näyttö verkko-osaamisesta ilman työkokemusta",
    ],
    link: "#",
  },
  {
    title: "Practical Cybersecurity IoT Security Lab",
    category: "Kyberturva",
    status: "Kurssiprojekti",
    year: "2026",
    summary:
      "Rakensin IoT-painotteisen hyökkäys- ja puolustuslabran, jossa testattiin yhteyksiä, segmentointia ja eristystä eri verkkoalueiden välillä. Fokus oli siinä, että ratkaisu on dokumentoitu niin hyvin, että se voidaan toistaa myöhemmin.",
    stack: ["IoT", "ICMP", "Segmentointi", "GNS3", "EVE-NG", "Raportointi"],
    impact: [
      "Baseline-yhteydet todennettu ping-testeillä",
      "Segmentointi esti hallitusti liikenteen eri verkkojen välillä",
      "Projektista syntyi suoraan työnäytteeksi sopiva dokumentaatio",
    ],
    link: "#",
  },
  {
    title: "Linux Servers & Databases Lab Set",
    category: "Linux",
    status: "Kurssikokonaisuus",
    year: "2026",
    summary:
      "Linux-palvelinharjoituksia Rocky Linuxilla ja Red Hat -ympäristössä. Paketissa painottui palvelinten käyttöönotto, perushardennus, käyttäjähallinta, palvelut ja tietokantaympäristön perusteet.",
    stack: ["Rocky Linux", "Red Hat", "SSH", "Systemd", "SQL", "CLI"],
    impact: [
      "Vahvisti admin-pohjaa ja komentoriviosaamista",
      "Näyttää, että osaan muutakin kuin vain tehdä käyttöliittymää",
      "Hyvä tukiprojekti verkko- ja kyberturvaroolien hakuihin",
    ],
    link: "#",
  },
  {
    title: "AWS Cloud Architecting Study Build",
    category: "Pilvi",
    status: "Tulossa",
    year: "2026",
    summary:
      "Rakenteilla oleva pilviprojekti, jossa yhdistän perusarkkitehtuurin, verkotuksen, palvelut ja kustannusajattelun selkeäksi demoksi. Tarkoitus on näyttää, että ymmärrän myös pilven roolin modernissa infra- ja sovelluskehityksessä.",
    stack: ["AWS", "VPC", "IAM", "Compute", "Architecture"],
    impact: [
      "Täydentää verkko- ja Linux-osaamista pilvipuolelle",
      "Sopii hyvin trainee- ja internship-hakuihin",
      "Tulee toimimaan portfolion vahvana kasvuprojektina",
    ],
    link: "#",
  },
];

const timeline = [
  {
    title: "ICT Engineering, Metropolia UAS",
    meta: "3. vuoden opiskelija · Smart IoT Systems / IoT and Networks",
    text:
      "Rakennan osaamista käytännön labrojen, projektien ja dokumentoinnin kautta. Oma vahvuus on tekninen tekeminen yhdistettynä selkeään raportointiin.",
    icon: BookOpen,
  },
  {
    title: "Practical Cybersecurity",
    meta: "Kevät 2026",
    text:
      "Monialustaiset verkkolabraympäristöt, IoT-skenaariot ja eristys-/hyökkäystestit. Pidän tärkeänä, että ratkaisut ovat myös toistettavissa.",
    icon: Shield,
  },
  {
    title: "Linux Servers & Databases",
    meta: "Kevät 2026",
    text:
      "Palvelinympäristöt, Linux-hallinta ja tietokantojen perusteet käytännön tasolla. Tavoite on rakentaa infraosaamisesta näkyvä työnäyte.",
    icon: Server,
  },
  {
    title: "Seuraava askel",
    meta: "Harjoittelu / trainee / opinnäytetyö",
    text:
      "Haen roolia, jossa pääsen käyttämään verkko-, Linux-, pilvi- ja kyberturvapohjaa oikeissa ympäristöissä ja kasvamaan nopeasti vastuullisempiin tehtäviin.",
    icon: Briefcase,
  },
];

const strengths = [
  {
    title: "Näyttöä tekemisestä",
    text:
      "En nojaa pelkkään kurssilistaan. Jokainen tärkeä projekti on kirjoitettu auki niin, että rekrytoija näkee ongelman, ratkaisun ja teknologiat yhdellä silmäyksellä.",
    icon: LayoutGrid,
  },
  {
    title: "Tekninen suunta on selkeä",
    text:
      "Painopiste on verkoissa, IoT:ssä, Linuxissa ja kyberturvassa. Sivu ei yritä näyttää kaikkea kaikille, vaan rakentaa uskottavan profiilin tiettyihin junior-rooleihin.",
    icon: Network,
  },
  {
    title: "Ammattimainen mutta näyttävä",
    text:
      "Visuaalisuus herättää huomion, mutta sisältö pysyy luettavana. Tavoite on näyttää hyvältä ilman, että sivu tuntuu pelkältä efektidemolta.",
    icon: Sparkles,
  },
];

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300">{text}</p>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200 backdrop-blur">
      {children}
    </span>
  );
}

export default function RoopePortfolioSite() {
  const [active, setActive] = useState("Kaikki");

  const filteredProjects = useMemo(() => {
    if (active === "Kaikki") return projects;
    return projects.filter((project) => project.category === active);
  }, [active]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.08),transparent_18%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-300">ROOPE AALTONEN</p>
            <p className="text-xs text-slate-400">ICT Engineering student · IoT / Networks / Cybersecurity</p>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#projects" className="transition hover:text-white">Projektit</a>
            <a href="#about" className="transition hover:text-white">Minusta</a>
            <a href="#timeline" className="transition hover:text-white">Polku</a>
            <a href="#contact" className="transition hover:text-white">Yhteys</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-28 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              <BadgeCheck className="h-4 w-4" />
              Avoin harjoittelu-, trainee- ja opinnäytetyömahdollisuuksille pääkaupunkiseudulla
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Rakennan käytännön työnäytteitä
              <span className="block bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
                verkoista, Linuxista, IoT:stä ja kyberturvasta.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Olen 3. vuoden tietotekniikan insinööriopiskelija Metropoliasta. Minulla ei vielä ole oman alan työkokemusta,
              joten rakennan uskottavuutta projekteilla, dokumentaatiolla ja teknisellä tekemisellä, joka on helppo näyttää rekrytoijalle.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Katso projektit
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Ota yhteyttä
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Pill key={skill}>{skill}</Pill>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-violet-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Profiili</p>
                  <h3 className="text-xl font-semibold text-white">Junior infra / network / security track</h3>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Open for work
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="mb-3 inline-flex rounded-xl bg-cyan-400/10 p-2 text-cyan-300">
                    <Network className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-400">Pääfokus</p>
                  <p className="mt-1 font-medium text-white">Verkot, IoT ja labra-arkkitehtuurit</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="mb-3 inline-flex rounded-xl bg-violet-400/10 p-2 text-violet-300">
                    <Shield className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-400">Erotun tällä</p>
                  <p className="mt-1 font-medium text-white">Dokumentoitu tekeminen, ei pelkkä teoriapohja</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="mb-3 inline-flex rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
                    <Server className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-400">Infraosaaminen</p>
                  <p className="mt-1 font-medium text-white">Linux, palvelimet, CLI, ympäristöjen pystytys</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="mb-3 inline-flex rounded-xl bg-amber-400/10 p-2 text-amber-300">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-400">Kasvusuunta</p>
                  <p className="mt-1 font-medium text-white">Pilvi, automaatio ja tuotantotason tekeminen</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5">
                <p className="text-sm text-slate-300">Mitä haluan näyttää tällä sivulla</p>
                <p className="mt-2 text-lg font-medium text-white">
                  Että pystyn oppimaan nopeasti, rakentamaan oikeita teknisiä kokonaisuuksia ja viemään ne myös siististi esille.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {strengths.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-white/10 p-3 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="Portfolio"
              title="Projektit, jotka myyvät osaamisen paremmin kuin pelkkä CV"
              text="Jokainen projekti on valittu niin, että se tukee junior-tason verkko-, infra-, Linux- tai kyberturvaroolia. Tähän kannattaa myöhemmin lisätä GitHub-linkki, kuvia, topologia ja lyhyt demo tai README." 
            />

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActive(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active === category
                      ? "bg-white text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      {project.category}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {project.status}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400">{project.year}</span>
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-white">{project.title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{project.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm font-medium text-white">Miksi tämä on hyvä työnäyte</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    {project.impact.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={project.link}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Lisää GitHub-linkki
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={project.link}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Lisää case-sivu
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="timeline" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <SectionTitle
            eyebrow="Polku"
            title="Mitä olen tehnyt tähän asti ja mihin olen menossa"
            text="Kun työkokemusta on vielä vähän, eteneminen kannattaa näyttää selkeänä polkuna. Tämä auttaa rekrytoijaa ymmärtämään, että suunta on jo olemassa eikä kyse ole hajanaisesta kokeilusta."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-white/10 p-3 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{item.meta}</p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-violet-400/10 p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/80">Miksi tämä portfolio toimii</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Se näyttää potentiaalin heti, vaikka työkokemusta olisi vielä vähän.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Sivun tarkoitus ei ole vain näyttää hienolta. Sen tarkoitus on tehdä yhdestä asiasta ilmiselvä: sinulla on jo suunta,
                  käytännön näyttöä ja kyky tehdä näkyväksi se, mitä osaat.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                  <Laptop className="h-5 w-5 text-cyan-300" />
                  <p className="mt-4 text-sm text-slate-400">Sopii rooleihin</p>
                  <p className="mt-1 font-medium text-white">Junior IT, network, infra, cloud, cybersecurity trainee</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                  <Github className="h-5 w-5 text-cyan-300" />
                  <p className="mt-4 text-sm text-slate-400">Seuraava lisäys</p>
                  <p className="mt-1 font-medium text-white">Liitä jokaiseen projektiin repo, kuvat, README ja topologia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <SectionTitle
                eyebrow="Yhteys"
                title="Rakennetaan tästä sinulle oikea työnhakutyökalu"
                text="Kun lisäät tähän omat oikeat linkit, kuvat ja GitHub-projektit, tämä toimii sekä portfolio-sivuna että henkilökohtaisena laskeutumissivuna hakemuksille, LinkedIniin ja CV:hen."
              />

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:your.email@example.com" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                  <Mail className="h-4 w-4" />
                  your.email@example.com
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
                  <ExternalLink className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/80">Pikainfo</p>

              <div className="mt-6 space-y-5 text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="font-medium text-white">Sijainti</p>
                    <p>Pääkaupunkiseutu / Helsinki region</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="mt-1 h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="font-medium text-white">Etsin tällä hetkellä</p>
                    <p>Harjoittelu 2, trainee-roolit, junior-alkuiset infra- ja verkkotehtävät sekä opinnäytetyöaihe</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="font-medium text-white">Mitä tämä sivu kertoo minusta</p>
                    <p>Otan tekemisen vakavasti, opin nopeasti ja osaan tehdä teknisestä työstä näkyvää ja ymmärrettävää.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
