export default function ContactForm() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
      <div className="text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          Contact Me
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Send a quick note
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This form opens your email client with the details filled in so
          you can send me a message.
        </p>
      </div>
      <form
        className="mt-6 grid gap-4"
        action="mailto:thaker.rajat@gmail.com"
        method="post"
        encType="text/plain"
      >
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Your name
          <input
            name="Name"
            type="text"
            required
            className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-200/60 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Jane Doe"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Contact info
          <input
            name="Contact"
            type="text"
            required
            className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-200/60 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Email or phone number"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Message
          <textarea
            name="Message"
            required
            rows={5}
            className="resize-none rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-200/60 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="What would you like to share?"
          />
        </label>
        <button
          type="submit"
          className="inline-flex w-fit items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
        >
          Send email
        </button>
      </form>
    </section>
  );
}
