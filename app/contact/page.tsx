import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Ramest Technolabs for your next project.",
};

export default function Page() {
  return (
    <SiteLayout activePage="contact" includeHireInFooter={true}>
      {/* CONTACT SECTION */}
        <section className="contact section" id="contact" style={{ paddingTop: "8rem" }}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Let's Connect</h2>
                    <p className="section-subtitle">Ready to start your next project? Drop us a line.</p>
                </div>

                <div className="contact-container">
                    <form action="" className="contact-form">
                        <div className="form-group">
                            <input type="text" placeholder="Your Name" className="form-input" />
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="Your Email" className="form-input" />
                        </div>
                        <div className="form-group">
                            <textarea placeholder="Project Details" rows={5} className="form-input"></textarea>
                        </div>
                        <button type="submit" className="button button-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    </SiteLayout>
  );
}
