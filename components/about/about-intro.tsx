const principles = [
  {
    index: "01",
    title: "Build",
    body: "Turn a technical idea into something concrete enough to test, inspect and improve.",
  },
  {
    index: "02",
    title: "Validate",
    body: "Check behaviour with evidence instead of assuming the first implementation is correct.",
  },
  {
    index: "03",
    title: "Document",
    body: "Leave the reasoning, limits and next steps clear enough for someone else to continue.",
  },
];

export function AboutIntro() {
  return (
    <section className="border-y border-white/[0.07] bg-[#0a151a]/70 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#76cfc6]">How I work</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            Practical learning,
            <span className="block text-[#7f999c]">structured thinking.</span>
          </h2>
        </div>

        <div className="space-y-5 text-[15px] leading-7 text-[#aebfc1] sm:text-base sm:leading-8">
          <p>
            I learn best by working with the real thing. That can mean configuring a network lab, tracing a web application issue, reading sensor data
            from a Raspberry Pi or testing how an Android or cloud environment behaves outside the happy path.
          </p>
          <p>
            My projects usually cross more than one boundary. I like the point where code meets infrastructure, where a device needs to communicate
            reliably and where testing turns a promising prototype into something understandable.
          </p>
          <p>
            I approach problems in a measured way: establish what should happen, reproduce what actually happens, narrow the cause and document the
            result. It is not flashy, but it is how useful systems get built.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-[1180px] gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 md:grid-cols-3">
        {principles.map((principle) => (
          <article key={principle.index} className="bg-[#0b171c] p-6 sm:p-7">
            <span className="font-mono text-[10px] font-bold text-[#74c9c0]">{principle.index}</span>
            <h3 className="mt-7 text-xl font-semibold text-white">{principle.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#8fa6a9]">{principle.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
