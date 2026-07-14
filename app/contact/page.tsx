import ContactForm from "@/components/ContactForm";
import SectionHeader from "@/components/sections/SectionHeader";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description: "Get in touch with Ramest Technolabs for your next project.",
  path: "/contact",
});

export default function Page() {
  return (
    <section
      className="contact section"
      id="contact"
      style={{ paddingTop: "8rem" }}
    >
      <div className="container">
        <SectionHeader
          title="Let's Connect"
          subtitle="Ready to start your next project? Drop us a line."
        />

        <div className="contact-container">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
